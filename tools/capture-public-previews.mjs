import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

const targets = [
  [
    "desk",
    "https://docheng-desk2.vercel.app/login",
    "Public Desk v2 sign-in entry; no customer data or authenticated workspace is shown.",
  ],
  [
    "resume",
    "https://resume.docheng.co.za/resume-scanner/",
    "Public resume-scanning interface; uploaded-document analysis was not performed.",
  ],
  [
    "apologia-sancta",
    "https://sandybrown-bear-488955.hostingersite.com/",
    "Public Apologia Sancta landing page; an accessible previous deployment, separate from the latest failed build.",
  ],
  [
    "thasi-etoile",
    "https://lightsalmon-kingfisher-947477.hostingersite.com/",
    "Public Thasi Étoile storefront; no purchase or customer account was created.",
  ],
  [
    "water-nest",
    "https://waternest.co.za/",
    "Public Water Nest storefront; no transaction or customer data is shown.",
  ],
];
await mkdir("public/screenshots", { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
});
const evidence = [];
try {
  for (const [slug, url, caption] of targets) {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 960 },
      deviceScaleFactor: 1,
    });
    try {
      const response = await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 45000,
      });
      if (response?.status() !== 200)
        throw new Error("Public entry did not return 200");
      await page
        .locator(slug === "desk" ? 'text="Welcome back"' : "h1")
        .first()
        .waitFor({ state: "visible", timeout: 15000 });
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({
        path: `public/screenshots/${slug}.png`,
        fullPage: false,
      });
      evidence.push({
        slug,
        url: page.url(),
        title: await page.title(),
        caption,
        checkedAt: new Date().toISOString(),
      });
      console.log(slug + ": captured public entry");
    } catch (error) {
      evidence.push({ slug, url, error: String(error) });
      console.log(slug + ": capture failed");
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
}
await writeFile(
  "docs/SCREENSHOT-AUDIT.json",
  JSON.stringify(evidence, null, 2) + "\n",
);
