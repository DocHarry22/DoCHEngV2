import { cookies } from "next/headers";
import {
  authenticate,
  register,
  createSession,
  writeSessionCookie,
  serverSession,
  sessionForToken,
  issueToken,
  consumeToken,
  SESSION_COOKIE,
  requireUser,
} from "@/lib/server/auth";
import { rows, run } from "@/lib/server/database";
import { queueMail, deliverMail } from "@/lib/server/mail";
import {
  assertSameOrigin,
  jsonBody,
  apiResponse,
  apiError,
  HttpError,
  field,
  emailField,
  passwordField,
  rateLimit,
  clientIdentity,
  canonicalOrigin,
  digest,
} from "@/lib/server/security";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ action: string }> };
export async function GET(_request: Request, context: Context) {
  try {
    const { action } = await context.params;
    if (action !== "session") throw new HttpError(404, "Not found.");
    return apiResponse(await serverSession());
  } catch (error) {
    return apiError(error);
  }
}
export async function POST(request: Request, context: Context) {
  try {
    assertSameOrigin(request);
    const { action } = await context.params;
    rateLimit("auth-ip", clientIdentity(request), 60);
    const body = await jsonBody(request);
    if (action === "signout") {
      const token = (await cookies()).get(SESSION_COOKIE)?.value;
      if (token) run("DELETE FROM sessions WHERE token_hash=?", digest(token));
      await writeSessionCookie(null);
      return apiResponse({ ok: true });
    }
    if (action === "verify" || action === "reset") {
      await consumeToken(
        field(body, "token", 43, 43),
        action,
        action === "reset" ? passwordField(body) : undefined,
      );
      return apiResponse({
        ok: true,
        message:
          action === "reset"
            ? "Password updated. Sign in with your new password."
            : "Email verified.",
      });
    }
    if (action === "resend") {
      const session = await requireUser();
      const user = session.user!;
      rateLimit("resend", user.id, 3, 60 * 60_000);
      if (!user.emailVerified) {
        const token = issueToken(user.id, "verify");
        const id = queueMail(
          user.email,
          "Verify your DoCHEng email",
          `Confirm your address: ${canonicalOrigin()}/verify?token=${token}\nThis link expires in 24 hours.`,
        );
        const sent = await deliverMail(id);
        return apiResponse({
          ok: true,
          message: sent
            ? "Verification email accepted for delivery."
            : "Verification email queued. Email delivery is awaiting configuration.",
        });
      }
      return apiResponse({
        ok: true,
        message: "Your email is already verified.",
      });
    }
    if (!["signin", "signup", "forgot"].includes(action))
      throw new HttpError(404, "Not found.");
    const email = emailField(body);
    rateLimit(`auth-${action}`, email, 8);
    if (action === "forgot") {
      const user = rows<{ id: string }>(
        "SELECT id FROM users WHERE email=? AND disabled=0",
        email,
      )[0];
      if (user) {
        const token = issueToken(user.id, "reset");
        const id = queueMail(
          email,
          "Reset your DoCHEng password",
          `Reset your password: ${canonicalOrigin()}/reset-password?token=${token}\nThis link expires in 30 minutes. If you did not request it, ignore this message.`,
        );
        await deliverMail(id);
      }
      return apiResponse({
        ok: true,
        message:
          "If an account exists, reset instructions have been queued for delivery.",
      });
    }
    const password = passwordField(body);
    const userId =
      action === "signup"
        ? await register(email, field(body, "name", 2, 100), password)
        : await authenticate(email, password);
    const token = createSession(userId);
    await writeSessionCookie(token);
    let message: string | undefined;
    if (action === "signup") {
      const verification = issueToken(userId, "verify");
      const mail = queueMail(
        email,
        "Welcome to DoCHEng — verify your email",
        `Confirm your email: ${canonicalOrigin()}/verify?token=${verification}\nThis link expires in 24 hours.`,
      );
      const sent = await deliverMail(mail);
      message = sent
        ? "Account created. Check your email to verify your address."
        : "Account created. Verification email is queued while email delivery is configured.";
    }
    return apiResponse({ ok: true, session: sessionForToken(token), message });
  } catch (error) {
    return apiError(error);
  }
}
