import type { Metadata } from "next";

import { DownloadCTAGroup } from "@/components/ecosystem/download-cta-group";
import { PricingCompareTable } from "@/components/ecosystem/pricing-compare-table";
import { PricingModelBadge } from "@/components/ecosystem/pricing-model-badge";
import { PricingProductCard } from "@/components/ecosystem/pricing-product-card";
import { SectionEyebrow } from "@/components/ecosystem/section-eyebrow";
import { Reveal } from "@/components/motion/reveal";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import {
  pricingAccessNotes,
  pricingEntries,
  pricingFaq,
  pricingOverviewBullets,
} from "@/lib/pricing-content";
import { pricingModels } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Pricing | DoCHEngV2",
  description:
    "Explore product-specific pricing models, platform access, and plan structures across the DoCHEng ecosystem.",
};

export default function PricingPage() {
  return (
    <>
      <Section className="scroll-mt-24 pb-10 pt-14 sm:pt-20">
        <Reveal>
          <SectionEyebrow className="tracking-[0.2em]">
            Ecosystem Pricing
          </SectionEyebrow>
          <h1 className="mt-5 text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Product-specific pricing built for technical execution at scale.
          </h1>
          <p className="notice mt-6">
            The existing ZAR plan amounts below are proposals retained for owner
            review. No provider-backed products or purchase workflow are
            activated. VAT registration and applicable tax treatment have not
            been confirmed. These figures are not active offers.
          </p>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-[var(--text-subtle)] sm:text-lg">
            DoCHEng pricing is branch-aware. Each product uses the billing model
            that fits its workflow while preserving one parent-brand quality
            standard across Desktop and Android experiences.
          </p>
          <DownloadCTAGroup
            className="mt-8"
            actions={[
              { label: "Compare Product Pricing", href: "#pricing-products" },
              {
                label: "Billing and Access Support",
                href: "/support#pricing-access",
                variant: "ghost",
              },
              {
                label: "Open Downloads Hub",
                href: "/downloads",
                variant: "ghost",
              },
              {
                label: "Explore Product Branches",
                href: "/products",
                variant: "ghost",
              },
            ]}
          />
        </Reveal>
      </Section>

      <Section className="py-10 sm:py-12">
        <Reveal>
          <Card className="space-y-6 bg-[var(--surface-0)]">
            <div>
              <SectionEyebrow>How Pricing Works</SectionEyebrow>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                Clear model logic across the parent ecosystem.
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {pricingModels.map((model) => (
                <div
                  key={model.model}
                  className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-4"
                >
                  <p className="text-sm font-semibold">{model.model}</p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-subtle)]">
                    {model.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-4">
              {pricingOverviewBullets.map((line) => (
                <p
                  key={line}
                  className="text-sm leading-relaxed text-[var(--text-subtle)]"
                >
                  <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)] align-middle" />
                  {line}
                </p>
              ))}
            </div>
          </Card>
        </Reveal>
      </Section>

      <Section id="pricing-products" className="scroll-mt-24 py-10 sm:py-12">
        <Reveal>
          <SectionEyebrow>Product Pricing</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Each app branch, pricing model, and access path in one view.
          </h2>
        </Reveal>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {pricingEntries.map((entry, index) => (
            <Reveal key={entry.slug} delayMs={index * 70}>
              <PricingProductCard entry={entry} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="py-10 sm:py-12">
        <Reveal>
          <div className="space-y-6">
            <div>
              <SectionEyebrow>Comparison Guide</SectionEyebrow>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                Select the right branch by model, cost baseline, and platform
                fit.
              </h2>
            </div>
            <PricingCompareTable entries={pricingEntries} />
          </div>
        </Reveal>
      </Section>

      <Section className="pb-16 pt-10 sm:pb-20 sm:pt-12">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <Card className="space-y-4">
              <SectionEyebrow>Billing and Access Notes</SectionEyebrow>
              {pricingAccessNotes.map((note) => (
                <p
                  key={note}
                  className="text-sm leading-relaxed text-[var(--text-subtle)]"
                >
                  {note}
                </p>
              ))}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {Array.from(
                  new Set(pricingEntries.map((entry) => entry.pricingModel)),
                ).map((model) => (
                  <PricingModelBadge key={model} model={model} />
                ))}
              </div>
            </Card>
          </Reveal>

          <Reveal delayMs={120}>
            <Card className="space-y-4">
              <SectionEyebrow>FAQ</SectionEyebrow>
              {pricingFaq.map((item) => (
                <div
                  key={item.question}
                  className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-0)] p-4"
                >
                  <h3 className="text-sm font-semibold">{item.question}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-subtle)]">
                    {item.answer}
                  </p>
                </div>
              ))}
              <DownloadCTAGroup
                className="pt-2"
                actions={[
                  { label: "Open Downloads", href: "/downloads" },
                  {
                    label: "Ask Pricing Support",
                    href: "/support#pricing-access",
                    variant: "ghost",
                  },
                  { label: "Back To Home", href: "/", variant: "ghost" },
                ]}
              />
            </Card>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
