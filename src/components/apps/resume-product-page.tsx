import Link from "next/link";
import type { CatalogueProduct } from "@/lib/catalogue";
import { resumeAppUrl, resumeBackupPlans, resumeFaq, resumeFeatures } from "@/lib/resume-content";
import { ScreenshotGallery } from "@/components/apps/screenshot-gallery";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";

export function ResumeProductPage({ product }: { product: CatalogueProduct }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "CareerForge — DoCHEng Resume Studio",
    description: product.summary,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: "https://www.docheng.co.za/products/resume",
    screenshot: product.screenshots.map((item) => "https://www.docheng.co.za" + item.url),
    featureList: product.features,
    offers: { "@type": "Offer", price: "0", priceCurrency: "ZAR", description: "Free browser career tools" },
  };

  return (
    <Section className="py-12 sm:py-16" containerClassName="space-y-12 sm:space-y-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <Link href="/apps" className="text-link">← All applications</Link>

      <div className="grid items-start gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-5">
          <p className="eyebrow">DoCHEng Resume Studio · {product.status.replaceAll("-", " ")}</p>
          <h1 className="text-5xl font-semibold tracking-tight sm:text-7xl">CareerForge</h1>
          <p className="text-2xl font-medium sm:text-3xl">Your experience. Your next chapter.</p>
          <p className="max-w-2xl text-lg leading-relaxed text-[var(--text-subtle)]">{product.summary}</p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a className="action-button" href={resumeAppUrl + "/builder/?new=1"} target="_blank" rel="noopener noreferrer">Create my résumé</a>
            <a className="text-link" href={resumeAppUrl + "/templates/"} target="_blank" rel="noopener noreferrer">Explore the templates →</a>
          </div>
          <p className="text-sm text-[var(--text-subtle)]">Free browser tools · No account or card needed · Works on desktop and mobile browsers</p>
        </div>
        <Card className="space-y-5 border-[var(--border-strong)]">
          <p className="eyebrow">Available now</p>
          <p className="text-4xl font-semibold">R0 <span className="text-base font-normal text-[var(--text-subtle)]">for browser career tools</span></p>
          <ul className="list-disc space-y-3 pl-5 text-sm leading-relaxed">
            <li>All eight résumé layouts and six cover-letter designs</li>
            <li>Live editing, local drafts and document downloads</li>
            <li>Job tracking, tailoring, career plans and interview practice</li>
          </ul>
          <a className="text-link inline-block text-sm" href="#resume-pricing">View prices and planned backup options ↓</a>
        </Card>
      </div>

      {product.screenshots.length ? (
        <div className="space-y-5" id="resume-screenshots">
          <div><p className="eyebrow">See the app</p><h2 className="mt-2 text-3xl font-semibold">Inside CareerForge</h2></div>
          <ScreenshotGallery screenshots={product.screenshots} />
          <p className="text-xs text-[var(--text-subtle)]">Screenshots captured from resume.docheng.co.za on 21 October 2026. Any example document details are fictional.</p>
        </div>
      ) : null}

      <div className="space-y-6">
        <div className="max-w-3xl space-y-3">
          <p className="eyebrow">More than a résumé builder</p>
          <h2 className="text-3xl font-semibold sm:text-4xl">Tools for every step of your next move.</h2>
          <p className="leading-relaxed text-[var(--text-subtle)]">{product.description}</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {resumeFeatures.map((feature, index) => (
            <Card key={feature.title} className="flex flex-col gap-4">
              <p className="eyebrow">0{index + 1}</p>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="flex-1 text-sm leading-relaxed text-[var(--text-subtle)]">{feature.description}</p>
              <a className="text-link text-sm" href={resumeAppUrl + feature.path} target="_blank" rel="noopener noreferrer">{feature.action} →</a>
            </Card>
          ))}
        </div>
      </div>

      <Card id="resume-pricing" className="scroll-mt-28 space-y-6">
        <div className="max-w-3xl space-y-3">
          <p className="eyebrow">Pricing and access</p>
          <h2 className="text-3xl font-semibold">Start free. Keep your tools free.</h2>
          <p className="leading-relaxed text-[var(--text-subtle)]">The live browser workspace costs R0. Optional cloud-backup plans are in preview; account services and paid checkout are not live. Every plan keeps the same browser career tools.</p>
        </div>
        <div className="overflow-x-auto rounded-xl border border-[var(--border-subtle)]" role="region" aria-label="Planned cloud-backup pricing" tabIndex={0}>
          <table className="w-full min-w-[700px] text-left text-sm">
            <caption className="border-b border-[var(--border-subtle)] bg-[var(--surface-0)] p-4 text-left font-medium">Cloud-backup plans — preview, coming soon</caption>
            <thead className="bg-[var(--surface-0)]">
              <tr>
                {["Plan", "ZAR / 30 days", "ZAR / 365 days", "USD / 30 days", "USD / 365 days", "Planned backup slots"].map((label) => <th key={label} scope="col" className="p-4 font-semibold">{label}</th>)}
              </tr>
            </thead>
            <tbody>
              {resumeBackupPlans.map((plan) => (
                <tr key={plan.name} className="border-t border-[var(--border-subtle)]">
                  <th scope="row" className="p-4 font-semibold">{plan.name}</th>
                  <td className="p-4">{plan.zar30}</td><td className="p-4">{plan.zar365}</td>
                  <td className="p-4">{plan.usd30}</td><td className="p-4">{plan.usd365}</td>
                  <td className="p-4">{plan.backups}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid gap-4 text-sm leading-relaxed text-[var(--text-subtle)] md:grid-cols-2">
          <p>Plus and Pro are planned as one-time 30- or 365-day passes, with no automatic renewal. ZAR and USD are separately set regional prices.</p>
          <p>Each planned cloud slot holds one JSON backup up to 1 MiB. Cloud copies would be uploaded explicitly; signing in would not automatically sync browser drafts.</p>
        </div>
        <a className="action-button inline-flex" href={resumeAppUrl + "/builder/?new=1"} target="_blank" rel="noopener noreferrer">Use the free résumé builder</a>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card className="space-y-5">
          <h2 className="text-2xl font-semibold">A few things to know</h2>
          {resumeFaq.map((item) => (
            <details key={item.question} className="border-t border-[var(--border-subtle)] pt-4">
              <summary className="cursor-pointer font-medium">{item.question}</summary>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-subtle)]">{item.answer}</p>
            </details>
          ))}
        </Card>
        <Card className="space-y-5">
          <p className="eyebrow">Your work, in your hands</p>
          <h2 className="text-2xl font-semibold">Keep a copy of your next chapter.</h2>
          <p className="text-sm leading-relaxed text-[var(--text-subtle)]">Save editable JSON backups and download your finished documents. Keep a separate copy before clearing your browser or changing devices.</p>
          <div className="flex flex-col items-start gap-4 text-sm">
            <a className="text-link" href={resumeAppUrl + "/resources/guides/"} target="_blank" rel="noopener noreferrer">Read the writing guides →</a>
            <a className="text-link" href={resumeAppUrl + "/privacy/"} target="_blank" rel="noopener noreferrer">Privacy and browser storage →</a>
            <Link className="text-link" href={product.support}>Get help with CareerForge →</Link>
          </div>
        </Card>
      </div>
    </Section>
  );
}
