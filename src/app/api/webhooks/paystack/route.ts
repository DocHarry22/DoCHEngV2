import {
  paystack,
  paymentKey,
  verifyWebhookSignature,
  fulfilCheckoutPayment,
} from "@/lib/server/commerce";
import {
  apiResponse,
  apiError,
  HttpError,
  digest,
} from "@/lib/server/security";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const key = paymentKey();
    if (Number(request.headers.get("content-length")) > 65536)
      throw new HttpError(413, "Event too large.");
    const reader = request.body?.getReader();
    if (!reader) throw new HttpError(400, "Event required.");
    let length = 0;
    const parts: Uint8Array[] = [];
    while (true) {
      const p = await reader.read();
      if (p.done) break;
      length += p.value.byteLength;
      if (length > 65536) {
        await reader.cancel();
        throw new HttpError(413, "Event too large.");
      }
      parts.push(p.value);
    }
    const raw = Buffer.concat(parts).toString("utf8");
    if (
      !verifyWebhookSignature(
        raw,
        request.headers.get("x-paystack-signature"),
        key,
      )
    )
      throw new HttpError(401, "Invalid payment signature.");
    const event = JSON.parse(raw);
    if (event.event !== "charge.success")
      return apiResponse({ ok: true, ignored: true });
    const reference = event.data?.reference;
    if (
      typeof reference !== "string" ||
      !/^DCH-TEST-[a-f0-9-]{36}$/.test(reference)
    )
      throw new HttpError(400, "Unknown order reference.");
    const verified = await paystack(
      "/transaction/verify/" + encodeURIComponent(reference),
    );
    fulfilCheckoutPayment(reference, verified, digest(raw));
    return apiResponse({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
