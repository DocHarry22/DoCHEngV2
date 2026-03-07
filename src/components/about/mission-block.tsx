import { SectionEyebrow } from "@/components/ecosystem/section-eyebrow";
import { Card } from "@/components/ui/card";
import type { CompanyMission } from "@/lib/company-content";

type MissionBlockProps = {
  mission: CompanyMission;
};

export function MissionBlock({ mission }: MissionBlockProps) {
  return (
    <Card className="space-y-5 bg-[var(--surface-0)]">
      <div>
        <SectionEyebrow>Mission</SectionEyebrow>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{mission.title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-subtle)] sm:text-base">{mission.summary}</p>
      </div>

      <div className="space-y-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-4">
        {mission.commitments.map((line) => (
          <p key={line} className="text-sm leading-relaxed text-[var(--text-subtle)]">
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)] align-middle" />
            {line}
          </p>
        ))}
      </div>
    </Card>
  );
}
