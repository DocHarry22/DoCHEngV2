import {
  getAppsByDeploymentTarget,
  getAppsForLauncher as getRegistryAppsForLauncher,
  getEcosystemApps,
  getPublicApps as getRegistryPublicApps,
  type EcosystemAccessType,
  type EcosystemDistribution,
  type EcosystemPlatform,
  type EcosystemPricingModel,
  type EcosystemRegistryEntry,
  type EcosystemReleaseChannel,
  type EcosystemVisibility
} from "@/lib/ecosystem-registry";

export type EcosystemAppStatus = "live" | "beta" | "early-access" | "planned" | "coming-soon" | "internal";

export {
  EcosystemAccessType,
  EcosystemVisibility,
  EcosystemPricingModel,
  EcosystemPlatform,
  EcosystemDistribution,
  EcosystemReleaseChannel
};

export type EcosystemAppCategory = "platform" | "productivity" | "career" | "student" | "research";

export type EcosystemParentRole = "parent-platform" | "product-branch" | "support-resource" | "internal-runtime";

export type EcosystemLaunchState = "public" | "invite-only" | "waitlist" | "internal";

export type EcosystemMaturityLevel = "foundation" | "growth" | "expansion" | "experimental";

export type EcosystemManifestApp = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  category: EcosystemAppCategory;
  audience: string;
  status: EcosystemAppStatus;
  featured: boolean;
  visibility: EcosystemVisibility;
  parentRole: EcosystemParentRole;
  subdomain?: string;
  webUrl?: string;
  internalRoute?: string;
  accessTypes: EcosystemAccessType[];
  platforms: EcosystemPlatform[];
  pricingModel: EcosystemPricingModel;
  pricingHref?: string;
  downloadHref?: string;
  supportHref?: string;
  docsHref?: string;
  changelogHref?: string;
  roadmapHref?: string;
  iconKey: "desk" | "resume" | "compass" | "research" | "labs" | "platform";
  themeAccent: string;
  sortOrder: number;
  distributions?: EcosystemDistribution[];
  relatedApps?: string[];
  capabilities?: string[];
  releaseChannels?: EcosystemReleaseChannel[];
  tags?: string[];
  launchState?: EcosystemLaunchState;
  maturityLevel?: EcosystemMaturityLevel;
};

const categoryMap: Record<EcosystemRegistryEntry["category"], EcosystemAppCategory> = {
  platform: "platform",
  productivity: "productivity",
  career: "career",
  student: "student",
  research: "research",
  adjacent: "platform"
};

const roleMap: Record<EcosystemRegistryEntry["role"], EcosystemParentRole> = {
  parent: "parent-platform",
  product: "product-branch",
  experimental: "internal-runtime",
  legacy: "support-resource",
  sibling: "support-resource",
  "support-project": "support-resource"
};

const statusMap: Record<EcosystemRegistryEntry["status"], EcosystemAppStatus> = {
  live: "live",
  beta: "beta",
  "early-access": "early-access",
  planned: "planned",
  "coming-soon": "coming-soon",
  internal: "internal",
  unknown: "planned"
};

const maturityMap: Record<EcosystemRegistryEntry["maturity"], EcosystemMaturityLevel> = {
  production: "foundation",
  growth: "growth",
  beta: "growth",
  prototype: "expansion",
  experimental: "experimental",
  legacy: "expansion",
  unknown: "expansion"
};

const themeAccentMap: Record<NonNullable<EcosystemManifestApp["iconKey"]>, string> = {
  platform: "blue",
  desk: "blue",
  resume: "orange",
  compass: "emerald",
  research: "violet",
  labs: "slate"
};

function toManifestApp(entry: EcosystemRegistryEntry): EcosystemManifestApp {
  return {
    id: entry.id,
    name: entry.name,
    slug: entry.slug,
    shortDescription: entry.description,
    longDescription: entry.description,
    category: categoryMap[entry.category],
    audience: entry.audience ?? "DoCHEng users",
    status: statusMap[entry.status],
    featured: Boolean(entry.featured),
    visibility: entry.visibility,
    parentRole: roleMap[entry.role],
    subdomain: entry.intendedSubdomain,
    webUrl: entry.currentUrl,
    internalRoute: entry.currentRoute ?? entry.placeholderRoute,
    accessTypes: entry.accessTypes,
    platforms: entry.platforms,
    pricingModel: entry.pricingModel ?? "tbd",
    pricingHref: entry.pricingHref,
    downloadHref: entry.downloadHref,
    supportHref: entry.supportHref,
    docsHref: entry.docsHref,
    changelogHref: entry.changelogHref,
    roadmapHref: entry.roadmapHref,
    iconKey: entry.iconKey ?? "platform",
    themeAccent: themeAccentMap[entry.iconKey ?? "platform"],
    sortOrder: entry.sortOrder ?? Number.MAX_SAFE_INTEGER,
    distributions: entry.distributions,
    relatedApps: entry.relatedProjects,
    capabilities: entry.capabilities,
    releaseChannels: entry.distributions?.map((distribution) => distribution.releaseChannel),
    tags: entry.tags,
    launchState: entry.launchState,
    maturityLevel: maturityMap[entry.maturity]
  };
}

function deepFreeze<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);

    for (const key of Object.keys(value as object)) {
      const nested = (value as Record<string, unknown>)[key];
      if (nested && typeof nested === "object") {
        deepFreeze(nested);
      }
    }
  }

  return value;
}

const manifestSeed: EcosystemManifestApp[] = getEcosystemApps().map(toManifestApp);

export const ecosystemManifest: readonly EcosystemManifestApp[] = deepFreeze(manifestSeed);

export const ecosystemStatusLabel: Record<EcosystemAppStatus, string> = {
  live: "Live",
  beta: "Beta",
  "early-access": "Early Access",
  planned: "Planned",
  "coming-soon": "Coming Soon",
  internal: "Internal"
};

export const ecosystemAccessTypeLabel: Record<EcosystemAccessType, string> = {
  web: "Web",
  desktop: "Desktop",
  android: "Android",
  hybrid: "Hybrid"
};

export function getAllApps() {
  return [...ecosystemManifest].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getFeaturedApps() {
  return getAllApps().filter((app) => app.featured);
}

export function getPublicApps() {
  return getRegistryPublicApps().map(toManifestApp);
}

export function getAppBySlug(slug: string) {
  return ecosystemManifest.find((app) => app.slug === slug);
}

export function getAppsByStatus(status: EcosystemAppStatus) {
  return getAllApps().filter((app) => app.status === status);
}

export function getAppsByAccessType(type: EcosystemAccessType) {
  return getAllApps().filter((app) => app.accessTypes.includes(type));
}

export function getAppsForLauncher() {
  return getRegistryAppsForLauncher().map(toManifestApp);
}

export function getAppsForDownloads() {
  return getAppsByDeploymentTarget("desktop")
    .concat(getAppsByDeploymentTarget("android"))
    .filter((entry) => entry.visibility === "public")
    .reduce<EcosystemRegistryEntry[]>((unique, entry) => {
      if (!unique.some((existing) => existing.id === entry.id)) {
        unique.push(entry);
      }
      return unique;
    }, [])
    .map(toManifestApp);
}

export function getAppsForPricing() {
  return getAllApps().filter(
    (app) => app.visibility === "public" && !!app.pricingHref && app.parentRole === "product-branch"
  );
}

export function getAppsByCategory(category: EcosystemAppCategory) {
  return getAllApps().filter((app) => app.category === category);
}

export function getLauncherGroups() {
  const apps = getAppsForLauncher();
  const grouped = {
    live: apps.filter((app) => app.status === "live" || app.status === "beta" || app.status === "early-access"),
    upcoming: apps.filter((app) => app.status === "planned" || app.status === "coming-soon")
  };

  return grouped;
}

export function getAppPrimaryAction(app: EcosystemManifestApp): { label: string; href: string; external?: boolean } {
  if (app.status === "live" || app.status === "beta" || app.status === "early-access") {
    if (app.webUrl) {
      return { label: "Open App", href: app.webUrl, external: true };
    }

    return { label: "Open Branch", href: app.internalRoute ?? "/products" };
  }

  if (app.status === "coming-soon" || app.status === "planned") {
    return { label: "Join Waitlist", href: app.supportHref ?? "/support#contact-form" };
  }

  return { label: "Learn More", href: app.roadmapHref ?? "/roadmap" };
}

export function getAppRouteMap() {
  return getAllApps().reduce<Record<string, string>>((map, app) => {
    map[app.slug] = app.internalRoute ?? app.webUrl ?? "/";
    return map;
  }, {});
}

export function validateEcosystemManifest(apps: readonly EcosystemManifestApp[] = ecosystemManifest) {
  const errors: string[] = [];
  const ids = new Set<string>();
  const slugs = new Set<string>();

  for (const app of apps) {
    if (ids.has(app.id)) {
      errors.push(`Duplicate app id: ${app.id}`);
    }
    ids.add(app.id);

    if (slugs.has(app.slug)) {
      errors.push(`Duplicate app slug: ${app.slug}`);
    }
    slugs.add(app.slug);

    if (app.visibility === "public" && app.parentRole === "product-branch" && !app.internalRoute) {
      errors.push(`Public product-branch is missing internalRoute: ${app.slug}`);
    }

    if ((app.status === "live" || app.status === "beta") && !app.pricingHref) {
      errors.push(`Active app is missing pricingHref: ${app.slug}`);
    }

    if (app.status === "internal" && app.visibility !== "internal-only") {
      errors.push(`Internal app must use internal-only visibility: ${app.slug}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
