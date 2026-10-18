import "server-only";
import {
  baseCatalogue,
  type CatalogueProduct,
  categories,
} from "@/lib/catalogue";
import { rows } from "./database";
import { HttpError } from "./security";
export function publishedCatalogue(): CatalogueProduct[] {
  const products = new Map(baseCatalogue.map((p) => [p.slug, p]));

  for (const draft of rows<{ slug: string; document: string }>(
    "SELECT slug,document FROM published_products",
  )) {
    const document = JSON.parse(draft.document);
    if (document.withdrawn === true) {
      products.delete(draft.slug);
      continue;
    }
    const product = validateProduct(document);
    if (product.visibility === "public") products.set(product.slug, product);
  }
  return [...products.values()];
}
export function validateProduct(input: unknown): CatalogueProduct {
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw new HttpError(400, "Product object required.");
  const p = input as CatalogueProduct;
  if (
    p.visibility !== undefined &&
    !["public", "internal"].includes(p.visibility)
  )
    throw new HttpError(400, "Choose public or internal visibility.");
  const text = (v: unknown, min: number, max: number) =>
    typeof v === "string" && v.trim().length >= min && v.length <= max;
  if (
    !text(p.slug, 2, 80) ||
    !/^[-a-z0-9]+$/.test(p.slug) ||
    !text(p.name, 2, 100) ||
    !text(p.summary, 20, 300) ||
    !text(p.description, 40, 8000) ||
    !text(p.audience, 3, 300)
  )
    throw new HttpError(
      400,
      "Complete product name, slug, descriptions and audience.",
    );
  if (
    !categories.includes(p.category) ||
    !["live", "beta", "coming-soon", "planned"].includes(p.status) ||
    !["free", "paid", "unconfirmed"].includes(p.pricing) ||
    !text(p.pricingNote, 10, 1000)
  )
    throw new HttpError(
      400,
      "Choose valid product categories, status and pricing metadata.",
    );
  for (const list of [p.features, p.platforms, p.related])
    if (
      !Array.isArray(list) ||
      list.length > 20 ||
      list.some((v) => !text(v, 1, 200))
    )
      throw new HttpError(400, "Invalid product lists.");
  if (!p.features.length || !p.platforms.length)
    throw new HttpError(400, "Features and supported platforms are required.");
  if (
    !Array.isArray(p.screenshots) ||
    p.screenshots.length > 12 ||
    p.screenshots.some(
      (s) =>
        !s ||
        typeof s !== "object" ||
        !/^\/(api\/media\/[a-f0-9-]+\.(png|jpg|webp)|screenshots\/[a-z0-9-]+\.png)$/.test(
          s.url,
        ) ||
        !text(s.caption, 5, 300),
    )
  )
    throw new HttpError(400, "Use uploaded screenshots with captions.");
  if (
    p.logoUrl &&
    !/^\/api\/media\/[a-f0-9-]+\.(png|jpg|webp)$/.test(p.logoUrl)
  )
    throw new HttpError(400, "Use an uploaded product logo.");
  // Launch verification and release artifacts are managed by separate server operations.
  if (
    p.launch &&
    (typeof p.launch.url !== "string" ||
      !p.launch.url.startsWith("https://") ||
      !text(p.launch.checkedAt, 10, 40) ||
      !text(p.launch.scope, 3, 200))
  )
    throw new HttpError(400, "Invalid launch evidence.");
  if (
    !/^\/docs(?:\/[a-z0-9-]+)?(?:#[a-z0-9-]+)?$/.test(p.documentation) ||
    !/^\/support(?:\?product=[a-z0-9-]+)?(?:#[a-z0-9-]+)?$/.test(p.support) ||
    !Array.isArray(p.releases)
  )
    throw new HttpError(400, "Invalid product navigation.");
  if (
    (p.releaseNotes !== undefined && !text(p.releaseNotes, 1, 5000)) ||
    (p.icon !== undefined && !text(p.icon, 1, 80))
  )
    throw new HttpError(
      400,
      "Use bounded text for the product icon and release notes.",
    );
  return {
    id: `app-${p.slug}`,
    visibility: p.visibility ?? "public",
    slug: p.slug,
    name: p.name,
    category: p.category,
    summary: p.summary,
    description: p.description,
    audience: p.audience,
    features: p.features,
    platforms: p.platforms,
    status: p.status,
    pricing: p.pricing,
    pricingNote: p.pricingNote,
    launch: p.launch,
    logoUrl: p.logoUrl,
    icon: p.icon ?? p.slug,
    featured: p.featured === true,
    screenshots: p.screenshots,
    documentation: p.documentation,
    support: p.support,
    related: p.related,
    releases: p.releases,
    releaseNotes: p.releaseNotes ?? "No release notes published.",
  };
}
