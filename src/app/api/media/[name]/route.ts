import { publishedCatalogue } from "@/lib/server/catalogue";
import { serverSession } from "@/lib/server/auth";
import { storagePath, readStoredFile } from "@/lib/server/files";
import { apiError, HttpError } from "@/lib/server/security";
export const runtime = "nodejs";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  try {
    const { name } = await params;
    const visible = publishedCatalogue().some(
      (p) =>
        p.logoUrl === "/api/media/" + name ||
        p.screenshots.some((s) => s.url === "/api/media/" + name),
    );
    if (!visible && (await serverSession()).user?.role !== "admin")
      throw new HttpError(404, "Image not found.");
    const data = await readStoredFile(storagePath("media", name));
    const type = name.endsWith(".png")
      ? "image/png"
      : name.endsWith(".jpg")
        ? "image/jpeg"
        : "image/webp";
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": type,
        "Content-Security-Policy": "default-src 'none'",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": visible
          ? "public, max-age=86400"
          : "private, no-store",
      },
    });
  } catch (error) {
    return apiError(error);
  }
}
