import { AuthGatedProductCard } from "@/components/auth/auth-gated-product-card";
import { SectionEyebrow } from "@/components/ecosystem/section-eyebrow";
import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/ui/section";
import { ecosystemProducts } from "@/lib/site-content";

export default function ProductsPage() {
  return (
    <Section className="scroll-mt-24 pb-16 pt-14 sm:pt-20">
      <Reveal>
        <SectionEyebrow className="tracking-[0.2em]">Product Branches</SectionEyebrow>
        <h1 className="mt-4 text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">Explore The DoCHEng Product Tree</h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--text-subtle)] sm:text-lg">
          Each branch is a dedicated execution product, sharing one technical foundation while serving different outcomes.
        </p>
      </Reveal>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {ecosystemProducts.map((product, index) => (
          <Reveal key={product.slug} delayMs={index * 90}>
            <AuthGatedProductCard product={product} featured compact />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
