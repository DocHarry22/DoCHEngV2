import { mkdirSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
const urls = [
  "https://coursecampass.vercel.app",
  "https://waternest.co.za",
  "https://lightsalmon-kingfisher-947477.hostingersite.com",
  "https://sandybrown-bear-488955.hostingersite.com",
  "https://papayawhip-dove-487276.hostingersite.com",
];
for (const url of urls) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
    const body = await response.text();
    console.log(
      JSON.stringify({
        url,
        status: response.status,
        finalUrl: response.url,
        title: body.match(/<title[^>]*>(.*?)<\/title>/is)?.[1],
        bytes: body.length,
      }),
    );
  } catch (error) {
    console.log(JSON.stringify({ url, error: error.message }));
  }
}
const url =
  "https://github.com/DocHarry22/apologiasancta-ui/releases/download/android-v1.0.3/apologia-sancta.apk";
const response = await fetch(url, { signal: AbortSignal.timeout(60000) });
if (!response.ok) throw new Error("APK download " + response.status);
const bytes = Buffer.from(await response.arrayBuffer());
const checksum = createHash("sha256").update(bytes).digest("hex");
if (
  checksum !==
  "e170aec135e1e4dcdfe38e91ac54b357a5f9a75e0a5de2099ec8ed5366925cd1"
)
  throw new Error("Release integrity mismatch");
mkdirSync("../verified-artifacts", { recursive: true });
writeFileSync("../verified-artifacts/apologia-sancta-1.0.3.apk", bytes);
writeFileSync(
  "docs/ARTIFACT-AUDIT.json",
  JSON.stringify(
    {
      product: "Apologia Sancta",
      tag: "android-v1.0.3",
      publishedAt: "2026-08-24T21:16:59Z",
      url,
      bytes: bytes.length,
      sha256: checksum,
      hashMatchesGitHubDigest: true,
      verificationDate: new Date().toISOString(),
      installationTested: false,
      note: "Android 6.0/API 23 minimum is declared in current source variables.gradle; this does not independently establish binary compatibility or runtime operation.",
    },
    null,
    2,
  ) + "\n",
);
console.log("APK bytes independently verified", bytes.length, checksum);
