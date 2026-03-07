import type { Platform } from "@/lib/site-content";
import { ecosystemProducts } from "@/lib/site-content";

export type ReleaseChannel = "stable" | "beta" | "preview";
export type BuildStatus = "available" | "limited" | "coming-soon";
export type AccessRequirement = "public" | "account" | "paid" | "waitlist";

export type DistributionBuild = {
  id: string;
  productSlug: string;
  productName: string;
  platform: Platform;
  version: string;
  releaseChannel: ReleaseChannel;
  status: BuildStatus;
  accessRequirement: AccessRequirement;
  installer: string;
  installNotes: string[];
  releaseNotes: string;
  actions: {
    label: string;
    href: string;
    variant?: "primary" | "ghost";
  }[];
};

const releaseBlueprintByProduct: Record<
  string,
  {
    desktop: Omit<DistributionBuild, "id" | "productSlug" | "productName" | "platform">;
    android: Omit<DistributionBuild, "id" | "productSlug" | "productName" | "platform">;
  }
> = {
  desk: {
    desktop: {
      version: "v2.4.1",
      releaseChannel: "stable",
      status: "available",
      accessRequirement: "account",
      installer: "Windows installer (.msi)",
      installNotes: [
        "Use a DoCHEng account to sync workspace state across devices.",
        "Recommended for daily technical execution and document-heavy sessions."
      ],
      releaseNotes: "Stable branch with workspace sync and improved retrieval speed.",
      actions: [
        { label: "Get Desktop Build", href: "/support#contact-form" },
        { label: "Desktop Setup Help", href: "/support#technical", variant: "ghost" }
      ]
    },
    android: {
      version: "v2.4.1-a",
      releaseChannel: "stable",
      status: "available",
      accessRequirement: "account",
      installer: "Android package (managed rollout)",
      installNotes: [
        "Best for capture, review, and quick technical actions in transit.",
        "Uses the same branch account for continuity with desktop."
      ],
      releaseNotes: "Stable companion release aligned with desktop feature parity.",
      actions: [
        { label: "Get Android Build", href: "/support#contact-form" },
        { label: "Join Mobile Updates", href: "/support#product", variant: "ghost" }
      ]
    }
  },
  resume: {
    desktop: {
      version: "v1.6.0",
      releaseChannel: "beta",
      status: "limited",
      accessRequirement: "paid",
      installer: "Windows installer (.exe)",
      installNotes: [
        "Career Plus users receive priority access to rapid iteration releases.",
        "Recommended for full CV parsing and export workflows."
      ],
      releaseNotes: "Beta release with improved role-fit scoring and export flow updates.",
      actions: [
        { label: "Unlock Desktop Beta", href: "/pricing" },
        { label: "View Resume Plans", href: "/products/resume", variant: "ghost" }
      ]
    },
    android: {
      version: "v1.6.0-a",
      releaseChannel: "preview",
      status: "limited",
      accessRequirement: "paid",
      installer: "Android beta track",
      installNotes: [
        "Preview track focuses on quick role checks and profile snapshots.",
        "Mobile capability expands with each release cycle."
      ],
      releaseNotes: "Preview branch for beta users with progressive feature enablement.",
      actions: [
        { label: "Request Android Preview", href: "/support#technical" },
        { label: "Compare Pricing", href: "/pricing", variant: "ghost" }
      ]
    }
  },
  compass: {
    desktop: {
      version: "v0.9.0",
      releaseChannel: "preview",
      status: "coming-soon",
      accessRequirement: "waitlist",
      installer: "Desktop pre-release",
      installNotes: [
        "Initial access opens through waitlist cohorts.",
        "Institution and advisor pilots launch before public release."
      ],
      releaseNotes: "Coming-soon branch preparing first launch wave for STEM planning.",
      actions: [
        { label: "Join Compass Waitlist", href: "/support#business" },
        { label: "Track Launch Updates", href: "/products/compass", variant: "ghost" }
      ]
    },
    android: {
      version: "v0.9.0-a",
      releaseChannel: "preview",
      status: "coming-soon",
      accessRequirement: "waitlist",
      installer: "Android pre-release",
      installNotes: [
        "Mobile launch follows desktop pilot milestones.",
        "Waitlisted users receive rollout emails before public listing."
      ],
      releaseNotes: "Coming-soon Android companion scheduled after desktop pilot readiness.",
      actions: [
        { label: "Join Waitlist", href: "/support#business" },
        { label: "View Compass Branch", href: "/products/compass", variant: "ghost" }
      ]
    }
  }
};

export const distributionBuilds: DistributionBuild[] = ecosystemProducts.flatMap((product) => {
  const blueprint = releaseBlueprintByProduct[product.slug];

  return [
    {
      id: `${product.slug}-desktop`,
      productSlug: product.slug,
      productName: product.name,
      platform: "Desktop",
      ...blueprint.desktop
    },
    {
      id: `${product.slug}-android`,
      productSlug: product.slug,
      productName: product.name,
      platform: "Android",
      ...blueprint.android
    }
  ];
});

export const distributionOverviewBullets = [
  "Downloads are branch-specific: every product has its own version cadence, status, and access gate.",
  "Desktop and Android are coordinated at the ecosystem level while each branch controls release maturity.",
  "Access can be public, account-based, paid-plan gated, or waitlist-only depending on branch stage."
] as const;

export const releaseChannelNotes = [
  {
    channel: "stable",
    title: "Stable",
    summary: "Production-ready builds for routine execution with the strongest reliability target."
  },
  {
    channel: "beta",
    title: "Beta",
    summary: "Feature-complete builds still gathering feedback from active users and power teams."
  },
  {
    channel: "preview",
    title: "Preview",
    summary: "Early-access distribution intended for pilots, waitlists, and staged launch cohorts."
  }
] as const;

export const distributionAccessGuide = [
  {
    label: "Public",
    summary: "Immediate download path with no account gate."
  },
  {
    label: "Account",
    summary: "Requires a DoCHEng account to activate synchronized branch access."
  },
  {
    label: "Paid",
    summary: "Requires an active paid plan or entitlement for install and updates."
  },
  {
    label: "Waitlist",
    summary: "Access opens in batches as branch readiness moves toward public release."
  }
] as const;

export function getBuildsByProductSlug(slug: string) {
  return distributionBuilds.filter((build) => build.productSlug === slug);
}
