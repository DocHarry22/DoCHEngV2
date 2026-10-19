import { test, expect, type Page } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
let ticket: string;
test.beforeEach(async ({ context }) => {
  const fixture = JSON.parse(
    execFileSync(
      process.execPath,
      [resolve("tests/e2e/fixtures/seed-admin.mjs"), "--overview"],
      { encoding: "utf8", env: { ...process.env, NODE_OPTIONS: "" } },
    ),
  );
  ticket = fixture.ticket;
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
async function navigate(page: Page, label: string) {
  const nav = page.getByRole("navigation", {
    name: "Administrator navigation",
  });
  const toggle = nav.getByRole("button", { name: /Admin menu/ });
  if (
    (await toggle.isVisible()) &&
    (await toggle.getAttribute("aria-expanded")) === "false"
  )
    await toggle.click();
  await nav.getByRole("link", { name: label, exact: true }).click();
  await expect(nav.locator('a[aria-current="page"]')).toHaveAttribute(
    "href",
    "#" + label.toLowerCase(),
  );
}
test("overview shows real totals, activity and actionable alerts with responsive navigation", async ({
  page,
  context,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/admin");
  await expect(
    page.getByRole("heading", { name: "Admin overview", exact: true }),
  ).toBeVisible();
  const data = await (await context.request.get("/api/admin")).json();
  for (const key of [
    "publishedProducts",
    "accounts",
    "openTickets",
    "queuedMail",
    "draftChanges",
    "publishedReleases",
  ])
    await expect(page.getByTestId("count-" + key)).toHaveText(
      data.summary[key].toLocaleString(),
    );
  await expect(
    page.getByRole("article", { name: "Recent activity" }),
  ).toContainText("Account created");
  const attention = page.getByRole("article", { name: "Needs attention" });
  await attention.getByRole("link", { name: /support ticket/ }).click();
  await expect(
    page.getByRole("heading", { name: "Support enquiries" }),
  ).toBeVisible();
  await expect(page.locator("#support")).toContainText(ticket);
  await navigate(page, "Email");
  await expect(
    page.getByRole("heading", { name: "Email delivery" }),
  ).toBeVisible();
  await navigate(page, "Releases");
  await expect(
    page.getByRole("heading", { name: "Release files", exact: true }),
  ).toBeVisible();
  await navigate(page, "Reports");
  await expect(
    page.getByRole("heading", { name: "Marketplace activity" }),
  ).toBeVisible();
  await navigate(page, "Repositories");
  await expect(page.locator("#repositories")).toBeVisible();
  await navigate(page, "Overview");
  await page
    .getByRole("button", { name: "Refresh dashboard", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Refresh dashboard", exact: true }),
  ).toBeEnabled();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({
    path: test.info().outputPath("admin-overview.png"),
    fullPage: true,
  });
  await page.screenshot({
    path: test.info().outputPath("admin-overview-viewport.png"),
    fullPage: false,
  });
  await page.addScriptTag({
    path: resolve("node_modules/axe-core/axe.min.js"),
  });
  const violations = await page.evaluate(async () => {
    const engine = (
      window as unknown as {
        axe: {
          run: (
            document: Document,
            options: object,
          ) => Promise<{ violations: { id: string; impact: string }[] }>;
        };
      }
    ).axe;
    const result = await engine.run(document, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
    });
    return result.violations
      .filter((v) => ["serious", "critical"].includes(v.impact))
      .map((v) => v.id);
  });
  expect(violations).toEqual([]);
  expect(errors).toEqual([]);
});
test("failed loads show a recoverable error and failed refreshes preserve the last data", async ({
  page,
}) => {
  await page.route("**/api/admin", (route) =>
    route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({ message: "Temporary test outage" }),
    }),
  );
  await page.goto("/admin");
  await expect(page.locator("main").getByRole("alert")).toContainText(
    "Unable to load",
  );
  await expect(page.getByTestId("count-accounts")).toHaveCount(0);
  await page.unroute("**/api/admin");
  await page.getByRole("button", { name: "Retry loading dashboard" }).click();
  await expect(page.getByTestId("count-accounts")).toBeVisible();
  const count = await page.getByTestId("count-accounts").textContent();
  await page.route("**/api/admin", (route) =>
    route.fulfill({ status: 503, contentType: "application/json", body: "{}" }),
  );
  await page
    .getByRole("button", { name: "Refresh dashboard", exact: true })
    .click();
  await expect(page.locator("main").getByRole("alert")).toContainText(
    "last successfully loaded",
  );
  await expect(page.getByTestId("count-accounts")).toHaveText(count!);
  await page.unroute("**/api/admin");
  await page.getByRole("button", { name: "Retry loading dashboard" }).click();
  await expect(page.locator("main").getByRole("alert")).toHaveCount(0);
});
test("section links support history and preserve product edits across navigation and refresh", async ({
  page,
}) => {
  await page.goto("/admin#activity");
  await expect(
    page.getByRole("heading", { name: "Audit trail" }),
  ).toBeVisible();
  await navigate(page, "Products");
  await page
    .getByRole("combobox", { name: "Choose a product", exact: true })
    .selectOption("desk");
  await page
    .getByLabel("App name", { exact: true })
    .fill("Unsaved navigation QA");
  await navigate(page, "Customers");
  await expect(
    page.getByRole("heading", { name: "Customer access" }),
  ).toBeVisible();
  await page.goBack();
  await expect(page.getByLabel("App name", { exact: true })).toHaveValue(
    "Unsaved navigation QA",
  );
  await navigate(page, "Overview");
  await page
    .getByRole("button", { name: "Refresh dashboard", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Refresh dashboard", exact: true }),
  ).toBeEnabled();
  await navigate(page, "Products");
  await expect(page.getByLabel("App name", { exact: true })).toHaveValue(
    "Unsaved navigation QA",
  );
});
