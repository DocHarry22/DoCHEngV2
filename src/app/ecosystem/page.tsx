import type { Metadata } from "next";

import { AccessLayerStrip } from "@/components/ecosystem/access-layer-strip";
import { ArchitectureMap } from "@/components/ecosystem/architecture-map";
import { ConnectedSystemDiagram } from "@/components/ecosystem/connected-system-diagram";
import { DownloadCTAGroup } from "@/components/ecosystem/download-cta-group";
import { EcosystemHero } from "@/components/ecosystem/ecosystem-hero";
import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/ui/section";
import { domainArchitecture, ecosystemAccessLayers, ecosystemProducts, ecosystemSystemLayers } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Ecosystem Architecture",
  description:
    "Strategic architecture view of DoCHEng: parent domain orchestration, product subdomains, desktop/android distribution, and connected ecosystem scaling."
};

export default function EcosystemArchitecturePage() {
  return (
    <Section className="scroll-mt-24 pb-16 pt-14 sm:pt-20">
      <div className="space-y-8 sm:space-y-10">
        <Reveal>
          <EcosystemHero
            title="Strategic architecture for one parent ecosystem and multiple product branches."
            summary="DoCHEng uses a parent-root architecture where docheng.co.za governs positioning and access, product subdomains deliver specialized branch workflows, and Desktop/Android channels provide coordinated runtime distribution."
          />
        </Reveal>

        <Reveal delayMs={70}>
          <ArchitectureMap parentDomain={domainArchitecture.parent} products={ecosystemProducts} />
        </Reveal>

        <Reveal delayMs={120}>
          <AccessLayerStrip layers={ecosystemAccessLayers} />
        </Reveal>

        <Reveal delayMs={170}>
          <ConnectedSystemDiagram layers={ecosystemSystemLayers} />
        </Reveal>

        <Reveal delayMs={220}>
          <DownloadCTAGroup
            actions={[
              { label: "Open Downloads", href: "/downloads" },
              { label: "Explore Product Branches", href: "/products", variant: "ghost" }
            ]}
          />
        </Reveal>
      </div>
    </Section>
  );
}
