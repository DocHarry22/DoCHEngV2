import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DownloadCTAGroup } from "@/components/ecosystem/download-cta-group";
import { SectionEyebrow } from "@/components/ecosystem/section-eyebrow";
import { Reveal } from "@/components/motion/reveal";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { changelogEntries } from "@/lib/changelog-content";
import { docCategoryMeta, docsArticles, getDocBySlug } from "@/lib/docs-content";

type DocPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return docsArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: DocPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getDocBySlug(slug);

  if (!article) {
    return {
      title: "Documentation Article Not Found"
    };
  }

  return {
    title: `${article.title} | Documentation`,
    alternates: { canonical: `/docs/${article.slug}` },
    description: article.summary
  };
}

export default async function DocArticlePage({ params }: DocPageProps) {
  const { slug } = await params;
  const article = getDocBySlug(slug);

  if (!article) {
    notFound();
  }

  const category = docCategoryMeta.find((entry) => entry.key === article.category);
  const relatedReleases = changelogEntries.filter((entry) => article.relatedReleaseSlugs?.includes(entry.slug));

  return (
    <Section className="scroll-mt-24 pb-16 pt-14 sm:pb-20 sm:pt-20">
      <Reveal>
        <SectionEyebrow>Documentation Article</SectionEyebrow>
        <h1 className="mt-4 text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">{article.title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--text-subtle)] sm:text-lg">{article.summary}</p>
      </Reveal>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <Reveal>
          <Card className="space-y-5 bg-[var(--surface-0)]">
            <h2 className="text-2xl font-semibold tracking-tight">Quick steps</h2>
            <div className="space-y-3">
              {article.quickSteps.map((step, index) => (
                <div key={step} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-4">
                  <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Step {index + 1}</p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-subtle)]">{step}</p>
                </div>
              ))}
            </div>

            <DownloadCTAGroup
              actions={[
                { label: "Back To Documentation", href: "/docs" },
                { label: "Open Changelog", href: "/changelog", variant: "ghost" },
                { label: "Still Need Help?", href: "/support#contact-form", variant: "ghost" }
              ]}
            />
          </Card>
        </Reveal>

        <Reveal delayMs={120}>
          <Card className="space-y-4 bg-[var(--surface-0)]">
            <h2 className="text-xl font-semibold tracking-tight">Article metadata</h2>
            <p className="text-sm text-[var(--text-subtle)]">
              <span className="font-semibold text-[var(--text-main)]">Category:</span> {category?.title ?? article.category}
            </p>
            <p className="text-sm text-[var(--text-subtle)]">
              <span className="font-semibold text-[var(--text-main)]">Audience:</span> {article.audience}
            </p>
            <p className="text-sm text-[var(--text-subtle)]">
              <span className="font-semibold text-[var(--text-main)]">Product scope:</span> {article.productScope}
            </p>
            <p className="text-sm text-[var(--text-subtle)]">
              <span className="font-semibold text-[var(--text-main)]">Read time:</span> {article.readTimeMinutes} minutes
            </p>
            <p className="text-sm text-[var(--text-subtle)]">
              <span className="font-semibold text-[var(--text-main)]">Updated:</span> {article.updatedAt}
            </p>

            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Tags</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-[var(--border-strong)] bg-[var(--surface-0)] px-2.5 py-1 text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {relatedReleases.length ? (
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Related Releases</p>
                <div className="mt-2 space-y-2">
                  {relatedReleases.map((entry) => (
                    <p key={entry.slug} className="text-sm text-[var(--text-subtle)]">
                      <span className="font-semibold text-[var(--text-main)]">{entry.version}</span> · {entry.title}
                    </p>
                  ))}
                </div>
              </div>
            ) : null}

            {article.relatedRoutes?.length ? (
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Related Routes</p>
                <DownloadCTAGroup
                  className="mt-2"
                  actions={article.relatedRoutes.map((route) => ({ label: route, href: route, variant: "ghost" as const }))}
                />
              </div>
            ) : null}
          </Card>
        </Reveal>
      </div>
    </Section>
  );
}
