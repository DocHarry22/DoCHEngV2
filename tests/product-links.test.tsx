import { render, screen } from "@testing-library/react";
import { baseCatalogue, productAction, type Release } from "@/lib/catalogue";
import { ProductAccessLinks } from "@/components/apps/product-access-links";
import { productDownloadLinks, releaseDownloadLink } from "@/lib/product-links";

const release: Release = {
  id: "windows-release", version: "1.0.0", channel: "stable", platform: "Windows",
  fileName: "app-1.0.0.msi", sha256: "a".repeat(64), bytes: 1000,
  releasedAt: "2026-10-20", requirements: "Windows 10 or later", notes: "Published installer",
  access: "public", externalUrl: "https://example.test/app-1.0.0.msi",
};

it("shows the website and one installer per platform without replacing a stable release with a preview", () => {
  const product = { ...baseCatalogue[0], releases: [
    { ...release, id: "preview", channel: "preview" as const, version: "2.0.0", releasedAt: "2026-10-21" },
    release,
    { ...release, id: "old", version: "0.9.0", releasedAt: "2026-10-19" },
  ] };
  render(<ProductAccessLinks product={product} />);
  expect(screen.getByRole("link", { name: "Open web app" })).toHaveAttribute("href", product.launch!.url);
  expect(screen.getAllByRole("link", { name: "Download for Windows (MSI)" })).toHaveLength(1);
  expect(productDownloadLinks(product)[0].href).toBe(release.externalUrl);
});

it("keeps account and paid downloads on the server access gate", () => {
  for (const access of ["account", "paid"] as const) {
    expect(releaseDownloadLink({ ...release, access })).toMatchObject({ href: "/api/downloads/windows-release", external: false });
  }
});

it("opens an installer for a downloadable app with no website, and keeps unreleased apps on their existing pathway", () => {
  const product = { ...baseCatalogue[0], launch: undefined, releases: [release] };
  expect(productAction(product)).toMatchObject({ label: "Download for Windows (MSI)", href: release.externalUrl });
  render(<ProductAccessLinks product={product} />);
  expect(screen.getAllByRole("link", { name: "Download for Windows (MSI)" })).toHaveLength(1);
  expect(productDownloadLinks({ ...product, releases: [] })).toEqual([]);
  expect(productAction({ ...product, status: "coming-soon", releases: [] }).href).toBe(product.support);
});
