import "server-only";
import { createHmac, timingSafeEqual, randomUUID } from "node:crypto";
import { rows, run, transaction } from "./database";
import { HttpError, digest, audit } from "./security";
export type Offer = {
  id: string;
  productSlug: string;
  amount: number;
  currency: "ZAR";
  deviceLimit: number;
  days?: number;
  bundleProducts?: string[];
};
export function approvedTestOffers(): Offer[] {
  if (
    process.env.DOCHENG_BILLING_MODE !== "test" ||
    !process.env.PAYSTACK_SECRET_KEY?.startsWith("sk_test_")
  )
    return [];
  let offers: Offer[];
  try {
    offers = JSON.parse(process.env.DOCHENG_APPROVED_TEST_OFFERS ?? "[]");
  } catch {
    return [];
  }
  if (!Array.isArray(offers)) return [];
  return offers.filter(
    (o) =>
      o &&
      typeof o === "object" &&
      typeof o.id === "string" &&
      /^[a-z0-9-]{2,80}$/.test(o.id) &&
      typeof o.productSlug === "string" &&
      /^[a-z0-9-]{2,80}$/.test(o.productSlug) &&
      Number.isSafeInteger(o.amount) &&
      o.amount > 0 &&
      o.amount < 100_000_000 &&
      o.currency === "ZAR" &&
      Number.isInteger(o.deviceLimit) &&
      o.deviceLimit > 0 &&
      o.deviceLimit <= 100 &&
      (o.days === undefined ||
        (Number.isInteger(o.days) && o.days > 0 && o.days <= 3650)) &&
      (o.bundleProducts === undefined ||
        (Array.isArray(o.bundleProducts) &&
          o.bundleProducts.length <= 10 &&
          o.bundleProducts.every(
            (p) => typeof p === "string" && /^[a-z0-9-]{2,80}$/.test(p),
          ))),
  );
}
export function paymentKey() {
  if (
    !approvedTestOffers().length ||
    !process.env.DOCHENG_LICENCE_SECRET ||
    process.env.DOCHENG_LICENCE_SECRET.length < 32
  )
    throw new HttpError(
      503,
      "Checkout is not activated. No payment has been taken.",
    );
  return process.env.PAYSTACK_SECRET_KEY!;
}
export async function paystack(path: string, body?: object) {
  const key = paymentKey();
  const response = await fetch("https://api.paystack.co" + path, {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: "Bearer " + key,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok)
    throw new HttpError(
      502,
      "The payment provider could not complete the request.",
    );
  const result = await response.json();
  if (!result.status)
    throw new HttpError(502, "The provider rejected the payment request.");
  return result.data;
}
export function verifyWebhookSignature(
  raw: string,
  signature: string | null,
  key: string,
) {
  if (!signature || !/^[a-f0-9]{128}$/.test(signature)) return false;
  const expected = createHmac("sha512", key).update(raw).digest();
  return timingSafeEqual(expected, Buffer.from(signature, "hex"));
}
export function licenceKey(orderId: string) {
  const secret = process.env.DOCHENG_LICENCE_SECRET;
  if (!secret || secret.length < 32)
    throw new HttpError(503, "Licence service is not configured.");
  return (
    "DCH-" +
    createHmac("sha256", secret).update(orderId).digest("hex").toUpperCase()
  );
}
export type Order = {
  id: string;
  user_id: string;
  reference: string;
  product_slug: string;
  amount: number;
  currency: string;
  status: string;
};
function applyPayment(
  reference: string,
  verified: {
    status: string;
    reference: string;
    amount: number;
    currency: string;
    customer: { email: string };
    domain: string;
  },
  eventId: string,
  snapshot?: Offer,
) {
  const order = rows<Order>(
    "SELECT * FROM orders WHERE reference=?",
    reference,
  )[0];
  if (!order) throw new HttpError(404, "Order not found.");
  const user = rows<{ email: string; verified: number }>(
    "SELECT email,verified FROM users WHERE id=?",
    order.user_id,
  )[0];
  if (
    verified.status !== "success" ||
    verified.reference !== order.reference ||
    verified.amount !== order.amount ||
    verified.currency !== order.currency ||
    verified.customer?.email?.toLowerCase() !== user?.email ||
    verified.domain !== "test" ||
    !user.verified
  )
    throw new HttpError(
      400,
      "Provider verification does not match this order.",
    );
  if (order.status === "paid") return order;
  if (order.status !== "pending")
    throw new HttpError(409, "Order is not awaiting payment.");
  const offer =
    snapshot ??
    approvedTestOffers().find(
      (o) => o.productSlug === order.product_slug && o.amount === order.amount,
    );
  if (
    !offer ||
    offer.productSlug !== order.product_slug ||
    offer.amount !== order.amount ||
    offer.currency !== order.currency
  )
    throw new HttpError(409, "The approved test offer is no longer available.");
  const expiry = offer.days ? Date.now() + offer.days * 86_400_000 : null,
    key = licenceKey(order.id);
  run("INSERT INTO payment_events VALUES (?,?)", eventId, Date.now());
  run(
    "UPDATE orders SET status='paid',paid_at=? WHERE id=?",
    Date.now(),
    order.id,
  );
  const products = [
    ...new Set([order.product_slug, ...(offer.bundleProducts ?? [])]),
  ];
  for (const slug of products)
    run(
      "INSERT INTO entitlements VALUES (?,?,?,?,?,?) ON CONFLICT(user_id,product_slug) DO UPDATE SET state=excluded.state,source=excluded.source,expires_at=CASE WHEN entitlements.state IN ('active','trial') AND (entitlements.expires_at IS NULL OR excluded.expires_at IS NULL) THEN NULL WHEN entitlements.state IN ('active','trial') THEN MAX(entitlements.expires_at,excluded.expires_at) ELSE excluded.expires_at END",
      randomUUID(),
      order.user_id,
      slug,
      "active",
      "plan",
      expiry,
    );
  const licenceId = randomUUID();
  run(
    "INSERT INTO licences VALUES (?,?,?,?,?,?,?,?,?)",
    licenceId,
    order.id,
    order.user_id,
    order.product_slug,
    digest(key),
    key.slice(-6),
    offer.deviceLimit,
    expiry,
    0,
  );
  for (const slug of products)
    run("INSERT INTO licence_products VALUES (?,?)", licenceId, slug);
  audit("paystack", "payment.verified", order.id, "test mode");
  return { ...order, status: "paid" };
}
export type VerifiedPayment = Parameters<typeof applyPayment>[1];
export function fulfilPayment(
  reference: string,
  verified: VerifiedPayment,
  eventId: string,
) {
  return transaction(() => applyPayment(reference, verified, eventId));
}

export function createCheckout(userId: string, offerIds: unknown) {
  paymentKey();
  if (
    !Array.isArray(offerIds) ||
    !offerIds.length ||
    offerIds.length > 5 ||
    offerIds.some((id) => typeof id !== "string") ||
    new Set(offerIds).size !== offerIds.length
  )
    throw new HttpError(400, "Choose one to five different approved offers.");
  const approved = approvedTestOffers();
  const offers = offerIds.map((id) => approved.find((o) => o.id === id));
  if (offers.some((o) => !o))
    throw new HttpError(400, "An approved test offer is no longer available.");
  const selected = offers as Offer[];
  const products = selected.flatMap((o) => [
    o.productSlug,
    ...(o.bundleProducts ?? []),
  ]);
  if (new Set(products).size !== products.length)
    throw new HttpError(
      400,
      "Your cart includes the same product more than once. Choose its individual offer or bundle.",
    );
  const amount = selected.reduce((total, o) => total + o.amount, 0);
  const reference = "DCH-TEST-" + randomUUID();
  transaction(() => {
    run(
      "INSERT INTO checkout_batches VALUES (?,?,?,?,?,?)",
      reference,
      userId,
      amount,
      "ZAR",
      "pending",
      Date.now(),
    );
    selected.forEach((offer, index) => {
      const id = randomUUID();
      run(
        "INSERT INTO orders (id,user_id,reference,product_slug,amount,currency,status,provider,created_at) VALUES (?,?,?,?,?,?,?,?,?)",
        id,
        userId,
        reference + "." + index,
        offer.productSlug,
        offer.amount,
        "ZAR",
        "pending",
        "paystack-test",
        Date.now(),
      );
      run(
        "INSERT INTO checkout_orders VALUES (?,?,?)",
        reference,
        id,
        JSON.stringify(offer),
      );
    });
  });
  return { reference, amount, currency: "ZAR" };
}

export function fulfilCheckoutPayment(
  reference: string,
  verified: VerifiedPayment,
  eventId: string,
) {
  const batch = rows<{
    user_id: string;
    amount: number;
    currency: string;
    status: string;
  }>("SELECT * FROM checkout_batches WHERE reference=?", reference)[0];
  if (!batch) return fulfilPayment(reference, verified, eventId);
  return transaction(() => {
    const buyer = rows<{ email: string; verified: number }>(
      "SELECT email,verified FROM users WHERE id=?",
      batch.user_id,
    )[0];
    if (
      verified.status !== "success" ||
      verified.reference !== reference ||
      verified.amount !== batch.amount ||
      verified.currency !== batch.currency ||
      verified.domain !== "test" ||
      !buyer?.verified ||
      verified.customer?.email?.toLowerCase() !== buyer.email
    )
      throw new HttpError(
        400,
        "Provider verification does not match this checkout.",
      );
    if (batch.status === "paid") return;
    if (batch.status !== "pending")
      throw new HttpError(409, "Checkout is not awaiting payment.");
    const orders = rows<Order & { offer_document: string }>(
      "SELECT o.*,c.offer_document FROM orders o JOIN checkout_orders c ON c.order_id=o.id WHERE c.reference=?",
      reference,
    );
    if (
      !orders.length ||
      orders.reduce((total, o) => total + o.amount, 0) !== batch.amount ||
      orders.some(
        (o) => o.user_id !== batch.user_id || o.currency !== batch.currency,
      )
    )
      throw new HttpError(409, "Checkout reconciliation failed.");
    for (const order of orders)
      applyPayment(
        order.reference,
        { ...verified, reference: order.reference, amount: order.amount },
        eventId + ":" + order.id,
        JSON.parse(order.offer_document) as Offer,
      );
    run(
      "UPDATE checkout_batches SET status='paid' WHERE reference=?",
      reference,
    );
  });
}
export function activateLicence(
  userId: string,
  key: string,
  fingerprint: string,
  name: string,
) {
  return transaction(() => {
    const licence = rows<{
      id: string;
      device_limit: number;
      expires_at: number | null;
      revoked: number;
    }>(
      "SELECT id,device_limit,expires_at,revoked FROM licences WHERE user_id=? AND key_hash=?",
      userId,
      digest(key),
    )[0];
    if (
      !licence ||
      licence.revoked ||
      (licence.expires_at !== null && licence.expires_at <= Date.now())
    )
      throw new HttpError(403, "Licence is invalid, expired or revoked.");
    const hashed = digest(fingerprint),
      existing = rows<{ id: string }>(
        "SELECT id FROM devices WHERE licence_id=? AND fingerprint_hash=?",
        licence.id,
        hashed,
      )[0];
    if (existing) return existing.id;
    const count = rows<{ total: number }>(
      "SELECT COUNT(*) AS total FROM devices WHERE licence_id=?",
      licence.id,
    )[0].total;
    if (count >= licence.device_limit)
      throw new HttpError(
        409,
        "Device limit reached. Deactivate a device in your account first.",
      );
    const id = randomUUID();
    run(
      "INSERT INTO devices VALUES (?,?,?,?,?,?)",
      id,
      licence.id,
      userId,
      hashed,
      name,
      Date.now(),
    );
    audit(userId, "licence.activated", licence.id);
    return id;
  });
}
