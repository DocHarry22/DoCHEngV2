import Link from "next/link";
import type { CatalogueProduct } from "@/lib/catalogue";
import { apologiaAppUrl, apologiaAvailability, apologiaFaq, apologiaFeatures, apologiaGraphUrl } from "@/lib/apologia-content";
import { ScreenshotGallery } from "@/components/apps/screenshot-gallery";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";

export function ApologiaProductPage({ product }: { product: CatalogueProduct }) {
  const android = product.releases.find((release) => release.platform === "Android");
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    description: product.summary,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web, Android",
    url: "https://www.docheng.co.za/products/apologia-sancta",
    screenshot: product.screenshots.map((item) => "https://www.docheng.co.za" + item.url),
    featureList: product.features,
  };

  return (
    <Section className="py-12 sm:py-16" containerClassName="space-y-12 sm:space-y-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <Link href="/apps" className="text-link">← All applications</Link>

      <div className="grid items-start gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-5">
          <p className="eyebrow">Catholic learning, research and trivia · Public beta</p>
          <h1 className="text-5xl font-semibold tracking-tight sm:text-7xl">Apologia Sancta</h1>
          <p className="text-2xl font-medium sm:text-3xl">Learn the faith. Explore the connections.</p>
          <p className="max-w-2xl text-lg leading-relaxed text-[var(--text-subtle)]">{product.summary}</p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a className="action-button" href={apologiaAppUrl + "/"} target="_blank" rel="noopener noreferrer">Open Apologia Sancta</a>
            <a className="text-link" href={apologiaGraphUrl + "/graph"} target="_blank" rel="noopener noreferrer">Explore the 3D Galaxy →</a>
          </div>
          <p className="text-sm leading-relaxed text-[var(--text-subtle)]">Web, installable web app and Android preview · Catholic lens with attributed comparative perspectives</p>
        </div>
        <Card className="space-y-5 border-[var(--border-strong)]">
          <p className="eyebrow">Three ways to explore</p>
          <ul className="space-y-4 text-sm leading-relaxed">
            <li><strong className="block text-lg">Learn and browse</strong>22 topics and 265 questions in the bundled library</li>
            <li><strong className="block text-lg">Connect ideas</strong>A source-linked research graph with 3D and 2D views</li>
            <li><strong className="block text-lg">Play trivia</strong>Room-based questions, teaching moments and rankings</li>
          </ul>
          <a className="text-link inline-block text-sm" href="#apologia-access">Check access and current availability ↓</a>
        </Card>
      </div>

      {product.screenshots.length ? (
        <div className="scroll-mt-28 space-y-5" id="apologia-screenshots">
          <div><p className="eyebrow">See the app</p><h2 className="mt-2 text-3xl font-semibold">Inside Apologia Sancta and the 3D Galaxy</h2></div>
          <ScreenshotGallery screenshots={product.screenshots} />
          <p className="text-xs text-[var(--text-subtle)]">Original screenshots from the public web app and Apologia Graph, captured on 22 October 2026. Current compatibility and service-availability notices are retained. No quiz room was joined or score created.</p>
        </div>
      ) : null}

      <div className="space-y-6">
        <div className="max-w-3xl space-y-3">
          <p className="eyebrow">One question, more context</p>
          <h2 className="text-3xl font-semibold sm:text-4xl">Read the sources. Follow the argument. Test your knowledge.</h2>
          <p className="leading-relaxed text-[var(--text-subtle)]">{product.description}</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {apologiaFeatures.map((feature, index) => (
            <Card key={feature.title} className="flex flex-col gap-4">
              <p className="eyebrow">0{index + 1}</p>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="flex-1 text-sm leading-relaxed text-[var(--text-subtle)]">{feature.description}</p>
              <a className="text-link text-sm" href={feature.href} target="_blank" rel="noopener noreferrer">{feature.action} →</a>
            </Card>
          ))}
        </div>
      </div>

      <Card id="apologia-access" className="scroll-mt-28 space-y-6">
        <div className="max-w-3xl space-y-3">
          <p className="eyebrow">Pricing and access</p>
          <h2 className="text-3xl font-semibold">Explore the public beta.</h2>
          <p className="leading-relaxed text-[var(--text-subtle)]">The public library and graph can be opened without a checkout. No paid plan prices or subscription checkout are published in the current interfaces. This beta includes working public catalogues and visual tools alongside features that still depend on unavailable services.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {apologiaAvailability.map((item) => (
            <div key={item.feature} className="space-y-2 rounded-xl border border-[var(--border-subtle)] p-5">
              <h3 className="font-semibold">{item.feature}</h3>
              <p className="text-sm font-medium">{item.status}</p>
              <p className="text-sm leading-relaxed text-[var(--text-subtle)]">{item.detail}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <a className="action-button" href={apologiaAppUrl + "/library/"} target="_blank" rel="noopener noreferrer">Browse the question library</a>
          <a className="text-link" href={apologiaAppUrl + "/mobile/"} target="_blank" rel="noopener noreferrer">Choose a trivia room →</a>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card className="space-y-5">
          <h2 className="text-2xl font-semibold">A few things to know</h2>
          {apologiaFaq.map((item) => (
            <details key={item.question} className="border-t border-[var(--border-subtle)] pt-4">
              <summary className="cursor-pointer font-medium">{item.question}</summary>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-subtle)]">{item.answer}</p>
            </details>
          ))}
        </Card>
        <Card className="space-y-5">
          <p className="eyebrow">Keep learning within reach</p>
          <h2 className="text-2xl font-semibold">Browser and Android access</h2>
          <p className="text-sm leading-relaxed text-[var(--text-subtle)]">Use the web app directly or install it through a supported browser. {android ? `Android ${android.version} is the current published wrapper, listed as a preview with its file details and SHA-256 checksum in the download centre.` : "Check the download centre for published Android releases."} Live rooms and account features still rely on the hosted services.</p>
          <div className="flex flex-col items-start gap-4 text-sm">
            <Link className="text-link" href="/downloads#apologia-sancta">View Android download and checksum →</Link>
            <a className="text-link" href={apologiaAppUrl + "/privacy/"} target="_blank" rel="noopener noreferrer">Read Apologia Sancta’s privacy information →</a>
            <Link className="text-link" href={product.support}>Get help with Apologia Sancta →</Link>
          </div>
        </Card>
      </div>
    </Section>
  );
}
