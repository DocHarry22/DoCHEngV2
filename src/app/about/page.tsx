import { AboutHero } from "@/components/about/about-hero";
import { CompanyTimelineStrip } from "@/components/about/company-timeline-strip";
import { CredibilitySignalCard } from "@/components/about/credibility-signal-card";
import { MissionBlock } from "@/components/about/mission-block";
import { PhilosophyGrid } from "@/components/about/philosophy-grid";
import { TeamProfileCard } from "@/components/about/team-profile-card";
import { SectionEyebrow } from "@/components/ecosystem/section-eyebrow";
import { Section } from "@/components/ui/section";
import {
  companyHero,
  companyMission,
  companyTimeline,
  credibilitySignals,
  operatingPrinciples,
  teamStructure
} from "@/lib/company-content";

export default function AboutPage() {
  return (
    <div className="space-y-20 pb-20">
      <Section className="pt-16 sm:pt-20">
        <AboutHero hero={companyHero} />
      </Section>

      <Section className="space-y-8">
        <MissionBlock mission={companyMission} />
      </Section>

      <Section className="space-y-7">
        <div>
          <SectionEyebrow>Operating Philosophy</SectionEyebrow>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">How We Make Decisions</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--text-subtle)] sm:text-base">
            Our philosophy is to ship trust first: explicit data boundaries, visible roadmap intent, and traceable delivery through changelogs.
          </p>
        </div>
        <PhilosophyGrid principles={operatingPrinciples} />
      </Section>

      <Section className="space-y-7">
        <div>
          <SectionEyebrow>Team Architecture</SectionEyebrow>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">Focused, Product-Led Team Structure</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--text-subtle)] sm:text-base">
            We keep ownership explicit across product, engineering, and operations so every shipped feature has clear accountability and support continuity.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {teamStructure.map((profile) => (
            <TeamProfileCard key={profile.title} profile={profile} />
          ))}
        </div>
      </Section>

      <Section className="space-y-7">
        <div>
          <SectionEyebrow>Credibility Signals</SectionEyebrow>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">Operational Proof Over Marketing Claims</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--text-subtle)] sm:text-base">
            Every signal below ties directly to a live product route, roadmap stream, or support lane that users can inspect today.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {credibilitySignals.map((signal) => (
            <CredibilitySignalCard key={signal.title} signal={signal} />
          ))}
        </div>
      </Section>

      <Section className="space-y-7">
        <div>
          <SectionEyebrow>Company Timeline</SectionEyebrow>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">From Platform Foundations to Ecosystem Expansion</h2>
        </div>
        <CompanyTimelineStrip phases={companyTimeline} />
      </Section>
    </div>
  );
}
