import { ProductBranchCard } from "@/components/ecosystem/product-branch-card";
import { SectionEyebrow } from "@/components/ecosystem/section-eyebrow";
import { Card } from "@/components/ui/card";
import type { EcosystemProduct } from "@/lib/site-content";

type ArchitectureMapProps = {
  parentDomain: string;
  products: readonly EcosystemProduct[];
};

export function ArchitectureMap({ parentDomain, products }: ArchitectureMapProps) {
  return (
    <Card className="space-y-6">
      <div>
        <SectionEyebrow>Domain Tree</SectionEyebrow>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">Parent domain strategy with branch-ready product domains.</h2>
      </div>

      <div className="rounded-2xl border border-[var(--border-strong)] bg-[var(--surface-2)] p-4">
        <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Parent Root</p>
        <p className="mt-1 text-lg font-semibold tracking-tight">{parentDomain}</p>
        <p className="mt-2 text-sm text-[var(--text-subtle)]">The root domain anchors brand trust, product discovery, pricing strategy, and ecosystem orchestration.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductBranchCard key={product.slug} product={product} />
        ))}
      </div>
    </Card>
  );
}
