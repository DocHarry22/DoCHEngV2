import type { CatalogueProduct, Release } from "@/lib/catalogue";

export function releaseDownloadLink(release: Release) {
  const external = release.access === "public" && Boolean(release.externalUrl);
  const extension = release.fileName.split(".").pop()?.toUpperCase();
  return {
    label: `Download for ${release.platform}${extension ? ` (${extension})` : ""}`,
    href: external
      ? release.externalUrl!
      : `/api/downloads/${encodeURIComponent(release.id)}`,
    external,
  };
}

export function productDownloadLinks(product: CatalogueProduct) {
  const priority = { stable: 0, beta: 1, preview: 2 };
  const releases = [...product.releases].sort(
    (a, b) =>
      priority[a.channel] - priority[b.channel] ||
      b.releasedAt.localeCompare(a.releasedAt) ||
      b.version.localeCompare(a.version, undefined, { numeric: true }),
  );
  return [...new Set(releases.map((release) => release.platform))].map(
    (platform) =>
      releaseDownloadLink(releases.find((release) => release.platform === platform)!),
  );
}
