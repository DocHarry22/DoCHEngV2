import type { Metadata } from "next";

import { DownloadCTAGroup } from "@/components/ecosystem/download-cta-group";
import { SectionEyebrow } from "@/components/ecosystem/section-eyebrow";
import { DocsSearchShell } from "@/components/docs/docs-search-shell";
import { ReleaseLinkedGuides } from "@/components/docs/release-linked-guides";
import { Reveal } from "@/components/motion/reveal";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { changelogEntries } from "@/lib/changelog-content";
import { docCategoryMeta, docsArticles, getDocsByCategory, getDocsForReleaseSlug } from "@/lib/docs-content";

export const metadata: Metadata = {
  title: "Documentation",
  alternates: { canonical: "/docs" },
  description: "Documentation and help articles for setup, product workflows, pricing access, account support, and business pathways."
};

export default function DocsPage() {
  const orderedCategories = [...docCategoryMeta].sort((a, b) => a.priority - b.priority);

  const releaseLinkedGuides = changelogEntries
    .slice()
    .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime())
    .slice(0, 4)
    .flatMap((entry) => {
      const docs = getDocsForReleaseSlug(entry.slug);

      return docs.map((doc) => ({
        releaseTitle: entry.title,
        releaseVersion: entry.version,
        releaseDate: entry.date,
        releaseRoute: "/changelog",
        guideTitle: doc.title,
        guideSlug: doc.slug,
        guideSummary: doc.summary
      }));
    });

  return (
    <>
      <Section className="scroll-mt-24 pb-10 pt-14 sm:pt-20">
        <Reveal>
          <SectionEyebrow className="tracking-[0.2em]">Documentation Hub</SectionEyebrow>
          <h1 className="mt-5 text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Structured guides for product, setup, access, and support workflows.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-[var(--text-subtle)] sm:text-lg">
            This hub is the documentation layer for the DoCHEng ecosystem. It keeps support guidance in one scalable structure so users can resolve
            practical questions without navigating disconnected pages.
          </p>
          <DownloadCTAGroup
            className="mt-8"
            actions={[
              { label: "Browse Categories", href: "#doc-categories" },
              { label: "Open Support Center", href: "/support", variant: "ghost" }
            ]}
          />
        </Reveal>
      </Section>

      <Section className="py-10 sm:py-12">
        <Reveal>
          <DocsSearchShell articles={docsArticles} />
        </Reveal>
      </Section>

      <Section className="py-10 sm:py-12">
        <Reveal>
          <SectionEyebrow>Release-linked Guidance</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Guides that explain release impact and next actions.</h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--text-subtle)] sm:text-base">
            These guides map recent changelog updates to operational documentation so users can validate changes, understand rollout impact, and escalate
            correctly when needed.
          </p>
        </Reveal>

        <div className="mt-8">
          <ReleaseLinkedGuides guides={releaseLinkedGuides} />
        </div>
      </Section>

      <Section id="doc-categories" className="scroll-mt-24 pb-16 pt-10 sm:pb-20 sm:pt-12">
        <Reveal>
          <SectionEyebrow>Documentation Categories</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Find the right guidance lane fast.</h2>
        </Reveal>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {orderedCategories.map((category, index) => {
            const categoryArticles = getDocsByCategory(category.key);

            return (
              <Reveal key={category.key} delayMs={index * 70}>
                <Card className="space-y-4 bg-[var(--surface-0)]">
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight">{category.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--text-subtle)]">{category.description}</p>
                  </div>

                  <div className="space-y-3">
                    {categoryArticles.map((article) => (
                      <Card key={article.slug} className="space-y-2 rounded-xl p-4 shadow-none">
                        <p className="text-sm font-semibold">{article.title}</p>
                        <p className="text-sm leading-relaxed text-[var(--text-subtle)]">{article.summary}</p>
                        <p className="text-xs text-[var(--text-muted)]">
                          {article.readTimeMinutes} min read · Updated {article.updatedAt}
                        </p>
                        <DownloadCTAGroup actions={[{ label: "Open Article", href: `/docs/${article.slug}`, variant: "ghost" }]} />
                      </Card>
                    ))}
                  </div>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </Section>
    </>
  );
}
