import {
  getPublicApps,
  getAppBySlug,
  getAppsForLauncher,
  getAppPrimaryAction,
  validateEcosystemManifest,
} from "@/lib/ecosystem-manifest";
import { baseCatalogue, productAction } from "@/lib/catalogue";
import { distributionBuilds } from "@/lib/distribution-content";
describe("verified registry policy", () => {
  it("uses unique published identifiers and complete metadata", () => {
    expect(validateEcosystemManifest().valid).toBe(true);
    expect(new Set(baseCatalogue.map((p) => p.slug)).size).toBe(
      baseCatalogue.length,
    );
    for (const p of baseCatalogue) {
      expect(p.description.length).toBeGreaterThan(40);
      expect(p.features.length).toBeGreaterThan(0);
      expect(p.platforms).toContain("Web");
      expect(p.pricing).toBe(p.slug === "resume" ? "free" : "unconfirmed");
    }
  });
  it("never publishes internal entries or private workspace records", () => {
    expect(
      getPublicApps().every(
        (p) => p.visibility === "public" && p.status !== "internal",
      ),
    ).toBe(true);
    expect(getAppBySlug("labs-runtime")).toBeUndefined();
    expect(getAppBySlug("research-core")).toBeUndefined();
    expect(
      getAppsForLauncher().every((p) => p.parentRole !== "parent-platform"),
    ).toBe(true);
  });
  it("launches only exact verified URLs and maps upcoming CTAs safely", () => {
    const desk = getAppBySlug("desk")!;
    expect(getAppPrimaryAction(desk).href).toBe(desk.verifiedWeb?.url);
    expect(
      getAppPrimaryAction({ ...desk, verifiedWeb: undefined }).external,
    ).not.toBe(true);
    const compass = baseCatalogue.find((p) => p.slug === "compass")!;
    expect(productAction(compass).external).toBe(false);
    expect(productAction(compass).label).toBe("Join Waitlist");
    expect(productAction({ ...compass, status: "planned" }).label).toBe(
      "View Roadmap",
    );
  });
  it("does not advertise nonexistent installers", () => {
    expect(distributionBuilds).toEqual([]);
    expect(
      baseCatalogue
        .filter((p) => p.category !== "Sister Projects")
        .every((p) => p.releases.length === 0),
    ).toBe(true);
    const release = baseCatalogue.find((p) => p.slug === "apologia-sancta")!
      .releases[0];
    expect(release.channel).toBe("preview");
    expect(release.sha256).toMatch(/^[a-f0-9]{64}$/);
  });
});
