import { Card } from "@/components/ui/card";
import type { TeamProfile } from "@/lib/company-content";

const roleTone: Record<TeamProfile["roleType"], string> = {
  founder: "text-amber-700 dark:text-amber-300",
  product: "text-sky-700 dark:text-sky-300",
  engineering: "text-emerald-700 dark:text-emerald-300",
  operations: "text-violet-700 dark:text-violet-300"
};

type TeamProfileCardProps = {
  profile: TeamProfile;
};

export function TeamProfileCard({ profile }: TeamProfileCardProps) {
  return (
    <Card className="h-full space-y-4 bg-[var(--surface-0)]">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold tracking-tight">{profile.title}</h3>
        <p className={`text-[11px] font-semibold uppercase tracking-[0.12em] ${roleTone[profile.roleType]}`}>{profile.roleType}</p>
      </div>

      <p className="text-sm leading-relaxed text-[var(--text-subtle)]">{profile.remit}</p>

      <div className="space-y-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-4">
        {profile.responsibilities.map((line) => (
          <p key={line} className="text-sm leading-relaxed text-[var(--text-subtle)]">
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)] align-middle" />
            {line}
          </p>
        ))}
      </div>

      <p className="text-sm leading-relaxed text-[var(--text-subtle)]">
        <span className="font-semibold text-[var(--text-main)]">Collaboration:</span> {profile.collaborationPoint}
      </p>
    </Card>
  );
}
