export type EcosystemEntryType = "workspace-project" | "ecosystem-app";

export type EcosystemRole =
  | "parent"
  | "product"
  | "experimental"
  | "legacy"
  | "sibling"
  | "support-project";

export type EcosystemLifecycle =
  | "active"
  | "planned"
  | "deprecated"
  | "replacing"
  | "internal";

export type EcosystemGeneration = "v1" | "v2" | "successor" | "unknown";

export type DeploymentTarget =
  | "parent-domain"
  | "subdomain"
  | "desktop"
  | "android"
  | "hybrid";

export type IntegrationLevel =
  | "linked-only"
  | "metadata-shared"
  | "package-shared"
  | "workspace-native";

export type EcosystemVisibility = "public" | "hidden" | "internal-only";

export type EcosystemCategory =
  | "platform"
  | "productivity"
  | "career"
  | "student"
  | "research"
  | "adjacent";

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

export type EcosystemDistributionStatus = "available" | "limited" | "coming-soon";

export type EcosystemReleaseChannel = "stable" | "beta" | "preview";

export type EcosystemDistributionAccess = "public" | "account" | "paid" | "waitlist";

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
};

const parentDomain = "docheng.co.za";

export const ecosystemRegistry: EcosystemRegistryEntry[] = [
  {
    id: "project-docheng-v2",
    entryType: "workspace-project",
    name: "DoCHEngV2",
    folderName: "DoCHEngV2",
    slug: "docheng-v2",
    description: "Current parent platform implementation and ecosystem integration layer.",
    category: "platform",
    role: "parent",
    lifecycle: "active",
    generation: "v2",
    status: "live",
    visibility: "public",
    audience: "All DoCHEng ecosystem users",
    maturity: "production",
    intendedSubdomain: "www.docheng.co.za",
    parentDomain,
    currentPathType: "sibling-folder",
    currentRelativePath: "../DoCHEngV2",
    currentRoute: "/",
    currentUrl: "https://docheng.co.za",
    futureUrl: "https://docheng.co.za",
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
    relatedProjects: ["project-docheng", "project-docheng-desk", "project-docheng-desk2", "project-resume-parser"],
    integrationLevel: "metadata-shared",
    notes: [
      "Acts as the canonical parent platform for ecosystem discovery.",
      "Consumes shared registry metadata while sibling folders remain independent."
    ]
  },
  {
    id: "project-docheng",
    entryType: "workspace-project",
    name: "DoCHEng",
    folderName: "docheng",
    slug: "docheng",
    description: "Legacy/previous parent implementation retained as a sibling codebase.",
    category: "platform",
    role: "legacy",
    lifecycle: "active",
    generation: "v1",
    status: "unknown",
    visibility: "hidden",
    audience: "Internal maintainers",
    maturity: "legacy",
    parentDomain,
    currentPathType: "sibling-folder",
    currentRelativePath: "../docheng",
    currentRoute: "/legacy",
    accessTypes: ["web"],
    platforms: ["web"],
    deploymentTarget: ["parent-domain"],
    relatedProjects: ["project-docheng-v2"],
    integrationLevel: "linked-only",
    notes: [
      "Kept for reference and selective migration.",
      "Not treated as the canonical parent runtime."
    ]
  },
  {
    id: "project-docheng-desk",
    entryType: "workspace-project",
    name: "DoCHEng Desk Workspace v1",
    folderName: "docheng_desk",
    slug: "docheng-desk-v1",
    description: "Existing Desk-oriented product workspace (generation v1).",
    category: "productivity",
    role: "product",
    lifecycle: "active",
    generation: "v1",
    status: "beta",
    visibility: "hidden",
    audience: "Internal teams and pilot users",
    maturity: "growth",
    intendedSubdomain: "desk.docheng.co.za",
    parentDomain,
    currentPathType: "sibling-folder",
    currentRelativePath: "../docheng_desk",
    currentRoute: "/products/desk",
    placeholderRoute: "/apps",
    accessTypes: ["web", "desktop", "android", "hybrid"],
    platforms: ["web", "desktop", "android"],
    deploymentTarget: ["subdomain", "desktop", "android", "hybrid"],
    relatedProjects: ["project-docheng-v2", "project-docheng-desk2"],
    integrationLevel: "linked-only",
    notes: [
      "Kept active while newer Desk generation evolves.",
      "Do not auto-replace without release readiness review."
    ]
  },
  {
    id: "project-docheng-desk2",
    entryType: "workspace-project",
    name: "DoCHEng Desk Workspace v2",
    folderName: "docheng_desk2",
    slug: "docheng-desk-v2",
    description: "Newer Desk generation candidate with expanded runtime and tests.",
    category: "productivity",
    role: "product",
    lifecycle: "replacing",
    generation: "v2",
    status: "beta",
    visibility: "hidden",
    audience: "Internal teams and pilot cohorts",
    maturity: "beta",
    intendedSubdomain: "desk.docheng.co.za",
    parentDomain,
    currentPathType: "sibling-folder",
    currentRelativePath: "../docheng_desk2",
    currentRoute: "/products/desk",
    placeholderRoute: "/apps",
    accessTypes: ["web", "desktop", "android", "hybrid"],
    platforms: ["web", "desktop", "android"],
    deploymentTarget: ["subdomain", "desktop", "android", "hybrid"],
    relatedProjects: ["project-docheng-v2", "project-docheng-desk"],
    successorTo: "project-docheng-desk",
    replaces: ["project-docheng-desk"],
    integrationLevel: "linked-only",
    notes: [
      "Classified as replacing candidate, not a forced replacement.",
      "Promotion depends on product readiness and migration checks."
    ]
  },
  {
    id: "project-resume-parser",
    entryType: "workspace-project",
    name: "Resume Parser Service",
    folderName: "resume_parser",
    slug: "resume-parser-service",
    description: "Dedicated resume parsing and analysis service codebase.",
    category: "career",
    role: "product",
    lifecycle: "active",
    generation: "unknown",
    status: "beta",
    visibility: "hidden",
    audience: "Career-focused users and hiring workflows",
    maturity: "beta",
    intendedSubdomain: "resume.docheng.co.za",
    parentDomain,
    currentPathType: "sibling-folder",
    currentRelativePath: "../resume_parser",
    currentRoute: "/products/resume",
    placeholderRoute: "/apps",
    accessTypes: ["web", "desktop", "hybrid"],
    platforms: ["web", "desktop"],
    deploymentTarget: ["subdomain", "desktop", "hybrid"],
    relatedProjects: ["project-docheng-v2"],
    integrationLevel: "linked-only",
    notes: [
      "Service is integrated via metadata and launch pathways before package unification."
    ]
  },
  {
    id: "project-apologia-sancta",
    entryType: "workspace-project",
    name: "Apologia Sancta",
    folderName: "apologia_sancta",
    slug: "apologia-sancta",
    description: "Adjacent sister project currently tracked alongside DoCHEng workspaces.",
    category: "adjacent",
    role: "sibling",
    lifecycle: "active",
    generation: "unknown",
    status: "unknown",
    visibility: "hidden",
    audience: "Separate audience branch",
    maturity: "unknown",
    parentDomain,
    currentPathType: "sibling-folder",
    currentRelativePath: "../apologia_sancta",
    currentRoute: "/adjacent/apologia-sancta",
    accessTypes: ["web"],
    platforms: ["web"],
    deploymentTarget: ["parent-domain"],
    relatedProjects: ["project-docheng-v2"],
    integrationLevel: "linked-only",
    notes: [
      "Explicitly modeled as adjacent, not force-merged into public DoCHEng app launcher."
    ]
  },
  {
    id: "app-parent-platform",
    entryType: "ecosystem-app",
    name: "DoCHEng Parent Platform",
    folderName: "DoCHEngV2",
    slug: "parent-platform",
    description: "Canonical ecosystem parent layer for discovery, trust, and orchestration.",
    category: "platform",
    role: "parent",
    lifecycle: "active",
    generation: "v2",
    status: "live",
    visibility: "public",
    audience: "All DoCHEng users and partners",
    maturity: "production",
    intendedSubdomain: "www.docheng.co.za",
    parentDomain,
    currentPathType: "sibling-folder",
    currentRelativePath: "../DoCHEngV2",
    currentRoute: "/",
    currentUrl: "https://docheng.co.za",
    futureUrl: "https://docheng.co.za",
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
    relatedProjects: ["project-docheng-v2"],
    integrationLevel: "metadata-shared",
    featured: true,
    iconKey: "platform",
    sortOrder: 1,
    launchState: "public",
    capabilities: ["ecosystem-discovery", "routing", "release-communication"],
    tags: ["parent", "platform", "canonical"]
  },
  {
    id: "app-desk",
    entryType: "ecosystem-app",
    name: "DoCHEng Desk",
    folderName: "docheng_desk2",
    slug: "desk",
    description: "Engineering-focused workspace for deep execution and structured technical work.",
    category: "productivity",
    role: "product",
    lifecycle: "active",
    generation: "v2",
    status: "live",
    visibility: "public",
    audience: "Engineering students, technical professionals, founders",
    maturity: "growth",
    intendedSubdomain: "desk.docheng.co.za",
    parentDomain,
    currentPathType: "sibling-folder",
    currentRelativePath: "../docheng_desk2",
    currentRoute: "/products/desk",
    currentUrl: "https://desk.docheng.co.za",
    futureUrl: "https://desk.docheng.co.za",
    accessTypes: ["web", "desktop", "android", "hybrid"],
    platforms: ["web", "desktop", "android"],
    deploymentTarget: ["subdomain", "desktop", "android", "hybrid"],
    pricingModel: "tiered",
    pricingHref: "/pricing#desk",
    supportHref: "/support#product",
    docsHref: "/docs",
    changelogHref: "/changelog",
    roadmapHref: "/roadmap",
    downloadHref: "/downloads#desk",
    relatedProjects: ["project-docheng-desk", "project-docheng-desk2"],
    integrationLevel: "metadata-shared",
    featured: true,
    iconKey: "desk",
    sortOrder: 10,
    launchState: "public",
    distributions: [
      {
        platform: "desktop",
        releaseChannel: "stable",
        status: "available",
        accessRequirement: "account",
        version: "v2.4.1",
        installer: "Windows installer (.msi)",
        notes: ["Recommended for deep engineering sessions.", "Account unlocks sync and branch continuity."]
      },
      {
        platform: "android",
        releaseChannel: "stable",
        status: "available",
        accessRequirement: "account",
        version: "v2.4.1-a",
        installer: "Android package (managed rollout)",
        notes: ["Optimized for mobile capture and quick technical actions."]
      }
    ],
    capabilities: ["workspace", "knowledge-management", "technical-execution"],
    tags: ["core", "productivity", "engineering"]
  },
  {
    id: "app-resume",
    entryType: "ecosystem-app",
    name: "DoCHEng Resume",
    folderName: "resume_parser",
    slug: "resume",
    description: "Career intelligence for CV parsing, role alignment, and profile strategy.",
    category: "career",
    role: "product",
    lifecycle: "active",
    generation: "successor",
    status: "beta",
    visibility: "public",
    audience: "Graduates, professionals, recruiters",
    maturity: "beta",
    intendedSubdomain: "resume.docheng.co.za",
    parentDomain,
    currentPathType: "sibling-folder",
    currentRelativePath: "../resume_parser",
    currentRoute: "/products/resume",
    currentUrl: "https://resume.docheng.co.za",
    futureUrl: "https://resume.docheng.co.za",
    accessTypes: ["web", "desktop", "android", "hybrid"],
    platforms: ["web", "desktop", "android"],
    deploymentTarget: ["subdomain", "desktop", "android", "hybrid"],
    pricingModel: "one-time",
    pricingHref: "/pricing#resume",
    supportHref: "/support#product",
    docsHref: "/docs",
    changelogHref: "/changelog",
    roadmapHref: "/roadmap",
    downloadHref: "/downloads#resume",
    relatedProjects: ["project-resume-parser", "project-docheng-v2"],
    integrationLevel: "metadata-shared",
    featured: true,
    iconKey: "resume",
    sortOrder: 20,
    launchState: "invite-only",
    distributions: [
      {
        platform: "desktop",
        releaseChannel: "beta",
        status: "limited",
        accessRequirement: "paid",
        version: "v1.6.0",
        installer: "Windows installer (.exe)",
        notes: ["Beta access is prioritized for paid users."]
      },
      {
        platform: "android",
        releaseChannel: "preview",
        status: "limited",
        accessRequirement: "paid",
        version: "v1.6.0-a",
        installer: "Android beta track",
        notes: ["Mobile preview expands in staged updates."]
      }
    ],
    capabilities: ["resume-parsing", "role-fit-analysis", "career-guidance"],
    tags: ["career", "beta", "intelligence"]
  },
  {
    id: "app-compass",
    entryType: "ecosystem-app",
    name: "DoCHEng Compass",
    folderName: "DoCHEngV2",
    slug: "compass",
    description: "Academic planning for STEM pathways, requirements, and progression decisions.",
    category: "student",
    role: "product",
    lifecycle: "planned",
    generation: "successor",
    status: "coming-soon",
    visibility: "public",
    audience: "STEM students, advisors, parents",
    maturity: "prototype",
    intendedSubdomain: "compass.docheng.co.za",
    parentDomain,
    currentPathType: "workspace-app",
    currentRelativePath: "src/app/products/compass",
    currentRoute: "/products/compass",
    futureUrl: "https://compass.docheng.co.za",
    accessTypes: ["web", "desktop", "android", "hybrid"],
    platforms: ["web", "desktop", "android"],
    deploymentTarget: ["subdomain", "desktop", "android", "hybrid"],
    pricingModel: "monthly",
    pricingHref: "/pricing#compass",
    supportHref: "/support#business-pathway",
    docsHref: "/docs",
    changelogHref: "/changelog",
    roadmapHref: "/roadmap",
    downloadHref: "/downloads#compass",
    relatedProjects: ["project-docheng-v2", "project-docheng-desk2"],
    integrationLevel: "metadata-shared",
    featured: false,
    iconKey: "compass",
    sortOrder: 30,
    launchState: "waitlist",
    distributions: [
      {
        platform: "desktop",
        releaseChannel: "preview",
        status: "coming-soon",
        accessRequirement: "waitlist",
        version: "v0.9.0",
        installer: "Desktop pre-release",
        notes: ["Pilot cohorts open before public release."]
      },
      {
        platform: "android",
        releaseChannel: "preview",
        status: "coming-soon",
        accessRequirement: "waitlist",
        version: "v0.9.0-a",
        installer: "Android pre-release",
        notes: ["Mobile rollout follows desktop pilot readiness."]
      }
    ],
    capabilities: ["program-planning", "requirements-tracking", "pathway-guidance"],
    tags: ["student", "planning", "coming-soon"]
  },
  {
    id: "app-research-core",
    entryType: "ecosystem-app",
    name: "DoCHEng Research Core",
    folderName: "DoCHEngV2",
    slug: "research-core",
    description: "Research workflows for synthesis, analysis, and technical literature operations.",
    category: "research",
    role: "product",
    lifecycle: "planned",
    generation: "successor",
    status: "planned",
    visibility: "hidden",
    audience: "Researchers, postgraduate learners, technical teams",
    maturity: "prototype",
    intendedSubdomain: "research.docheng.co.za",
    parentDomain,
    currentPathType: "workspace-app",
    currentRelativePath: "src/app/research",
    currentRoute: "/research",
    placeholderRoute: "/roadmap",
    futureUrl: "https://research.docheng.co.za",
    accessTypes: ["web", "desktop"],
    platforms: ["web", "desktop"],
    deploymentTarget: ["subdomain", "desktop", "hybrid"],
    pricingModel: "hybrid",
    pricingHref: "/pricing",
    supportHref: "/support#business-pathway",
    docsHref: "/docs",
    changelogHref: "/changelog",
    roadmapHref: "/roadmap",
    relatedProjects: ["project-docheng-v2"],
    integrationLevel: "metadata-shared",
    featured: false,
    iconKey: "research",
    sortOrder: 40,
    launchState: "waitlist",
    capabilities: ["literature-synthesis", "source-management"],
    tags: ["research", "planned"]
  },
  {
    id: "app-labs-runtime",
    entryType: "ecosystem-app",
    name: "DoCHEng Labs Runtime",
    folderName: "DoCHEngV2",
    slug: "labs-runtime",
    description: "Internal and experimental runtime for advanced prototypes and platform experiments.",
    category: "platform",
    role: "experimental",
    lifecycle: "internal",
    generation: "successor",
    status: "internal",
    visibility: "internal-only",
    audience: "Internal teams and pilot partners",
    maturity: "experimental",
    intendedSubdomain: "labs.docheng.co.za",
    parentDomain,
    currentPathType: "workspace-app",
    currentRelativePath: "src/app/labs",
    currentRoute: "/labs",
    placeholderRoute: "/roadmap",
    futureUrl: "https://labs.docheng.co.za",
    accessTypes: ["web", "desktop"],
    platforms: ["web", "desktop"],
    deploymentTarget: ["subdomain", "desktop", "hybrid"],
    pricingModel: "tbd",
    supportHref: "/support#business-pathway",
    roadmapHref: "/roadmap",
    relatedProjects: ["project-docheng-v2"],
    integrationLevel: "metadata-shared",
    featured: false,
    iconKey: "labs",
    sortOrder: 50,
    launchState: "internal",
    capabilities: ["prototype-runtime", "internal-testing"],
    tags: ["internal", "labs"]
  }
];

export function getRegistryEntries() {
  return [...ecosystemRegistry];
}

export function getWorkspaceProjects() {
  return ecosystemRegistry.filter((entry) => entry.entryType === "workspace-project");
}

export function getEcosystemApps() {
  return ecosystemRegistry
    .filter((entry): entry is EcosystemRegistryEntry & { entryType: "ecosystem-app" } => entry.entryType === "ecosystem-app")
    .sort((a, b) => (a.sortOrder ?? Number.MAX_SAFE_INTEGER) - (b.sortOrder ?? Number.MAX_SAFE_INTEGER));
}

export function getPublicApps() {
  return getEcosystemApps().filter((entry) => entry.visibility === "public");
}

export function getCoreDochengApps() {
  return getPublicApps().filter((entry) => entry.featured || entry.role === "parent");
}

export function getExperimentalApps() {
  return getEcosystemApps().filter((entry) => entry.role === "experimental" || entry.maturity === "experimental");
}

export function getAppsByDeploymentTarget(target: DeploymentTarget) {
  return getEcosystemApps().filter((entry) => entry.deploymentTarget.includes(target));
}

export function getAppsForLauncher() {
  return getPublicApps().filter((entry) => entry.role !== "parent");
}

export function getAppsByIntegrationLevel(level: IntegrationLevel) {
  return getEcosystemApps().filter((entry) => entry.integrationLevel === level);
}

export function getProjectsByIntegrationLevel(level: IntegrationLevel) {
  return getWorkspaceProjects().filter((entry) => entry.integrationLevel === level);
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
    "workspace-native": 0
  };

  const warnings: string[] = [];

  ecosystemRegistry.forEach((entry) => {
    byIntegrationLevel[entry.integrationLevel] += 1;

    if (entry.entryType === "ecosystem-app" && entry.visibility === "public" && !entry.currentUrl && !entry.futureUrl) {
      warnings.push(`${entry.slug}: public app is missing currentUrl/futureUrl linkage.`);
    }

    if (entry.entryType === "workspace-project" && !entry.currentRelativePath) {
      warnings.push(`${entry.slug}: workspace project is missing currentRelativePath.`);
    }

    if (!entry.relatedProjects.length) {
      warnings.push(`${entry.slug}: relatedProjects is empty; add at least one relation for traceability.`);
    }
  });

  return {
    totals: {
      registryEntries: ecosystemRegistry.length,
      workspaceProjects: getWorkspaceProjects().length,
      appEntries: getEcosystemApps().length,
      publicApps: getPublicApps().length,
      launchableApps: getAppsForLauncher().length,
      byIntegrationLevel
    },
    warnings
  };
}
