// @vitest-environment node
import { beforeAll, beforeEach, afterEach, it, expect, vi } from "vitest";
import { resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { database, rows } from "@/lib/server/database";
import { queueMail, deliverMail } from "@/lib/server/mail";
beforeAll(() => {
  process.env.DOCHENG_DATA_DIR = resolve(".test-data", randomUUID());
});
beforeEach(() => {
  database().exec("DELETE FROM mail_outbox");
  vi.stubEnv("RESEND_API_KEY", "");
  vi.stubEnv("HOSTINGER_MAIL_TOKEN", "");
  vi.stubEnv("HOSTINGER_MAILBOX_ID", "");
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});
it("keeps mail durable when no provider is configured", async () => {
  const id = queueMail("member@example.test", "Verification", "Test message");
  expect(await deliverMail(id)).toBe(false);
  expect(
    rows<{ status: string }>("SELECT status FROM mail_outbox")[0].status,
  ).toBe("queued");
});
it("uses Hostinger's documented send endpoint and recognizes its empty 204 response", async () => {
  vi.stubEnv("HOSTINGER_MAIL_TOKEN", "test-secret");
  vi.stubEnv("HOSTINGER_MAILBOX_ID", "mailbox-test");
  const send = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
  vi.stubGlobal("fetch", send);
  const id = queueMail("member@example.test", "Verify", "Single-use link");
  expect(await deliverMail(id)).toBe(true);
  const [url, options] = send.mock.calls[0];
  expect(url).toBe(
    "https://api.mail.hostinger.com/api/v1/mailboxes/mailbox-test/send",
  );
  expect(JSON.parse(options.body)).toEqual({
    to: ["member@example.test"],
    displayName: "DoCHEng",
    subject: "Verify",
    text: "Single-use link",
  });
  expect(await deliverMail(id)).toBe(true);
  expect(send).toHaveBeenCalledTimes(1);
});
it("never reports a failed provider request as accepted", async () => {
  vi.stubEnv("HOSTINGER_MAIL_TOKEN", "test-secret");
  vi.stubEnv("HOSTINGER_MAILBOX_ID", "mailbox-test");
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(new Response(null, { status: 403 })),
  );
  const id = queueMail("member@example.test", "Verify", "Message");
  expect(await deliverMail(id)).toBe(false);
  expect(
    rows<{ status: string; attempts: number }>(
      "SELECT status,attempts FROM mail_outbox",
    )[0],
  ).toMatchObject({ status: "queued", attempts: 1 });
});
