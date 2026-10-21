import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "@playwright/test");
const origin = "https://resume.docheng.co.za";
const output = resolve("public/screenshots");
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  channel: process.env.PLAYWRIGHT_BROWSER_CHANNEL || undefined,
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined,
  args: ["--no-proxy-server"],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  locale: "en-ZA",
  timezoneId: "Africa/Johannesburg",
  reducedMotion: "reduce",
  serviceWorkers: "block",
});
const page = await context.newPage();
page.setDefaultTimeout(45000);
const evidence = { origin, checkedAt: new Date().toISOString(), fictionalExamples: true, pages: [] };
async function visit(route) {
  console.log("Opening " + route);
  const response = await page.goto(origin + route, { waitUntil: "domcontentloaded", timeout: 90000 });
  if (response.status() !== 200) throw new Error(route + " returned " + response.status());
  await page.locator("main").first().waitFor();
  await Promise.race([page.evaluate(() => document.fonts.ready), new Promise((done) => setTimeout(done, 5000))]);
}
async function capture(name, scope) {
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: resolve(output, "resume-" + name + ".png"), fullPage: false });
  const item = { screenshot: "resume-" + name + ".png", url: page.url(), scope, title: await page.title() };
  evidence.pages.push(item);
  console.log(JSON.stringify(item));
}
try {
  await visit("/builder/?new=1");
  const sample = {
    title: "Project coordinator — fictional example",
    contact: { full_name: "Alex Morgan", email: "alex.morgan@example.com", location: "Cape Town, South Africa" },
    summary: { summary: "Project coordinator bringing people, plans and priorities together. Experienced in scheduling, budget tracking and clear stakeholder communication." },
    experience: [{ position: "Project Coordinator", company: "Example Studio", start_date: "2022-03", current: true, description: ["Coordinate schedules and budgets across a multidisciplinary team.", "Turn project goals into practical plans and clear stakeholder updates.", "Improve handovers with thoughtful documentation."] }],
    education: [{ institution: "Example University", degree: "Bachelor of Commerce", start_date: "2015", end_date: "2018" }],
    skills: [{ category: "Core skills", skills: ["Project planning", "Communication", "Budget tracking", "Microsoft Office"] }],
    languages: [{ language: "English", proficiency: "Fluent" }],
  };
  await page.getByLabel("Import resume", { exact: true }).setInputFiles({ name: "fictional-example.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(sample)) });
  await page.waitForFunction(() => [...document.querySelectorAll("input")].some((input) => input.value === "Alex Morgan"));
  if (await page.getByLabel(/^Full Name/).inputValue() !== "Alex Morgan") throw new Error("Fictional JSON sample did not import");
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await capture("builder", "Live editor with fictional sample entered through its browser form; no server document was created.");

  await visit("/templates/");
  await page.locator("[data-gallery-ready=true]").waitFor();
  if (await page.locator(".template-card").count() !== 8) throw new Error("Expected eight live résumé layouts");
  await capture("templates", "Live eight-layout gallery; its sample documents are fictional.");

  await visit("/cover-letter/");
  await page.locator("main[data-letter-ready=true]").waitFor();
  await page.getByRole("button", { name: "Create cover letter", exact: true }).click();
  await page.getByLabel("Cover letter title").fill("Project coordinator — fictional letter");
  await page.getByRole("button", { name: "Your Information", exact: true }).click();
  await page.getByLabel("full name", { exact: true }).fill("Alex Morgan");
  await page.getByLabel("email", { exact: true }).fill("alex.morgan@example.com");
  await page.getByRole("button", { name: "Write Content", exact: true }).click();
  await page.getByLabel("Opening paragraph").fill("I am writing to apply for the Project Coordinator role. I enjoy bringing people, schedules and priorities together, and would welcome the opportunity to contribute to your team.");
  await page.getByRole("button", { name: "Save in browser", exact: true }).click();
  await capture("cover-letter", "Live cover-letter editor with a fictional local example.");

  for (const [name, route, scope] of [
    ["workspace", "/dashboard/", "Live browser workspace in the isolated screenshot profile."],
    ["checker", "/resume-scanner/", "Live upload interface with Basic, ATS and Expert modes; no document was submitted."],
    ["career-plan", "/career-plan/", "Live 90-day plan starting screen in the isolated browser profile."],
  ]) {
    await visit(route);
    await page.getByRole("heading").first().waitFor();
    await capture(name, scope);
  }
  for (const route of ["/jobs/", "/job-tracker/", "/salary-analyzer/", "/tailor/", "/history/", "/interview-prep/", "/auto-apply/"]) {
    await visit(route);
    const text = await page.locator("main").first().innerText();
    evidence.pages.push({ url: page.url(), status: 200, text: text.slice(0, 7000) });
    console.log(route + " verified");
  }
} catch (error) {
  console.log(await page.locator("body").innerText().catch(() => "Unable to read page"));
  console.log(await page.locator("select").evaluateAll((items) => items.map((item) => item.outerHTML)).catch(() => []));
  await page.screenshot({ path: resolve(process.env.TEMP || ".", "resume-capture-failure.png") }).catch(() => {});
  throw error;
} finally {
  await writeFile("docs/RESUME-SCREENSHOT-AUDIT.json", JSON.stringify(evidence, null, 2) + "\n");
  await browser.close();
}
