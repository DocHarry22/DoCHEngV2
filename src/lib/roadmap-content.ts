export type RoadmapPhaseId = "now" | "next" | "later";
export type RoadmapStatus = "in-progress" | "planned" | "vision";
export type RoadmapTrack = "product" | "platform" | "distribution" | "access" | "support" | "ecosystem";

export type RoadmapPhase = {
  id: RoadmapPhaseId;
  label: string;
  horizon: string;
  summary: string;
};

export type RoadmapItem = {
  id: string;
  title: string;
  phase: RoadmapPhaseId;
  summary: string;
  status: RoadmapStatus;
  productScope: string;
  platformScope: string;
  audience: string;
  track: RoadmapTrack;
  priority: number;
  ctaLabel: string;
  ctaHref: string;
};

export type VisionPillar = {
  title: string;
  summary: string;
};

export type EvolutionArea = {
  title: string;
  summary: string;
  scope: string;
  status: RoadmapStatus;
};

export const roadmapPhases: RoadmapPhase[] = [
  {
    id: "now",
    label: "Foundation",
    horizon: "Now",
    summary: "Strengthen current product branches, stabilize cross-platform flows, and improve trust-critical support surfaces."
  },
  {
    id: "next",
    label: "Expansion",
    horizon: "Next",
    summary: "Extend DoCHEng branch depth and add tighter ecosystem links across account, distribution, and product intelligence."
  },
  {
    id: "later",
    label: "Ecosystem Scale",
    horizon: "Later",
    summary: "Evolve the parent platform into a coordinated operating system for technical work, learning, and career progression."
  }
] as const;

export const roadmapVisionPillars: VisionPillar[] = [
  {
    title: "One parent strategy across many product branches",
    summary: "DoCHEng exists to align specialized products under one durable product language, support model, and trust standard."
  },
  {
    title: "Integrated execution, not isolated tools",
    summary: "The roadmap emphasizes continuity between products so users can move from study to work and from planning to delivery without context loss."
  },
  {
    title: "Credible ambition with staged delivery",
    summary: "Roadmap phases communicate direction without fake launch promises. Each step is framed as capability maturity, not hype."
  }
] as const;

export const roadmapItems: RoadmapItem[] = [
  {
    id: "desk-runtime-depth",
    title: "Deepen Desk runtime reliability and workflow depth",
    phase: "now",
    summary: "Improve core branch consistency for document-heavy engineering execution and daily technical operations.",
    status: "in-progress",
    productScope: "DoCHEng Desk",
    platformScope: "Desktop + Android",
    audience: "Engineering operators and technical teams",
    track: "product",
    priority: 1,
    ctaLabel: "Open Desk Branch",
    ctaHref: "/products/desk"
  },
  {
    id: "resume-beta-hardening",
    title: "Harden Resume branch from beta into production confidence",
    phase: "now",
    summary: "Refine role-fit intelligence, profile workflows, and release confidence for technical career pathways.",
    status: "in-progress",
    productScope: "DoCHEng Resume",
    platformScope: "Desktop + Android",
    audience: "Graduates and technical professionals",
    track: "product",
    priority: 2,
    ctaLabel: "View Resume Branch",
    ctaHref: "/products/resume"
  },
  {
    id: "distribution-clarity",
    title: "Expand distribution clarity across channels",
    phase: "now",
    summary: "Mature build visibility, release channel communication, and installation guidance through one parent downloads layer.",
    status: "in-progress",
    productScope: "All active branches",
    platformScope: "Desktop + Android",
    audience: "New and returning users",
    track: "distribution",
    priority: 3,
    ctaLabel: "Open Downloads",
    ctaHref: "/downloads"
  },
  {
    id: "compass-launch-track",
    title: "Bring Compass from planned branch to structured launch track",
    phase: "next",
    summary: "Advance academic planning workflows from waitlist positioning toward staged real-world rollout.",
    status: "planned",
    productScope: "DoCHEng Compass",
    platformScope: "Desktop + Android",
    audience: "STEM learners, advisors, and institutions",
    track: "product",
    priority: 1,
    ctaLabel: "View Compass Branch",
    ctaHref: "/products/compass"
  },
  {
    id: "account-entitlements",
    title: "Unify account and entitlement logic across branches",
    phase: "next",
    summary: "Strengthen account pathways so branch access, pricing entitlements, and support context stay coherent at ecosystem level.",
    status: "planned",
    productScope: "Parent platform + all product branches",
    platformScope: "Web + Desktop + Android",
    audience: "Individual and team customers",
    track: "access",
    priority: 2,
    ctaLabel: "Review Access Support",
    ctaHref: "/support#pricing-access"
  },
  {
    id: "support-routing-intelligence",
    title: "Increase support routing intelligence and resolution speed",
    phase: "next",
    summary: "Improve structured inquiry pathways linking product, billing, and business support without repeated user context.",
    status: "planned",
    productScope: "Support layer",
    platformScope: "Web support center",
    audience: "All customer segments",
    track: "support",
    priority: 3,
    ctaLabel: "Open Support Center",
    ctaHref: "/support"
  },
  {
    id: "ecosystem-intelligence-fabric",
    title: "Build a shared intelligence fabric across branch experiences",
    phase: "later",
    summary: "Advance connected patterns so product branches can exchange meaningful context while preserving branch-specific workflows.",
    status: "vision",
    productScope: "Desk, Resume, Compass, future branches",
    platformScope: "Web + Desktop + Android + future runtimes",
    audience: "Long-term ecosystem users",
    track: "ecosystem",
    priority: 1,
    ctaLabel: "Open Architecture",
    ctaHref: "/ecosystem"
  },
  {
    id: "documentation-system-maturity",
    title: "Expand documentation into a full product operations knowledge layer",
    phase: "later",
    summary: "Evolve docs from static guidance into a strategic system for onboarding, implementation, and branch expansion readiness.",
    status: "vision",
    productScope: "Parent documentation layer",
    platformScope: "Web documentation",
    audience: "Users, teams, and partners",
    track: "platform",
    priority: 2,
    ctaLabel: "Open Documentation",
    ctaHref: "/docs"
  },
  {
    id: "partner-expansion-track",
    title: "Enable partner and institutional ecosystem pathways",
    phase: "later",
    summary: "Formalize strategic partnership routes for organizations needing branch-level deployment and support alignment.",
    status: "vision",
    productScope: "Parent brand and branch ecosystem",
    platformScope: "Web + account + support flows",
    audience: "Institutions and enterprise partners",
    track: "ecosystem",
    priority: 3,
    ctaLabel: "Contact Support",
    ctaHref: "/support#business-pathway"
  }
] as const;

export const productPlatformEvolutionAreas: EvolutionArea[] = [
  {
    title: "Product branch depth",
    summary: "Each branch matures feature depth according to its execution context while preserving one ecosystem language.",
    scope: "Desk, Resume, Compass, future branches",
    status: "planned"
  },
  {
    title: "Platform continuity",
    summary: "Desktop, Android, and web experiences are progressively aligned so users can transition channels without friction.",
    scope: "Web + Desktop + Android",
    status: "planned"
  },
  {
    title: "Future modular additions",
    summary: "New modules can be introduced through parent-domain governance without fragmenting brand clarity.",
    scope: "Parent platform architecture",
    status: "vision"
  }
] as const;

export const futureSystemGrowthAreas: EvolutionArea[] = [
  {
    title: "Access and account maturity",
    summary: "Improve authentication, entitlement mapping, and account controls to reduce onboarding friction across branches.",
    scope: "Sign-in, account, and branch gating",
    status: "planned"
  },
  {
    title: "Distribution lifecycle control",
    summary: "Increase visibility for release channels, compatibility, and updates through a cleaner parent distribution system.",
    scope: "Downloads and release signaling",
    status: "in-progress"
  },
  {
    title: "Support and trust operations",
    summary: "Strengthen issue routing, response expectation clarity, and business inquiry pathways.",
    scope: "Support and contact layer",
    status: "planned"
  },
  {
    title: "Documentation and implementation confidence",
    summary: "Expand docs for setup, workflows, and scaling guidance so ecosystem adoption becomes predictable.",
    scope: "Documentation and onboarding",
    status: "vision"
  }
] as const;

export function getRoadmapItemsByPhase(phase: RoadmapPhaseId) {
  return roadmapItems
    .filter((item) => item.phase === phase)
    .sort((a, b) => a.priority - b.priority);
}
