import { test, expect } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { resolve } from "node:path";

test.beforeEach(async ({ context }) => {
  // This fixture writes only the local browser-test database. Production has no HTTP role bootstrap.
  const { token } = JSON.parse(
    execFileSync(
      process.execPath,
      [resolve("tests/e2e/fixtures/seed-admin.mjs")],
      { encoding: "utf8", env: { ...process.env, NODE_OPTIONS: "" } },
    ),
  );
  await context.addCookies([
    {
      name: "__Host-docheng-session",
      value: token,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
    },
  ]);
});

test("guided editor saves, attaches media and releases, previews and explicitly publishes", async ({
  page,
  context,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/admin");
  await expect(
    page.getByRole("heading", { name: "Guided product editor" }),
  ).toBeVisible();
  const chooser = await page
    .getByRole("combobox", { name: "Choose a product", exact: true })
    .boundingBox();
  expect(chooser?.width).toBeGreaterThan(200);
  await page.getByRole("button", { name: "Add an application" }).click();
  const name = "QA editor " + randomUUID().slice(0, 8);
  await page.getByLabel("App name", { exact: true }).fill(name);
  const slug = await page
    .getByLabel("Page address", { exact: true })
    .inputValue();
  await page
    .getByLabel("Short description", { exact: true })
    .fill("A clearly marked application for local editor acceptance testing.");
  await page
    .getByLabel("Full description", { exact: true })
    .fill(
      "This local QA application exercises the guided product editor, draft saving and explicit publication with real server validation.",
    );
  await page
    .getByLabel("Who is it for?", { exact: true })
    .fill("Local QA reviewers");
  await page
    .getByLabel("Key features", { exact: true })
    .fill("Draft previews\nReviewed publication");
  await page
    .getByRole("combobox", { name: "Visibility", exact: true })
    .selectOption("public");
  const preview = page.getByRole("complementary", { name: "Product preview" });
  await expect(preview.getByRole("heading", { name })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Approve and publish" }),
  ).toBeDisabled();
  await page
    .getByLabel("Upload product logo", { exact: true })
    .setInputFiles(resolve("public/screenshots/desk.png"));
  await expect(
    page.getByLabel("Replace product logo", { exact: true }),
  ).toBeVisible();
  await page
    .getByLabel("Add a screenshot", { exact: true })
    .setInputFiles(resolve("public/screenshots/resume.png"));
  await page
    .getByLabel("Screenshot 1 caption", { exact: true })
    .fill("Screenshot attached through the guided editor");
  await expect(
    preview.getByRole("img", {
      name: "Screenshot attached through the guided editor",
    }),
  ).toBeVisible();
  const save = page.waitForResponse(
    (r) => r.url().endsWith("/api/admin") && r.request().method() === "POST",
  );
  await page.getByRole("button", { name: "Save draft", exact: true }).click();
  const saved = await save;
  expect(saved.status()).toBe(200);
  const savedProduct = (await saved.json()).product;
  expect(
    (await context.request.get(savedProduct.screenshots[0].url)).status(),
  ).toBe(200);
  expect(
    (await fetch("http://localhost:43187" + savedProduct.screenshots[0].url))
      .status,
  ).toBe(404);
  await expect(page.getByRole("status")).toContainText("Draft saved");
  expect((await context.request.get("/products/" + slug)).status()).toBe(404);
  await expect(
    page.getByLabel("Page address", { exact: true }),
  ).toHaveAttribute("readonly", "");
  await page.getByText("Upload a release file", { exact: true }).click();
  await page.getByLabel("Version", { exact: true }).fill("0.0.1-preview");
  await page
    .getByLabel("Installer (up to 100 MB)", { exact: true })
    .setInputFiles({
      name: "qa-preview.zip",
      mimeType: "application/zip",
      buffer: Buffer.from("UEsFBgAAAAAAAAAAAAAAAAAAAAAAAA==", "base64"),
    });
  await page
    .getByLabel("System requirements", { exact: true })
    .fill("Windows local QA fixture");
  await page
    .getByLabel("Release notes", { exact: true })
    .fill("Local QA fixture for the guided release upload workflow.");
  await page.getByRole("button", { name: "Upload release for review" }).click();
  await expect(page.getByRole("status").first()).toContainText(
    "Release attached",
  );
  await expect(preview).toContainText("1 verified release files attached");
  await page
    .getByRole("checkbox", {
      name: "I have reviewed this product and approve its public publication.",
    })
    .check();
  await page.getByRole("button", { name: "Approve and publish" }).click();
  await expect(page.getByRole("status").first()).toContainText(
    "Product publication approved",
  );
  const publicPage = await context.request.get("/products/" + slug);
  expect(publicPage.status()).toBe(200);
  expect(
    (await fetch("http://localhost:43187" + savedProduct.screenshots[0].url))
      .status,
  ).toBe(200);
  expect(await publicPage.text()).toContain(name);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page
    .getByRole("heading", { name: "Guided product editor" })
    .scrollIntoViewIfNeeded();
  await page.screenshot({
    path: test.info().outputPath("guided-editor.png"),
    fullPage: false,
  });
  await page.getByRole("button", { name: "Withdraw publication" }).click();
  await expect(page.getByRole("status").first()).toContainText(
    "publication withdrawn",
  );
  expect((await context.request.get("/products/" + slug)).status()).toBe(404);
  expect(errors).toEqual([]);
});

test("editor protects unsaved changes and rejects stale saves without discarding input", async ({
  page,
  context,
}) => {
  await page.goto("/admin");
  await page
    .getByRole("combobox", { name: "Choose a product", exact: true })
    .selectOption("desk");
  await page.getByLabel("App name", { exact: true }).fill("Unsaved Desk edit");
  await page
    .getByRole("combobox", { name: "Choose a product", exact: true })
    .selectOption("resume");
  await expect(page.locator("main").getByRole("alert")).toContainText(
    "unsaved changes",
  );
  await page.getByRole("button", { name: "Keep editing" }).click();
  await expect(page.getByLabel("App name", { exact: true })).toHaveValue(
    "Unsaved Desk edit",
  );
  await page.getByRole("button", { name: "Add an application" }).click();
  await page.getByRole("button", { name: "Discard changes" }).click();
  const name = "Concurrent QA " + randomUUID().slice(0, 8);
  await page.getByLabel("App name", { exact: true }).fill(name);
  await page
    .getByLabel("Short description", { exact: true })
    .fill("A separate local fixture for concurrent editor acceptance checks.");
  await page
    .getByLabel("Full description", { exact: true })
    .fill(
      "This local fixture verifies that saved revisions protect other administrators from losing work when two editors change the same product.",
    );
  await page
    .getByLabel("Who is it for?", { exact: true })
    .fill("Local QA reviewers");
  await page
    .getByLabel("Key features", { exact: true })
    .fill("Protect concurrent edits");
  await page.getByRole("button", { name: "Save draft", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Draft saved");
  const slug = await page
    .getByLabel("Page address", { exact: true })
    .inputValue();
  const data = await (await context.request.get("/api/admin")).json();
  const draft = data.drafts.find((d: { slug: string }) => d.slug === slug);
  expect(
    (
      await context.request.post("/api/admin", {
        headers: { Origin: "http://localhost:43187" },
        data: {
          action: "save-product",
          product: {
            ...JSON.parse(draft.document),
            name: "Another editor's saved version",
          },
          revision: draft.revision,
        },
      })
    ).status(),
  ).toBe(200);
  await page
    .getByLabel("App name", { exact: true })
    .fill("My unsaved conflicting version");
  await page.getByRole("button", { name: "Save draft", exact: true }).click();
  await expect(page.locator("main").getByRole("alert")).toContainText(
    "This draft changed",
  );
  await expect(page.getByLabel("App name", { exact: true })).toHaveValue(
    "My unsaved conflicting version",
  );
  await page.getByRole("button", { name: "Reload saved draft" }).click();
  await page.getByRole("button", { name: "Discard changes" }).click();
  await expect(page.getByLabel("App name", { exact: true })).toHaveValue(
    "Another editor's saved version",
  );
});
