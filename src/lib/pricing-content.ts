import type { EcosystemProduct, Platform, PricingModel } from "@/lib/site-content";
import { ecosystemProducts } from "@/lib/site-content";

export type PricingAction = {
  label: string;
  href: string;
  variant?: "primary" | "ghost";
};

export type PricingEntry = {
  productName: string;
  slug: string;
  summary: string;
  pricingModel: PricingModel;
  pricingModelLabel: string;
  startingPrice: string;
  billingCadence: string;
  includedPlatforms: Platform[];
  notableFeatures: string[];
  bestFor: string;
  planNote: string;
  status: EcosystemProduct["status"];
  plans: EcosystemProduct["plans"];
  actions: PricingAction[];
};

const pricingModelLabels: Record<PricingModel, string> = {
  free: "Free",
  "free-trial": "Free Trial",
  "one-time": "One-time Purchase",
  monthly: "Monthly Subscription",
  annual: "Annual Subscription",
  tiered: "Tiered Access"
};

const defaultBillingCadence: Record<PricingModel, string> = {
  free: "No recurring charge",
  "free-trial": "Trial then paid conversion",
  "one-time": "Single purchase",
  monthly: "Billed monthly",
  annual: "Billed annually",
  tiered: "Plan-dependent cadence"
};

const pricingDetailBySlug: Record<string, Pick<PricingEntry, "bestFor" | "planNote" | "notableFeatures">> = {
  desk: {
    bestFor: "Engineering operators and technical teams who need a daily command workspace.",
    planNote: "Starter access is free, with monthly Pro expansion for advanced actions.",
    notableFeatures: [
      "Local projects and structured knowledge capture",
      "AI-powered technical assistance in Pro",
      "Cross-device workflow continuity"
    ]
  },
  resume: {
    bestFor: "Career-focused technical professionals preparing high-stakes applications.",
    planNote: "Primary value is one-time ownership with optional monthly refinement support.",
    notableFeatures: [
      "Technical resume parsing and score visibility",
      "Role-fit optimization for engineering hiring",
      "Export-ready profile package"
    ]
  },
  compass: {
    bestFor: "STEM learners and advisors planning academic pathways and milestones.",
    planNote: "Launch pricing starts with monthly student plans and advisor expansion tiers.",
    notableFeatures: [
      "Program and requirement planning",
      "Multi-student advisor views",
      "Progress and pathway guidance"
    ]
  }
};

export const pricingEntries: PricingEntry[] = ecosystemProducts.map((product) => {
  const details = pricingDetailBySlug[product.slug] ?? {
    bestFor: product.targetUser,
    planNote: product.plans[0]?.summary ?? "Pricing details will be published with launch updates.",
    notableFeatures: [product.summary]
  };

  return {
    productName: product.name,
    slug: product.slug,
    summary: product.positioning,
    pricingModel: product.pricingModel,
    pricingModelLabel: pricingModelLabels[product.pricingModel],
    startingPrice: product.startingPrice,
    billingCadence: defaultBillingCadence[product.pricingModel],
    includedPlatforms: product.platforms,
    notableFeatures: details.notableFeatures,
    bestFor: details.bestFor,
    planNote: details.planNote,
    status: product.status,
    plans: product.plans,
    actions: [
      { label: "View Branch", href: `/products/${product.slug}` },
      {
        label: product.status === "coming-soon" ? "Join Waitlist" : "Download Options",
        href: product.status === "coming-soon" ? "/support#business" : `/downloads#${product.slug}`,
        variant: "ghost"
      }
    ]
  };
});

export const pricingOverviewBullets = [
  "Pricing is product-specific: each branch can use the model that fits its workflow and user depth.",
  "Desktop and Android access is included according to each branch release stage.",
  "Billing structures are designed to scale from individual learners to professional teams."
] as const;

export const pricingAccessNotes = [
  "All listed prices are starting points and may expand by plan depth, seats, or premium capabilities.",
  "Coming-soon branches publish final pricing before public launch with migration-safe upgrade paths.",
  "Regional pricing and institutional licensing can be offered through DoCHEng support channels."
] as const;

export const pricingFaq = [
  {
    question: "Do I pay once for the whole ecosystem?",
    answer: "No. Pricing is branch-specific so you only pay for the product workflows you actually use."
  },
  {
    question: "Are Desktop and Android included together?",
    answer: "Most active branches support both platforms under one product access path. Launch-stage products may phase platform support in steps."
  },
  {
    question: "What happens when pricing changes in future releases?",
    answer: "DoCHEng plans pricing transitions with clear upgrade notes to avoid unexpected disruptions for active users."
  }
] as const;
