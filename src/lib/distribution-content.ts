import type { Platform } from "@/lib/site-content";

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

// Installers are published only after byte-level verification.
export const distributionBuilds: DistributionBuild[] = [];

export const distributionOverviewBullets = [
  "Downloads are branch-specific: every product has its own version cadence, status, and access gate.",
  "Desktop and Android are coordinated at the ecosystem level while each branch controls release maturity.",
  "Access can be public, account-based, paid-plan gated, or waitlist-only depending on branch stage.",
] as const;

export const releaseChannelNotes = [
  {
    channel: "stable",
    title: "Stable",
    summary:
      "Production-ready builds for routine execution with the strongest reliability target.",
  },
  {
    channel: "beta",
    title: "Beta",
    summary:
      "Feature-complete builds still gathering feedback from active users and power teams.",
  },
  {
    channel: "preview",
    title: "Preview",
    summary:
      "Early-access distribution intended for pilots, waitlists, and staged launch cohorts.",
  },
] as const;

export const distributionAccessGuide = [
  {
    label: "Public",
    summary: "Immediate download path with no account gate.",
  },
  {
    label: "Account",
    summary:
      "Requires a DoCHEng account to activate synchronized branch access.",
  },
  {
    label: "Paid",
    summary:
      "Requires an active paid plan or entitlement for install and updates.",
  },
  {
    label: "Waitlist",
    summary:
      "Access opens in batches as branch readiness moves toward public release.",
  },
] as const;

export function getBuildsByProductSlug(slug: string) {
  return distributionBuilds.filter((build) => build.productSlug === slug);
}
