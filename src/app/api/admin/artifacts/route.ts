import { unlink } from "node:fs/promises";
import { requireUser } from "@/lib/server/auth";
import { rows, run, transaction } from "@/lib/server/database";
import { storeUpload } from "@/lib/server/files";
import { validateProduct } from "@/lib/server/catalogue";
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
    const user = session.user!;
    if (!user.emailVerified)
      throw new HttpError(403, "Verify your administrator email first.");
    rateLimit("artifact-upload", user.id, 10, 60 * 60_000);
    const q = new URL(request.url).searchParams;
    const slug = q.get("slug") ?? "",
      version = q.get("version") ?? "",
      platform = q.get("platform") ?? "",
      channel = q.get("channel") ?? "",
      extension = q.get("extension") ?? "",
      notes = q.get("notes") ?? "",
      requirements = q.get("requirements") ?? "";
    if (
      !/^[a-z0-9-]{2,80}$/.test(slug) ||
      !/^v?\d+\.\d+\.\d+(?:-[a-z0-9.-]+)?$/.test(version) ||
      !["Windows", "Android"].includes(platform) ||
      !["stable", "beta", "preview"].includes(channel) ||
      !["exe", "msi", "apk", "zip"].includes(extension) ||
      notes.length < 20 ||
      notes.length > 3000 ||
      requirements.length < 10 ||
      requirements.length > 1000
    )
      throw new HttpError(
        400,
        "Provide release version, channel, platform, notes and system requirements.",
      );
    if ((platform === "Android") !== (extension === "apk"))
      throw new HttpError(
        400,
        "Android releases must be APK files; Windows releases must use a Windows format.",
      );
    if (
      channel === "stable" &&
      (q.get("installationTested") !== "true" ||
        q.get("publisherReviewed") !== "true")
    )
      throw new HttpError(
        400,
        "Stable releases require installation-test and publisher-review attestations.",
      );
    const draft = rows<{ document: string }>(
      "SELECT document FROM product_drafts WHERE slug=?",
      slug,
    )[0];
    if (!draft)
      throw new HttpError(
        400,
        "Save a product draft before uploading a release.",
      );
    const file = await storeUpload(
      request,
      "releases",
      extension,
      100 * 1024 * 1024,
    );
    const valid =
      extension === "exe"
        ? file.head.toString("ascii", 0, 2) === "MZ"
        : extension === "msi"
          ? file.head
              .subarray(0, 8)
              .equals(Buffer.from([208, 207, 17, 224, 161, 177, 26, 225]))
          : file.head.toString("ascii", 0, 2) === "PK";
    if (!valid) {
      await unlink(file.path);
      throw new HttpError(
        415,
        "The uploaded bytes do not match the installer format.",
      );
    }
    const release = {
      id: file.name.split(".")[0],
      fileName: file.name,
      version,
      platform: platform as "Windows" | "Android",
      channel: channel as "stable" | "beta" | "preview",
      sha256: file.sha256,
      bytes: file.bytes,
      releasedAt: new Date().toISOString().slice(0, 10),
      requirements,
      notes,
      access: (["public", "account", "paid"].includes(q.get("access") ?? "")
        ? q.get("access")
        : "public") as "public" | "account" | "paid",
    };
    transaction(() => {
      const current = rows<{ document: string }>(
        "SELECT document FROM product_drafts WHERE slug=?",
        slug,
      )[0];
      if (!current)
        throw new HttpError(409, "Product draft was removed during upload.");
      const product = validateProduct(JSON.parse(current.document));
      product.releases = [...product.releases, release];
      run(
        "UPDATE product_drafts SET document=?,revision=revision+1,approved_at=NULL,approved_by=NULL,updated_at=? WHERE slug=?",
        JSON.stringify(product),
        Date.now(),
        slug,
      );
      audit(user.id, "release.uploaded", release.id, file.sha256);
    });
    return apiResponse(
      {
        ok: true,
        message:
          "File checksum verified. Review and explicitly publish the updated product draft before download availability.",
        release,
      },
      201,
    );
  } catch (error) {
    return apiError(error);
  }
}
