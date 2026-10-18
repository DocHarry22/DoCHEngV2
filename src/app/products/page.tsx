import { Marketplace } from "@/components/apps/marketplace";
import { Section } from "@/components/ui/section";
import { publishedCatalogue } from "@/lib/server/catalogue";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Products",
  description:
    "Explore the DoCHEng software range and selected independent sister projects.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <Section className="scroll-mt-24 pb-16 pt-14 sm:pt-20">
      <div>
        <p className="eyebrow">Product Branches</p>
        <h1 className="mt-4 text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Explore The DoCHEng Product Tree
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--text-subtle)] sm:text-lg">
          Explore the core DoCHEng range and selected independent projects, with
          verified availability and clear release status.
        </p>
      </div>

      <div className="mt-8">
        <Marketplace products={publishedCatalogue()} />
      </div>
    </Section>
  );
}
