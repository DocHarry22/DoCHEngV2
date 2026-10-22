import Link from "next/link";
import type { CatalogueProduct } from "@/lib/catalogue";
import { paperplaneFaq, paperplaneFeatures, paperplanePlans } from "@/lib/paperplane-content";
import { ScreenshotGallery } from "@/components/apps/screenshot-gallery";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";

export function PaperplaneProductPage({ product }: { product: CatalogueProduct }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    description: product.summary,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: "https://www.docheng.co.za/products/paperplane",
    screenshot: product.screenshots.map((item) => "https://www.docheng.co.za" + item.url),
    featureList: product.features,
  };

  return (
    <Section className="py-12 sm:py-16" containerClassName="space-y-12 sm:space-y-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <Link href="/apps" className="text-link">← All applications</Link>

      <div className="grid items-start gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-5">
          <p className="eyebrow">Paperplane PDF Tools · Private preview</p>
          <h1 className="text-5xl font-semibold tracking-tight sm:text-7xl">Paperplane</h1>
          <p className="text-2xl font-medium sm:text-3xl">A little less paperwork.</p>
          <p className="max-w-2xl text-lg leading-relaxed text-[var(--text-subtle)]">{product.summary}</p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link className="action-button" href={product.support}>Request early access</Link>
            <a className="text-link" href="#paperplane-screenshots">See the workspace →</a>
          </div>
          <p className="text-sm leading-relaxed text-[var(--text-subtle)]">Invitation-only engineering preview · Desktop and mobile browsers · Public launch pending</p>
        </div>
        <Card className="space-y-5 border-[var(--border-strong)]">
          <p className="eyebrow">Everyday tools, on your device</p>
          <p className="text-4xl font-semibold">24 <span className="text-base font-normal text-[var(--text-subtle)]">browser PDF tools</span></p>
          <ul className="list-disc space-y-3 pl-5 text-sm leading-relaxed">
            <li>Organize, edit, annotate and sign PDFs</li>
            <li>Interactive forms, local OCR and reusable workflows</li>
            <li>Free browser tools in the preview; paid checkout coming soon</li>
          </ul>
          <a className="text-link inline-block text-sm" href="#paperplane-pricing">View draft prices and plan details ↓</a>
        </Card>
      </div>

      {product.screenshots.length ? (
        <div className="scroll-mt-28 space-y-5" id="paperplane-screenshots">
          <div><p className="eyebrow">See the app</p><h2 className="mt-2 text-3xl font-semibold">Inside Paperplane</h2></div>
          <ScreenshotGallery screenshots={product.screenshots} />
          <p className="text-xs text-[var(--text-subtle)]">Original screenshots captured from the private preview on 22 October 2026. Example documents and names are fictional.</p>
        </div>
      ) : null}

      <div className="space-y-6">
        <div className="max-w-3xl space-y-3">
          <p className="eyebrow">Your everyday PDF workspace</p>
          <h2 className="text-3xl font-semibold sm:text-4xl">From a pile of pages to a finished task.</h2>
          <p className="leading-relaxed text-[var(--text-subtle)]">{product.description}</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {paperplaneFeatures.map((feature, index) => (
            <Card key={feature.title} className="space-y-4">
              <p className="eyebrow">0{index + 1}</p>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-[var(--text-subtle)]">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>

      <Card id="paperplane-pricing" className="scroll-mt-28 space-y-6">
        <div className="max-w-3xl space-y-3">
          <p className="eyebrow">Pricing and access</p>
          <h2 className="text-3xl font-semibold">Free tools. Room to grow.</h2>
          <p className="leading-relaxed text-[var(--text-subtle)]">Browser tools cost R0 within the private preview. Pro and Business prices below are drafts for additional account capacity. Paid checkout is disabled; these passes are not on sale.</p>
        </div>
        <div className="overflow-x-auto rounded-xl border border-[var(--border-subtle)]" role="region" aria-label="Draft Paperplane pricing" tabIndex={0}>
          <table className="w-full min-w-[600px] text-left text-sm">
            <caption className="border-b border-[var(--border-subtle)] bg-[var(--surface-0)] p-4 text-left font-medium">Paperplane plans — draft prices, checkout coming soon</caption>
            <thead className="bg-[var(--surface-0)]"><tr>
              {["Plan", "ZAR / 30 days", "ZAR / 365 days", "USD / 30 days", "USD / 365 days"].map((label) => <th key={label} scope="col" className="p-4 font-semibold">{label}</th>)}
            </tr></thead>
            <tbody>{paperplanePlans.map((plan) => (
              <tr key={plan.name} className="border-t border-[var(--border-subtle)]">
                <th scope="row" className="p-4 font-semibold">{plan.name}</th>
                <td className="p-4">{plan.zar30}</td><td className="p-4">{plan.zar365}</td>
                <td className="p-4">{plan.usd30}</td><td className="p-4">{plan.usd365}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        <p className="text-sm leading-relaxed text-[var(--text-subtle)]">One-time 30- or 365-day passes are planned, with no automatic renewal. The app previews 12 currencies; ZAR and USD prices are set independently. Every plan is for one person, including Business.</p>
        <div className="overflow-x-auto rounded-xl border border-[var(--border-subtle)]" role="region" aria-label="Preview account capacity" tabIndex={0}>
          <table className="w-full min-w-[540px] text-left text-sm">
            <caption className="border-b border-[var(--border-subtle)] p-4 text-left font-medium">Account capacity in the preview</caption>
            <thead className="bg-[var(--surface-0)]"><tr>
              {["Plan", "Server jobs / rolling 24 hours", "Saved server workflows", "API keys"].map((label) => <th key={label} scope="col" className="p-4 font-semibold">{label}</th>)}
            </tr></thead>
            <tbody>{paperplanePlans.map((plan) => (
              <tr key={plan.name} className="border-t border-[var(--border-subtle)]">
                <th scope="row" className="p-4 font-semibold">{plan.name}</th>
                <td className="p-4">{plan.jobs}</td><td className="p-4">{plan.workflows}</td><td className="p-4">{plan.keys}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        <p className="text-sm leading-relaxed text-[var(--text-subtle)]">The same browser tools are included in every plan. Hosted jobs have the same limits across plans: up to 10 files and 8 MB combined per job. Local workflow presets run on your device; cloud scheduling and cross-device sync are not enabled.</p>
        <Link className="action-button inline-flex" href={product.support}>Ask about Paperplane access</Link>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card className="space-y-5">
          <h2 className="text-2xl font-semibold">A few things to know</h2>
          {paperplaneFaq.map((item) => (
            <details key={item.question} className="border-t border-[var(--border-subtle)] pt-4">
              <summary className="cursor-pointer font-medium">{item.question}</summary>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-subtle)]">{item.answer}</p>
            </details>
          ))}
        </Card>
        <Card className="space-y-5">
          <p className="eyebrow">Yours stays yours</p>
          <h2 className="text-2xl font-semibold">Choose where your work happens.</h2>
          <p className="text-sm leading-relaxed text-[var(--text-subtle)]">Look for “On your device” on browser tools. Additional tools that upload files to the processing service are shown separately in the app. Keep your originals, save editable projects where supported and review each result before sharing.</p>
          <Link className="text-link inline-block text-sm" href={product.support}>Get help with Paperplane →</Link>
        </Card>
      </div>
    </Section>
  );
}
