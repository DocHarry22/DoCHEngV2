import { unlink } from "node:fs/promises";
import { requireUser } from "@/lib/server/auth";
import { storeUpload } from "@/lib/server/files";
import {
  assertSameOrigin,
  apiResponse,
  apiError,
  HttpError,
  audit,
  rateLimit,
} from "@/lib/server/security";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const session = await requireUser(true);
    if (!session.user!.emailVerified)
      throw new HttpError(403, "Verify your email first.");
    rateLimit("media-upload", session.user!.id, 30);
    const mime = request.headers.get("content-type") ?? "";
    const ext = (
      {
        "image/png": "png",
        "image/jpeg": "jpg",
        "image/webp": "webp",
      } as Record<string, string>
    )[mime];
    if (!ext) throw new HttpError(415, "Use PNG, JPEG or WebP.");
    const file = await storeUpload(request, "media", ext, 5 * 1024 * 1024);
    const valid =
      ext === "png"
        ? file.head
            .subarray(0, 8)
            .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
        : ext === "jpg"
          ? file.head[0] === 255 && file.head[1] === 216 && file.head[2] === 255
          : file.head.toString("ascii", 0, 4) === "RIFF" &&
            file.head.toString("ascii", 8, 12) === "WEBP";
    if (!valid) {
      await unlink(file.path);
      throw new HttpError(415, "File bytes do not match the image format.");
    }
    audit(session.user!.id, "media.uploaded", file.name, file.sha256);
    return apiResponse({ ok: true, url: "/api/media/" + file.name }, 201);
  } catch (error) {
    return apiError(error);
  }
}
