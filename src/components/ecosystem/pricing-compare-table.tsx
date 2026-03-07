import { PlatformBadge } from "@/components/ecosystem/platform-badge";
import { PricingModelBadge } from "@/components/ecosystem/pricing-model-badge";
import { Card } from "@/components/ui/card";
import type { PricingEntry } from "@/lib/pricing-content";

type PricingCompareTableProps = {
  entries: PricingEntry[];
};

export function PricingCompareTable({ entries }: PricingCompareTableProps) {
  return (
    <>
      <Card className="hidden overflow-hidden p-0 md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-[var(--surface-2)]">
              <tr>
                <th className="px-4 py-3 text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Product</th>
                <th className="px-4 py-3 text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Model</th>
                <th className="px-4 py-3 text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Starting</th>
                <th className="px-4 py-3 text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Platforms</th>
                <th className="px-4 py-3 text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Best For</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.slug} className="border-t border-[var(--border-subtle)]">
                  <td className="px-4 py-4 text-sm font-semibold">{entry.productName}</td>
                  <td className="px-4 py-4">
                    <PricingModelBadge model={entry.pricingModel} />
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold">{entry.startingPrice}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      {entry.includedPlatforms.map((platform) => (
                        <PlatformBadge key={`${entry.slug}-table-${platform}`} platform={platform} />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-[var(--text-subtle)]">{entry.bestFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-3 md:hidden">
        {entries.map((entry) => (
          <Card key={`${entry.slug}-mobile-compare`} className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold">{entry.productName}</p>
              <PricingModelBadge model={entry.pricingModel} />
            </div>
            <p className="text-lg font-semibold leading-none">{entry.startingPrice}</p>
            <div className="flex flex-wrap gap-2">
              {entry.includedPlatforms.map((platform) => (
                <PlatformBadge key={`${entry.slug}-mobile-${platform}`} platform={platform} />
              ))}
            </div>
            <p className="text-sm text-[var(--text-subtle)]">{entry.bestFor}</p>
          </Card>
        ))}
      </div>
    </>
  );
}
