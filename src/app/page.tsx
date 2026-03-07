import { ArchitectureStrip } from "@/components/ecosystem/architecture-strip";
import { DownloadCTAGroup } from "@/components/ecosystem/download-cta-group";
import { AuthGatedProductCard } from "@/components/auth/auth-gated-product-card";
import { PillarCard } from "@/components/ecosystem/pillar-card";
import { PricingPreviewCard } from "@/components/ecosystem/pricing-preview-card";
import { SectionEyebrow } from "@/components/ecosystem/section-eyebrow";
import { BrandLockup } from "@/components/branding/brand-lockup";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { domainArchitecture, ecosystemProducts, valuePillars } from "@/lib/site-content";
import { roadmapPhases } from "@/lib/roadmap-content";

const statusTone = {
  live: "text-emerald-600 dark:text-emerald-300",
  beta: "text-amber-600 dark:text-amber-300",
  "coming-soon": "text-sky-700 dark:text-sky-300"
} as const;

const activeBranches = ecosystemProducts.filter((product) => product.status !== "coming-soon");
const futureBranches = ecosystemProducts.filter((product) => product.status === "coming-soon");

export default function HomePage() {
  return (
    <>
      <Section id="home" className="ecosystem-hero scroll-mt-24 pb-12 pt-14 sm:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal>
            <SectionEyebrow className="tree-kicker tracking-[0.2em]">Parent Engineering Tree</SectionEyebrow>
            <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              One root platform. Multiple app branches. More growth ahead.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--text-subtle)] sm:text-lg">
              DoCHEng now presents the ecosystem as a living product tree: the parent root at `docheng.co.za`, active branches for current apps,
              and future branches already mapped for products still to be built.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href="/#products">Explore Apps</Button>
              <Button href="/downloads" variant="ghost">
                Open Downloads
              </Button>
              <Button href="/#architecture" variant="ghost">
                View Tree Architecture
              </Button>
            </div>
            <div className="mt-8 grid max-w-xl grid-cols-1 gap-2 sm:grid-cols-3">
              <div className="tree-stat-card rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-0)] px-3 py-2">
                <p className="text-xs text-[var(--text-muted)]">Live Branches</p>
                <p className="text-lg font-semibold">{activeBranches.length}</p>
              </div>
              <div className="tree-stat-card rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-0)] px-3 py-2">
                <p className="text-xs text-[var(--text-muted)]">Future Branches</p>
                <p className="text-lg font-semibold">{futureBranches.length + 1}</p>
              </div>
              <div className="tree-stat-card rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-0)] px-3 py-2">
                <p className="text-xs text-[var(--text-muted)]">Platforms</p>
                <p className="text-lg font-semibold">Desktop + Android</p>
              </div>
            </div>
          </Reveal>

          <Reveal delayMs={120} className="relative">
            <Card className="tree-canvas space-y-6">
              <div className="tree-root-panel rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-2)] p-4">
                <p className="mb-2 font-mono text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">Root Node</p>
                <BrandLockup linked={false} />
              </div>
              <div className="space-y-4">
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--accent-secondary)]">Branch Map</p>
                <p className="text-sm text-[var(--text-subtle)]">
                  Every branch carries the same technical standards, product language, and distribution strategy while serving a specific execution workflow.
                </p>
                <div className="tree-map grid gap-4 pt-1 sm:grid-cols-2">
                  <div className="space-y-2">
                    <p className="tree-lane-label">Active Branches</p>
                    {activeBranches.map((product) => (
                      <div key={product.slug} className="branch-node branch-node-active">
                        <p className="text-sm font-semibold">{product.name}</p>
                        <p className={`text-[11px] font-semibold uppercase tracking-[0.1em] ${statusTone[product.status]}`}>{product.status}</p>
                        <p className="mt-1 text-xs text-[var(--text-muted)]">{product.subdomain}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <p className="tree-lane-label">Future Growth</p>
                    {futureBranches.map((product) => (
                      <div key={product.slug} className="branch-node branch-node-future">
                        <p className="text-sm font-semibold">{product.name}</p>
                        <p className={`text-[11px] font-semibold uppercase tracking-[0.1em] ${statusTone[product.status]}`}>{product.status}</p>
                        <p className="mt-1 text-xs text-[var(--text-muted)]">{product.subdomain}</p>
                      </div>
                    ))}
                    <div className="branch-node branch-node-future">
                      <p className="text-sm font-semibold">Future Product</p>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)]">planned</p>
                      <p className="mt-1 text-xs text-[var(--text-muted)]">future-product.docheng.co.za</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Reveal>
        </div>
      </Section>

      <Section id="about" className="scroll-mt-24 py-10 sm:py-12">
        <Reveal>
          <Card className="grid gap-5 bg-[var(--surface-0)] sm:grid-cols-[0.65fr_1.35fr] sm:items-start">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent-secondary)]">About The Ecosystem</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">A visual system built around growth.</h2>
            </div>
            <p className="text-base leading-relaxed text-[var(--text-subtle)] sm:text-lg">
              The redesign positions each product as a branch from the same engineering root. This makes navigation clearer, communicates expansion plans,
              and tells users exactly where each app belongs in the bigger DoCHEng journey.
            </p>
          </Card>
        </Reveal>
      </Section>

      <Section id="value" className="py-10 sm:py-12">
        <Reveal>
          <SectionEyebrow>What DoCHEng Helps You Do</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Build better outcomes across study, work, and technical growth.</h2>
        </Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {valuePillars.map((pillar, index) => (
            <Reveal key={pillar.title} delayMs={index * 90}>
              <PillarCard title={pillar.title} description={pillar.body} emphasized={index === 0} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="products" className="scroll-mt-24 py-10 sm:py-12">
        <Reveal>
          <SectionEyebrow>Current Branches</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Specialized apps connected by one parent root.</h2>
        </Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {ecosystemProducts.map((product, index) => (
            <Reveal key={product.slug} delayMs={index * 90}>
              <AuthGatedProductCard product={product} featured />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="platforms" className="py-10 sm:py-12">
        <Reveal>
          <Card className="bg-[var(--surface-0)]">
            <SectionEyebrow>Desktop + Android Access</SectionEyebrow>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">Every branch ships on both major pathways.</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Card className="shadow-none">
                <h3 className="text-lg font-semibold">Desktop Distribution</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-subtle)]">
                  Install high-focus technical workflows on desktop for deep execution, larger workspaces, and full engineering context.
                </p>
                <DownloadCTAGroup className="mt-4" actions={[{ label: "Browse Desktop Builds", href: "/downloads", variant: "ghost" }]} />
              </Card>
              <Card className="shadow-none">
                <h3 className="text-lg font-semibold">Android Distribution</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-subtle)]">
                  Keep each branch portable with Android companions built for capture, review, and quick technical action in the field.
                </p>
                <DownloadCTAGroup className="mt-4" actions={[{ label: "Browse Android Builds", href: "/downloads", variant: "ghost" }]} />
              </Card>
            </div>
          </Card>
        </Reveal>
      </Section>

      <Section id="pricing" className="scroll-mt-24 py-10 sm:py-12">
        <Reveal>
          <Card className="space-y-6 bg-[var(--surface-0)]">
            <div>
              <SectionEyebrow>Pricing By Branch Type</SectionEyebrow>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">Flexible models for different stages of ecosystem growth.</h2>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {ecosystemProducts.map((product) => (
                <PricingPreviewCard
                  key={product.slug}
                  productName={product.name}
                  pricingModel={product.pricingModel}
                  startingPrice={product.startingPrice}
                  summary={product.positioning}
                  planNote={product.plans[0]?.summary}
                  cta={{ label: "View Branch", href: `/products/${product.slug}`, variant: "ghost" }}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href="/pricing">Compare Plans</Button>
              <Button href="/downloads" variant="ghost">
                View Downloads
              </Button>
              <Button href="/products" variant="ghost">
                View Product Catalog
              </Button>
            </div>
          </Card>
        </Reveal>
      </Section>

      <Section id="architecture" className="scroll-mt-24 py-10 sm:py-12">
        <Reveal>
          <div className="space-y-6">
            <SectionEyebrow>Ecosystem Tree Architecture</SectionEyebrow>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{domainArchitecture.visionLine}</h2>
            <ArchitectureStrip
              parentDomain={domainArchitecture.parent}
              subdomains={domainArchitecture.subdomains}
              description="Concise preview: one parent brand root, specialized product subdomains, and coordinated runtime distribution."
            />
            <div className="flex flex-wrap gap-3">
              <Button href="/ecosystem">Open Full Architecture Layer</Button>
              <Button href="/downloads" variant="ghost">
                Check Distribution Flow
              </Button>
              <Button href="/products" variant="ghost">
                Inspect Product Branches
              </Button>
            </div>
          </div>
        </Reveal>
      </Section>

      <Section id="roadmap" className="scroll-mt-24 py-10 sm:py-12">
        <Reveal>
          <Card className="space-y-6 bg-[var(--surface-0)]">
            <div>
              <SectionEyebrow>Future Vision</SectionEyebrow>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">Roadmap phases show how the ecosystem scales with clarity.</h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--text-subtle)] sm:text-base">
                DoCHEng grows through staged capability maturity across product branches, platform channels, and trust layers. See the full roadmap for near-term, mid-term, and long-term direction.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {roadmapPhases.map((phase) => (
                <div key={phase.id} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)]">{phase.horizon}</p>
                  <h3 className="mt-2 text-lg font-semibold tracking-tight">{phase.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-subtle)]">{phase.summary}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href="/roadmap">Open Full Roadmap</Button>
              <Button href="/ecosystem" variant="ghost">
                View Architecture
              </Button>
            </div>
          </Card>
        </Reveal>
      </Section>

      <Section id="contact" className="scroll-mt-24 pt-10 sm:pt-12">
        <Reveal>
          <Card className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent-secondary)]">Next Step</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">Choose your branch and get the right support for every step.</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href="/#products">Explore Apps</Button>
              <Button href="/support" variant="ghost">
                Open Support Center
              </Button>
            </div>
          </Card>
        </Reveal>
      </Section>
    </>
  );
}
