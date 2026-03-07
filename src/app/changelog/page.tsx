import type { Metadata } from "next";

import { ReleaseHighlightCard } from "@/components/changelog/release-highlight-card";
import { ReleaseNotesBoard } from "@/components/changelog/release-notes-board";
import { DownloadCTAGroup } from "@/components/ecosystem/download-cta-group";
import { SectionEyebrow } from "@/components/ecosystem/section-eyebrow";
import { Reveal } from "@/components/motion/reveal";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { changelogEntries, changelogFaq, changelogHighlight, changelogOverviewBullets } from "@/lib/changelog-content";

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "Track product and platform updates across the DoCHEng ecosystem with structured release notes, scope labels, and roadmap context."
};

export default function ChangelogPage() {
  return (
    <>
      <Section className="scroll-mt-24 pb-10 pt-14 sm:pt-20">
        <Reveal>
          <SectionEyebrow className="tracking-[0.2em]">Release Notes</SectionEyebrow>
          <h1 className="mt-5 text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Transparent changelog for every meaningful DoCHEng ecosystem update.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-[var(--text-subtle)] sm:text-lg">
            This page tracks shipped and planned release progress across products, platforms, and parent-brand systems so users can see what changed,
            where it applies, and which pathways to use next.
          </p>
          <DownloadCTAGroup
            className="mt-8"
            actions={[
              { label: "View Latest Highlight", href: "#latest-release" },
              { label: "Open Product Catalog", href: "/products", variant: "ghost" },
              { label: "Ask Update Support", href: "/support#contact-form", variant: "ghost" }
            ]}
          />
        </Reveal>
      </Section>

      <Section id="latest-release" className="scroll-mt-24 py-10 sm:py-12">
        <Reveal>
          <ReleaseHighlightCard entry={changelogHighlight} />
        </Reveal>
      </Section>

      <Section className="py-10 sm:py-12">
        <Reveal>
          <Card className="space-y-4 bg-[var(--surface-0)]">
            <SectionEyebrow>How To Read This</SectionEyebrow>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Scan updates by type, scope, and status without digging through raw commits.</h2>
            <div className="space-y-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-4">
              {changelogOverviewBullets.map((line) => (
                <p key={line} className="text-sm leading-relaxed text-[var(--text-subtle)]">
                  <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)] align-middle" />
                  {line}
                </p>
              ))}
            </div>
          </Card>
        </Reveal>
      </Section>

      <Section id="recent-updates" className="scroll-mt-24 py-10 sm:py-12">
        <Reveal>
          <SectionEyebrow>Recent Updates</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Product-aware release entries with filterable scope and update type.</h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--text-subtle)] sm:text-base">
            Use filters to isolate updates for specific products, platforms, and release categories while keeping chronology clear.
          </p>
        </Reveal>

        <div className="mt-8">
          <ReleaseNotesBoard entries={changelogEntries} />
        </div>
      </Section>

      <Section className="py-10 sm:py-12">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <Card className="space-y-4 bg-[var(--surface-0)]">
              <SectionEyebrow>Roadmap Relationship</SectionEyebrow>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Changelog shows delivered progress. Roadmap shows directional evolution.</h2>
              <p className="text-sm leading-relaxed text-[var(--text-subtle)]">
                Released items are documented here with explicit shipped/planned status. For strategic direction and future capability context, use the roadmap
                layer so planned work is not mistaken for completed releases.
              </p>
              <DownloadCTAGroup
                actions={[
                  { label: "Open Roadmap", href: "/roadmap" },
                  { label: "View Ecosystem Architecture", href: "/ecosystem", variant: "ghost" }
                ]}
              />
            </Card>
          </Reveal>

          <Reveal delayMs={120}>
            <Card className="space-y-4 bg-[var(--surface-0)]">
              <SectionEyebrow>FAQ</SectionEyebrow>
              {changelogFaq.map((item) => (
                <div key={item.question} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-4">
                  <h3 className="text-sm font-semibold">{item.question}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-subtle)]">{item.answer}</p>
                </div>
              ))}
            </Card>
          </Reveal>
        </div>
      </Section>

      <Section className="pb-16 pt-10 sm:pb-20 sm:pt-12">
        <Reveal>
          <Card className="space-y-4 bg-[var(--surface-0)] sm:p-8">
            <SectionEyebrow>Next Action</SectionEyebrow>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Use the right ecosystem pathway after each release update.</h2>
            <p className="max-w-3xl text-sm leading-relaxed text-[var(--text-subtle)] sm:text-base">
              Need product context, build access, or support after a release note? Move directly into product, downloads, support, and roadmap layers
              without losing update context.
            </p>
            <DownloadCTAGroup
              className="pt-2"
              actions={[
                { label: "Explore Products", href: "/products" },
                { label: "Open Downloads", href: "/downloads", variant: "ghost" },
                { label: "Open Support", href: "/support#contact-form", variant: "ghost" },
                { label: "Read Roadmap", href: "/roadmap", variant: "ghost" }
              ]}
            />
          </Card>
        </Reveal>
      </Section>
    </>
  );
}
