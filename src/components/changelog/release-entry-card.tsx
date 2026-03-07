import { Card } from "@/components/ui/card";
import { PlatformScopeBadge } from "@/components/changelog/platform-scope-badge";
import { ProductScopeBadge } from "@/components/changelog/product-scope-badge";
import { ReleaseStatusBadge } from "@/components/changelog/release-status-badge";
import { UpdateTypeBadge } from "@/components/changelog/update-type-badge";
import { VersionBadge } from "@/components/changelog/version-badge";
import type { ReleaseNoteEntry } from "@/lib/changelog-content";

type ReleaseEntryCardProps = {
  entry: ReleaseNoteEntry;
};

export function ReleaseEntryCard({ entry }: ReleaseEntryCardProps) {
  const releaseDate = new Date(entry.date);
  const displayDate = releaseDate.toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });

  return (
    <Card className="h-full space-y-4 bg-[var(--surface-0)]">
      <div className="flex flex-wrap items-center gap-2">
        <VersionBadge version={entry.version} />
        <UpdateTypeBadge type={entry.updateType} />
        <ReleaseStatusBadge status={entry.status} />
        <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">{displayDate}</p>
      </div>

      <h3 className="text-xl font-semibold tracking-tight">{entry.title}</h3>
      <p className="text-sm leading-relaxed text-[var(--text-subtle)]">{entry.summary}</p>

      <div className="space-y-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-3">
        {entry.detailNotes.map((note) => (
          <p key={note} className="text-sm leading-relaxed text-[var(--text-subtle)]">
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)] align-middle" />
            {note}
          </p>
        ))}
      </div>

      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Product Scope</p>
        <div className="flex flex-wrap gap-2">
          {entry.productScope.map((scopeId) => (
            <ProductScopeBadge key={scopeId} scopeId={scopeId} />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Platform Scope</p>
        <div className="flex flex-wrap gap-2">
          {entry.platformScope.map((scopeId) => (
            <PlatformScopeBadge key={scopeId} scopeId={scopeId} />
          ))}
        </div>
      </div>
    </Card>
  );
}
