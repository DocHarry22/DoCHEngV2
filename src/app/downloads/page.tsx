import type { Metadata } from "next";

import { DistributionCatalog } from "@/components/ecosystem/distribution-catalog";
import { DownloadCTAGroup } from "@/components/ecosystem/download-cta-group";
import { SectionEyebrow } from "@/components/ecosystem/section-eyebrow";
import { Reveal } from "@/components/motion/reveal";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import {
  distributionBuilds,
  distributionAccessGuide,
  distributionOverviewBullets,
  releaseChannelNotes
} from "@/lib/distribution-content";

export const metadata: Metadata = {
  title: "Downloads | DoCHEngV2",
  description:
    "Download and install DoCHEng product branches across Desktop and Android with clear release channels, access requirements, and rollout notes."
};

export default function DownloadsPage() {
  const availableBuildCount = distributionBuilds.filter((build) => build.status === "available").length;
  const limitedBuildCount = distributionBuilds.filter((build) => build.status === "limited").length;
  const upcomingBuildCount = distributionBuilds.filter((build) => build.status === "coming-soon").length;

  return (
    <>
      <Section className="scroll-mt-24 pb-10 pt-14 sm:pt-20">
        <Reveal>
          <SectionEyebrow className="tracking-[0.2em]">Distribution Flow</SectionEyebrow>
          <h1 className="mt-5 text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Download each branch with platform clarity and release-stage confidence.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-[var(--text-subtle)] sm:text-lg">
            This hub centralizes DoCHEng distribution across Desktop and Android so users can see version status, release channel, access requirements,
            and setup guidance before installation.
          </p>
          <DownloadCTAGroup
            className="mt-8"
            actions={[
              { label: "Browse Build Catalog", href: "#build-catalog" },
              { label: "Compare Pricing Access", href: "/pricing", variant: "ghost" }
            ]}
          />
        </Reveal>
      </Section>

      <Section className="py-10 sm:py-12">
        <Reveal>
          <Card className="space-y-5 bg-[var(--surface-0)]">
            <div>
              <SectionEyebrow>How Distribution Works</SectionEyebrow>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">One parent delivery standard, branch-specific release readiness.</h2>
            </div>

            <div className="space-y-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-4">
              {distributionOverviewBullets.map((line) => (
                <p key={line} className="text-sm leading-relaxed text-[var(--text-subtle)]">
                  <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)] align-middle" />
                  {line}
                </p>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {releaseChannelNotes.map((note) => (
                <div key={note.channel} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-4">
                  <p className="text-sm font-semibold">{note.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-subtle)]">{note.summary}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Available</p>
                <p className="mt-1 text-2xl font-semibold">{availableBuildCount}</p>
              </div>
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Limited</p>
                <p className="mt-1 text-2xl font-semibold">{limitedBuildCount}</p>
              </div>
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Coming Soon</p>
                <p className="mt-1 text-2xl font-semibold">{upcomingBuildCount}</p>
              </div>
            </div>
          </Card>
        </Reveal>
      </Section>

      <Section id="build-catalog" className="scroll-mt-24 py-10 sm:py-12">
        <Reveal>
          <SectionEyebrow>Build Catalog</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Desktop and Android releases mapped by branch.</h2>
        </Reveal>

        <DistributionCatalog builds={distributionBuilds} />
      </Section>

      <Section className="py-10 sm:py-12">
        <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <Reveal>
            <Card className="space-y-4">
              <SectionEyebrow>Access Requirements</SectionEyebrow>
              {distributionAccessGuide.map((guide) => (
                <div key={guide.label} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-0)] p-4">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.08em]">{guide.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-subtle)]">{guide.summary}</p>
                </div>
              ))}
            </Card>
          </Reveal>

          <Reveal delayMs={120}>
            <div id="support" className="scroll-mt-24">
              <Card className="space-y-4">
                <SectionEyebrow>Support Path</SectionEyebrow>
                <p className="text-sm leading-relaxed text-[var(--text-subtle)]">
                  Need help selecting a release channel, mapping branch access, or activating a paid or waitlist track? DoCHEng support can align your
                  setup with your use case.
                </p>
                <DownloadCTAGroup
                  actions={[
                    { label: "Contact Distribution Support", href: "/support#technical" },
                    { label: "Explore Product Branches", href: "/products", variant: "ghost" }
                  ]}
                />
              </Card>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
