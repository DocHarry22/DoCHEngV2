import "server-only";
import {
  createHash,
  randomBytes,
  randomUUID,
  scrypt,
  timingSafeEqual,
} from "node:crypto";
import { run, rows, transaction } from "./database";

const derive = (password: string, salt: string) =>
  new Promise<Buffer>((resolve, reject) => {
    scrypt(
      password,
      salt,
      64,
      { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 },
      (error, key) => (error ? reject(error) : resolve(key)),
    );
  });
export const opaqueToken = () => randomBytes(32).toString("base64url");
export const digest = (value: string) =>
  createHash("sha256").update(value).digest("hex");
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export function audit(
  actor: string,
  action: string,
  resource: string,
  detail = "",
) {
  run(
    "INSERT INTO audit_log VALUES (?,?,?,?,?,?)",
    randomUUID(),
    actor,
    action,
    resource,
    detail,
    Date.now(),
  );
}
export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const key = await derive(password, salt);
  return `scrypt$${salt}$${key.toString("hex")}`;
}
export async function verifyPassword(password: string, stored: string) {
  const [scheme, salt, expected] = stored.split("$");
  if (
    scheme !== "scrypt" ||
    !salt ||
    !expected ||
    !/^[a-f0-9]{128}$/.test(expected)
  )
    return false;
  const key = await derive(password, salt);
  return timingSafeEqual(key, Buffer.from(expected, "hex"));
}
export function canonicalOrigin() {
  return new URL(process.env.DOCHENG_ORIGIN ?? "https://www.docheng.co.za")
    .origin;
}
export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const permitted =
    process.env.NODE_ENV === "production"
      ? canonicalOrigin()
      : new URL(request.url).origin;
  if (
    origin !== permitted ||
    request.headers.get("sec-fetch-site") === "cross-site"
  )
    throw new HttpError(403, "Refresh this page and try again.");
}
export async function jsonBody(
  request: Request,
): Promise<Record<string, unknown>> {
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    throw new HttpError(415, "Send JSON content.");
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400, "Request body required.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      size += part.value.byteLength;
      if (size > 16_384) {
        await reader.cancel();
        throw new HttpError(413, "Request is too large.");
      }
      chunks.push(part.value);
    }
    const result: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!result || typeof result !== "object" || Array.isArray(result))
      throw new Error();
    return result as Record<string, unknown>;
  } catch (error) {
    if (error instanceof HttpError) throw error;
    throw new HttpError(400, "Invalid JSON.");
  }
}
export function field(
  body: Record<string, unknown>,
  key: string,
  min: number,
  max: number,
) {
  const value = body[key];
  if (
    typeof value !== "string" ||
    value.trim().length < min ||
    value.length > max
  )
    throw new HttpError(400, `Check ${key} (${min}–${max} characters).`);
  return value.trim();
}
export function emailField(body: Record<string, unknown>) {
  const email = field(body, "email", 3, 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw new HttpError(400, "Enter a valid email address.");
  return email;
}
export function passwordField(body: Record<string, unknown>) {
  const password = body.password;
  if (
    typeof password !== "string" ||
    password.length < 12 ||
    password.length > 128
  )
    throw new HttpError(400, "Use a password of 12–128 characters.");
  return password;
}
export function rateLimit(
  scope: string,
  identity: string,
  limit: number,
  duration = 15 * 60_000,
) {
  const key = digest(`${scope}:${identity}`);
  const now = Date.now();
  transaction(() => {
    run("DELETE FROM rate_limits WHERE expires_at <= ?", now);
    const current = rows<{ hits: number }>(
      "SELECT hits FROM rate_limits WHERE key=?",
      key,
    )[0];
    if (current && current.hits >= limit)
      throw new HttpError(429, "Too many requests. Please try again later.");
    if (current) run("UPDATE rate_limits SET hits=hits+1 WHERE key=?", key);
    else run("INSERT INTO rate_limits VALUES (?,?,?)", key, 1, now + duration);
  });
}
export function clientIdentity(request: Request) {
  // Enable only behind a reverse proxy which replaces this header.
  return process.env.DOCHENG_TRUST_PROXY === "1"
    ? (request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        "shared")
    : "shared";
}
export function safeNext(value: string | undefined) {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    /[\\\x00-\x1f]/.test(value)
  )
    return "/account";
  return value;
}
export function apiResponse(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
export function apiError(error: unknown) {
  if (error instanceof HttpError)
    return apiResponse({ ok: false, message: error.message }, error.status);
  // Do not log request bodies, credentials, database contents or provider responses.
  console.error(
    "Platform operation failed",
    error instanceof Error ? error.name : "UnknownError",
  );
  return apiResponse(
    {
      ok: false,
      message:
        "This service is temporarily unavailable. Please try again later.",
    },
    503,
  );
}
