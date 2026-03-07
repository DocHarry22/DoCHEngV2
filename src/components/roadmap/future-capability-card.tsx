import type { EvolutionArea, RoadmapStatus } from "@/lib/roadmap-content";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

const statusLabel: Record<RoadmapStatus, string> = {
  "in-progress": "In Progress",
  planned: "Planned",
  vision: "Aspirational"
};

const statusTone: Record<RoadmapStatus, string> = {
  "in-progress": "text-emerald-700 dark:text-emerald-300",
  planned: "text-amber-700 dark:text-amber-300",
  vision: "text-sky-700 dark:text-sky-300"
};

type FutureCapabilityCardProps = {
  area: EvolutionArea;
};

export function FutureCapabilityCard({ area }: FutureCapabilityCardProps) {
  return (
    <Card className="h-full space-y-3 bg-[var(--surface-0)]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold tracking-tight">{area.title}</h3>
        <span className={cn("text-xs font-semibold uppercase tracking-[0.1em]", statusTone[area.status])}>{statusLabel[area.status]}</span>
      </div>
      <p className="text-sm leading-relaxed text-[var(--text-subtle)]">{area.summary}</p>
      <p className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-subtle)]">
        <span className="font-semibold text-[var(--text-main)]">Scope:</span> {area.scope}
      </p>
    </Card>
  );
}
