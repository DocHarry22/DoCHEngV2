import Link from "next/link";
import { publishedCatalogue } from "@/lib/server/catalogue";
import { categories } from "@/lib/catalogue";
import { engineeringTools } from "@/lib/engineering-tools";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { BrandLockup } from "@/components/branding/brand-lockup";
import { ProductIcon } from "@/components/apps/product-icon";
import { ProductAccessLinks } from "@/components/apps/product-access-links";
import { ProductFinder } from "@/components/apps/product-finder";
import { Newsletter } from "@/components/marketing/newsletter";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "DoCHEng — Driven by Curiosity",
  description:
    "Purposeful software for engineering, research, documents and technical careers. Explore DoCHEng apps and free engineering tools.",
  alternates: { canonical: "/" },
};
export default function Home() {
  const products = publishedCatalogue();
  return (
    <>
      <Section id="home" className="ecosystem-hero pb-12 pt-16 sm:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="eyebrow">Independent software. Connected thinking.</p>
            <h1 className="mt-6 text-5xl font-semibold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
              Curiosity,
              <br />
              put to <span className="text-[var(--accent-primary)]">work.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-[var(--text-subtle)]">
              One engineering root. A growing collection of tools for your
              research, documents, career and technical work.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link className="action-button" href="/apps">
                Explore applications →
              </Link>
              <Link className="text-link self-center" href="/tools">
                Open engineering tools
              </Link>
            </div>
            <p className="mt-8 font-mono text-xs text-[var(--text-muted)]">
              ENGINEERING · DOCUMENTS · CAREERS · RESEARCH
            </p>
          </div>
          <div className="ecosystem-stage">
            <div className="mx-auto w-fit rounded-2xl border border-[var(--border-strong)] bg-[var(--surface-1)] p-5">
              <BrandLockup linked={false} />
            </div>
            <svg
              className="tree-connectors"
              viewBox="0 0 360 60"
              preserveAspectRatio="none"
              fill="none"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                d="M180 0v24M60 60V38q0-14 14-14h212q14 0 14 14v22M180 24v36"
                strokeWidth="1.5"
              />
            </svg>
            <div className="grid grid-cols-3 gap-2">
              {products.slice(0, 3).map((p) => (
                <Link
                  key={p.id}
                  href={"/products/" + p.slug}
                  className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-3 text-center"
                >
                  <ProductIcon
                    slug={p.icon}
                    imageUrl={p.logoUrl}
                    className="!h-12 !w-12"
                  />
                  <p className="mt-3 text-xs font-semibold">
                    {p.name.replace("DoCHEng ", "")}
                  </p>
                  <p className="mt-2 font-mono text-[9px] uppercase text-[var(--text-muted)]">
                    {p.status.replaceAll("-", " ")}
                  </p>
                </Link>
              ))}
            </div>
            <div className="mt-8 flex items-center justify-between border-t border-[var(--border-subtle)] pt-4">
              <span className="eyebrow">The engineering tree</span>
              <Link href="/ecosystem" className="text-link">
                How it connects ↗
              </Link>
            </div>
          </div>
        </div>
      </Section>
      <Section id="products" className="space-y-7 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Built around real work</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
              A tool for your next step.
            </h2>
          </div>
          <Link href="/apps" className="text-link">
            Browse the collection →
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {products.map((p) => {
              return (
                <Card key={p.id} className="market-card flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <ProductIcon slug={p.icon} imageUrl={p.logoUrl} />
                    <span className="status-pill">
                      {p.status.replaceAll("-", " ")}
                    </span>
                  </div>
                  <div>
                    <p className="eyebrow">{p.category}</p>
                    <h3 className="mt-2 text-2xl font-semibold">{p.name}</h3>
                  </div>
                  <p className="flex-1 text-sm leading-relaxed text-[var(--text-subtle)]">
                    {p.summary}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {p.platforms.join(" · ")} ·{" "}
                    {p.pricing === "unconfirmed"
                      ? "Pricing under review"
                      : p.pricing}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <ProductAccessLinks product={p} primaryClassName="text-link" />
                    <Link className="text-link" href={"/products/" + p.slug}>
                      Product details
                    </Link>
                  </div>
                </Card>
              );
            })}
        </div>
      </Section>
      <Section className="space-y-7 py-12">
        <p className="eyebrow">Explore by purpose</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories
            .filter((c) => c !== "Sister Projects")
            .map((category, index) => (
              <Link
                key={category}
                className="home-category"
                href={"/apps?category=" + encodeURIComponent(category)}
              >
                <span className="font-mono text-xs text-[var(--text-muted)]">
                  0{index + 1}
                </span>
                <h2 className="text-xl font-semibold">{category}</h2>
                <span className="text-link">Explore →</span>
              </Link>
            ))}
        </div>
      </Section>
      <Section className="py-12">
        <Card className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Free engineering workbench</p>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
              Make the first calculation count.
            </h2>
            <p className="my-5 leading-relaxed text-[var(--text-subtle)]">
              From unit conversions to pump power and mass balances: useful
              screening tools with equations, units, assumptions and references.
            </p>
            <Link className="action-button" href="/tools">
              Explore all {engineeringTools.length + 1} tools
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {engineeringTools
              .filter((t) =>
                [
                  "pump-power",
                  "pipe-velocity",
                  "tank-volume",
                  "hydraulic-retention-time",
                ].includes(t.slug),
              )
              .map((t) => (
                <Link
                  key={t.slug}
                  className="home-category"
                  href={"/tools/" + t.slug}
                >
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-xs text-[var(--text-subtle)]">
                    {t.equation}
                  </p>
                </Link>
              ))}
          </div>
        </Card>
      </Section>
      <Section className="py-12">
        <ProductFinder products={products} />
      </Section>
      <Section id="architecture" className="py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <p className="eyebrow">One root. Independent branches.</p>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
              Connected by purpose.
              <br />
              Clear about availability.
            </h2>
            <p className="my-5 leading-relaxed text-[var(--text-subtle)]">
              DoCHEng brings specialised applications together under one
              engineering brand. Each product keeps its own data permissions and
              release path. The hub helps you find the right starting point.
            </p>
            <Link className="text-link" href="/ecosystem">
              Explore the ecosystem →
            </Link>
          </div>
          <div className="space-y-4">
            <Card>
              <h3 className="text-lg font-semibold">Web applications</h3>
              <p className="mt-2 text-sm text-[var(--text-subtle)]">
                Verified entry pages are linked directly. Beta status reflects
                the remaining product acceptance work.
              </p>
            </Card>
            <Card>
              <h3 className="text-lg font-semibold">Desktop and Android</h3>
              <p className="my-2 text-sm text-[var(--text-subtle)]">
                Installers appear only when release files, compatibility and
                checksums have been verified. No core DoCHEng native installers
                are currently verified.
              </p>
              <Link className="text-link" href="/downloads">
                Check the download centre →
              </Link>
            </Card>
          </div>
        </div>
      </Section>
      <Section id="pricing" className="py-12">
        <Card className="grid gap-6 sm:grid-cols-[1.5fr_1fr]">
          <div>
            <p className="eyebrow">Straightforward access</p>
            <h2 className="mt-4 text-3xl font-semibold">
              Explore before you commit.
            </h2>
            <p className="mt-4 leading-relaxed text-[var(--text-subtle)]">
              The engineering workbench is free. App plan amounts are still
              proposals while commercial configuration is reviewed. Paid
              checkout is not activated.
            </p>
          </div>
          <div className="flex flex-col items-start justify-center gap-4">
            <Link className="action-button" href="/pricing">
              Review plan proposals
            </Link>
            <Link className="text-link" href="/support#contact-form">
              Discuss team or enterprise needs
            </Link>
          </div>
        </Card>
      </Section>
      <Section className="py-12">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            [
              "Documentation",
              "Setup, technical context and practical guidance.",
              "/docs",
            ],
            [
              "Support",
              "Send an enquiry and keep a persistent ticket reference.",
              "/support",
            ],
            [
              "Roadmap and updates",
              "Follow release direction and the work still ahead.",
              "/roadmap",
            ],
          ].map(([title, summary, href]) => (
            <Card key={href} className="space-y-4">
              <h2 className="text-xl font-semibold">{title}</h2>
              <p className="text-sm text-[var(--text-subtle)]">{summary}</p>
              <Link className="text-link" href={href}>
                Explore →
              </Link>
            </Card>
          ))}
        </div>
      </Section>
      <Section id="contact" className="pb-20 pt-12">
        <Card className="space-y-6">
          <div>
            <p className="eyebrow">Stay curious</p>
            <h2 className="mt-4 text-3xl font-semibold">
              Be part of what comes next.
            </h2>
            <p className="mt-3 text-[var(--text-subtle)]">
              Choose product updates or early-access news. Confirm your email
              before announcements begin.
            </p>
          </div>
          <Newsletter />
        </Card>
      </Section>
    </>
  );
}
