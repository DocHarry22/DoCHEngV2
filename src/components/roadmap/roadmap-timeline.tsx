import { RoadmapPhaseCard } from "@/components/roadmap/roadmap-phase-card";
import { SectionEyebrow } from "@/components/ecosystem/section-eyebrow";
import type { RoadmapItem, RoadmapPhase } from "@/lib/roadmap-content";
import { Card } from "@/components/ui/card";

type RoadmapTimelineProps = {
  phases: readonly RoadmapPhase[];
  itemsByPhase: Record<RoadmapPhase["id"], RoadmapItem[]>;
};

export function RoadmapTimeline({ phases, itemsByPhase }: RoadmapTimelineProps) {
  return (
    <div className="space-y-8">
      {phases.map((phase) => (
        <div key={phase.id} className="space-y-4">
          <Card className="space-y-3 bg-[var(--surface-0)]">
            <SectionEyebrow className="tracking-[0.16em]">{phase.horizon}</SectionEyebrow>
            <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">{phase.label}</h3>
            <p className="text-sm leading-relaxed text-[var(--text-subtle)] sm:text-base">{phase.summary}</p>
          </Card>

          <div className="grid gap-5 lg:grid-cols-3">
            {itemsByPhase[phase.id].map((item) => (
              <RoadmapPhaseCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
