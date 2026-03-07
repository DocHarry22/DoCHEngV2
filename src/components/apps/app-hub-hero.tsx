import { featuredApps, launchableApps, sortedEcosystemApps } from "@/lib/apps-content";

import { SectionEyebrow } from "@/components/ecosystem/section-eyebrow";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";

export function AppHubHero() {
  return (
    <Reveal>
      <SectionEyebrow className="tracking-[0.2em]">Ecosystem App Hub</SectionEyebrow>
      <h1 className="mt-5 text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
        One launch layer for every DoCHEng app branch.
      </h1>
      <p className="mt-6 max-w-3xl text-base leading-relaxed text-[var(--text-subtle)] sm:text-lg">
        The Apps Hub is the parent discovery and launch surface for the DoCHEng ecosystem. Compare branches, understand availability,
        and jump into subdomain apps or download channels with full context.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Apps In Registry</p>
          <p className="mt-1 text-2xl font-semibold">{sortedEcosystemApps.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Launchable Now</p>
          <p className="mt-1 text-2xl font-semibold">{launchableApps.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Featured Core Apps</p>
          <p className="mt-1 text-2xl font-semibold">{featuredApps.length}</p>
        </Card>
      </div>
    </Reveal>
  );
}
