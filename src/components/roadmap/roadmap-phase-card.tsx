import type { RoadmapItem, RoadmapStatus } from "@/lib/roadmap-content";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const statusLabel: Record<RoadmapStatus, string> = {
  "in-progress": "In Progress",
  planned: "Planned",
  vision: "Vision"
};

const statusTone: Record<RoadmapStatus, string> = {
  "in-progress": "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  planned: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  vision: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300"
};

type RoadmapPhaseCardProps = {
  item: RoadmapItem;
};

export function RoadmapPhaseCard({ item }: RoadmapPhaseCardProps) {
  return (
    <Card className="h-full space-y-4 bg-[var(--surface-0)]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)]">Priority {item.priority}</span>
        <span className={cn("rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em]", statusTone[item.status])}>
          {statusLabel[item.status]}
        </span>
      </div>

      <h3 className="text-xl font-semibold tracking-tight">{item.title}</h3>
      <p className="text-sm leading-relaxed text-[var(--text-subtle)]">{item.summary}</p>

      <div className="grid gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-3 text-sm text-[var(--text-subtle)]">
        <p>
          <span className="font-semibold text-[var(--text-main)]">Product scope:</span> {item.productScope}
        </p>
        <p>
          <span className="font-semibold text-[var(--text-main)]">Platform scope:</span> {item.platformScope}
        </p>
        <p>
          <span className="font-semibold text-[var(--text-main)]">Audience:</span> {item.audience}
        </p>
      </div>

      <Button href={item.ctaHref} variant="ghost" className="w-full justify-center text-xs">
        {item.ctaLabel}
      </Button>
    </Card>
  );
}
