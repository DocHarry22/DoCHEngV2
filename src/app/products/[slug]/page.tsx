import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DownloadCTAGroup } from "@/components/ecosystem/download-cta-group";
import { PlatformBadge } from "@/components/ecosystem/platform-badge";
import { PricingPreviewCard } from "@/components/ecosystem/pricing-preview-card";
import { SectionEyebrow } from "@/components/ecosystem/section-eyebrow";
import { StatusBadge } from "@/components/ecosystem/status-badge";
import { Reveal } from "@/components/motion/reveal";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { ecosystemProducts, getProductBySlug } from "@/lib/site-content";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return ecosystemProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Branch Not Found | DoCHEngV2"
    };
  }

  return {
    title: `${product.name} | DoCHEngV2`,
    description: product.summary
  };
}

export default async function ProductBranchPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <Section className="scroll-mt-24 pb-16 pt-14 sm:pt-20">
      <Reveal>
        <SectionEyebrow className="tracking-[0.2em]">Product Branch</SectionEyebrow>
        <h1 className="mt-4 text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">{product.name}</h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--text-subtle)] sm:text-lg">{product.summary}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <p className="rounded-full border border-[var(--border-strong)] bg-[var(--surface-1)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-main)]">
            {product.pricingModel} model
          </p>
          <StatusBadge status={product.status} />
        </div>
      </Reveal>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal delayMs={90}>
          <Card className="space-y-4">
            <SectionEyebrow className="tracking-[0.16em]">Branch Context</SectionEyebrow>
            <p className="text-sm leading-relaxed text-[var(--text-subtle)]">{product.positioning}</p>
            <p className="text-sm text-[var(--text-subtle)]">
              <span className="font-semibold text-[var(--text-main)]">Target users:</span> {product.targetUser}
            </p>
            <div className="flex flex-wrap gap-2">
              {product.platforms.map((platform) => (
                <PlatformBadge key={platform} platform={platform} className="border-[var(--border-subtle)]" />
              ))}
            </div>
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-0)] p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Subdomain</p>
              <p className="mt-1 text-sm font-semibold">{product.subdomain}</p>
            </div>
          </Card>
        </Reveal>

        <Reveal delayMs={140}>
          <Card className="space-y-4">
            <SectionEyebrow className="tracking-[0.16em]">Plans</SectionEyebrow>
            <div className="grid gap-3">
              {product.plans.map((plan) => (
                <PricingPreviewCard
                  key={plan.name}
                  productName={`${product.name} - ${plan.name}`}
                  pricingModel={product.pricingModel}
                  startingPrice={plan.price}
                  summary={plan.summary}
                  planNote={plan.cadence}
                />
              ))}
            </div>
            <DownloadCTAGroup
              actions={[
                {
                  label: product.status === "coming-soon" ? "Join Waitlist" : "Download Options",
                  href: product.status === "coming-soon" ? "/support#business" : `/downloads#${product.slug}`
                },
                { label: "Product Support", href: "/support#product", variant: "ghost" },
                { label: "Back to Product Tree", href: "/products", variant: "ghost" }
              ]}
            />
          </Card>
        </Reveal>
      </div>
    </Section>
  );
}
