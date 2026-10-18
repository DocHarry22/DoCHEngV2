import { randomUUID } from "node:crypto";
import { rows, run, transaction } from "@/lib/server/database";
import { queueMail, deliverMail } from "@/lib/server/mail";
import {
  assertSameOrigin,
  jsonBody,
  apiError,
  apiResponse,
  HttpError,
  emailField,
  field,
  rateLimit,
  clientIdentity,
  opaqueToken,
  digest,
  canonicalOrigin,
} from "@/lib/server/security";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    rateLimit("subscribe-ip", clientIdentity(request), 20, 60 * 60_000);
    const body = await jsonBody(request);
    if (body.action === "confirm" || body.action === "unsubscribe") {
      const token = field(body, "token", 43, 43);
      const subscription = rows<{ id: string }>(
        "SELECT id FROM subscriptions WHERE token_hash=?",
        digest(token),
      )[0];
      if (!subscription)
        throw new HttpError(400, "Invalid or expired subscription link.");
      if (body.action === "unsubscribe")
        run("DELETE FROM subscriptions WHERE id=?", subscription.id);
      else
        run("UPDATE subscriptions SET confirmed=1 WHERE id=?", subscription.id);
      return apiResponse({
        ok: true,
        message:
          body.action === "confirm"
            ? "Your subscription is confirmed."
            : "You have been unsubscribed.",
      });
    }
    const email = emailField(body);
    rateLimit("subscribe-email", email, 3, 60 * 60_000);
    if (body.consent !== true || body.website)
      throw new HttpError(400, "Consent is required.");
    const topic = field(body, "topic", 2, 80);
    if (!/^(ecosystem|desk|resume|compass|engineering-tools)$/.test(topic))
      throw new HttpError(400, "Choose a listed topic.");
    const token = opaqueToken();
    const id = randomUUID();
    const mail = transaction(() => {
      if (
        rows(
          "SELECT id FROM subscriptions WHERE email=? AND topic=?",
          email,
          topic,
        ).length
      )
        return null;
      run(
        "INSERT INTO subscriptions VALUES (?,?,?,?,?,?)",
        id,
        email,
        topic,
        0,
        digest(token),
        Date.now(),
      );
      return queueMail(
        email,
        "Confirm DoCHEng updates",
        `Confirm your opt-in: ${canonicalOrigin()}/subscriptions?token=${token}\nTo unsubscribe: ${canonicalOrigin()}/subscriptions?token=${token}&action=unsubscribe\nYou will not receive announcements before confirming.`,
      );
    });
    if (mail) await deliverMail(mail);
    return apiResponse({
      ok: true,
      message:
        "If this address is not already subscribed, a confirmation email has been queued. No announcements are sent before confirmation.",
    });
  } catch (error) {
    return apiError(error);
  }
}
