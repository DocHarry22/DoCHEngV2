import { randomUUID } from "node:crypto";
import {
  requireUser,
  authenticate,
  issueToken,
  SESSION_COOKIE,
} from "@/lib/server/auth";
import { rows, run, transaction } from "@/lib/server/database";
import {
  assertSameOrigin,
  jsonBody,
  apiResponse,
  apiError,
  field,
  audit,
  HttpError,
  rateLimit,
} from "@/lib/server/security";
import { queueMail } from "@/lib/server/mail";
import { publishedCatalogue } from "@/lib/server/catalogue";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const session = await requireUser();
    const id = session.user!.id;
    return apiResponse({
      session,
      products: publishedCatalogue(),
      tickets: rows(
        "SELECT id,enquiry_type,product,status,created_at FROM tickets WHERE user_id=? ORDER BY created_at DESC LIMIT 100",
        id,
      ),
      replies: rows(
        "SELECT m.ticket_id,m.message,m.created_at FROM ticket_messages m JOIN tickets t ON t.id=m.ticket_id WHERE t.user_id=? ORDER BY m.created_at DESC LIMIT 100",
        id,
      ),
      orders: rows(
        "SELECT id,reference,product_slug,amount,currency,status,created_at FROM orders WHERE user_id=? ORDER BY created_at DESC LIMIT 100",
        id,
      ),
      licences: rows(
        "SELECT id,order_id,product_slug,key_hint,device_limit,expires_at,revoked,CASE WHEN revoked=1 THEN 'revoked' WHEN expires_at IS NOT NULL AND expires_at<=? THEN 'expired' ELSE 'active' END AS status FROM licences WHERE user_id=?",
        Date.now(),
        id,
      ),
      devices: rows(
        "SELECT id,name,created_at FROM devices WHERE user_id=?",
        id,
      ),
    });
  } catch (error) {
    return apiError(error);
  }
}
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const session = await requireUser();
    const user = session.user!;
    rateLimit("account", user.id, 40);
    const body = await jsonBody(request);
    if (body.action === "profile") {
      run(
        "UPDATE users SET name=? WHERE id=?",
        field(body, "name", 2, 100),
        user.id,
      );
      audit(user.id, "account.profile", user.id);
    } else if (body.action === "revoke-device") {
      run(
        "DELETE FROM devices WHERE id=? AND user_id=?",
        field(body, "deviceId", 36, 36),
        user.id,
      );
      audit(user.id, "device.revoked", user.id);
    } else if (body.action === "revoke-sessions") {
      // End all sessions; client must sign in again.
      run("DELETE FROM sessions WHERE user_id=?", user.id);
      audit(user.id, "sessions.revoked", user.id);
      const response = apiResponse({
        ok: true,
        message: "All sessions ended. Sign in again.",
      });
      response.headers.append(
        "Set-Cookie",
        `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${process.env.NODE_ENV === "production" ? "; Secure" : ""}`,
      );
      return response;
    } else if (body.action === "erasure") {
      const ticket = `DCH-PRIVACY-${randomUUID()}`;
      transaction(() => {
        run(
          "INSERT INTO tickets (id,user_id,email,name,enquiry_type,product,message,organization,context,created_at) VALUES (?,?,?,?,?,?,?,?,?,?)",
          ticket,
          user.id,
          user.email,
          user.name,
          "privacy",
          "ecosystem",
          "Account erasure request. Review legal retention obligations before deletion.",
          "",
          "",
          Date.now(),
        );
        audit(user.id, "privacy.erasure-requested", ticket);
        queueMail(
          user.email,
          `${ticket}: privacy request received`,
          "Your account erasure request has been recorded for review.",
        );
      });
      return apiResponse({
        ok: true,
        message: `Erasure request recorded: ${ticket}`,
      });
    } else if (body.action === "change-password") {
      await authenticate(user.email, field(body, "currentPassword", 12, 128));
      // Reuse the audited, single-use reset flow; no browser-controlled user identifier.
      const token = issueToken(user.id, "reset");
      const { consumeToken } = await import("@/lib/server/auth");
      await consumeToken(token, "reset", field(body, "newPassword", 12, 128));
      return apiResponse({
        ok: true,
        message: "Password changed. Sign in again on all devices.",
      });
    } else throw new HttpError(400, "Unknown account action.");
    return apiResponse({ ok: true, message: "Account updated." });
  } catch (error) {
    return apiError(error);
  }
}
