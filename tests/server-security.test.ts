// @vitest-environment node
import { randomUUID } from "node:crypto";
import { resolve } from "node:path";
import { vi, beforeAll, beforeEach, describe, it, expect } from "vitest";
const jar = vi.hoisted(() => new Map<string, string>());
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) =>
      jar.has(name) ? { value: jar.get(name) } : undefined,
    set: (name: string, value: string) => jar.set(name, value),
  }),
}));
import { POST as authPost } from "@/app/api/auth/[action]/route";
import { POST as supportPost } from "@/app/api/support/route";
import { GET as accountGet } from "@/app/api/account/route";
import { GET as adminGet, POST as adminPost } from "@/app/api/admin/route";
import {
  register,
  authenticate,
  createSession,
  sessionForToken,
  issueToken,
  consumeToken,
  SESSION_COOKIE,
} from "@/lib/server/auth";
import { database, rows, run } from "@/lib/server/database";
import {
  rateLimit,
  digest,
  verifyPassword,
  hashPassword,
} from "@/lib/server/security";
import { safeNextPath } from "@/lib/auth/redirect";
const request = (path: string, body: unknown, origin = "http://localhost") =>
  new Request("http://localhost" + path, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: origin },
    body: JSON.stringify(body),
  });
beforeAll(() => {
  process.env.DOCHENG_DATA_DIR = resolve(".test-data", randomUUID());
  delete process.env.RESEND_API_KEY;
});
beforeEach(() => {
  jar.clear();
  database().exec(
    "DELETE FROM devices;DELETE FROM licences;DELETE FROM payment_events;DELETE FROM orders;DELETE FROM ticket_messages;DELETE FROM tickets;DELETE FROM sessions;DELETE FROM auth_tokens;DELETE FROM entitlements;DELETE FROM users;DELETE FROM rate_limits;DELETE FROM mail_outbox;DELETE FROM audit_log;DELETE FROM product_drafts;DELETE FROM product_repositories;DELETE FROM published_products;DELETE FROM subscriptions;",
  );
});
describe("server trust boundaries", () => {
  it("checks real passwords and never infers administrator role or access from an address", async () => {
    const id = await register(
      "all-admin-pro@example.com",
      "Member",
      "correct horse battery staple",
    );
    await expect(
      authenticate("all-admin-pro@example.com", "wrong password entirely"),
    ).rejects.toThrow("incorrect");
    expect(
      await authenticate(
        "all-admin-pro@example.com",
        "correct horse battery staple",
      ),
    ).toBe(id);
    const token = createSession(id);
    const session = sessionForToken(token);
    expect(session.user?.role).toBe("user");
    expect(session.entitlements).toEqual([]);
    expect(
      rows<{ token_hash: string }>("SELECT token_hash FROM sessions")[0]
        .token_hash,
    ).toBe(digest(token));
    expect(JSON.stringify(rows("SELECT * FROM users"))).not.toContain(
      "correct horse",
    );
  });
  it("rejects fake legacy cookies, expired sessions and disabled users", async () => {
    jar.set("dochengv2-auth", "1");
    expect((await accountGet()).status).toBe(401);
    expect(sessionForToken("1").state).toBe("guest");
    const id = await register(
        "person@example.com",
        "Person",
        "correct horse battery staple",
      ),
      token = createSession(id);
    run("UPDATE sessions SET expires_at=0");
    expect(sessionForToken(token).state).toBe("guest");
    const active = createSession(id);
    run("UPDATE users SET disabled=1 WHERE id=?", id);
    expect(sessionForToken(active).state).toBe("guest");
  });
  it("revalidates roles and entitlements for each server read", async () => {
    const id = await register(
      "admin-in-name@example.com",
      "User",
      "correct horse battery staple",
    );
    jar.set(SESSION_COOKIE, createSession(id));
    expect((await adminGet()).status).toBe(403);
    run(
      "INSERT INTO entitlements VALUES (?,?,?,?,?,?)",
      randomUUID(),
      id,
      "resume",
      "active",
      "manual",
      Date.now() - 1,
    );
    expect(sessionForToken(jar.get(SESSION_COOKIE)).entitlements).toEqual([]);
    run("UPDATE users SET role='admin',verified=1 WHERE id=?", id);
    expect((await adminGet()).status).toBe(200);
    run("UPDATE users SET role='user' WHERE id=?", id);
    expect((await adminGet()).status).toBe(403);
  });
  it("uses single-use reset tokens and revokes old sessions", async () => {
    const id = await register(
        "reset@example.com",
        "Reset",
        "old password is very long",
      ),
      session = createSession(id),
      token = issueToken(id, "reset");
    await consumeToken(token, "reset", "new password is very long");
    expect(sessionForToken(session).state).toBe("guest");
    await expect(
      consumeToken(token, "reset", "another long password"),
    ).rejects.toThrow("expired");
    await expect(
      authenticate("reset@example.com", "old password is very long"),
    ).rejects.toThrow();
    expect(
      await authenticate("reset@example.com", "new password is very long"),
    ).toBe(id);
  });
  it("protects auth mutations against cross-site submissions", async () => {
    const response = await authPost(
      request(
        "/api/auth/signup",
        {
          name: "Member",
          email: "member@example.com",
          password: "long and strong password",
        },
        "https://attacker.example",
      ),
      { params: Promise.resolve({ action: "signup" }) },
    );
    expect(response.status).toBe(403);
    expect(rows("SELECT * FROM users")).toHaveLength(0);
  });
  it("stores a support ticket and durable mail separately, without claiming delivery", async () => {
    const body = {
      name: "Test Member",
      email: "test@example.com",
      enquiryType: "technical",
      product: "desk",
      message: "I need help understanding installation availability.",
      consent: true,
    };
    const response = await supportPost(request("/api/support", body));
    expect(response.status).toBe(201);
    const result = await response.json();
    expect(result.ticket).toMatch(/^DCH-\d{4}-[A-F0-9]{12}$/);
    expect(result.emailStatus).toBe("queued");
    expect(rows("SELECT * FROM tickets")).toHaveLength(1);
    expect(
      rows("SELECT * FROM mail_outbox WHERE status='queued'"),
    ).toHaveLength(1);
  });
  it("does not attach anonymous tickets to an account based on a supplied email", async () => {
    const id = await register(
      "owner@example.com",
      "Owner",
      "correct horse battery staple",
    );
    await supportPost(
      request("/api/support", {
        name: "Someone",
        email: "owner@example.com",
        enquiryType: "general",
        product: "ecosystem",
        message: "This message is not from an authenticated account.",
        consent: true,
      }),
    );
    jar.set(SESSION_COOKIE, createSession(id));
    const response = await accountGet();
    expect((await response.json()).tickets).toEqual([]);
  });
  it("rejects spam, unknown categories, oversized bodies and missing consent", async () => {
    const body = {
      name: "Person",
      email: "test@example.com",
      enquiryType: "invented",
      product: "desk",
      message: "A message long enough for this form.",
      consent: true,
    };
    expect((await supportPost(request("/api/support", body))).status).toBe(400);
    expect(
      (
        await supportPost(
          request("/api/support", {
            ...body,
            enquiryType: "general",
            website: "spam",
          }),
        )
      ).status,
    ).toBe(400);
    expect(
      (
        await supportPost(
          request("/api/support", {
            ...body,
            enquiryType: "general",
            consent: false,
          }),
        )
      ).status,
    ).toBe(400);
    expect(
      (
        await supportPost(
          request("/api/support", { ...body, message: "x".repeat(20_000) }),
        )
      ).status,
    ).toBe(413);
    expect(rows("SELECT * FROM tickets")).toHaveLength(0);
  });
  it("enforces durable rate limits", () => {
    rateLimit("test", "key", 2);
    rateLimit("test", "key", 2);
    expect(() => rateLimit("test", "key", 2)).toThrow("Too many");
  });
  it("uses salted password hashes", async () => {
    const a = await hashPassword("a real password here"),
      b = await hashPassword("a real password here");
    expect(a).not.toBe(b);
    expect(await verifyPassword("a real password here", a)).toBe(true);
    expect(await verifyPassword("wrong password", a)).toBe(false);
  });
  it("rejects open redirects", () => {
    for (const path of [
      "https://evil.example",
      "//evil.example",
      "/\\evil.example",
      "/\n/evil.example",
    ])
      expect(safeNextPath(path)).toBe("/account");
    expect(safeNextPath("/products/desk")).toBe("/products/desk");
  });
  it("requires explicit administrator publication approval", async () => {
    const id = await register(
      "owner@example.com",
      "Owner",
      "correct horse battery staple",
    );
    run("UPDATE users SET role='admin',verified=1 WHERE id=?", id);
    jar.set(SESSION_COOKIE, createSession(id));
    const { baseCatalogue } = await import("@/lib/catalogue");
    const response = await adminPost(
      request("/api/admin", { action: "publish", product: baseCatalogue[0] }),
    );
    expect(response.status).toBe(400);
    expect(rows("SELECT * FROM product_drafts")).toHaveLength(0);
  });
});

it("bootstraps only the explicitly configured first administrator after mailbox verification", async () => {
  vi.stubEnv("DOCHENG_BOOTSTRAP_ADMIN_EMAIL", "owner@example.com");
  try {
    const owner = await register(
      "owner@example.com",
      "Owner",
      "a long owner password here",
    );
    expect(sessionForToken(createSession(owner)).user?.role).toBe("user");
    await consumeToken(issueToken(owner, "verify"), "verify");
    expect(sessionForToken(createSession(owner)).user?.role).toBe("admin");
    const other = await register(
      "second@example.com",
      "Other",
      "a long other password here",
    );
    await consumeToken(issueToken(other, "verify"), "verify");
    expect(sessionForToken(createSession(other)).user?.role).toBe("user");
  } finally {
    vi.unstubAllEnvs();
  }
});
it("keeps approved publications stable while drafts change and rejects stale revisions", async () => {
  const owner = await register(
    "owner@example.com",
    "Owner",
    "a long owner password here",
  );
  run("UPDATE users SET role='admin',verified=1 WHERE id=?", owner);
  jar.set(SESSION_COOKIE, createSession(owner));
  const { baseCatalogue } = await import("@/lib/catalogue");
  const { publishedCatalogue } = await import("@/lib/server/catalogue");
  const product = {
    ...baseCatalogue[0],
    slug: "qa-lab",
    name: "QA original",
    status: "planned",
    launch: undefined,
    releases: [],
    support: "/support?product=qa-lab#contact-form",
    privateRepository: "https://example.test/private-source",
  };
  expect(
    (
      await adminPost(
        request("/api/admin", { action: "save-product", product }),
      )
    ).status,
  ).toBe(200);
  expect(publishedCatalogue().some((p) => p.slug === "qa-lab")).toBe(false);
  expect(
    (
      await adminPost(
        request("/api/admin", {
          action: "publish",
          product,
          revision: 1,
          approvePublication: true,
        }),
      )
    ).status,
  ).toBe(200);
  const edited = { ...product, name: "QA draft edit" };
  expect(
    (
      await adminPost(
        request("/api/admin", {
          action: "save-product",
          product: edited,
          revision: 2,
        }),
      )
    ).status,
  ).toBe(200);
  expect(publishedCatalogue().find((p) => p.slug === "qa-lab")?.name).toBe(
    "QA original",
  );
  expect(JSON.stringify(publishedCatalogue())).not.toContain("private-source");
  expect(
    (
      await adminPost(
        request("/api/admin", {
          action: "publish",
          product: edited,
          revision: 2,
          approvePublication: true,
        }),
      )
    ).status,
  ).toBe(409);
  expect(
    (
      await adminPost(
        request("/api/admin", {
          action: "unpublish",
          product: edited,
          revision: 3,
        }),
      )
    ).status,
  ).toBe(200);
  expect(publishedCatalogue().some((p) => p.slug === "qa-lab")).toBe(false);
});
it("requires an administrator role for account-state changes and revokes disabled sessions", async () => {
  const owner = await register(
      "owner@example.com",
      "Owner",
      "a long owner password here",
    ),
    member = await register(
      "member@example.com",
      "Member",
      "a long member password here",
    ),
    memberToken = createSession(member);
  jar.set(SESSION_COOKIE, memberToken);
  expect(
    (
      await adminPost(
        request("/api/admin", {
          action: "user-state",
          userId: owner,
          disabled: true,
        }),
      )
    ).status,
  ).toBe(403);
  run("UPDATE users SET role='admin',verified=1 WHERE id=?", owner);
  jar.set(SESSION_COOKIE, createSession(owner));
  expect(
    (
      await adminPost(
        request("/api/admin", {
          action: "user-state",
          userId: member,
          disabled: true,
        }),
      )
    ).status,
  ).toBe(200);
  expect(sessionForToken(memberToken).state).toBe("guest");
  expect(
    (
      await adminPost(
        request("/api/admin", {
          action: "user-state",
          userId: owner,
          disabled: true,
        }),
      )
    ).status,
  ).toBe(400);
});

it("keeps repository references private and refuses internal product publication",async()=>{
 const id=await register("owner@example.com","Owner","a long owner password here");run("UPDATE users SET role='admin',verified=1 WHERE id=?",id);jar.set(SESSION_COOKIE,createSession(id));
 expect((await adminPost(request("/api/admin",{action:"repository",slug:"desk",repository:"example-owner/private-code",private:true}))).status).toBe(200);
 const admin=await adminGet();expect((await admin.json()).repositories[0].repository).toBe("example-owner/private-code");
 const {baseCatalogue}=await import("@/lib/catalogue");const{publishedCatalogue}=await import("@/lib/server/catalogue");expect(JSON.stringify(publishedCatalogue())).not.toContain("private-code");
 expect((await adminPost(request("/api/admin",{action:"publish",product:{...baseCatalogue[0],visibility:"internal"},approvePublication:true}))).status).toBe(400);
 run("UPDATE users SET role='user' WHERE id=?",id);expect((await adminGet()).status).toBe(403);
});
