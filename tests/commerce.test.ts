// @vitest-environment node
import { randomUUID, createHmac } from "node:crypto";
import { resolve } from "node:path";
import { beforeAll, beforeEach, describe, it, expect } from "vitest";
import { register } from "@/lib/server/auth";
import { database, run, rows } from "@/lib/server/database";
import {
  fulfilPayment,
  licenceKey,
  activateLicence,
  verifyWebhookSignature,
  paymentKey,
  createCheckout,
  fulfilCheckoutPayment,
} from "@/lib/server/commerce";
beforeAll(() => {
  process.env.DOCHENG_DATA_DIR = resolve(".test-data", randomUUID());
});
beforeEach(() => {
  database().exec(
    "DELETE FROM devices;DELETE FROM licences;DELETE FROM checkout_orders;DELETE FROM checkout_batches;DELETE FROM orders;DELETE FROM payment_events;DELETE FROM entitlements;DELETE FROM sessions;DELETE FROM auth_tokens;DELETE FROM users;DELETE FROM audit_log;",
  );
  process.env.DOCHENG_BILLING_MODE = "test";
  process.env.PAYSTACK_SECRET_KEY = "sk_test_local_test_only";
  process.env.DOCHENG_LICENCE_SECRET =
    "local-test-secret-with-more-than-32-characters";
  process.env.DOCHENG_APPROVED_TEST_OFFERS = JSON.stringify([
    {
      id: "desk-test",
      productSlug: "desk",
      amount: 10000,
      currency: "ZAR",
      deviceLimit: 1,
    },
  ]);
});
async function order() {
  const user = await register(
    "buyer@example.test",
    "Buyer",
    "a strong test password here",
  );
  run("UPDATE users SET verified=1 WHERE id=?", user);
  const id = randomUUID(),
    reference = "DCH-TEST-" + randomUUID();
  run(
    "INSERT INTO orders (id,user_id,reference,product_slug,amount,currency,status,provider,created_at) VALUES (?,?,?,?,?,?,?,?,?)",
    id,
    user,
    reference,
    "desk",
    10000,
    "ZAR",
    "pending",
    "paystack-test",
    Date.now(),
  );
  return { id, user, reference };
}
describe("commercial trust boundary", () => {
  it("keeps live billing unavailable even when a live-looking key is configured", () => {
    process.env.PAYSTACK_SECRET_KEY = "sk_live_not_authorized";
    expect(() => paymentKey()).toThrow("not activated");
  });
  it("validates HMAC signatures against exact bytes", () => {
    const raw = '{"event":"charge.success"}',
      key = "sk_test_test";
    const signature = createHmac("sha512", key).update(raw).digest("hex");
    expect(verifyWebhookSignature(raw, signature, key)).toBe(true);
    expect(verifyWebhookSignature(raw + " ", signature, key)).toBe(false);
    expect(verifyWebhookSignature(raw, "bad", key)).toBe(false);
  });
  it("rejects mismatched payment amounts and does not grant access", async () => {
    const o = await order();
    expect(() =>
      fulfilPayment(
        o.reference,
        {
          status: "success",
          reference: o.reference,
          amount: 1,
          currency: "ZAR",
          customer: { email: "buyer@example.test" },
          domain: "test",
        },
        "event",
      ),
    ).toThrow("does not match");
    expect(rows("SELECT * FROM entitlements")).toHaveLength(0);
    expect(rows("SELECT * FROM licences")).toHaveLength(0);
  });
  it("fulfils once and enforces device limits, expiry and revocation", async () => {
    const o = await order(),
      verified = {
        status: "success",
        reference: o.reference,
        amount: 10000,
        currency: "ZAR",
        customer: { email: "buyer@example.test" },
        domain: "test",
      };
    fulfilPayment(o.reference, verified, "event-1");
    fulfilPayment(o.reference, verified, "event-1");
    expect(rows("SELECT * FROM licences")).toHaveLength(1);
    expect(rows("SELECT * FROM entitlements")).toHaveLength(1);
    const key = licenceKey(o.id);
    const device = activateLicence(
      o.user,
      key,
      "device-fingerprint-0001",
      "Laptop",
    );
    expect(
      activateLicence(o.user, key, "device-fingerprint-0001", "Laptop"),
    ).toBe(device);
    expect(() =>
      activateLicence(o.user, key, "device-fingerprint-0002", "Second PC"),
    ).toThrow("limit reached");
    expect(() =>
      activateLicence("someone-else", key, "device-fingerprint-0001", "Laptop"),
    ).toThrow("invalid");
    run("UPDATE licences SET revoked=1");
    expect(() =>
      activateLicence(o.user, key, "device-fingerprint-0001", "Laptop"),
    ).toThrow("revoked");
  });
});

it("recalculates a cart from approved offers and grants every verified bundle product once", async () => {
  const o = await order();
  process.env.DOCHENG_APPROVED_TEST_OFFERS = JSON.stringify([
    {
      id: "desk-test",
      productSlug: "desk",
      amount: 10000,
      currency: "ZAR",
      deviceLimit: 2,
      bundleProducts: ["resume"],
    },
    {
      id: "compass-test",
      productSlug: "compass",
      amount: 5000,
      currency: "ZAR",
      deviceLimit: 1,
      days: 30,
    },
  ]);
  const cart = createCheckout(o.user, ["desk-test", "compass-test"]);
  expect(cart.amount).toBe(15000);
  const verified = {
    status: "success",
    reference: cart.reference,
    amount: 15000,
    currency: "ZAR",
    customer: { email: "buyer@example.test" },
    domain: "test",
  };
  expect(() =>
    fulfilCheckoutPayment(
      cart.reference,
      { ...verified, amount: 1 },
      "wrong-total",
    ),
  ).toThrow("does not match");
  expect(rows("SELECT * FROM entitlements")).toHaveLength(0);
  // The original checkout snapshot is honored when an operator edits a later quote.
  process.env.DOCHENG_APPROVED_TEST_OFFERS = JSON.stringify([
    {
      id: "desk-test",
      productSlug: "desk",
      amount: 99999,
      currency: "ZAR",
      deviceLimit: 1,
    },
  ]);
  fulfilCheckoutPayment(cart.reference, verified, "cart-event");
  fulfilCheckoutPayment(cart.reference, verified, "cart-event");
  expect(rows("SELECT * FROM licences")).toHaveLength(2);
  expect(
    rows<{ product_slug: string }>(
      "SELECT product_slug FROM entitlements ORDER BY product_slug",
    ).map((p) => p.product_slug),
  ).toEqual(["compass", "desk", "resume"]);
  expect(rows("SELECT * FROM licence_products")).toHaveLength(3);
});
it("rejects unknown, duplicate and overlapping cart offers before creating a payment batch", async () => {
  const o = await order();
  expect(() => createCheckout(o.user, ["invented"]).amount).toThrow(
    "no longer",
  );
  expect(() => createCheckout(o.user, ["desk-test", "desk-test"])).toThrow(
    "different",
  );
  process.env.DOCHENG_APPROVED_TEST_OFFERS = JSON.stringify([
    {
      id: "desk-test",
      productSlug: "desk",
      amount: 10000,
      currency: "ZAR",
      deviceLimit: 1,
      bundleProducts: ["resume"],
    },
    {
      id: "resume-test",
      productSlug: "resume",
      amount: 2000,
      currency: "ZAR",
      deviceLimit: 1,
    },
  ]);
  expect(() => createCheckout(o.user, ["desk-test", "resume-test"])).toThrow(
    "same product",
  );
  expect(rows("SELECT * FROM checkout_batches")).toHaveLength(0);
});
