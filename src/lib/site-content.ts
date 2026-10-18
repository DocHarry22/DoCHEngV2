import { getAppBySlug, getAppsForLauncher } from "@/lib/ecosystem-manifest";

export type Platform = "Desktop" | "Android" | "Web";
export type PricingModel =
  "free" | "free-trial" | "one-time" | "monthly" | "annual" | "tiered";

export type ProductPlan = {
  name: string;
  price: string;
  cadence: string;
  summary: string;
};

export type EcosystemProduct = {
  name: string;
  slug: string;
  positioning: string;
  summary: string;
  targetUser: string;
  platforms: Platform[];
  pricingModel: PricingModel;
  startingPrice: string;
  plans: ProductPlan[];
  ctaLabel: string;
  ctaHref: string;
  subdomain: string;
  status: "live" | "beta" | "coming-soon";
};

export type EcosystemAccessLayer = {
  channel: Platform;
  label: string;
  summary: string;
  ctaLabel: string;
  ctaHref: string;
};

export const siteNavigation = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/about" },
  { label: "Apps", href: "/apps" },
  { label: "Products", href: "/#products" },
  { label: "Changelog", href: "/changelog" },
  { label: "Downloads", href: "/downloads" },
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: "/docs" },
  { label: "Roadmap", href: "/roadmap" },
  { label: "Architecture", href: "/ecosystem" },
  { label: "Support", href: "/support" },
] as const;

const platformMap = {
  desktop: "Desktop",
  android: "Android",
} as const;

const pricingModelMap = {
  free: "free",
  "free-trial": "free-trial",
  "one-time": "one-time",
  monthly: "monthly",
  annual: "annual",
  tiered: "tiered",
  hybrid: "tiered",
  tbd: "monthly",
} as const;

const starterPlansBySlug: Record<string, ProductPlan[]> = {
  desk: [
    {
      name: "Starter",
      price: "R0",
      cadence: "Free",
      summary: "Core workspace with local projects and basic organization.",
    },
    {
      name: "Pro",
      price: "R149",
      cadence: "per month",
      summary: "Advanced knowledge tooling, AI actions, and cross-device sync.",
    },
  ],
  resume: [
    {
      name: "Standard",
      price: "R399",
      cadence: "one-time",
      summary: "Resume parsing, technical scoring, and export templates.",
    },
    {
      name: "Career Plus",
      price: "R79",
      cadence: "per month",
      summary:
        "Continuous profile refinement with role tracking and recommendations.",
    },
  ],
  compass: [
    {
      name: "Student",
      price: "R59",
      cadence: "per month",
      summary:
        "Program planning, requirement tracking, and study pathway guidance.",
    },
    {
      name: "Advisor",
      price: "R199",
      cadence: "per month",
      summary: "Multi-student planning dashboards for schools and mentors.",
    },
  ],
};

const targetUserBySlug: Record<string, string> = {
  desk: "Engineering students, consultants, technical operators",
  resume: "Graduates, professionals, recruiters, technical founders",
  compass: "STEM learners, parents, advisors, first-year students",
};

const productsForParent = ["desk", "resume", "compass"]
  .map((slug) => getAppBySlug(slug))
  .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

export const ecosystemProducts: EcosystemProduct[] = productsForParent.map(
  (app) => {
    const nonWebPlatforms = app.platforms
      .filter((platform) => platform !== "web")
      .map((platform) => platformMap[platform]);
    const plans = starterPlansBySlug[app.slug] ?? [
      {
        name: "Standard",
        price: "TBD",
        cadence: "TBD",
        summary: app.shortDescription,
      },
    ];

    return {
      name: app.name,
      slug: app.slug,
      positioning: app.shortDescription,
      summary: app.longDescription,
      targetUser: targetUserBySlug[app.slug] ?? app.audience,
      platforms: nonWebPlatforms.length ? nonWebPlatforms : ["Web"],
      pricingModel: pricingModelMap[app.pricingModel],
      startingPrice: "Pricing under review",
      plans,
      ctaLabel: app.status === "coming-soon" ? "Join Waitlist" : "Open Branch",
      ctaHref: app.internalRoute ?? `/products/${app.slug}`,
      subdomain: app.subdomain ?? "Public launch pending",
      status:
        app.status === "live"
          ? "live"
          : app.status === "beta"
            ? "beta"
            : "coming-soon",
    };
  },
);

export const valuePillars = [
  {
    title: "Study with structure",
    body: "Turn fragmented study material into clear, reusable technical knowledge systems.",
  },
  {
    title: "Work with precision",
    body: "Operate engineering projects with better documentation, faster retrieval, and cleaner execution trails.",
  },
  {
    title: "Grow with confidence",
    body: "Move from academic preparation to professional readiness with tools built for technical careers.",
  },
  {
    title: "Build inside one ecosystem",
    body: "Access specialized apps that remain connected through one parent brand and one operating philosophy.",
  },
] as const;

export const domainArchitecture = {
  parent: "docheng.co.za",
  visionLine: "One parent ecosystem, multiple specialized product domains.",
  subdomains: getAppsForLauncher()
    .map((app) => app.subdomain)
    .filter((domain): domain is string => Boolean(domain)),
} as const;

export const ecosystemAccessLayers: EcosystemAccessLayer[] = [
  {
    channel: "Desktop",
    label: "Desktop Runtime",
    summary:
      "High-focus engineering workflows with larger contexts, project folders, and deep execution sessions.",
    ctaLabel: "Download Desktop",
    ctaHref: "/downloads",
  },
  {
    channel: "Android",
    label: "Android Companion",
    summary:
      "Portable capture, review, and fast technical actions across field work, commuting, and study transitions.",
    ctaLabel: "Download Android",
    ctaHref: "/downloads",
  },
] as const;

export const ecosystemSystemLayers = [
  {
    id: "brand",
    title: "Parent Brand Layer",
    summary:
      "docheng.co.za anchors identity, positioning, trust, and ecosystem entry.",
  },
  {
    id: "domain",
    title: "Product Domain Layer",
    summary:
      "Each product expands through dedicated subdomains with focused workflows and pricing models.",
  },
  {
    id: "runtime",
    title: "Runtime Access Layer",
    summary:
      "Desktop and Android channels deliver the same branch capabilities through context-specific interactions.",
  },
  {
    id: "intelligence",
    title: "Connected Intelligence Layer",
    summary:
      "Shared product language and data patterns keep the ecosystem coherent as new branches are added.",
  },
] as const;

export const pricingModels = [
  {
    model: "Free",
    description: "Entry-level access for learning and evaluation.",
  },
  {
    model: "Free Trial",
    description: "Time-boxed premium access for product fit validation.",
  },
  {
    model: "One-time",
    description: "Single purchase for focused utility products.",
  },
  {
    model: "Monthly",
    description: "Subscription for continuous use and updates.",
  },
  {
    model: "Annual",
    description: "Discounted commitment plans for long-term teams.",
  },
  {
    model: "Tiered",
    description: "Multiple plan levels mapped to user depth and team scale.",
  },
  {
    model: "Coming Soon",
    description: "Pricing will be announced when product access opens.",
  },
] as const;

export function getProductBySlug(slug: string) {
  return ecosystemProducts.find((product) => product.slug === slug);
}
