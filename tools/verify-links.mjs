import { writeFileSync } from "node:fs";
const urls = [
  "https://www.docheng.co.za/",
  "https://docheng.co.za/",
  "http://docheng.co.za/",
  ...[
    "apps",
    "products",
    "products/desk",
    "products/resume",
    "products/compass",
    "pricing",
    "downloads",
    "signin",
    "signup",
    "account",
    "dashboard",
    "support",
    "docs",
    "roadmap",
    "changelog",
    "ecosystem",
    "about",
    "sitemap.xml",
    "robots.txt",
  ].map((path) => "https://www.docheng.co.za/" + path),
  "https://desk.docheng.co.za",
  "https://resume.docheng.co.za",
  "https://coursecampass.docheng.co.za",
  "https://compass.docheng.co.za",
  "https://docheng-desk2.vercel.app",
  "https://waternest.netlify.app",
];
const results = [];
for (let offset = 0; offset < urls.length; offset += 5)
  await Promise.all(
    urls.slice(offset, offset + 5).map(async (url) => {
      try {
        const response = await fetch(url, {
          signal: AbortSignal.timeout(15000),
        });
        const body = await response.text();
        const title = body.match(/<title[^>]*>(.*?)<\/title>/is)?.[1];
        const h1 = body
          .match(/<h1[^>]*>(.*?)<\/h1>/is)?.[1]
          ?.replace(/<[^>]+>/g, "");
        const result = {
          url,
          status: response.status,
          finalUrl: response.url,
          title,
          h1,
          bytes: body.length,
          checkedAt: new Date().toISOString(),
        };
        results.push(result);
        console.log(JSON.stringify(result));
      } catch (error) {
        const result = {
          url,
          error: error.message,
          checkedAt: new Date().toISOString(),
        };
        results.push(result);
        console.log(JSON.stringify(result));
      }
    }),
  );
writeFileSync("docs/LINK-AUDIT.json", JSON.stringify(results, null, 2) + "\n");
