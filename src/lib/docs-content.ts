export type DocCategory =
  | "getting-started"
  | "product-workflows"
  | "technical-setup"
  | "pricing-access"
  | "account-support"
  | "business-partnership";

export type DocStatus = "published" | "planned";

export type DocArticle = {
  title: string;
  slug: string;
  summary: string;
  category: DocCategory;
  status: DocStatus;
  productScope: "ecosystem" | "desk" | "resume" | "compass";
  audience: string;
  readTimeMinutes: number;
  updatedAt: string;
  tags: string[];
  quickSteps: string[];
  relatedReleaseSlugs?: string[];
  relatedRoutes?: string[];
};

export type DocCategoryMeta = {
  key: DocCategory;
  title: string;
  description: string;
  priority: number;
};

export const docCategoryMeta: DocCategoryMeta[] = [
  {
    key: "getting-started",
    title: "Getting started",
    description:
      "Parent-brand orientation, ecosystem structure, and first actions.",
    priority: 1,
  },
  {
    key: "product-workflows",
    title: "Product workflows",
    description:
      "Branch-specific operating guidance for Desk, Resume, and Compass pathways.",
    priority: 2,
  },
  {
    key: "technical-setup",
    title: "Technical setup",
    description:
      "Install, update, runtime checks, and release-channel alignment.",
    priority: 3,
  },
  {
    key: "pricing-access",
    title: "Pricing and access",
    description:
      "Plan mapping, entitlement logic, and billing/access guidance.",
    priority: 4,
  },
  {
    key: "account-support",
    title: "Account and support",
    description: "Sign-in, account hygiene, and escalation pathways.",
    priority: 5,
  },
  {
    key: "business-partnership",
    title: "Business and partnership",
    description:
      "Institutional rollout, pilot preparation, and business enquiry structure.",
    priority: 6,
  },
] as const;

export const docsArticles: DocArticle[] = [
  {
    title: "DoCHEng Ecosystem Quickstart",
    slug: "ecosystem-quickstart",
    summary:
      "Understand the parent ecosystem model, branch structure, and where to begin based on your goals.",
    category: "getting-started",
    status: "published",
    productScope: "ecosystem",
    audience: "New users evaluating the DoCHEng ecosystem",
    readTimeMinutes: 4,
    updatedAt: "2026-03-07",
    tags: ["onboarding", "ecosystem", "start-here"],
    quickSteps: [
      "Map your goal to a branch: Desk, Resume, or Compass.",
      "Review pricing/access status for your target branch.",
      "Use support if your workflow spans multiple branches.",
    ],
    relatedRoutes: ["/products", "/pricing", "/support"],
  },
  {
    title: "Branch Selection Guide",
    slug: "branch-selection-guide",
    summary:
      "Choose the right DoCHEng product branch using workflow outcomes instead of generic feature checklists.",
    category: "product-workflows",
    status: "published",
    productScope: "ecosystem",
    audience: "Teams and individuals deciding product fit",
    readTimeMinutes: 5,
    updatedAt: "2026-03-07",
    tags: ["product-fit", "desk", "resume", "compass"],
    quickSteps: [
      "Use Desk for technical execution and knowledge operations.",
      "Use Resume for profile optimization and career positioning.",
      "Use Compass for STEM planning and academic navigation.",
    ],
    relatedRoutes: ["/products", "/ecosystem"],
  },
  {
    title: "Desktop and Android Setup Checklist",
    slug: "desktop-android-setup-checklist",
    summary:
      "Set up branch builds cleanly, verify release channels, and avoid common installation drift.",
    category: "technical-setup",
    status: "published",
    productScope: "ecosystem",
    audience: "Users deploying DoCHEng across desktop and mobile",
    readTimeMinutes: 6,
    updatedAt: "2026-03-07",
    tags: ["installation", "release-channel", "desktop", "android"],
    quickSteps: [
      "Confirm your branch and target release channel before install.",
      "Check that an actual installer, requirements and SHA-256 checksum are published; the core apps have no verified native release yet.",
      "Escalate technical mismatch via support with product, platform, and version details.",
    ],
    relatedRoutes: ["/downloads", "/support#technical-help"],
  },
  {
    title: "Pricing, Billing, and Entitlement Basics",
    slug: "pricing-billing-entitlements",
    summary:
      "Understand DoCHEng billing models, branch-level access, and how entitlements control runtime availability.",
    category: "pricing-access",
    status: "published",
    productScope: "ecosystem",
    audience: "Users comparing plans and validating access coverage",
    readTimeMinutes: 5,
    updatedAt: "2026-03-07",
    tags: ["pricing", "billing", "entitlements"],
    quickSteps: [
      "Displayed app plan amounts are proposals; paid checkout is inactive. Confirm a provider-backed offer before any purchase.",
      "Use account page to verify entitlement state.",
      "Route unresolved billing/access gaps to support pricing lane.",
    ],
    relatedRoutes: ["/pricing", "/account", "/support#pricing-access"],
  },
  {
    title: "Account Access Recovery",
    slug: "account-access-recovery",
    summary:
      "Recover sign-in and access continuity with a structured sequence before escalation.",
    category: "account-support",
    status: "published",
    productScope: "ecosystem",
    audience: "Users blocked by account or entitlement issues",
    readTimeMinutes: 4,
    updatedAt: "2026-03-07",
    tags: ["account", "signin", "support"],
    quickSteps: [
      "Validate account email and active session state.",
      "Use password recovery for your DoCHEng account. Independent apps enforce their own sign-in and permissions.",
      "Escalate with account email, branch slug, and observed state.",
    ],
    relatedRoutes: ["/signin", "/account", "/support#contact-form"],
  },
  {
    title: "Partnership Pilot Preparation",
    slug: "partnership-pilot-preparation",
    summary:
      "Prepare your organization for DoCHEng pilot discussions with clear timeline, scope, and branch context.",
    category: "business-partnership",
    status: "published",
    productScope: "ecosystem",
    audience: "Institutions and organizations evaluating collaboration",
    readTimeMinutes: 4,
    updatedAt: "2026-03-07",
    tags: ["partnership", "pilot", "business"],
    quickSteps: [
      "Define branch priorities and expected user groups.",
      "Prepare deployment timeline and implementation constraints.",
      "Submit business enquiry with pilot scope and decision milestones.",
    ],
    relatedRoutes: ["/roadmap", "/support#business-pathway"],
  },
  {
    title: "Reading Release Notes and Rollout Impact",
    slug: "release-notes-rollout-impact",
    summary:
      "Interpret DoCHEng release metadata clearly so shipped and planned updates are not confused.",
    category: "getting-started",
    status: "published",
    productScope: "ecosystem",
    audience: "Users and teams tracking changelog updates",
    readTimeMinutes: 4,
    updatedAt: "2026-03-07",
    tags: ["changelog", "release-notes", "rollout"],
    quickSteps: [
      "Use update type and status labels first before reading details.",
      "Check product scope and platform scope to see whether the update affects your workflow.",
      "Follow related route links for product, downloads, roadmap, or support actions.",
    ],
    relatedReleaseSlugs: [
      "changelog-layer-release",
      "distribution-status-clarity-upgrade",
    ],
    relatedRoutes: ["/changelog", "/downloads", "/support#contact-form"],
  },
  {
    title: "Post-Update Validation Checklist",
    slug: "post-update-validation-checklist",
    summary:
      "Run a practical validation sequence after major ecosystem updates before escalating issues.",
    category: "technical-setup",
    status: "published",
    productScope: "ecosystem",
    audience: "Power users and teams validating release impact",
    readTimeMinutes: 5,
    updatedAt: "2026-03-07",
    tags: ["validation", "quality-check", "release"],
    quickSteps: [
      "Confirm update date/version against the changelog entry.",
      "Verify account entitlements and route guards if auth or access changed.",
      "Check product routes and downloads behavior before filing support tickets.",
    ],
    relatedReleaseSlugs: [
      "auth-account-access-foundation",
      "pricing-structure-refinement",
    ],
    relatedRoutes: ["/changelog", "/account", "/downloads"],
  },
  {
    title: "How To Report Update Regressions",
    slug: "report-update-regressions",
    summary:
      "Submit high-quality support context for post-release regressions with minimal back-and-forth.",
    category: "account-support",
    status: "published",
    productScope: "ecosystem",
    audience: "Users reporting release-impact issues",
    readTimeMinutes: 4,
    updatedAt: "2026-03-07",
    tags: ["support", "regression", "incident"],
    quickSteps: [
      "Include release version/date and affected product scope in your report.",
      "Add platform scope and exact route where behavior changed.",
      "Attach expected behavior, observed behavior, and whether issue is blocked or degraded.",
    ],
    relatedReleaseSlugs: [
      "support-docs-pathway-expansion",
      "changelog-layer-release",
    ],
    relatedRoutes: ["/support#contact-form", "/changelog"],
  },
];

export function getDocBySlug(slug: string) {
  return docsArticles.find((article) => article.slug === slug);
}

export function getDocsByCategory(category: DocCategory) {
  return docsArticles.filter((article) => article.category === category);
}

export function getPublishedDocs() {
  return docsArticles.filter((article) => article.status === "published");
}

export function getDocsForReleaseSlug(releaseSlug: string) {
  return docsArticles.filter((article) =>
    article.relatedReleaseSlugs?.includes(releaseSlug),
  );
}
