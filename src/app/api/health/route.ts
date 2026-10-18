import { rows } from "@/lib/server/database";
import { mailConfigured } from "@/lib/server/mail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  try {
    rows("SELECT 1");
    return Response.json(
      {
        status: "ready",
        storage: "ready",
        email: mailConfigured() ? "configured" : "queued-only",
        billing: "inactive",
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { status: "unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
