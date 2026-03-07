export type TeamRoleType = "founder" | "product" | "engineering" | "operations";
export type CredibilityStatus = "active" | "in-progress";

export type CompanyHero = {
  eyebrow: string;
  title: string;
  summary: string;
  ctaPrimary: { label: string; href: string; variant?: "ghost" };
  ctaSecondary: { label: string; href: string; variant?: "ghost" };
  ctaTertiary: { label: string; href: string; variant?: "ghost" };
};

export type CompanyMission = {
  title: string;
  summary: string;
  commitments: string[];
};

export type OperatingPrinciple = {
  title: string;
  summary: string;
  executionNote: string;
};

export type TeamProfile = {
  id: string;
  title: string;
  roleType: TeamRoleType;
  remit: string;
  responsibilities: string[];
  collaborationPoint: string;
};

export type CredibilitySignal = {
  title: string;
  summary: string;
  evidence: string;
  status: CredibilityStatus;
  routeLabel: string;
  routeHref: string;
};

export type CompanyTimelinePhase = {
  id: string;
  phase: string;
  title: string;
  summary: string;
  focusAreas: string[];
  routeHref: string;
};

export const companyHero: CompanyHero = {
  eyebrow: "Parent Brand",
  title: "DoCHEng is a founder-led ecosystem company built for technical execution.",
  summary:
    "We build and govern a connected product ecosystem where engineering work, learning, and career progression can operate under one disciplined parent platform.",
  ctaPrimary: { label: "Explore Product Branches", href: "/products" },
  ctaSecondary: { label: "View Ecosystem Architecture", href: "/ecosystem", variant: "ghost" as const },
  ctaTertiary: { label: "Open Support Layer", href: "/support", variant: "ghost" as const }
} as const;

export const companyMission: CompanyMission = {
  title: "Mission",
  summary:
    "Deliver a reliable, premium ecosystem where specialized products stay coherent through one operating philosophy, one trust standard, and one parent-brand direction.",
  commitments: [
    "Build products that improve practical outcomes for technical users, not vanity metrics.",
    "Keep ecosystem growth structured through typed systems, clear IA, and staged capability rollout.",
    "Maintain transparent communication through roadmap and changelog layers instead of hype cycles."
  ]
};

export const operatingPrinciples: OperatingPrinciple[] = [
  {
    title: "System-first product design",
    summary: "Each branch is specialized, but all branches must fit one coherent parent platform.",
    executionNote: "Architecture and routing decisions prioritize ecosystem continuity over isolated wins."
  },
  {
    title: "Credible engineering over noise",
    summary: "We prefer clear capability statements, typed models, and tested behavior over inflated claims.",
    executionNote: "Roadmap and release updates are explicitly staged as shipped, in-progress, or planned."
  },
  {
    title: "Support as product quality",
    summary: "Support, documentation, and access workflows are treated as core product layers.",
    executionNote: "User pathways connect products, pricing, account, docs, and escalation in one support fabric."
  },
  {
    title: "Calm premium clarity",
    summary: "DoCHEng interfaces should communicate seriousness through precision, readability, and composure.",
    executionNote: "Design follows tokenized surfaces, measured hierarchy, and consistent responsive behavior."
  }
];

export const teamStructure: TeamProfile[] = [
  {
    id: "founder-office",
    title: "Founder Office",
    roleType: "founder",
    remit: "Own parent-brand direction, ecosystem strategy, and long-horizon operating standards.",
    responsibilities: [
      "Set mission boundaries and branch expansion priorities.",
      "Approve roadmap maturity phases and strategic sequencing.",
      "Protect trust posture across public positioning and delivery communication."
    ],
    collaborationPoint: "Works across product, engineering, and operations to keep branch decisions ecosystem-aligned."
  },
  {
    id: "product-systems",
    title: "Product Systems",
    roleType: "product",
    remit: "Translate strategy into usable branch workflows and coherent cross-route user journeys.",
    responsibilities: [
      "Define product, pricing, docs, and support pathway integration.",
      "Maintain clarity in IA, copy systems, and decision flows.",
      "Ensure each release improves practical execution quality."
    ],
    collaborationPoint: "Partners with engineering and operations on delivery priorities and rollout sequencing."
  },
  {
    id: "platform-engineering",
    title: "Platform Engineering",
    roleType: "engineering",
    remit: "Build and maintain the typed foundations that connect branches into one platform.",
    responsibilities: [
      "Maintain shared data models, reusable component patterns, and route integrity.",
      "Preserve quality with lint, type safety, and test discipline.",
      "Support platform evolution across web, desktop, and Android pathways."
    ],
    collaborationPoint: "Works with product systems to ensure architecture supports roadmap and support commitments."
  },
  {
    id: "operations-support",
    title: "Operations and Support",
    roleType: "operations",
    remit: "Run contact, support routing, docs quality, and release communication standards.",
    responsibilities: [
      "Triage support pathways across product, pricing, account, and business lanes.",
      "Maintain documentation quality and discoverability.",
      "Coordinate changelog communication with roadmap and release context."
    ],
    collaborationPoint: "Feeds recurring user issues back into product and engineering planning cycles."
  }
];

export const credibilitySignals: CredibilitySignal[] = [
  {
    title: "Typed ecosystem architecture",
    summary: "Core product, pricing, support, roadmap, docs, and changelog layers are modeled with typed content structures.",
    evidence: "Data-driven rendering patterns are used across major parent-platform routes.",
    status: "active",
    routeLabel: "Inspect Architecture",
    routeHref: "/ecosystem"
  },
  {
    title: "Transparent delivery communication",
    summary: "Roadmap and changelog communicate direction and release state without fabricated promises.",
    evidence: "Updates are categorized by shipped, in-progress, and planned states with route-level context.",
    status: "active",
    routeLabel: "View Changelog",
    routeHref: "/changelog"
  },
  {
    title: "Integrated support and documentation",
    summary: "Support lanes and docs hub are connected to product, pricing, and account pathways for faster issue resolution.",
    evidence: "Support categories, contact pathways, and docs taxonomy are centralized and scalable.",
    status: "active",
    routeLabel: "Open Support",
    routeHref: "/support"
  },
  {
    title: "Cross-platform branch governance",
    summary: "Distribution and access layers are structured for desktop and Android branch delivery under one parent standard.",
    evidence: "Downloads, branch access rules, and account pathways are aligned through centralized content models.",
    status: "in-progress",
    routeLabel: "Review Roadmap",
    routeHref: "/roadmap"
  }
];

export const companyTimeline: CompanyTimelinePhase[] = [
  {
    id: "phase-foundation",
    phase: "Phase 01",
    title: "Platform foundation",
    summary: "Establish the parent ecosystem shell, branch mapping, and core route architecture.",
    focusAreas: ["Parent brand architecture", "Initial branch structure", "Core pricing and distribution layers"],
    routeHref: "/ecosystem"
  },
  {
    id: "phase-trust-layers",
    phase: "Phase 02",
    title: "Trust and operations layers",
    summary: "Expand support, documentation, and account pathways to improve ecosystem reliability.",
    focusAreas: ["Support and contact system", "Documentation hub", "Account and access flows"],
    routeHref: "/support"
  },
  {
    id: "phase-strategic-scale",
    phase: "Phase 03",
    title: "Strategic ecosystem scale",
    summary: "Mature roadmap and release communication while scaling branch capability depth.",
    focusAreas: ["Roadmap phase clarity", "Release/changelog communication", "Branch maturity sequencing"],
    routeHref: "/roadmap"
  }
];
