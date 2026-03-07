import { DownloadCTAGroup } from "@/components/ecosystem/download-cta-group";
import { Card } from "@/components/ui/card";
import type { CompanyTimelinePhase } from "@/lib/company-content";

type CompanyTimelineStripProps = {
  phases: CompanyTimelinePhase[];
};

export function CompanyTimelineStrip({ phases }: CompanyTimelineStripProps) {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {phases.map((phase) => (
        <Card key={phase.id} className="h-full space-y-4 bg-[var(--surface-0)]">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent-secondary)]">{phase.phase}</p>
          <h3 className="text-xl font-semibold tracking-tight">{phase.title}</h3>
          <p className="text-sm leading-relaxed text-[var(--text-subtle)]">{phase.summary}</p>
          <div className="space-y-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-3">
            {phase.focusAreas.map((line) => (
              <p key={line} className="text-sm leading-relaxed text-[var(--text-subtle)]">
                <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)] align-middle" />
                {line}
              </p>
            ))}
          </div>
          <DownloadCTAGroup actions={[{ label: "Open Related Layer", href: phase.routeHref, variant: "ghost" }]} />
        </Card>
      ))}
    </div>
  );
}
