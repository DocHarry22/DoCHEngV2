import "server-only";
import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import type { AppSession } from "@/lib/auth/types";
import { rows, run, transaction } from "./database";
import {
  digest,
  opaqueToken,
  hashPassword,
  verifyPassword,
  HttpError,
  audit,
} from "./security";

export const SESSION_COOKIE =
  process.env.NODE_ENV === "production"
    ? "__Host-docheng-session"
    : "docheng-session";
const lifetime = 7 * 24 * 60 * 60_000;
type User = {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  role: "user" | "admin";
  verified: number;
  disabled: number;
};
export const guest: AppSession = {
  state: "guest",
  user: null,
  entitlements: [],
};
export function sessionForToken(token: string | undefined): AppSession {
  if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token)) return guest;
  const user = rows<User>(
    "SELECT u.* FROM users u JOIN sessions s ON s.user_id=u.id WHERE s.token_hash=? AND s.expires_at>? AND u.disabled=0",
    digest(token),
    Date.now(),
  )[0];
  if (!user) return guest;
  const entitlements = rows<{
    product_slug: string;
    state: "active" | "trial";
    source: "grant" | "plan" | "beta" | "manual";
  }>(
    "SELECT product_slug,state,source FROM entitlements WHERE user_id=? AND state IN ('active','trial') AND (expires_at IS NULL OR expires_at>?)",
    user.id,
    Date.now(),
  );
  return {
    state: "authenticated",
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      emailVerified: Boolean(user.verified),
    },
    entitlements: entitlements.map((entry) => ({
      productSlug: entry.product_slug,
      state: entry.state,
      source: entry.source,
    })),
  };
}
export async function serverSession() {
  return sessionForToken((await cookies()).get(SESSION_COOKIE)?.value);
}
export async function requireUser(admin = false) {
  const session = await serverSession();
  if (!session.user) throw new HttpError(401, "Sign in to continue.");
  if (admin && (session.user.role !== "admin" || !session.user.emailVerified))
    throw new HttpError(403, "Administrator access required.");
  return session;
}
export async function register(email: string, name: string, password: string) {
  const hash = await hashPassword(password);
  const id = randomUUID();
  transaction(() => {
    if (rows("SELECT id FROM users WHERE email=?", email).length)
      throw new HttpError(
        409,
        "Unable to register. Try signing in or resetting your password.",
      );
    run(
      "INSERT INTO users (id,email,name,password_hash,created_at) VALUES (?,?,?,?,?)",
      id,
      email,
      name,
      hash,
      Date.now(),
    );
    audit(id, "account.created", id);
  });
  return id;
}
// Equal scrypt work for unknown users helps avoid exposing registered addresses through timing.
let dummyHash: Promise<string> | undefined;
export async function authenticate(email: string, password: string) {
  const user = rows<User>("SELECT * FROM users WHERE email=?", email)[0];
  const hash =
    user?.password_hash ?? (await (dummyHash ??= hashPassword(opaqueToken())));
  const valid = await verifyPassword(password, hash);
  if (!valid || !user || user.disabled)
    throw new HttpError(401, "Email or password is incorrect.");
  return user.id;
}
export function createSession(userId: string) {
  const token = opaqueToken();
  run("DELETE FROM sessions WHERE expires_at<=?", Date.now());
  run(
    "INSERT INTO sessions VALUES (?,?,?,?)",
    digest(token),
    userId,
    Date.now(),
    Date.now() + lifetime,
  );
  return token;
}
export async function writeSessionCookie(token: string | null) {
  (await cookies()).set(SESSION_COOKIE, token ?? "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: token ? lifetime / 1000 : 0,
  });
  // Remove the old forgeable marker; never accept it as authentication.
  (await cookies()).set("dochengv2-auth", "", { path: "/", maxAge: 0 });
}
export function issueToken(userId: string, purpose: "verify" | "reset") {
  const token = opaqueToken();
  transaction(() => {
    run(
      "DELETE FROM auth_tokens WHERE user_id=? AND purpose=?",
      userId,
      purpose,
    );
    run(
      "INSERT INTO auth_tokens VALUES (?,?,?,?)",
      digest(token),
      userId,
      purpose,
      Date.now() + (purpose === "reset" ? 30 * 60_000 : 24 * 60 * 60_000),
    );
  });
  return token;
}
export async function consumeToken(
  token: string,
  purpose: "verify" | "reset",
  password?: string,
) {
  const hash = password ? await hashPassword(password) : undefined;
  transaction(() => {
    const record = rows<{ user_id: string }>(
      "SELECT user_id FROM auth_tokens WHERE token_hash=? AND purpose=? AND expires_at>?",
      digest(token),
      purpose,
      Date.now(),
    )[0];
    if (!record)
      throw new HttpError(
        400,
        "This link has expired or has already been used.",
      );
    run("DELETE FROM auth_tokens WHERE token_hash=?", digest(token));
    if (purpose === "verify") {
      run("UPDATE users SET verified=1 WHERE id=?", record.user_id);
      // Explicit hosting configuration, used only for the first verified administrator.
      const address =
        process.env.DOCHENG_BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
      if (address && !rows("SELECT id FROM users WHERE role='admin'").length) {
        const owner = rows<{ email: string }>(
          "SELECT email FROM users WHERE id=?",
          record.user_id,
        )[0];
        if (owner?.email === address) {
          run("UPDATE users SET role='admin' WHERE id=?", record.user_id);
          audit("hosting-configuration", "admin.bootstrapped", record.user_id);
        }
      }
    } else {
      if (!hash) throw new HttpError(400, "Password required.");
      run("UPDATE users SET password_hash=? WHERE id=?", hash, record.user_id);
      run("DELETE FROM sessions WHERE user_id=?", record.user_id);
    }
    audit(record.user_id, `account.${purpose}`, record.user_id);
  });
}
