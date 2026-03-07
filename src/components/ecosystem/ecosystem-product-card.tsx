import { DownloadCTAGroup, type CTAAction } from "@/components/ecosystem/download-cta-group";
import { PlatformBadge } from "@/components/ecosystem/platform-badge";
import { StatusBadge } from "@/components/ecosystem/status-badge";
import { Card } from "@/components/ui/card";
import type { EcosystemProduct } from "@/lib/site-content";
import { cn } from "@/lib/cn";

type EcosystemProductCardProps = {
  product: EcosystemProduct;
  actions?: CTAAction[];
  featured?: boolean;
  compact?: boolean;
  className?: string;
};

export function EcosystemProductCard({ product, actions = [], featured = false, compact = false, className }: EcosystemProductCardProps) {
  return (
    <Card className={cn("h-full space-y-4", featured && "border-[var(--border-strong)]", className)}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">{product.positioning}</p>
        <StatusBadge status={product.status} />
      </div>

      <h3 className="text-xl font-semibold">{product.name}</h3>
      <p className="text-sm leading-relaxed text-[var(--text-subtle)]">{product.summary}</p>

      {!compact ? (
        <p className="text-sm text-[var(--text-subtle)]">
          <span className="font-semibold text-[var(--text-main)]">Target:</span> {product.targetUser}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {product.platforms.map((platform) => (
          <PlatformBadge key={platform} platform={platform} />
        ))}
      </div>

      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-0)] p-3">
        <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Starting Price</p>
        <p className="mt-1 text-lg font-semibold">{product.startingPrice}</p>
        <p className="mt-1 text-xs uppercase tracking-[0.1em] text-[var(--text-muted)]">{product.pricingModel} model</p>
        <p className="text-sm text-[var(--text-subtle)]">{product.subdomain}</p>
      </div>

      <DownloadCTAGroup className="pt-1" actions={actions} />
    </Card>
  );
}
