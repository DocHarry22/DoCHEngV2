import type { Metadata } from "next";

import { FutureCapabilityCard } from "@/components/roadmap/future-capability-card";
import { InterestCTA } from "@/components/roadmap/interest-cta";
import { RoadmapHero } from "@/components/roadmap/roadmap-hero";
import { RoadmapTimeline } from "@/components/roadmap/roadmap-timeline";
import { SectionEyebrow } from "@/components/ecosystem/section-eyebrow";
import { Reveal } from "@/components/motion/reveal";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import {
  futureSystemGrowthAreas,
  getRoadmapItemsByPhase,
  productPlatformEvolutionAreas,
  roadmapPhases,
  roadmapVisionPillars
} from "@/lib/roadmap-content";

export const metadata: Metadata = {
  title: "Roadmap",
  description:
    "Strategic roadmap and future vision for the DoCHEng ecosystem: phased product growth, platform evolution, and long-term parent-brand direction."
};

const roadmapItemsByPhase = {
  now: getRoadmapItemsByPhase("now"),
  next: getRoadmapItemsByPhase("next"),
  later: getRoadmapItemsByPhase("later")
};

export default function RoadmapPage() {
  return (
    <>
      <Section className="scroll-mt-24 pb-10 pt-14 sm:pt-20">
        <Reveal>
          <RoadmapHero
            title="Strategic roadmap for a growing parent ecosystem."
            summary="This roadmap explains where DoCHEng is heading across products, platforms, and support systems. It focuses on phased capability maturity so users can understand what is active now, what expands next, and what longer-term ecosystem scale looks like."
          />
        </Reveal>
      </Section>

      <Section className="py-10 sm:py-12">
        <Reveal>
          <Card className="space-y-6 bg-[var(--surface-0)]">
            <div>
              <SectionEyebrow>Why This Exists</SectionEyebrow>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">The parent brand exists to coordinate sustained ecosystem growth.</h2>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {roadmapVisionPillars.map((pillar) => (
                <Card key={pillar.title} className="h-full border-[var(--border-subtle)] bg-[var(--surface-1)] shadow-none">
                  <h3 className="text-lg font-semibold tracking-tight">{pillar.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-subtle)]">{pillar.summary}</p>
                </Card>
              ))}
            </div>
          </Card>
        </Reveal>
      </Section>

      <Section className="py-10 sm:py-12">
        <Reveal>
          <SectionEyebrow>Roadmap Phases</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Now, next, and later phases with clear strategic scope.</h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--text-subtle)] sm:text-base">
            Each item is directional and grounded in current ecosystem architecture. Vision-stage items are aspirational and intentionally framed without fixed launch dates.
          </p>
        </Reveal>

        <div className="mt-8">
          <RoadmapTimeline phases={roadmapPhases} itemsByPhase={roadmapItemsByPhase} />
        </div>
      </Section>

      <Section className="py-10 sm:py-12">
        <Reveal>
          <SectionEyebrow>Product And Platform Evolution</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">How branch capabilities and platform channels mature together.</h2>
        </Reveal>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {productPlatformEvolutionAreas.map((area) => (
            <Reveal key={area.title}>
              <FutureCapabilityCard area={area} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="py-10 sm:py-12">
        <Reveal>
          <SectionEyebrow>System Growth Areas</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Future improvements across access, distribution, support, and docs.</h2>
        </Reveal>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {futureSystemGrowthAreas.map((area) => (
            <Reveal key={area.title}>
              <FutureCapabilityCard area={area} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="pb-16 pt-10 sm:pb-20 sm:pt-12">
        <Reveal>
          <InterestCTA
            title="Track ecosystem direction and engage with the right pathway."
            summary="If your team, institution, or workflow depends on DoCHEng evolution, use support and documentation pathways to share context. Product, pricing, and architecture layers remain the operational core while roadmap phases communicate strategic movement."
          />
        </Reveal>
      </Section>
    </>
  );
}
