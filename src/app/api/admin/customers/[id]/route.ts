import { requireUser } from "@/lib/server/auth";
import { customerProfile } from "@/lib/server/customers";
import { apiError, apiResponse } from "@/lib/server/security";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireUser(true);
    const { id } = await context.params;
    return apiResponse(
      customerProfile(id, new URL(request.url).searchParams, session.user!.id),
    );
  } catch (error) {
    return apiError(error);
  }
}
