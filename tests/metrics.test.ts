// @vitest-environment node
import { beforeAll, beforeEach, it, expect } from "vitest";
import { resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { database, rows } from "@/lib/server/database";
import { POST } from "@/app/api/metrics/route";
beforeAll(() => {
  process.env.DOCHENG_DATA_DIR = resolve(".test-data", randomUUID());
});
beforeEach(() => {
  database().exec("DELETE FROM metrics_daily;DELETE FROM rate_limits;");
});
const request = (body: object, headers: Record<string, string> = {}) =>
  new Request("http://localhost/api/metrics", {
    method: "POST",
    headers: {
      Origin: "http://localhost",
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });
it("counts public page views by broad campaign without visitor data", async () => {
  for (let n = 0; n < 2; n++)
    expect(
      (
        await POST(
          request({
            path: "/apps",
            campaign: "newsletter",
            email: "must-not-be-stored@example.test",
          }),
        )
      ).status,
    ).toBe(200);
  expect(rows<{ views: number }>("SELECT * FROM metrics_daily")[0].views).toBe(
    2,
  );
  expect(JSON.stringify(rows("SELECT * FROM metrics_daily"))).not.toContain(
    "must-not-be-stored",
  );
});
it("ignores private routes and privacy opt-outs and rejects cross-site submissions", async () => {
  await POST(
    request({ path: "/reset-password?token=secret", campaign: "unknown" }),
  );
  await POST(request({ path: "/apps" }, { dnt: "1" }));
  await POST(request({ path: "/apps" }, { "sec-gpc": "1" }));
  expect(
    (
      await POST(
        request({ path: "/apps" }, { Origin: "https://attacker.example" }),
      )
    ).status,
  ).toBe(403);
  expect(rows("SELECT * FROM metrics_daily")).toEqual([]);
});
it("never stores arbitrary referral values", async () => {
  await POST(request({ path: "/apps", campaign: "person@example.test" }));
  expect(
    rows<{ campaign: string }>("SELECT campaign FROM metrics_daily")[0]
      .campaign,
  ).toBe("direct");
});
