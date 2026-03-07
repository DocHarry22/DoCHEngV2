import {
  getAllApps,
  getAppBySlug,
  getAppPrimaryAction,
  getAppsByAccessType,
  getAppsByStatus,
  getAppsForDownloads,
  getAppsForLauncher,
  getAppsForPricing,
  getFeaturedApps,
  getPublicApps,
  validateEcosystemManifest
} from "@/lib/ecosystem-manifest";

describe("ecosystem manifest", () => {
  it("exposes canonical app list and featured/public selectors", () => {
    const all = getAllApps();
    const featured = getFeaturedApps();
    const publicApps = getPublicApps();

    expect(all.length).toBeGreaterThan(0);
    expect(featured.length).toBeGreaterThan(0);
    expect(publicApps.every((app) => app.visibility === "public")).toBe(true);
  });

  it("returns expected app by slug", () => {
    const desk = getAppBySlug("desk");

    expect(desk).toBeDefined();
    expect(desk?.name).toMatch(/docheng desk/i);
  });

  it("supports status and access selectors", () => {
    const liveApps = getAppsByStatus("live");
    const desktopApps = getAppsByAccessType("desktop");

    expect(liveApps.some((app) => app.slug === "desk")).toBe(true);
    expect(desktopApps.length).toBeGreaterThan(0);
  });

  it("builds launcher/download/pricing selector sets", () => {
    const launcher = getAppsForLauncher();
    const downloads = getAppsForDownloads();
    const pricing = getAppsForPricing();

    expect(launcher.every((app) => app.parentRole !== "parent-platform")).toBe(true);
    expect(downloads.some((app) => app.slug === "desk")).toBe(true);
    expect(pricing.some((app) => app.slug === "resume")).toBe(true);
  });

  it("resolves status-safe primary actions", () => {
    const liveAction = getAppPrimaryAction(getAppBySlug("desk")!);
    const plannedAction = getAppPrimaryAction(getAppBySlug("research-core")!);

    expect(liveAction.label).toMatch(/open/i);
    expect(plannedAction.label).toMatch(/waitlist/i);
  });

  it("validates manifest shape with no errors", () => {
    const result = validateEcosystemManifest();

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});
