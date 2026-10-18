import "server-only";
import { join } from "node:path";
import { mkdirSync, createWriteStream, createReadStream } from "node:fs";
import { unlink, readFile } from "node:fs/promises";
import { randomUUID, createHash } from "node:crypto";
import { Readable, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import { database, dataDirectory } from "./database";
import { HttpError } from "./security";
export function storagePath(section: string, name: string) {
  database();
  if (
    !/^[a-z]+$/.test(section) ||
    !/^[a-f0-9-]+\.(png|jpg|webp|exe|msi|apk|zip)$/.test(name)
  )
    throw new HttpError(400, "Invalid stored file.");
  const dir = join(dataDirectory(), section);
  mkdirSync(dir, { recursive: true, mode: 0o700 });
  return join(dir, name);
}
export async function hashFile(path: string) {
  const hash = createHash("sha256");
  for await (const chunk of createReadStream(path)) hash.update(chunk);
  return hash.digest("hex");
}
export async function storeUpload(
  request: Request,
  section: string,
  extension: string,
  limit: number,
) {
  if (!request.body) throw new HttpError(400, "File required.");
  const name = randomUUID() + "." + extension,
    path = storagePath(section, name);
  let bytes = 0;
  let head = Buffer.alloc(0);
  const hash = createHash("sha256");
  const transform = new Transform({
    transform(chunk: Buffer, _encoding, callback) {
      bytes += chunk.length;
      if (bytes > limit)
        return callback(new HttpError(413, "File exceeds the upload limit."));
      if (head.length < 32) head = Buffer.concat([head, chunk]).subarray(0, 32);
      hash.update(chunk);
      callback(null, chunk);
    },
  });
  try {
    await pipeline(
      Readable.fromWeb(
        request.body as import("node:stream/web").ReadableStream,
      ),
      transform,
      createWriteStream(path, { flags: "wx", mode: 0o600 }),
    );
    if (!bytes) throw new HttpError(400, "Empty file.");
    const checksum = hash.digest("hex");
    if (checksum !== (await hashFile(path)))
      throw new HttpError(400, "File checksum verification failed.");
    return { name, path, bytes, sha256: checksum, head };
  } catch (error) {
    await unlink(path).catch(() => {});
    throw error;
  }
}
export const readStoredFile = readFile;
