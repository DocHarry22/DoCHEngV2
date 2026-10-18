import { randomBytes } from "node:crypto";
import { serverSession } from "@/lib/server/auth";
import { run, transaction } from "@/lib/server/database";
import { queueMail, deliverMail } from "@/lib/server/mail";
import {
  assertSameOrigin,
  jsonBody,
  apiResponse,
  apiError,
  HttpError,
  field,
  emailField,
  rateLimit,
  clientIdentity,
} from "@/lib/server/security";
import {
  supportEnquiryTypes,
  supportProductOptions,
} from "@/lib/support-content";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    rateLimit("support-ip", clientIdentity(request), 20, 60 * 60_000);
    const body = await jsonBody(request);
    if (body.website)
      throw new HttpError(400, "Unable to submit this request.");
    if (body.consent !== true)
      throw new HttpError(400, "Consent is required to process your enquiry.");
    const email = emailField(body);
    rateLimit("support-email", email, 5, 60 * 60_000);
    const name = field(body, "name", 2, 100),
      message = field(body, "message", 20, 8000);
    const enquiryType = field(body, "enquiryType", 1, 40),
      product = field(body, "product", 1, 80);
    if (
      !supportEnquiryTypes.some((entry) => entry.value === enquiryType) ||
      !supportProductOptions.some((entry) => entry.value === product)
    )
      throw new HttpError(400, "Select a valid enquiry type and product.");
    const organization = body.organization
      ? field(body, "organization", 0, 200)
      : "";
    const context = body.priorityContext
      ? field(body, "priorityContext", 0, 300)
      : "";
    const session = await serverSession();
    // Tickets belong to a signed-in account only when its email matches the submission. No email-only ownership lookup.
    const owner = session.user?.email === email ? session.user.id : null;
    const ticket = `DCH-${new Date().getUTCFullYear()}-${randomBytes(6).toString("hex").toUpperCase()}`;
    const mail = transaction(() => {
      run(
        "INSERT INTO tickets (id,user_id,email,name,enquiry_type,product,message,organization,context,created_at) VALUES (?,?,?,?,?,?,?,?,?,?)",
        ticket,
        owner,
        email,
        name,
        enquiryType,
        product,
        message,
        organization,
        context,
        Date.now(),
      );
      const confirmation = queueMail(
        email,
        `${ticket}: DoCHEng enquiry received`,
        `Your enquiry has been recorded as ${ticket}.\nProduct: ${product}\nType: ${enquiryType}\nKeep this reference. Please do not send passwords or payment card details.\nWe have not promised a response deadline.`,
      );
      const notification = process.env.DOCHENG_SUPPORT_EMAIL
        ? queueMail(
            process.env.DOCHENG_SUPPORT_EMAIL,
            `${ticket}: new ${enquiryType} enquiry`,
            `A new ticket is available in the protected DoCHEng admin dashboard. Reference: ${ticket}.`,
          )
        : undefined;
      return { confirmation, notification };
    });
    const [sent] = await Promise.all([
      deliverMail(mail.confirmation),
      mail.notification
        ? deliverMail(mail.notification)
        : Promise.resolve(false),
    ]);
    return apiResponse(
      {
        ok: true,
        ticket,
        emailStatus: sent ? "accepted" : "queued",
        message: sent
          ? "Your enquiry is saved. A confirmation email has been accepted for delivery."
          : "Your enquiry is saved. Keep your ticket reference; confirmation email is queued.",
      },
      201,
    );
  } catch (error) {
    return apiError(error);
  }
}
