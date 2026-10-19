import { test, expect, type Page } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
let fixture: {
  token: string;
  batch: string;
  ticket: string;
  licence: string;
  adminId: string;
  customer: { id: string; email: string; name: string };
};
test.beforeEach(async ({ context }) => {
  fixture = JSON.parse(
    execFileSync(
      process.execPath,
      [resolve("tests/e2e/fixtures/seed-admin.mjs"), "--customers"],
      { encoding: "utf8", env: { ...process.env, NODE_OPTIONS: "" } },
    ),
  );
  await context.addCookies([
    {
      name: "__Host-docheng-session",
      value: fixture.token,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
    },
  ]);
});
async function search(page: Page, value: string) {
  await page.getByRole("searchbox", { name: "Search customers" }).fill(value);
  await page.getByRole("button", { name: "Search", exact: true }).click();
}
async function accessibility(page: Page) {
  await page.addScriptTag({
    path: resolve("node_modules/axe-core/axe.min.js"),
  });
  const violations = await page.evaluate(async () => {
    const axe = (
      window as unknown as {
        axe: {
          run: (
            document: Document,
            options: object,
          ) => Promise<{ violations: { id: string; impact: string }[] }>;
        };
      }
    ).axe;
    return (
      await axe.run(document, {
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
      })
    ).violations
      .filter((v) => ["serious", "critical"].includes(v.impact))
      .map((v) => v.id);
  });
  expect(violations).toEqual([]);
}
test("directory finds accounts beyond 100, combines filters and opens complete bookmarkable profiles", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/admin#customers");
  await expect(
    page.getByRole("heading", { name: "Customer directory", exact: true }),
  ).toBeVisible();
  await search(page, "directory-" + fixture.batch);
  await expect(page.getByRole("status")).toContainText("111 customers found");
  for (let i = 2; i <= 5; i++) {
    await page.getByRole("button", { name: "Next customers page" }).click();
    await expect(
      page.getByRole("navigation", { name: "customers pages" }),
    ).toContainText("Page " + i + " of 5");
  }
  await expect(
    page.getByRole("link", { name: fixture.customer.name, exact: true }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: fixture.customer.name, exact: true })
    .click();
  await expect(page).toHaveURL(
    new RegExp("#customers/" + fixture.customer.id + "$"),
  );
  await expect(
    page.getByRole("heading", {
      name: "Customer profile: " + fixture.customer.name,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("article", { name: "Account details" }),
  ).toContainText(fixture.customer.email);
  await expect(
    page.getByRole("article", { name: "Customer licences" }),
  ).toContainText("Ending TEST");
  await page
    .getByRole("article", { name: "Customer support history" })
    .locator("summary")
    .filter({ hasText: fixture.ticket })
    .click();
  await expect(
    page.getByRole("article", { name: "Customer support history" }),
  ).toContainText("Local recorded support reply.");
  await expect(
    page.getByRole("article", { name: "Customer activity" }),
  ).toContainText("Account created");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({
    path: test.info().outputPath("customer-profile.png"),
    fullPage: true,
  });
  await page.screenshot({
    path: test.info().outputPath("customer-profile-viewport.png"),
  });
  await accessibility(page);
  await page.getByRole("link", { name: "Back to customer directory" }).click();
  await expect(
    page.getByRole("navigation", { name: "customers pages" }),
  ).toContainText("Page 5 of 5");
  await page
    .getByRole("combobox", { name: "Verification", exact: true })
    .selectOption("verified");
  await page
    .getByRole("combobox", { name: "Account status", exact: true })
    .selectOption("disabled");
  await expect(page.getByRole("status")).toContainText("18 customers found");
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({
    path: test.info().outputPath("customer-directory-viewport.png"),
  });
  await accessibility(page);
  await search(page, "no-matching-customer-" + fixture.batch);
  await expect(
    page.getByText("No customers match these filters.", { exact: false }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Reset search" }).click();
  await expect(
    page.getByRole("searchbox", { name: "Search customers" }),
  ).toHaveValue("");
  expect(errors).toEqual([]);
});
test("profile requires confirmation for account, product access and licence changes and records the outcomes", async ({
  page,
  context,
}) => {
  await page.goto("/admin#customers/" + fixture.customer.id);
  const account = page.getByRole("article", { name: "Account details" });
  await expect(account).toContainText("Enabled");
  await page
    .getByRole("button", { name: "Disable account", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText(fixture.customer.email);
  await expect(
    dialog.getByRole("button", { name: "Cancel", exact: true }),
  ).toBeFocused();
  await page.screenshot({
    path: test.info().outputPath("customer-confirmation-viewport.png"),
  });
  await accessibility(page);
  await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
  expect(
    (
      await (
        await context.request.get("/api/admin/customers/" + fixture.customer.id)
      ).json()
    ).customer.disabled,
  ).toBe(0);
  await page
    .getByRole("button", { name: "Disable account", exact: true })
    .click();
  await page.route("**/api/admin", (route) =>
    route.request().method() === "POST"
      ? route.fulfill({
          status: 503,
          contentType: "application/json",
          body: JSON.stringify({ message: "Temporary save failure" }),
        })
      : route.continue(),
  );
  await dialog
    .getByRole("button", { name: "Confirm change", exact: true })
    .click();
  await expect(dialog.getByRole("alert")).toContainText(
    "Temporary save failure",
  );
  await page.unroute("**/api/admin");
  await dialog
    .getByRole("button", { name: "Confirm change", exact: true })
    .click();
  await expect(dialog).toHaveCount(0);
  await expect(account).toContainText("Disabled");
  const access = page.getByRole("article", { name: "Product access" });
  await access
    .getByRole("combobox", { name: "Product", exact: true })
    .selectOption("resume");
  await access
    .getByRole("combobox", { name: "Access", exact: true })
    .selectOption("active");
  await access
    .getByLabel("Expiry (your local time, optional)", { exact: true })
    .fill("2030-01-01T12:00");
  await access.getByRole("button", { name: "Review access change" }).click();
  await expect(dialog).toContainText("Manual grant");
  await dialog
    .getByRole("button", { name: "Confirm change", exact: true })
    .click();
  await expect(dialog).toHaveCount(0);
  await expect(access).toContainText("active · manual");
  const profile = await (
    await context.request.get("/api/admin/customers/" + fixture.customer.id)
  ).json();
  expect(
    profile.entitlements.find(
      (e: { product_slug: string }) => e.product_slug === "resume",
    ).expires_at,
  ).toBe(await page.evaluate(() => new Date("2030-01-01T12:00").getTime()));
  await page
    .getByRole("button", { name: "Revoke licence ending TEST" })
    .click();
  await expect(dialog).toContainText("registered devices removed");
  await dialog
    .getByRole("button", { name: "Confirm change", exact: true })
    .click();
  await expect(dialog).toHaveCount(0);
  await expect(
    page.getByRole("article", { name: "Customer licences" }),
  ).toContainText("Revoked");
  await expect(
    page.getByRole("article", { name: "Customer activity" }),
  ).toContainText("Licence revoked");
  await page
    .getByRole("button", { name: "Enable account", exact: true })
    .click();
  await dialog
    .getByRole("button", { name: "Confirm change", exact: true })
    .click();
  await expect(account).toContainText("Enabled");
  await page.goto("/admin#customers/" + fixture.adminId);
  await expect(
    page.getByText("You are viewing your own account.", { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Disable account", exact: true }),
  ).toHaveCount(0);
});
test("customer reads recover from outages and discard profile data when access is rejected", async ({
  page,
}) => {
  await page.route("**/api/admin/customers?*", (route) =>
    route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({ message: "Directory temporarily unavailable" }),
    }),
  );
  await page.goto("/admin#customers");
  await expect(page.locator("main").getByRole("alert")).toContainText(
    "Directory temporarily unavailable",
  );
  await page.unroute("**/api/admin/customers?*");
  await page.getByRole("button", { name: "Retry customer search" }).click();
  await search(page, fixture.customer.email);
  await page
    .getByRole("link", { name: fixture.customer.name, exact: true })
    .click();
  await expect(
    page.getByRole("article", { name: "Account details" }),
  ).toBeVisible();
  await page.route(
    "**/api/admin/customers/" + fixture.customer.id + "?*",
    (route) =>
      route.fulfill({
        status: 403,
        contentType: "application/json",
        body: JSON.stringify({ message: "Administrator access required." }),
      }),
  );
  await page
    .getByRole("button", { name: "Refresh dashboard", exact: true })
    .click();
  await expect(page.locator("main").getByRole("alert")).toContainText(
    "Administrator access required",
  );
  await expect(
    page.getByRole("article", { name: "Account details" }),
  ).toHaveCount(0);
  await page.unroute("**/api/admin/customers/" + fixture.customer.id + "?*");
  await page.getByRole("button", { name: "Retry customer profile" }).click();
  await expect(
    page.getByRole("article", { name: "Account details" }),
  ).toBeVisible();
  await page.goto("/admin#customers/00000000-0000-0000-0000-000000000000");
  await expect(page.locator("main").getByRole("alert")).toContainText(
    "Customer not found",
  );
  await page.getByRole("link", { name: "Back to customer directory" }).click();
  await expect(
    page.getByRole("heading", { name: "Customer directory", exact: true }),
  ).toBeVisible();
});
