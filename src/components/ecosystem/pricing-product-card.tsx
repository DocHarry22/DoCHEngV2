import { DownloadCTAGroup } from "@/components/ecosystem/download-cta-group";
import { PlatformBadge } from "@/components/ecosystem/platform-badge";
import { PricingModelBadge } from "@/components/ecosystem/pricing-model-badge";
import { StatusBadge } from "@/components/ecosystem/status-badge";
import { Card } from "@/components/ui/card";
import type { PricingEntry } from "@/lib/pricing-content";
import { cn } from "@/lib/cn";

type PricingProductCardProps = {
  entry: PricingEntry;
  className?: string;
};

export function PricingProductCard({ entry, className }: PricingProductCardProps) {
  return (
    <Card className={cn("h-full space-y-5 border-[var(--border-strong)]", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold">{entry.productName}</h3>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--text-subtle)]">{entry.summary}</p>
        </div>
        <StatusBadge status={entry.status} className="mt-1" />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <PricingModelBadge model={entry.pricingModel} />
        <p className="text-xs uppercase tracking-[0.1em] text-[var(--text-muted)]">{entry.billingCadence}</p>
      </div>

      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-0)] p-4">
        <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Starting Price</p>
        <p className="mt-1 text-2xl font-semibold leading-none">{entry.startingPrice}</p>
        <p className="mt-2 text-sm text-[var(--text-subtle)]">{entry.planNote}</p>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Included Platforms</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {entry.includedPlatforms.map((platform) => (
            <PlatformBadge key={`${entry.slug}-${platform}`} platform={platform} />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Best For</p>
        <p className="text-sm leading-relaxed text-[var(--text-subtle)]">{entry.bestFor}</p>
      </div>

      <ul className="space-y-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-0)] p-4">
        {entry.notableFeatures.map((feature) => (
          <li key={feature} className="text-sm leading-relaxed text-[var(--text-subtle)]">
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)] align-middle" />
            {feature}
          </li>
        ))}
      </ul>

      <DownloadCTAGroup className="pt-1" actions={entry.actions} />
    </Card>
  );
}
