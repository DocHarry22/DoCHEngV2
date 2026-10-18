import { test, expect } from "@playwright/test";
import { randomUUID } from "node:crypto";
import { resolve } from "node:path";
test.beforeAll(async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBe(true);
  expect(await response.json()).toMatchObject({
    status: "ready",
    storage: "ready",
    billing: "inactive",
  });
});
test("public routes, catalogue filters and responsive layout", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (e) => { if (e.type() === "error") errors.push(e.text()); });
  for (const path of [
    "/",
    "/apps",
    "/products/desk",
    "/downloads",
    "/pricing",
    "/support",
    "/docs",
    "/tools",
    "/tools/pump-power",
    "/privacy",
    "/compare",
    "/checkout",
  ]) {
    await page.goto(path);
    await expect(page.locator("h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    if (["/", "/apps", "/products/desk"].includes(path)) {
      await page.screenshot({path: test.info().outputPath((path === "/" ? "home" : path.slice(1).replaceAll("/", "-")) + ".png")});
    }
  }
  await page.goto("/apps");
  await page.getByRole("searchbox", { name: "Search apps" }).fill("resume");
  await expect(page.getByRole("status")).toContainText("1 applications");
  await expect(
    page.getByRole("link", { name: "DoCHEng Desk", exact: true }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Reset filters" }).click();
  await page
    .getByLabel("Release status", { exact: true })
    .selectOption("coming-soon");
  await expect(
    page.getByRole("link", { name: "DoCHEng Compass", exact: true }),
  ).toBeVisible();
  const mobileToggle = page.getByRole("button", {name: "Toggle navigation menu"});
  if (await mobileToggle.isVisible()) {
    await mobileToggle.click();
    const navigation = page.getByRole("navigation", {name: "Mobile primary"});
    await expect(navigation).toBeVisible();
    await navigation.getByRole("link", {name: "Home", exact: true}).click();
    await expect(mobileToggle).toHaveAttribute("aria-expanded", "false");
  }
  expect(errors).toEqual([]);
});
test("calculator validates and produces an independent reference result", async ({
  page,
}) => {
  await page.goto("/tools/pump-power");
  await page.getByLabel("Flow rate (m³/h)", { exact: true }).fill("3.6");
  await page.getByLabel("Total pump head (m)", { exact: true }).fill("10");
  await page.getByLabel("Pump efficiency (%)", { exact: true }).fill("50");
  await page.getByRole("button", { name: "Calculate", exact: true }).click();
  await expect(page.locator(".result-panel")).toContainText(/0[,.]196133/);
  await page.getByLabel("Pump efficiency (%)", { exact: true }).fill("0");
  await page.getByRole("button", { name: "Calculate", exact: true }).click();
  await expect(page.locator("main").getByRole("alert")).toContainText("efficiency");
});
test("forged browser sessions cannot unlock account or administrator routes", async ({
  page,
  context,
}) => {
  await context.addCookies([
    { name: "dochengv2-auth", value: "1", domain: "localhost", path: "/" },
  ]);
  await page.goto("/signin");
  await page.evaluate(() =>
    localStorage.setItem(
      "dochengv2.session.v1",
      JSON.stringify({ state: "authenticated", user: { role: "admin" } }),
    ),
  );
  await page.goto("/account");
  await expect(page).toHaveURL(/\/signin/);
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/signin/);
});
test("registration, real session, support persistence and logout", async ({
  page,
  context,
}) => {
  const email = "qa-" + randomUUID() + "@example.test";
  await page.goto("/signup");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Full Name", { exact: true }).fill("QA Member");
  await page
    .getByLabel("Password", { exact: true })
    .fill("QA long and unique password 731!");
  await page
    .getByRole("button", { name: "Create Account", exact: true })
    .click();
  await expect(page).toHaveURL(/\/account/);
  await expect(page.getByText(email, { exact: true })).toBeVisible();
  const cookie = (await context.cookies()).find(
    (c) => c.name === "__Host-docheng-session",
  );
  expect(cookie?.httpOnly).toBe(true);
  expect(cookie?.sameSite).toBe("Lax");
  await page.goto("/support");
  await page.getByLabel("Name", { exact: true }).fill("QA Member");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page
    .getByLabel("Enquiry type", { exact: true })
    .selectOption("technical");
  await page.getByLabel("Product", { exact: true }).selectOption("desk");
  await page
    .getByLabel("Message", { exact: true })
    .fill(
      "QA automated support test: verifying persistence without sending external email.",
    );
  await page.getByRole("checkbox").check();
  await page
    .getByRole("button", { name: "Submit Request", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText(
    /DCH-\d{4}-[A-F0-9]{12}/,
  );
  const ticket = (await page.getByRole("status").textContent())?.match(
    /DCH-\d{4}-[A-F0-9]{12}/,
  )?.[0];
  await page.goto("/account");
  await expect(page.getByText(new RegExp(ticket!))).toBeVisible();
  await page.getByRole("button", { name: "Sign Out", exact: true }).click();
  await expect(page).toHaveURL(/\/signin/);
  await page.goto("/account");
  await expect(page).toHaveURL(/\/signin/);
});
test("keyboard navigation has a visible skip target and labelled marketplace controls", async ({
  page,
}) => {
  await page.goto("/apps");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  for (const label of ["Category", "Platform", "Release status", "Pricing"])
    await expect(page.getByLabel(label, { exact: true })).toBeVisible();
  await expect(
    page.locator('a[href*="future-product.docheng.co.za"]'),
  ).toHaveCount(0);
});

test("public pages have no critical or serious automated accessibility violations", async ({
  page,
}) => {
  test.setTimeout(120_000);
  for (const theme of ["dark", "light"]) {
  await page.goto("/");
  const isDark = await page.locator("html").evaluate((element) => element.classList.contains("dark"));
  if (isDark !== (theme === "dark")) {
    const toggle = page.getByRole("button", {name: "Toggle color mode"});
    const mobileMenu = page.getByRole("button", {name: "Toggle navigation menu"});
    const openMenu = !(await toggle.isVisible());
    if (openMenu) await mobileMenu.click();
    await toggle.click();
    if (openMenu) await mobileMenu.click();
  }
  for (const path of [
    "/",
    "/apps",
    "/products/desk",
    "/support",
    "/tools/pump-power",
    "/signup",
  ]) {
    await page.goto(path);
    await expect(page.locator("html")).toHaveClass(theme === "dark" ? /dark/ : /light/);
    await page.addScriptTag({
      path: resolve("node_modules/axe-core/axe.min.js"),
    });
    const violations = await page.evaluate(async () => {
      const engine = (
        window as unknown as Window & {
          axe: {
            run: (
              context: Document,
              options: object,
            ) => Promise<{
              violations: {
                id: string;
                impact: string;
                nodes: { target: string[] }[];
              }[];
            }>;
          };
        }
      ).axe;
      const results = await engine.run(document, {
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
      });
      return results.violations
        .filter((v) => ["critical", "serious"].includes(v.impact))
        .map((v) => ({
          id: v.id,
          impact: v.impact,
          targets: v.nodes.map((n) => n.target),
        }));
    });
    expect(violations, `${theme} ${path}`).toEqual([]);
  }
  }
});
