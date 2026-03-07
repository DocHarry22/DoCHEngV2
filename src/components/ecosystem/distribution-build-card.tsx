import { AccessRequirementBadge } from "@/components/ecosystem/access-requirement-badge";
import { DownloadCTAGroup } from "@/components/ecosystem/download-cta-group";
import { PlatformBadge } from "@/components/ecosystem/platform-badge";
import { ReleaseChannelBadge } from "@/components/ecosystem/release-channel-badge";
import { StatusBadge } from "@/components/ecosystem/status-badge";
import { Card } from "@/components/ui/card";
import type { DistributionBuild } from "@/lib/distribution-content";

const statusLabel = {
  available: "Build Ready",
  limited: "Limited Access",
  "coming-soon": "Coming Soon"
} as const;

type DistributionBuildCardProps = {
  build: DistributionBuild;
};

export function DistributionBuildCard({ build }: DistributionBuildCardProps) {
  return (
    <Card className="h-full space-y-4 border-[var(--border-strong)] bg-[var(--surface-0)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">{build.productName}</h3>
          <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">{statusLabel[build.status]}</p>
        </div>
        <StatusBadge status={build.status === "available" ? "live" : build.status === "limited" ? "beta" : "coming-soon"} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <PlatformBadge platform={build.platform} />
        <ReleaseChannelBadge channel={build.releaseChannel} />
        <AccessRequirementBadge requirement={build.accessRequirement} />
      </div>

      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-3">
        <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Version</p>
        <p className="mt-1 text-base font-semibold">{build.version}</p>
        <p className="mt-2 text-sm text-[var(--text-subtle)]">{build.installer}</p>
      </div>

      <p className="text-sm leading-relaxed text-[var(--text-subtle)]">{build.releaseNotes}</p>

      <ul className="space-y-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-3">
        {build.installNotes.map((note) => (
          <li key={note} className="text-sm leading-relaxed text-[var(--text-subtle)]">
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)] align-middle" />
            {note}
          </li>
        ))}
      </ul>

      <DownloadCTAGroup actions={build.actions} className="pt-1" />
    </Card>
  );
}
