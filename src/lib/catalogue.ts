import { getAppsForLauncher } from "@/lib/ecosystem-manifest";
import { selectedProducts } from "@/lib/selected-products";
import { productPreviews } from "@/lib/product-previews";
import { productDownloadLinks } from "@/lib/product-links";
export const categories = [
  "Engineering and Productivity",
  "Career and Education",
  "Documents and Business",
  "Research and Development",
  "Sister Projects",
] as const;
export type ProductCategory = (typeof categories)[number];
export type ProductStatus = "live" | "beta" | "coming-soon" | "planned";
export type Release = {
  id: string;
  version: string;
  channel: "stable" | "beta" | "preview";
  platform: "Windows" | "Android";
  fileName: string;
  sha256: string;
  bytes: number;
  releasedAt: string;
  requirements: string;
  notes: string;
  access: "public" | "account" | "paid";
  externalUrl?: string;
  publisherUrl?: string;
};
export type CatalogueProduct = {
  visibility: "public" | "internal";
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  summary: string;
  description: string;
  audience: string;
  features: string[];
  platforms: string[];
  status: ProductStatus;
  featured: boolean;
  pricing: "free" | "paid" | "unconfirmed";
  pricingNote: string;
  launch?: { url: string; checkedAt: string; scope: string };
  icon: string;
  screenshots: { url: string; caption: string }[];
  documentation: string;
  support: string;
  related: string[];
  releaseNotes: string;
  releases: Release[];
  logoUrl?: string;
};
const details: Record<
  string,
  Pick<
    CatalogueProduct,
    "category" | "description" | "features" | "pricingNote"
  >
> = {
  desk: {
    category: "Engineering and Productivity",
    description:
      "Bring documents, notes and technical questions into one research workspace. Desk v2 is built around separate notebooks, source ingestion and citation-led exploration. The public deployment currently reaches its sign-in screen; hosted processing and account workflows have not yet completed production acceptance testing.",
    features: [
      "Organize sources into research notebooks",
      "Explore source-grounded questions and citations",
      "Create structured study and research outputs",
    ],
    pricingNote:
      "Existing Starter R0 and Pro R149/month proposals are retained for review. Checkout and paid entitlements are not activated.",
  },
  resume: {
    category: "Career and Education",
    description:
      "A workspace for understanding and improving a CV. The public interface includes resume scanning and PDF template workflows. The associated parsing service extracts information from PDF and DOCX documents. Hosted analysis quality, personal-data handling and template exports remain subject to product-specific acceptance testing.",
    features: [
      "Explore a resume scanning interface",
      "Work with PDF resume templates",
      "PDF and DOCX parsing service in the associated codebase",
    ],
    pricingNote:
      "Existing Standard R399 once-off and Career Plus R79/month proposals are retained. No verified sale is offered here.",
  },
  compass: {
    category: "Career and Education",
    description:
      "An academic planning project for exploring programmes, entry requirements and study pathways. Both earlier and newer implementations were discovered. The intended Hostinger subdomain currently serves a hosting default page, so there is no verified public application launch.",
    features: [
      "Academic pathway planning project",
      "Programme and entry requirement exploration",
      "Student and advisor workflows under development",
    ],
    pricingNote:
      "Existing Student R59/month and Advisor R199/month proposals remain unconfirmed. Launch dates and final prices have not been approved.",
  },
};
export const baseCatalogue: CatalogueProduct[] = [
  ...getAppsForLauncher()
    .filter((app) => app.visibility === "public")
    .map(
      (app) =>
        ({
          id: app.id,
          visibility: "public",
          slug: app.slug,
          name: app.name,
          category: details[app.slug]?.category ?? "Research and Development",
          summary: app.shortDescription,
          description: details[app.slug]?.description ?? app.longDescription,
          audience: app.audience,
          features: details[app.slug]?.features ?? [app.shortDescription],
          platforms: ["Web"],
          status:
            app.status === "live"
              ? "live"
              : app.status === "beta"
                ? "beta"
                : app.status === "coming-soon"
                  ? "coming-soon"
                  : "planned",
          featured: app.featured,
          pricing: "unconfirmed",
          pricingNote:
            details[app.slug]?.pricingNote ?? "Pricing has not been verified.",
          launch: app.verifiedWeb,
          icon: app.slug,
          screenshots: [],
          documentation: "/docs",
          support: `/support?product=${app.slug}#contact-form`,
          related:
            app.slug === "resume"
              ? ["compass"]
              : ["desk", "resume"].filter((s) => s !== app.slug),
          releases: [],
          releaseNotes:
            "No downloadable release version has been verified. Product implementation and production availability are tracked separately.",
        }) as CatalogueProduct,
    ),
  ...selectedProducts,
].map((product) => ({
  ...product,
  screenshots: productPreviews[product.slug] ?? product.screenshots,
}));
export function productAction(product: CatalogueProduct) {
  if (
    (product.status === "live" || product.status === "beta") &&
    product.launch
  )
    return {
      label:
        product.category === "Sister Projects" ? "Visit website" : "Open web app",
      href: product.launch.url,
      external: true,
    };
  if (product.status === "live" || product.status === "beta") {
    const download = productDownloadLinks(product)[0];
    if (download) return download;
  }
  if (product.status === "planned")
    return { label: "View Roadmap", href: "/roadmap", external: false };
  if (product.status === "coming-soon")
    return { label: "Join Waitlist", href: product.support, external: false };
  return {
    label: "View Product",
    href: `/products/${product.slug}`,
    external: false,
  };
}
export function filterCatalogue(
  products: CatalogueProduct[],
  filters: {
    query: string;
    category: string;
    platform: string;
    status: string;
    pricing: string;
  },
) {
  const query = filters.query.trim().toLocaleLowerCase();
  return products.filter(
    (p) =>
      (!query ||
        [p.name, p.summary, p.description, ...p.features]
          .join(" ")
          .toLocaleLowerCase()
          .includes(query)) &&
      (!filters.category || p.category === filters.category) &&
      (!filters.platform || p.platforms.includes(filters.platform)) &&
      (!filters.status || p.status === filters.status) &&
      (!filters.pricing || p.pricing === filters.pricing),
  );
}
