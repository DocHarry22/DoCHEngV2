import { publishedCatalogue } from "@/lib/server/catalogue";
import { requireUser } from "@/lib/server/auth";
import { hashFile, storagePath } from "@/lib/server/files";
import { createReadStream } from "node:fs";
import { Readable } from "node:stream";
import { apiError, HttpError } from "@/lib/server/security";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const product = publishedCatalogue().find((p) =>
      p.releases.some((r) => r.id === id),
    );
    const release = product?.releases.find((r) => r.id === id);
    if (!release || !product)
      throw new HttpError(404, "Verified release not found.");
    if (release.externalUrl && release.access === "public")
      return Response.redirect(release.externalUrl, 302);
    if (release.access !== "public") {
      const session = await requireUser();
      if (!session.user!.emailVerified)
        throw new HttpError(
          403,
          "Verify your account email before accessing this release.",
        );
      if (
        release.access === "paid" &&
        (!session.user!.emailVerified ||
          !session.entitlements.some(
            (e) =>
              e.productSlug === product.slug &&
              (e.state === "active" || e.state === "trial"),
          ))
      )
        throw new HttpError(
          403,
          "This release requires an active entitlement.",
        );
    }
    const path = storagePath("releases", release.fileName);
    if ((await hashFile(path)) !== release.sha256)
      throw new HttpError(
        503,
        "The release file failed integrity verification.",
      );
    const stream = Readable.toWeb(
      createReadStream(path),
    ) as ReadableStream<Uint8Array>;
    return new Response(stream, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition":
          'attachment; filename="' +
          product.slug +
          "-" +
          release.version +
          "." +
          release.fileName.split(".").at(-1) +
          '"',
        "X-Content-Type-Options": "nosniff",
        "X-Checksum-SHA256": release.sha256,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    return apiError(error);
  }
}
