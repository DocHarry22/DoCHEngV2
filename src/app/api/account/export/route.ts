import { requireUser } from "@/lib/server/auth";
import { rows } from "@/lib/server/database";
import { apiError, apiResponse, audit } from "@/lib/server/security";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const session = await requireUser();
    const id = session.user!.id;
    audit(id, "privacy.export", id);
    const response = apiResponse({
      account: session.user,
      entitlements: session.entitlements,
      tickets: rows(
        "SELECT id,email,name,enquiry_type,product,message,status,created_at FROM tickets WHERE user_id=?",
        id,
      ),
      orders: rows(
        "SELECT id,reference,product_slug,amount,currency,status,created_at FROM orders WHERE user_id=?",
        id,
      ),
    });
    response.headers.set(
      "Content-Disposition",
      'attachment; filename="docheng-account.json"',
    );
    return response;
  } catch (error) {
    return apiError(error);
  }
}
