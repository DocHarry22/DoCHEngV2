import {
  ecosystemStatusLabel,
  ecosystemAccessTypeLabel,
  getAllApps,
  getFeaturedApps,
  getAppsForLauncher,
  type EcosystemManifestApp,
  type EcosystemAccessType,
  type EcosystemAppCategory,
  type EcosystemAppStatus
} from "@/lib/ecosystem-manifest";

export type AppStatus = EcosystemAppStatus;

export type AppAccessType = EcosystemAccessType;

export type AppCategory = EcosystemAppCategory;

export type PricingState = "free" | "freemium" | "paid" | "hybrid" | "tbd";

export type AppCtaType = "open-app" | "view-product" | "download" | "join-waitlist" | "learn-more" | "compare-plans";

export type EcosystemAppCTA = {
  type: AppCtaType;
  label: string;
  href: string;
  external?: boolean;
};

export type EcosystemApp = {
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  category: AppCategory;
  audience: string;
  status: AppStatus;
  accessTypes: AppAccessType[];
  subdomain?: string;
  routeHref?: string;
  downloadHref?: string;
  pricingHref?: string;
  featured?: boolean;
  icon: "desk" | "resume" | "compass" | "labs" | "research" | "future";
  pricingModel: PricingState;
  sortOrder: number;
  availabilityNote?: string;
  ctas: EcosystemAppCTA[];
};

const pricingStateByManifest: Record<EcosystemManifestApp["pricingModel"], PricingState> = {
  free: "free",
  "free-trial": "freemium",
  "one-time": "paid",
  monthly: "paid",
  annual: "paid",
  tiered: "freemium",
  hybrid: "hybrid",
  tbd: "tbd"
};

const availabilityNoteByStatus: Record<AppStatus, string> = {
  live: "Available now on active channels.",
  beta: "Active beta access with staged rollout.",
  "early-access": "Early access is currently invite-based.",
  planned: "Planned branch with roadmap-tracked launch sequence.",
  "coming-soon": "Coming soon with waitlist-first release control.",
  internal: "Internal-only branch; public access is currently unavailable."
};

function toCompatibilityIcon(iconKey: EcosystemManifestApp["iconKey"]): EcosystemApp["icon"] {
  if (iconKey === "platform") {
    return "future";
  }
  return iconKey;
}

function toCompatibilityCtas(app: EcosystemManifestApp): EcosystemAppCTA[] {
  const ctas: EcosystemAppCTA[] = [];

  if (app.webUrl && (app.status === "live" || app.status === "beta" || app.status === "early-access")) {
    ctas.push({ type: "open-app", label: "Open App", href: app.webUrl, external: true });
  }

  if (app.internalRoute) {
    ctas.push({ type: "view-product", label: "View Product", href: app.internalRoute });
  }

  if (app.downloadHref) {
    ctas.push({ type: "download", label: "Download", href: app.downloadHref });
  }

  if (app.pricingHref) {
    ctas.push({ type: "compare-plans", label: "Compare Plans", href: app.pricingHref });
  }

  if (app.status === "planned" || app.status === "coming-soon") {
    ctas.push({ type: "join-waitlist", label: "Join Waitlist", href: app.supportHref ?? "/support#contact-form" });
  }

  if (!ctas.length) {
    ctas.push({ type: "learn-more", label: "Learn More", href: app.roadmapHref ?? "/roadmap" });
  }

  return ctas;
}

export const ecosystemApps: EcosystemApp[] = getAllApps().map((app) => ({
  name: app.name,
  slug: app.slug,
  shortDescription: app.shortDescription,
  longDescription: app.longDescription,
  category: app.category,
  audience: app.audience,
  status: app.status,
  accessTypes: app.accessTypes,
  subdomain: app.subdomain,
  routeHref: app.internalRoute,
  downloadHref: app.downloadHref,
  pricingHref: app.pricingHref,
  featured: app.featured,
  icon: toCompatibilityIcon(app.iconKey),
  pricingModel: pricingStateByManifest[app.pricingModel],
  sortOrder: app.sortOrder,
  availabilityNote: availabilityNoteByStatus[app.status],
  ctas: toCompatibilityCtas(app)
}));

export const appStatusLabel: Record<AppStatus, string> = ecosystemStatusLabel;

export const appAccessTypeLabel: Record<AppAccessType, string> = ecosystemAccessTypeLabel;

export const appCategoryLabel: Record<AppCategory, string> = {
  productivity: "Productivity",
  career: "Career",
  student: "Student",
  research: "Research",
  platform: "Platform"
};

export const pricingStateLabel: Record<PricingState, string> = {
  free: "Free",
  freemium: "Freemium",
  paid: "Paid",
  hybrid: "Hybrid Model",
  tbd: "TBD"
};

export const ecosystemStructureRows = [
  {
    layer: "Parent Site",
    location: "docheng.co.za",
    responsibility: "Discovery, comparison, launch, and ecosystem trust context."
  },
  {
    layer: "Subdomain Apps",
    location: "*.docheng.co.za",
    responsibility: "Specialized product workflows with focused execution surfaces."
  },
  {
    layer: "Download Channels",
    location: "Desktop + Android",
    responsibility: "Optional distribution for offline, portable, and field-ready usage."
  }
] as const;

export const sortedEcosystemApps = [...ecosystemApps].sort((a, b) => a.sortOrder - b.sortOrder);

export const featuredApps = getFeaturedApps().map((featured) => sortedEcosystemApps.find((app) => app.slug === featured.slug)).filter((app): app is EcosystemApp => Boolean(app));

export const launchableApps = getAppsForLauncher().map((launchable) => sortedEcosystemApps.find((app) => app.slug === launchable.slug)).filter((app): app is EcosystemApp => Boolean(app));

export function getAppLauncherTarget(app: EcosystemApp) {
  if (app.status === "live" || app.status === "beta" || app.status === "early-access") {
    if (app.subdomain) {
      return {
        href: `https://${app.subdomain}`,
        external: true,
        label: "Open Subdomain"
      };
    }

    return {
      href: app.routeHref ?? "/apps",
      external: false,
      label: "Open Branch"
    };
  }

  if (app.status === "planned" || app.status === "coming-soon") {
    return {
      href: "/support#contact-form",
      external: false,
      label: "Join Waitlist"
    };
  }

  return {
    href: app.routeHref ?? "/roadmap",
    external: false,
    label: "View Roadmap"
  };
}
