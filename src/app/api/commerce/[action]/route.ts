import {
  approvedTestOffers,
  paymentKey,
  paystack,
  activateLicence,
  licenceKey,
  createCheckout,
  type Order,
} from "@/lib/server/commerce";
import { requireUser } from "@/lib/server/auth";
import { rows } from "@/lib/server/database";
import {
  assertSameOrigin,
  jsonBody,
  apiResponse,
  apiError,
  HttpError,
  field,
  rateLimit,
  canonicalOrigin,
} from "@/lib/server/security";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ action: string }> };
export async function GET(request: Request, { params }: Context) {
  try {
    const { action } = await params;
    if (action === "offers")
      return apiResponse({ mode: "test-only", offers: approvedTestOffers() });
    const session = await requireUser();
    const id = new URL(request.url).searchParams.get("id") ?? "";
    const order = rows<Order>(
      "SELECT * FROM orders WHERE id=? AND user_id=?",
      id,
      session.user!.id,
    )[0];
    if (!order || order.status !== "paid")
      throw new HttpError(404, "Paid order not found.");
    if (action === "licence") return apiResponse({ key: licenceKey(order.id) });
    if (action !== "receipt") throw new HttpError(404, "Not found.");
    const response = apiResponse({
      type: "test-payment-receipt",
      reference: order.reference,
      currency: order.currency,
      amount: order.amount / 100,
      product: order.product_slug,
      note: "Test payment only. This is not a VAT tax invoice.",
    });
    response.headers.set(
      "Content-Disposition",
      'attachment; filename="docheng-test-receipt.json"',
    );
    return response;
  } catch (error) {
    return apiError(error);
  }
}
export async function POST(request: Request, { params }: Context) {
  try {
    assertSameOrigin(request);
    const session = await requireUser();
    const user = session.user!;
    if (!user.emailVerified)
      throw new HttpError(
        403,
        "Verify your email before requesting commercial access.",
      );
    rateLimit("commerce", user.id, 10);
    const { action } = await params;
    const body = await jsonBody(request);
    if (action === "activate") {
      const id = activateLicence(
        user.id,
        field(body, "key", 68, 68),
        field(body, "fingerprint", 16, 300),
        field(body, "name", 2, 100),
      );
      return apiResponse({ ok: true, deviceId: id });
    }
    if (action !== "checkout") throw new HttpError(404, "Not found.");
    paymentKey();
    const cart = createCheckout(user.id, body.offerIds ?? [body.offerId]);
    const checkout = await paystack("/transaction/initialize", {
      email: user.email,
      amount: cart.amount,
      currency: "ZAR",
      reference: cart.reference,
      callback_url: canonicalOrigin() + "/account",
    });
    const url = new URL(checkout.authorization_url);
    if (url.protocol !== "https:" || url.hostname !== "checkout.paystack.com")
      throw new HttpError(502, "Unexpected checkout destination.");
    return apiResponse({ ok: true, url: url.href, reference: cart.reference });
  } catch (error) {
    return apiError(error);
  }
}
