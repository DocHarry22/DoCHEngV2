import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { SupportCategory } from "@/lib/support-content";

const availabilityTone: Record<SupportCategory["availability"], string> = {
  open: "text-emerald-700 dark:text-emerald-300",
  scheduled: "text-amber-700 dark:text-amber-300",
  "coming-soon": "text-sky-700 dark:text-sky-300"
};

type SupportCategoryCardProps = {
  category: SupportCategory;
};

export function SupportCategoryCard({ category }: SupportCategoryCardProps) {
  return (
    <Card className="h-full space-y-4 bg-[var(--surface-0)]">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold tracking-tight">{category.title}</h3>
        <p className={`text-[11px] font-semibold uppercase tracking-[0.1em] ${availabilityTone[category.availability]}`}>
          {category.availability.replace("-", " ")}
        </p>
      </div>

      <p className="text-sm leading-relaxed text-[var(--text-subtle)]">{category.shortDescription}</p>

      <div className="space-y-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-4">
        <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Recommended action</p>
        <p className="text-sm leading-relaxed text-[var(--text-subtle)]">{category.recommendedAction}</p>
        <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Contact channel</p>
        <p className="text-sm text-[var(--text-main)]">{category.contactChannel}</p>
      </div>

      <Button href={category.ctaHref} className="w-full sm:w-auto">
        {category.ctaLabel}
      </Button>
    </Card>
  );
}
