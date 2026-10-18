import { baseCatalogue } from "@/lib/catalogue";
import { engineeringTools } from "@/lib/engineering-tools";
import { run } from "@/lib/server/database";
import {
  assertSameOrigin,
  jsonBody,
  apiResponse,
  apiError,
  rateLimit,
} from "@/lib/server/security";
export const runtime = "nodejs";
const routes = new Set([
  "/",
  "/apps",
  "/products",
  "/downloads",
  "/pricing",
  "/support",
  "/docs",
  "/tools",
  ...baseCatalogue.map((p) => "/products/" + p.slug),
  ...engineeringTools.map((t) => "/tools/" + t.slug),
  "/tools/unit-converter",
]);
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const body = await jsonBody(request);
    if (typeof body.path !== "string" || !routes.has(body.path))
      return apiResponse({ ok: true });
    if (
      request.headers.get("dnt") === "1" ||
      request.headers.get("sec-gpc") === "1"
    )
      return apiResponse({ ok: true });
    rateLimit("aggregate-metrics", "global", 2000, 60_000);
    const campaign =
      typeof body.campaign === "string" &&
      ["newsletter", "github", "partner"].includes(body.campaign)
        ? body.campaign
        : "direct";
    run(
      "INSERT INTO metrics_daily VALUES (?,?,?,1) ON CONFLICT(day,path,campaign) DO UPDATE SET views=views+1",
      new Date().toISOString().slice(0, 10),
      body.path,
      campaign,
    );
    return apiResponse({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
