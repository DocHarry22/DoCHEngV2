import { requireUser } from "@/lib/server/auth";
import { customerDirectory } from "@/lib/server/customers";
import { apiError, apiResponse } from "@/lib/server/security";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  try {
    await requireUser(true);
    return apiResponse(customerDirectory(new URL(request.url).searchParams));
  } catch (error) {
    return apiError(error);
  }
}
