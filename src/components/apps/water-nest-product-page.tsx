import Link from "next/link";
import type { CatalogueProduct } from "@/lib/catalogue";
import { waterNestFaq, waterNestFeatures, waterNestPriceExamples, waterNestUrl } from "@/lib/water-nest-content";
import { ScreenshotGallery } from "@/components/apps/screenshot-gallery";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";

export function WaterNestProductPage({ product }: { product: CatalogueProduct }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Water Nest — Storefront and services",
    description: product.summary,
    url: "https://www.docheng.co.za/products/water-nest",
    about: { "@type": "WebSite", name: "Water Nest", url: waterNestUrl + "/" },
    image: product.screenshots.map((item) => "https://www.docheng.co.za" + item.url),
  };

  return (
    <Section className="py-12 sm:py-16" containerClassName="space-y-12 sm:space-y-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <Link href="/apps" className="text-link">← All applications</Link>

      <div className="grid items-start gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-5">
          <p className="eyebrow">Water-treatment products and services · Independent storefront</p>
          <h1 className="text-5xl font-semibold tracking-tight sm:text-7xl">Water Nest</h1>
          <p className="text-2xl font-medium sm:text-3xl">Find the product. Plan the service.</p>
          <p className="max-w-2xl text-lg leading-relaxed text-[var(--text-subtle)]">{product.summary}</p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a className="action-button" href={waterNestUrl + "/shop"} target="_blank" rel="noopener noreferrer">Shop Water Nest</a>
            <a className="text-link" href={waterNestUrl + "/services/book"} target="_blank" rel="noopener noreferrer">Request a service →</a>
          </div>
          <p className="text-sm leading-relaxed text-[var(--text-subtle)]">South African storefront · Prices in rand · Products, quotes and service enquiries</p>
        </div>
        <Card className="space-y-5 border-[var(--border-strong)]">
          <p className="eyebrow">From browsing to a clear request</p>
          <ul className="space-y-4 text-sm leading-relaxed">
            <li><strong className="block text-lg">Find what fits</strong>Search products and check listed prices and stock</li>
            <li><strong className="block text-lg">Already own the equipment?</strong>Request installation, maintenance or repair labour</li>
            <li><strong className="block text-lg">Confirm the scope</strong>Ask for a quote and agree the details with Water Nest</li>
          </ul>
          <a className="text-link inline-block text-sm" href="#water-nest-pricing">See current catalogue examples ↓</a>
        </Card>
      </div>

      {product.screenshots.length ? (
        <div className="scroll-mt-28 space-y-5" id="water-nest-screenshots">
          <div><p className="eyebrow">See the storefront</p><h2 className="mt-2 text-3xl font-semibold">Inside Water Nest</h2></div>
          <ScreenshotGallery screenshots={product.screenshots} />
          <p className="text-xs text-[var(--text-subtle)]">Homepage screenshot captured on 18 October 2026; the deployed build and public catalogue were checked again on 23 October. Marketing claims shown belong to the store. No order, enquiry or payment was submitted.</p>
        </div>
      ) : null}

      <div className="space-y-6">
        <div className="max-w-3xl space-y-3">
          <p className="eyebrow">Products and practical next steps</p>
          <h2 className="text-3xl font-semibold sm:text-4xl">Browse, compare and describe what you need.</h2>
          <p className="leading-relaxed text-[var(--text-subtle)]">{product.description}</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {waterNestFeatures.map((feature, index) => (
            <Card key={feature.title} className="flex flex-col gap-4">
              <p className="eyebrow">0{index + 1}</p>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="flex-1 text-sm leading-relaxed text-[var(--text-subtle)]">{feature.description}</p>
              <a className="text-link text-sm" href={waterNestUrl + feature.path} target="_blank" rel="noopener noreferrer">{feature.action} →</a>
            </Card>
          ))}
        </div>
      </div>

      <Card id="water-nest-pricing" className="scroll-mt-28 space-y-6">
        <div className="max-w-3xl space-y-3">
          <p className="eyebrow">Product pricing and service quotes</p>
          <h2 className="text-3xl font-semibold">Catalogue prices, with stock in view.</h2>
          <p className="leading-relaxed text-[var(--text-subtle)]">These examples come from Water Nest’s public shop. They show physical-product prices in ZAR, checked on 23 October 2026. Check the store for the selected specification, current stock, delivery charges and final total.</p>
        </div>
        <div className="overflow-x-auto rounded-xl border border-[var(--border-subtle)]" role="region" aria-label="Water Nest catalogue price examples" tabIndex={0}>
          <table className="w-full min-w-[540px] text-left text-sm">
            <caption className="border-b border-[var(--border-subtle)] bg-[var(--surface-0)] p-4 text-left font-medium">Catalogue examples — 23 October 2026</caption>
            <thead className="bg-[var(--surface-0)]"><tr>
              {["Product", "Displayed price (ZAR)", "Stock at check"].map((label) => <th key={label} scope="col" className="p-4 font-semibold">{label}</th>)}
            </tr></thead>
            <tbody>{waterNestPriceExamples.map((item) => (
              <tr key={item.name} className="border-t border-[var(--border-subtle)]">
                <th scope="row" className="p-4 font-semibold">{item.name}</th>
                <td className="p-4">{item.price}</td><td className="p-4">{item.stock}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        <div className="grid gap-4 text-sm leading-relaxed text-[var(--text-subtle)] md:grid-cols-2">
          <p>Service requests can cover labour only or include parts. Your selected hours, crew, urgency and travel area are preliminary; Water Nest confirms the scope and issues a written quote.</p>
          <p>Water Nest manages its own products, accounts, orders and payments. No DoCHEng software subscription is required to browse this listing. Store terms govern any purchase or service agreement.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <a className="action-button" href={waterNestUrl + "/shop"} target="_blank" rel="noopener noreferrer">Check the current catalogue</a>
          <a className="text-link" href={waterNestUrl + "/quote"} target="_blank" rel="noopener noreferrer">Request a custom quote →</a>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card className="space-y-5">
          <h2 className="text-2xl font-semibold">A few things to know</h2>
          {waterNestFaq.map((item) => (
            <details key={item.question} className="border-t border-[var(--border-subtle)] pt-4">
              <summary className="cursor-pointer font-medium">{item.question}</summary>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-subtle)]">{item.answer}</p>
            </details>
          ))}
        </Card>
        <Card className="space-y-5">
          <p className="eyebrow">Your next step</p>
          <h2 className="text-2xl font-semibold">Get the details from Water Nest.</h2>
          <p className="text-sm leading-relaxed text-[var(--text-subtle)]">For product suitability, service availability or an existing order, use Water Nest’s own contact channels. Read its shipping, returns and purchase terms before agreeing an order.</p>
          <div className="flex flex-col items-start gap-4 text-sm">
            <a className="text-link" href={waterNestUrl + "/contact"} target="_blank" rel="noopener noreferrer">Contact Water Nest →</a>
            <a className="text-link" href={waterNestUrl + "/shipping"} target="_blank" rel="noopener noreferrer">Shipping information →</a>
            <a className="text-link" href={waterNestUrl + "/returns"} target="_blank" rel="noopener noreferrer">Returns policy →</a>
            <Link className="text-link" href={product.support}>Report an issue with this listing →</Link>
          </div>
        </Card>
      </div>
    </Section>
  );
}
