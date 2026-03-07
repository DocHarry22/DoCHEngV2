import { DownloadCTAGroup } from "@/components/ecosystem/download-cta-group";
import { Card } from "@/components/ui/card";
import type { CredibilitySignal } from "@/lib/company-content";

const statusTone: Record<CredibilitySignal["status"], string> = {
  active: "text-emerald-700 dark:text-emerald-300",
  "in-progress": "text-amber-700 dark:text-amber-300"
};

type CredibilitySignalCardProps = {
  signal: CredibilitySignal;
};

export function CredibilitySignalCard({ signal }: CredibilitySignalCardProps) {
  return (
    <Card className="h-full space-y-4 bg-[var(--surface-0)]">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold tracking-tight">{signal.title}</h3>
        <p className={`text-[11px] font-semibold uppercase tracking-[0.12em] ${statusTone[signal.status]}`}>{signal.status}</p>
      </div>

      <p className="text-sm leading-relaxed text-[var(--text-subtle)]">{signal.summary}</p>
      <p className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-3 text-sm leading-relaxed text-[var(--text-subtle)]">
        <span className="font-semibold text-[var(--text-main)]">Evidence:</span> {signal.evidence}
      </p>
      <DownloadCTAGroup actions={[{ label: signal.routeLabel, href: signal.routeHref, variant: "ghost" }]} />
    </Card>
  );
}
