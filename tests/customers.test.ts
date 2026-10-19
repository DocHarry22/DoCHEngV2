// @vitest-environment node
import { randomUUID } from "node:crypto";
import { resolve } from "node:path";
import { beforeAll, beforeEach, it, expect, vi } from "vitest";
const jar = vi.hoisted(() => new Map<string, string>());
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) =>
      jar.has(name) ? { value: jar.get(name) } : undefined,
  }),
}));
import { GET as directoryGet } from "@/app/api/admin/customers/route";
import { GET as profileGet } from "@/app/api/admin/customers/[id]/route";
import { POST as adminPost } from "@/app/api/admin/route";
import {
  createSession,
  SESSION_COOKIE,
  sessionForToken,
} from "@/lib/server/auth";
import { database, run, rows } from "@/lib/server/database";
import { audit } from "@/lib/server/security";
import type {
  CustomerDirectoryData,
  CustomerProfileData,
} from "@/lib/customers";
beforeAll(() => {
  process.env.DOCHENG_DATA_DIR = resolve(".test-data", randomUUID());
});
beforeEach(() => {
  jar.clear();
  database().exec(
    "DELETE FROM devices;DELETE FROM licence_products;DELETE FROM licences;DELETE FROM orders;DELETE FROM ticket_messages;DELETE FROM tickets;DELETE FROM sessions;DELETE FROM auth_tokens;DELETE FROM entitlements;DELETE FROM users;DELETE FROM audit_log;DELETE FROM rate_limits;",
  );
});
function user(
  name = "Customer",
  verified = 1,
  disabled = 0,
  created = Date.now(),
) {
  const id = randomUUID();
  run(
    "INSERT INTO users (id,email,name,password_hash,verified,disabled,created_at) VALUES (?,?,?,?,?,?,?)",
    id,
    id + "@example.test",
    name,
    "private-password-hash",
    verified,
    disabled,
    created,
  );
  return id;
}
function administrator() {
  const id = user("Owner");
  run("UPDATE users SET role='admin' WHERE id=?", id);
  jar.set(SESSION_COOKIE, createSession(id));
  return id;
}
const directory = (query = "") =>
  directoryGet(new Request("http://localhost/api/admin/customers" + query));
const profile = (id: string, query = "") =>
  profileGet(
    new Request("http://localhost/api/admin/customers/" + id + query),
    { params: Promise.resolve({ id }) },
  );
function licence(owner: string, hint = "ABCD") {
  const order = randomUUID(),
    id = randomUUID();
  run(
    "INSERT INTO orders VALUES (?,?,?,?,?,?,?,?,?,?)",
    order,
    owner,
    randomUUID(),
    "desk",
    100,
    "ZAR",
    "paid",
    "test",
    Date.now(),
    Date.now(),
  );
  run(
    "INSERT INTO licences VALUES (?,?,?,?,?,?,?,?,?)",
    id,
    order,
    owner,
    "desk",
    "private-key-hash-" + id,
    hint,
    2,
    null,
    0,
  );
  return id;
}
function ticket(owner: string | null, email = "guest@example.test") {
  const id = "DCH-TEST-" + randomUUID();
  run(
    "INSERT INTO tickets VALUES (?,?,?,?,?,?,?,?,?,?,?)",
    id,
    owner,
    email,
    "Customer",
    "technical",
    "desk",
    "Customer support message",
    "",
    "",
    "open",
    Date.now(),
  );
  return id;
}
const mutation = (body: unknown) =>
  adminPost(
    new Request("http://localhost/api/admin", {
      method: "POST",
      headers: {
        Origin: "http://localhost",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }),
  );

it("requires a live verified administrator session for directory and profile reads", async () => {
  const id = user();
  expect((await directory()).status).toBe(401);
  expect((await profile(id)).status).toBe(401);
  jar.set(SESSION_COOKIE, createSession(id));
  expect((await directory()).status).toBe(403);
  expect((await profile(id)).status).toBe(403);
  run("UPDATE users SET role='admin',verified=0 WHERE id=?", id);
  expect((await profile(id)).status).toBe(403);
  run("UPDATE users SET verified=1 WHERE id=?", id);
  const response = await directory();
  expect(response.status).toBe(200);
  expect(response.headers.get("cache-control")).toContain("no-store");
  run("UPDATE users SET disabled=1 WHERE id=?", id);
  expect((await directory()).status).toBe(401);
});
it("searches and paginates every customer, treats SQL patterns literally, and combines filters", async () => {
  administrator();
  const old = user("Under_score% O'Neil", 0, 1, 1);
  for (let i = 0; i < 111; i++) user("Directory " + i, i % 2, 0, 100 + i);
  const first: CustomerDirectoryData = await (await directory()).json();
  expect(first.total).toBe(113);
  expect(first.items).toHaveLength(25);
  expect(first.pages).toBe(5);
  const last: CustomerDirectoryData = await (await directory("?page=5")).json();
  expect(last.items.map((u) => u.id)).toContain(old);
  expect(first.items.some((a) => last.items.some((b) => a.id === b.id))).toBe(
    false,
  );
  const found: CustomerDirectoryData = await (
    await directory(
      "?q=" +
        encodeURIComponent("under_SCORE% o'neil") +
        "&verification=unverified&state=disabled",
    )
  ).json();
  expect(found.total).toBe(1);
  expect(found.items[0].id).toBe(old);
  expect(
    (await (await directory("?q=" + encodeURIComponent("' OR 1=1 --"))).json())
      .total,
  ).toBe(0);
  expect(
    (
      await (
        await directory("?q=" + encodeURIComponent(old + "@example.test"))
      ).json()
    ).total,
  ).toBe(1);
  expect(JSON.stringify(first)).not.toContain("password_hash");
});
it("rejects invalid filters and pages, bounds high pages, and handles missing profiles", async () => {
  const owner = administrator();
  for (const query of [
    "?page=0",
    "?page=-1",
    "?page=1.2",
    "?page=1000000",
    "?state=anything",
    "?verification=1",
    "?q=" + "a".repeat(255),
  ])
    expect((await directory(query)).status).toBe(400);
  expect((await (await directory("?page=999999")).json()).page).toBe(1);
  expect((await profile("' OR 1=1")).status).toBe(400);
  expect((await profile(randomUUID())).status).toBe(404);
  expect((await profile(owner, "?ticketPage=-1")).status).toBe(400);
});
it("scopes profile data and audit history to the selected account and excludes authentication and licence secrets", async () => {
  const owner = administrator(),
    customer = user(),
    other = user("Other customer");
  const key = licence(customer),
    otherKey = licence(other, "WXYZ"),
    support = ticket(customer),
    otherTicket = ticket(other);
  ticket(null, customer + "@example.test");
  run("INSERT INTO licence_products VALUES (?,?)", key, "resume");
  run(
    "INSERT INTO devices VALUES (?,?,?,?,?,?)",
    randomUUID(),
    key,
    customer,
    "private-device-hash",
    "Laptop",
    Date.now(),
  );
  run(
    "INSERT INTO entitlements VALUES (?,?,?,?,?,?)",
    randomUUID(),
    customer,
    "desk",
    "trial",
    "manual",
    123,
  );
  run(
    "INSERT INTO ticket_messages VALUES (?,?,?,?,?)",
    randomUUID(),
    support,
    owner,
    "A recorded support reply",
    Date.now(),
  );
  audit(customer, "account.created", customer);
  audit(owner, "entitlement.changed", customer, "desk:trial");
  audit(owner, "licence.revoked", key);
  audit(owner, "support.replied", support);
  audit(owner, "licence.revoked", otherKey);
  audit(other, "support.replied", otherTicket);
  const response = await profile(customer),
    data: CustomerProfileData = await response.json();
  expect(data.customer.id).toBe(customer);
  expect(data.currentUserId).toBe(owner);
  expect(data.entitlements[0].expires_at).toBe(123);
  expect(data.licences.total).toBe(1);
  expect(data.licences.items[0]).toMatchObject({
    id: key,
    devices: 1,
    products: ["resume"],
  });
  expect(data.tickets.total).toBe(1);
  expect(data.tickets.items[0].replies[0].message).toBe(
    "A recorded support reply",
  );
  expect(data.activity.total).toBe(4);
  const json = JSON.stringify(data);
  for (const secret of [
    "password_hash",
    "private-password-hash",
    "key_hash",
    "private-key-hash",
    "private-device-hash",
    "token_hash",
    otherKey,
    otherTicket,
  ])
    expect(json).not.toContain(secret);
});
it("paginates licence, support and activity histories independently", async () => {
  const owner = administrator(),
    customer = user();
  for (let i = 0; i < 21; i++) {
    licence(customer);
    ticket(customer);
    audit(owner, "entitlement.changed", customer, "event " + i);
  }
  const first: CustomerProfileData = await (await profile(customer)).json();
  const second: CustomerProfileData = await (
    await profile(customer, "?licencePage=3&ticketPage=2&activityPage=2")
  ).json();
  expect(first.licences.total).toBe(21);
  expect(first.licences.items).toHaveLength(10);
  expect(second.licences.items).toHaveLength(1);
  expect(second.tickets.items).toHaveLength(10);
  expect(second.activity.items).toHaveLength(1);
  expect(
    second.tickets.items.some((b) =>
      first.tickets.items.some((a) => a.id === b.id),
    ),
  ).toBe(false);
});
it("keeps account and access changes audited, invalidates disabled sessions and reflects licence revocation in the profile", async () => {
  const owner = administrator(),
    customer = user(),
    session = createSession(customer),
    key = licence(customer);
  run(
    "INSERT INTO devices VALUES (?,?,?,?,?,?)",
    randomUUID(),
    key,
    customer,
    "device-hash",
    "Laptop",
    Date.now(),
  );
  expect(
    (await mutation({ action: "user-state", userId: owner, disabled: true }))
      .status,
  ).toBe(400);
  expect(
    (await mutation({ action: "user-state", userId: customer, disabled: true }))
      .status,
  ).toBe(200);
  expect(sessionForToken(session).state).toBe("guest");
  expect(
    (
      await mutation({
        action: "entitlement",
        userId: customer,
        slug: "desk",
        state: "trial",
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
      })
    ).status,
  ).toBe(200);
  expect(
    (await mutation({ action: "revoke-licence", licenceId: key })).status,
  ).toBe(200);
  const data: CustomerProfileData = await (await profile(customer)).json();
  expect(data.customer.disabled).toBe(1);
  expect(data.entitlements[0].state).toBe("trial");
  expect(data.licences.items[0]).toMatchObject({ revoked: 1, devices: 0 });
  expect(data.activity.items.map((a) => a.action)).toEqual(
    expect.arrayContaining([
      "user.state-changed",
      "entitlement.changed",
      "licence.revoked",
    ]),
  );
  expect(rows("SELECT * FROM devices WHERE licence_id=?", key)).toHaveLength(0);
});
