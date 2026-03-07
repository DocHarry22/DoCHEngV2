import type { EcosystemProduct } from "@/lib/site-content";
import { ecosystemProducts } from "@/lib/site-content";

export type ReleaseUpdateType = "major" | "minor" | "fix" | "improvement" | "maintenance" | "upcoming";
export type ReleaseStatus = "shipped" | "in-progress" | "planned";

export type ReleaseProductScopeId = EcosystemProduct["slug"] | "parent-platform" | "pricing-layer" | "support-layer" | "ecosystem-layer";
export type ReleasePlatformScopeId = "web" | "desktop" | "android" | "parent-platform";

export type ReleaseNoteEntry = {
  id: string;
  slug: string;
  title: string;
  date: string;
  version: string;
  productScope: ReleaseProductScopeId[];
  platformScope: ReleasePlatformScopeId[];
  updateType: ReleaseUpdateType;
  status: ReleaseStatus;
  summary: string;
  detailNotes: string[];
  featured: boolean;
  relatedRoute?: string;
  roadmapRoute?: string;
  tags?: string[];
};

export type ProductScopeMeta = {
  id: ReleaseProductScopeId;
  label: string;
  href: string;
};

export type PlatformScopeMeta = {
  id: ReleasePlatformScopeId;
  label: string;
};

const productScopeBySlug = ecosystemProducts.reduce<Record<string, ProductScopeMeta>>((map, product) => {
  map[product.slug] = {
    id: product.slug,
    label: product.name,
    href: `/products/${product.slug}`
  };

  return map;
}, {});

export const releaseProductScopes: ProductScopeMeta[] = [
  { id: "parent-platform", label: "Parent Platform", href: "/" },
  { id: "pricing-layer", label: "Pricing Layer", href: "/pricing" },
  { id: "support-layer", label: "Support Layer", href: "/support" },
  { id: "ecosystem-layer", label: "Ecosystem Layer", href: "/ecosystem" },
  ...(ecosystemProducts.map((product) => productScopeBySlug[product.slug]) as ProductScopeMeta[])
];

export const releasePlatformScopes: PlatformScopeMeta[] = [
  { id: "web", label: "Web" },
  { id: "desktop", label: "Desktop" },
  { id: "android", label: "Android" },
  { id: "parent-platform", label: "Parent Platform" }
];

export const changelogEntries: ReleaseNoteEntry[] = [
  {
    id: "release-changelog-layer",
    slug: "changelog-layer-release",
    title: "Structured changelog and release notes layer launched",
    date: "2026-03-07",
    version: "v0.9.0",
    productScope: ["parent-platform", "support-layer", "ecosystem-layer"],
    platformScope: ["web", "parent-platform"],
    updateType: "major",
    status: "shipped",
    summary:
      "A dedicated changelog route now tracks product and platform progress with typed metadata, product/platform scope tags, and structured release summaries.",
    detailNotes: [
      "Added a dedicated changelog experience focused on trusted update communication.",
      "Introduced reusable release cards, update badges, and scope labels for scan-first reading.",
      "Linked release entries directly to products, support pathways, roadmap context, and downloads where relevant."
    ],
    featured: true,
    relatedRoute: "/changelog",
    roadmapRoute: "/roadmap",
    tags: ["release-notes", "trust", "ecosystem-progress"]
  },
  {
    id: "release-auth-foundation",
    slug: "auth-account-access-foundation",
    title: "Account access foundation and route protection expanded",
    date: "2026-03-07",
    version: "v0.8.2",
    productScope: ["parent-platform", "support-layer"],
    platformScope: ["web", "parent-platform"],
    updateType: "improvement",
    status: "shipped",
    summary:
      "Auth/account groundwork now includes typed adapter seams, account routes, session-aware navigation, and middleware protection patterns.",
    detailNotes: [
      "Added sign-in, sign-up, account, and dashboard-access pathways with clearer guardrails.",
      "Implemented middleware redirects for protected account routes.",
      "Added release-safe test coverage for sign-in/sign-up/sign-out flows."
    ],
    featured: false,
    relatedRoute: "/account",
    roadmapRoute: "/roadmap",
    tags: ["auth", "account", "route-protection"]
  },
  {
    id: "release-pricing-refinement",
    slug: "pricing-structure-refinement",
    title: "Pricing structure refined with dedicated comparison layer",
    date: "2026-03-06",
    version: "v0.8.0",
    productScope: ["pricing-layer", "desk", "resume", "compass"],
    platformScope: ["web", "desktop", "android"],
    updateType: "major",
    status: "shipped",
    summary:
      "Pricing now has its own route and typed content model, clarifying branch-level models and platform-fit comparisons.",
    detailNotes: [
      "Launched a full pricing page with model explanation, product cards, compare table, and FAQ.",
      "Aligned parent navigation and footer pathways to the dedicated pricing route.",
      "Improved branch-level pricing clarity for current and upcoming products."
    ],
    featured: false,
    relatedRoute: "/pricing",
    roadmapRoute: "/roadmap",
    tags: ["pricing", "comparison", "branch-models"]
  },
  {
    id: "release-support-docs-path",
    slug: "support-docs-pathway-expansion",
    title: "Support and documentation pathways expanded",
    date: "2026-03-05",
    version: "v0.7.6",
    productScope: ["support-layer", "parent-platform"],
    platformScope: ["web", "parent-platform"],
    updateType: "improvement",
    status: "shipped",
    summary:
      "Support contact lanes and documentation pathways were tightened to reduce routing confusion and speed user resolution.",
    detailNotes: [
      "Expanded support categories and contact-method clarity.",
      "Added explicit documentation routing from support pathways.",
      "Strengthened escalation messaging for multi-domain requests."
    ],
    featured: false,
    relatedRoute: "/support",
    roadmapRoute: "/roadmap",
    tags: ["support", "docs", "service-quality"]
  },
  {
    id: "release-ecosystem-tree-ui",
    slug: "ecosystem-tree-visual-refresh",
    title: "Ecosystem tree visualization refreshed for parent-brand clarity",
    date: "2026-03-04",
    version: "v0.7.0",
    productScope: ["ecosystem-layer", "parent-platform", "desk", "resume", "compass"],
    platformScope: ["web", "parent-platform"],
    updateType: "minor",
    status: "shipped",
    summary:
      "Homepage ecosystem visuals now communicate active and future branches with stronger parent-brand hierarchy and branch mapping.",
    detailNotes: [
      "Refined tree hero and branch-map semantics for easier ecosystem scanning.",
      "Aligned visual accents to core DoCHEng palette for better consistency.",
      "Improved hierarchy between current products and planned expansion branches."
    ],
    featured: false,
    relatedRoute: "/ecosystem",
    roadmapRoute: "/roadmap",
    tags: ["ui", "ecosystem", "parent-brand"]
  },
  {
    id: "release-distribution-status-clarity",
    slug: "distribution-status-clarity-upgrade",
    title: "Distribution status clarity improvements",
    date: "2026-03-14",
    version: "v0.9.1",
    productScope: ["parent-platform", "desk", "resume", "compass"],
    platformScope: ["desktop", "android", "web"],
    updateType: "upcoming",
    status: "planned",
    summary:
      "Planned release to tighten how branch build status is surfaced across download and support pathways.",
    detailNotes: [
      "Clarify build-stage messaging between active, limited, and upcoming availability states.",
      "Connect download status cues to support escalation paths.",
      "Improve user guidance for cross-platform rollout sequencing."
    ],
    featured: false,
    relatedRoute: "/downloads",
    roadmapRoute: "/roadmap",
    tags: ["downloads", "status", "planned"]
  }
];

export const changelogHighlight = changelogEntries.find((entry) => entry.featured) ?? changelogEntries[0];

export const changelogOverviewBullets = [
  "Release notes are structured by product scope, platform scope, and update type to keep changes clear.",
  "Shipped and planned updates are visually separated so future items are not confused with completed releases.",
  "Each entry links to relevant ecosystem routes for support, product context, and roadmap direction."
] as const;

export const changelogFaq = [
  {
    question: "How often is this changelog updated?",
    answer: "DoCHEng updates this page as meaningful ecosystem changes are released or scheduled with clear status labels."
  },
  {
    question: "Are planned updates already available?",
    answer: "No. Planned items are explicitly labeled and shown as directional, not shipped releases."
  },
  {
    question: "Where can I ask update-related questions?",
    answer: "Use the support pathways for release-specific questions, account impact, or rollout clarification."
  }
] as const;

export function getProductScopeMeta(scopeId: ReleaseProductScopeId): ProductScopeMeta {
  return releaseProductScopes.find((scope) => scope.id === scopeId) ?? { id: scopeId, label: scopeId, href: "/changelog" };
}

export function getPlatformScopeMeta(scopeId: ReleasePlatformScopeId): PlatformScopeMeta {
  return releasePlatformScopes.find((scope) => scope.id === scopeId) ?? { id: scopeId, label: scopeId };
}
