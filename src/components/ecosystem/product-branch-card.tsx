import Link from "next/link";

import { PlatformBadge } from "@/components/ecosystem/platform-badge";
import { StatusBadge } from "@/components/ecosystem/status-badge";
import { Card } from "@/components/ui/card";
import type { EcosystemProduct } from "@/lib/site-content";

type ProductBranchCardProps = {
  product: EcosystemProduct;
};

export function ProductBranchCard({ product }: ProductBranchCardProps) {
  return (
    <Card className="h-full space-y-4 bg-[var(--surface-0)]">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">{product.positioning}</p>
        <StatusBadge status={product.status} />
      </div>

      <div>
        <h3 className="text-xl font-semibold tracking-tight">{product.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-subtle)]">{product.summary}</p>
      </div>

      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-3">
        <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Branch Domain</p>
        <p className="mt-1 text-sm font-semibold">{product.subdomain}</p>
        <p className="mt-1 text-xs uppercase tracking-[0.1em] text-[var(--text-muted)]">{product.pricingModel} model</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {product.platforms.map((platform) => (
          <PlatformBadge key={platform} platform={platform} />
        ))}
      </div>

      <div className="pt-1">
        <Link
          href={`/products/${product.slug}`}
          className="inline-flex items-center rounded-xl border border-[var(--border-strong)] bg-[var(--surface-1)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-main)] transition hover:bg-[var(--surface-2)]"
        >
          Open Branch
        </Link>
      </div>
    </Card>
  );
}
