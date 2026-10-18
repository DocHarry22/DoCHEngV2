import "server-only";
import { lookup } from "node:dns/promises";
import { request as httpsRequest } from "node:https";
import { isIP } from "node:net";
import { HttpError } from "./security";
function publicAddress(address: string) {
  if (isIP(address) !== 4) return false; // IPv4 only; blocks IPv6 mapped/ULA/link-local ambiguity.
  const [a, b] = address.split(".").map(Number);
  return !(
    a === 0 ||
    a === 10 ||
    a === 127 ||
    a >= 224 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && (b === 168 || b === 0)) ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 198 && (b === 18 || b === 19))
  );
}
export async function probeUrl(
  value: string,
  redirects = 0,
): Promise<{ url: string; checkedAt: string; scope: string }> {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new HttpError(400, "Enter a valid HTTPS address.");
  }
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    (url.port && url.port !== "443") ||
    isIP(url.hostname) ||
    url.hostname.endsWith(".local") ||
    !url.hostname.includes(".") ||
    [...url.searchParams.keys()].some((key) =>
      /token|secret|password|session|credential|authorization|^code$/i.test(
        key,
      ),
    )
  )
    throw new HttpError(
      400,
      "Use a public HTTPS hostname without credentials.",
    );
  const addresses = (await lookup(url.hostname, { all: true })).filter(
    (address) => address.family === 4,
  );
  if (!addresses.length || addresses.some((a) => !publicAddress(a.address)))
    throw new HttpError(400, "This destination is not a public IPv4 web host.");
  const address = addresses[0];
  const result = await new Promise<{
    status: number;
    location?: string;
    body: string;
  }>((resolve, reject) => {
    const req = httpsRequest(
      url,
      {
        method: "GET",
        timeout: 8000,
        headers: {
          "User-Agent": "DoCHEng-Link-Verifier/1.0",
          Accept: "text/html",
        },
        lookup: (_host, _options, callback) =>
          callback(null, address.address, 4),
      },
      (res) => {
        const parts: Buffer[] = [];
        let length = 0;
        res.on("data", (chunk) => {
          length += chunk.length;
          if (length > 512_000) {
            req.destroy();
            reject(new HttpError(400, "Page exceeds verification size limit."));
          } else parts.push(chunk);
        });
        res.on("end", () =>
          resolve({
            status: res.statusCode ?? 0,
            location: res.headers.location,
            body: Buffer.concat(parts).toString("utf8"),
          }),
        );
      },
    );
    req.on("timeout", () => req.destroy(new Error("Timeout")));
    req.on("error", reject);
    req.end();
  });
  if (result.status >= 300 && result.status < 400 && result.location) {
    if (redirects >= 3) throw new HttpError(400, "Too many redirects.");
    return probeUrl(new URL(result.location, url).href, redirects + 1);
  }
  if (
    result.status !== 200 ||
    !/<(?:html|main|body)/i.test(result.body) ||
    /You Are All Set to Go!|<title>Default page<\/title>|DEPLOYMENT_NOT_FOUND/i.test(
      result.body,
    )
  )
    throw new HttpError(400, "A working application entry page was not found.");
  return {
    url: url.href,
    checkedAt: new Date().toISOString().slice(0, 10),
    scope:
      "Public entry page only; product workflows require separate acceptance testing.",
  };
}
