import { Marketplace } from "@/components/apps/marketplace";
import { Section } from "@/components/ui/section";
import { publishedCatalogue } from "@/lib/server/catalogue";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Apps Hub",
  description:
    "Discover DoCHEng software for research, documents and technical careers. Compare real availability, platforms and access.",
  alternates: { canonical: "/apps" },
};
export default function Apps() {
  return (
    <>
      <Section className="ecosystem-hero pb-8 pt-16">
        <p className="eyebrow">The DoCHEng software collection</p>
        <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl">
          Find your next
          <br />
          <span className="text-[var(--accent-primary)]">way of working.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--text-subtle)]">
          Purposeful tools for engineering, research, documents and your next
          career step. Explore what is available and what is still taking shape.
        </p>
      </Section>
      <Section className="pb-20 pt-8">
        <Marketplace products={publishedCatalogue()} />
      </Section>
    </>
  );
}
