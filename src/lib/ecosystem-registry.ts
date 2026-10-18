export type EcosystemEntryType = "workspace-project" | "ecosystem-app";

export type EcosystemRole =
  | "parent"
  | "product"
  | "experimental"
  | "legacy"
  | "sibling"
  | "support-project";

export type EcosystemLifecycle =
  "active" | "planned" | "deprecated" | "replacing" | "internal";

export type EcosystemGeneration = "v1" | "v2" | "successor" | "unknown";

export type DeploymentTarget =
  "parent-domain" | "subdomain" | "desktop" | "android" | "hybrid";

export type IntegrationLevel =
  "linked-only" | "metadata-shared" | "package-shared" | "workspace-native";

export type EcosystemVisibility = "public" | "hidden" | "internal-only";

export type EcosystemCategory =
  "platform" | "productivity" | "career" | "student" | "research" | "adjacent";

export type EcosystemStatus =
  | "live"
  | "beta"
  | "early-access"
  | "planned"
  | "coming-soon"
  | "internal"
  | "unknown";

export type EcosystemAccessType = "web" | "desktop" | "android" | "hybrid";

export type EcosystemPlatform = "web" | "desktop" | "android";

export type EcosystemPricingModel =
  | "free"
  | "free-trial"
  | "one-time"
  | "monthly"
  | "annual"
  | "tiered"
  | "hybrid"
  | "tbd";

export type EcosystemCurrentPathType =
  | "sibling-folder"
  | "workspace-app"
  | "workspace-package"
  | "external-repo"
  | "url-only"
  | "unknown";

export type EcosystemMaturity =
  | "experimental"
  | "prototype"
  | "beta"
  | "growth"
  | "production"
  | "legacy"
  | "unknown";

export type EcosystemDistributionStatus =
  "available" | "limited" | "coming-soon";

export type EcosystemReleaseChannel = "stable" | "beta" | "preview";

export type EcosystemDistributionAccess =
  "public" | "account" | "paid" | "waitlist";

export type EcosystemDistribution = {
  platform: EcosystemPlatform;
  releaseChannel: EcosystemReleaseChannel;
  status: EcosystemDistributionStatus;
  accessRequirement: EcosystemDistributionAccess;
  version?: string;
  installer?: string;
  notes?: string[];
};

export type EcosystemRegistryEntry = {
  id: string;
  entryType: EcosystemEntryType;
  name: string;
  folderName?: string;
  slug: string;
  description: string;
  category: EcosystemCategory;
  role: EcosystemRole;
  lifecycle: EcosystemLifecycle;
  generation: EcosystemGeneration;
  status: EcosystemStatus;
  visibility: EcosystemVisibility;
  audience?: string;
  maturity: EcosystemMaturity;
  intendedSubdomain?: string;
  parentDomain?: string;
  currentPathType: EcosystemCurrentPathType;
  currentRelativePath?: string;
  currentRoute?: string;
  placeholderRoute?: string;
  currentUrl?: string;
  futureUrl?: string;
  accessTypes: EcosystemAccessType[];
  platforms: EcosystemPlatform[];
  deploymentTarget: DeploymentTarget[];
  pricingModel?: EcosystemPricingModel;
  pricingHref?: string;
  supportHref?: string;
  docsHref?: string;
  changelogHref?: string;
  roadmapHref?: string;
  downloadHref?: string;
  relatedProjects: string[];
  successorTo?: string;
  replaces?: string[];
  integrationLevel: IntegrationLevel;
  notes?: string[];
  featured?: boolean;
  iconKey?: "desk" | "resume" | "compass" | "research" | "labs" | "platform";
  sortOrder?: number;
  launchState?: "public" | "invite-only" | "waitlist" | "internal";
  distributions?: EcosystemDistribution[];
  capabilities?: string[];
  tags?: string[];
  verifiedWeb?: {
    url: string;
    checkedAt: string;
    scope: "login-page" | "public-interface";
  };
};

const registrySeed: EcosystemRegistryEntry[] = [
  {
    id: "app-parent-platform",
    entryType: "ecosystem-app",
    name: "DoCHEng Parent Platform",
    slug: "parent-platform",
    description:
      "Canonical ecosystem parent layer for discovery, trust, and orchestration.",
    category: "platform",
    role: "parent",
    lifecycle: "active",
    generation: "v2",
    status: "live",
    visibility: "public",
    audience: "All DoCHEng users and partners",
    maturity: "production",
    intendedSubdomain: "www.docheng.co.za",
    parentDomain: "docheng.co.za",
    currentPathType: "sibling-folder",
    currentRoute: "/",
    currentUrl: "https://www.docheng.co.za",
    accessTypes: ["web"],
    platforms: ["web"],
    deploymentTarget: ["parent-domain"],
    pricingModel: "free",
    pricingHref: "/pricing",
    supportHref: "/support",
    docsHref: "/docs",
    changelogHref: "/changelog",
    roadmapHref: "/roadmap",
    downloadHref: "/downloads",
    relatedProjects: [],
    integrationLevel: "metadata-shared",
    featured: true,
    iconKey: "platform",
    sortOrder: 1,
    launchState: "public",
    capabilities: ["ecosystem-discovery", "routing", "release-communication"],
    tags: ["parent", "platform", "canonical"],
    distributions: [],
  },
  {
    id: "app-desk",
    entryType: "ecosystem-app",
    name: "DoCHEng Desk",
    slug: "desk",
    description:
      "Engineering-focused workspace for deep execution and structured technical work.",
    category: "productivity",
    role: "product",
    lifecycle: "active",
    generation: "v2",
    status: "beta",
    visibility: "public",
    audience: "Engineering students, technical professionals, founders",
    maturity: "growth",
    intendedSubdomain: "docheng-desk2.vercel.app",
    parentDomain: "docheng.co.za",
    currentPathType: "sibling-folder",
    currentRoute: "/products/desk",
    currentUrl: "https://docheng-desk2.vercel.app/login",
    accessTypes: ["web"],
    platforms: ["web"],
    deploymentTarget: ["subdomain", "desktop", "android", "hybrid"],
    pricingModel: "tiered",
    pricingHref: "/pricing#desk",
    supportHref: "/support#product",
    docsHref: "/docs",
    changelogHref: "/changelog",
    roadmapHref: "/roadmap",
    downloadHref: "/downloads",
    relatedProjects: [],
    integrationLevel: "metadata-shared",
    featured: true,
    iconKey: "desk",
    sortOrder: 10,
    launchState: "public",
    distributions: [],
    capabilities: ["workspace", "knowledge-management", "technical-execution"],
    tags: ["core", "productivity", "engineering"],
    verifiedWeb: {
      url: "https://docheng-desk2.vercel.app/login",
      checkedAt: "2026-10-18",
      scope: "login-page",
    },
  },
  {
    id: "app-resume",
    entryType: "ecosystem-app",
    name: "DoCHEng Resume",
    slug: "resume",
    description:
      "Career intelligence for CV parsing, role alignment, and profile strategy.",
    category: "career",
    role: "product",
    lifecycle: "active",
    generation: "successor",
    status: "beta",
    visibility: "public",
    audience: "Graduates, professionals, recruiters",
    maturity: "beta",
    intendedSubdomain: "resume.docheng.co.za",
    parentDomain: "docheng.co.za",
    currentPathType: "sibling-folder",
    currentRoute: "/products/resume",
    currentUrl: "https://resume.docheng.co.za/resume-scanner/",
    accessTypes: ["web"],
    platforms: ["web"],
    deploymentTarget: ["subdomain", "desktop", "android", "hybrid"],
    pricingModel: "one-time",
    pricingHref: "/pricing#resume",
    supportHref: "/support#product",
    docsHref: "/docs",
    changelogHref: "/changelog",
    roadmapHref: "/roadmap",
    downloadHref: "/downloads",
    relatedProjects: [],
    integrationLevel: "metadata-shared",
    featured: true,
    iconKey: "resume",
    sortOrder: 20,
    launchState: "public",
    distributions: [],
    capabilities: ["resume-parsing", "role-fit-analysis", "career-guidance"],
    tags: ["career", "beta", "intelligence"],
    verifiedWeb: {
      url: "https://resume.docheng.co.za/resume-scanner/",
      checkedAt: "2026-10-18",
      scope: "public-interface",
    },
  },
  {
    id: "app-compass",
    entryType: "ecosystem-app",
    name: "DoCHEng Compass",
    slug: "compass",
    description:
      "Academic planning for STEM pathways, requirements, and progression decisions.",
    category: "student",
    role: "product",
    lifecycle: "planned",
    generation: "successor",
    status: "coming-soon",
    visibility: "public",
    audience: "STEM students, advisors, parents",
    maturity: "prototype",
    parentDomain: "docheng.co.za",
    currentPathType: "workspace-app",
    currentRoute: "/products/compass",
    accessTypes: ["web"],
    platforms: ["web"],
    deploymentTarget: ["subdomain", "desktop", "android", "hybrid"],
    pricingModel: "monthly",
    pricingHref: "/pricing#compass",
    supportHref: "/support#business-pathway",
    docsHref: "/docs",
    changelogHref: "/changelog",
    roadmapHref: "/roadmap",
    downloadHref: "/downloads",
    relatedProjects: [],
    integrationLevel: "metadata-shared",
    featured: false,
    iconKey: "compass",
    sortOrder: 30,
    launchState: "waitlist",
    distributions: [],
    capabilities: [
      "program-planning",
      "requirements-tracking",
      "pathway-guidance",
    ],
    tags: ["student", "planning", "coming-soon"],
  },
];

// Release claims are evidence-gated. Intended subdomains are never launch evidence.
export const ecosystemRegistry: EcosystemRegistryEntry[] = registrySeed.map(
  (entry) => {
    if (entry.entryType !== "ecosystem-app") return entry;
    if (entry.role === "parent")
      return {
        ...entry,
        currentUrl: "https://www.docheng.co.za",
        futureUrl: undefined,
      };
    const verified: Record<
      string,
      NonNullable<EcosystemRegistryEntry["verifiedWeb"]>
    > = {
      desk: {
        url: "https://docheng-desk2.vercel.app/login",
        checkedAt: "2026-10-18",
        scope: "login-page",
      },
      resume: {
        url: "https://resume.docheng.co.za/resume-scanner/",
        checkedAt: "2026-10-18",
        scope: "public-interface",
      },
    };
    const evidence = verified[entry.slug];
    return {
      ...entry,
      status: evidence ? "beta" : entry.status,
      currentUrl: evidence?.url,
      futureUrl: undefined,
      intendedSubdomain: evidence ? new URL(evidence.url).hostname : undefined,
      verifiedWeb: evidence,
      accessTypes: ["web"],
      platforms: ["web"],
      distributions: [],
      downloadHref: "/downloads",
      launchState: evidence ? "public" : entry.launchState,
    };
  },
);

export function getRegistryEntries() {
  return [...ecosystemRegistry];
}

export function getWorkspaceProjects() {
  return ecosystemRegistry.filter(
    (entry) => entry.entryType === "workspace-project",
  );
}

export function getEcosystemApps() {
  return ecosystemRegistry
    .filter(
      (
        entry,
      ): entry is EcosystemRegistryEntry & { entryType: "ecosystem-app" } =>
        entry.entryType === "ecosystem-app",
    )
    .sort(
      (a, b) =>
        (a.sortOrder ?? Number.MAX_SAFE_INTEGER) -
        (b.sortOrder ?? Number.MAX_SAFE_INTEGER),
    );
}

export function getPublicApps() {
  return getEcosystemApps().filter(
    (entry) =>
      entry.visibility === "public" &&
      entry.status !== "internal" &&
      entry.lifecycle !== "internal",
  );
}

export function getCoreDochengApps() {
  return getPublicApps().filter(
    (entry) => entry.featured || entry.role === "parent",
  );
}

export function getExperimentalApps() {
  return getEcosystemApps().filter(
    (entry) =>
      entry.role === "experimental" || entry.maturity === "experimental",
  );
}

export function getAppsByDeploymentTarget(target: DeploymentTarget) {
  return getEcosystemApps().filter((entry) =>
    entry.deploymentTarget.includes(target),
  );
}

export function getAppsForLauncher() {
  return getPublicApps().filter((entry) => entry.role !== "parent");
}

export function getAppsByIntegrationLevel(level: IntegrationLevel) {
  return getEcosystemApps().filter((entry) => entry.integrationLevel === level);
}

export function getProjectsByIntegrationLevel(level: IntegrationLevel) {
  return getWorkspaceProjects().filter(
    (entry) => entry.integrationLevel === level,
  );
}

export function getEcosystemNodeBySlug(slug: string) {
  return ecosystemRegistry.find((entry) => entry.slug === slug);
}

export type EcosystemDiagnostics = {
  totals: {
    registryEntries: number;
    workspaceProjects: number;
    appEntries: number;
    publicApps: number;
    launchableApps: number;
    byIntegrationLevel: Record<IntegrationLevel, number>;
  };
  warnings: string[];
};

export function getEcosystemDiagnostics(): EcosystemDiagnostics {
  const byIntegrationLevel: Record<IntegrationLevel, number> = {
    "linked-only": 0,
    "metadata-shared": 0,
    "package-shared": 0,
    "workspace-native": 0,
  };

  const warnings: string[] = [];

  ecosystemRegistry.forEach((entry) => {
    byIntegrationLevel[entry.integrationLevel] += 1;

    if (
      entry.entryType === "ecosystem-app" &&
      entry.visibility === "public" &&
      !entry.currentUrl &&
      !entry.futureUrl
    ) {
      warnings.push(
        `${entry.slug}: public app is missing currentUrl/futureUrl linkage.`,
      );
    }

    if (entry.entryType === "workspace-project" && !entry.currentRelativePath) {
      warnings.push(
        `${entry.slug}: workspace project is missing currentRelativePath.`,
      );
    }

    if (!entry.relatedProjects.length) {
      warnings.push(
        `${entry.slug}: relatedProjects is empty; add at least one relation for traceability.`,
      );
    }
  });

  return {
    totals: {
      registryEntries: ecosystemRegistry.length,
      workspaceProjects: getWorkspaceProjects().length,
      appEntries: getEcosystemApps().length,
      publicApps: getPublicApps().length,
      launchableApps: getAppsForLauncher().length,
      byIntegrationLevel,
    },
    warnings,
  };
}
