import { DownloadCTAGroup } from "@/components/ecosystem/download-cta-group";
import { SectionEyebrow } from "@/components/ecosystem/section-eyebrow";
import { Card } from "@/components/ui/card";
import { PlatformScopeBadge } from "@/components/changelog/platform-scope-badge";
import { ProductScopeBadge } from "@/components/changelog/product-scope-badge";
import { ReleaseStatusBadge } from "@/components/changelog/release-status-badge";
import { UpdateTypeBadge } from "@/components/changelog/update-type-badge";
import { VersionBadge } from "@/components/changelog/version-badge";
import type { ReleaseNoteEntry } from "@/lib/changelog-content";

type ReleaseHighlightCardProps = {
  entry: ReleaseNoteEntry;
};

export function ReleaseHighlightCard({ entry }: ReleaseHighlightCardProps) {
  const releaseDate = new Date(entry.date);
  const displayDate = releaseDate.toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <Card className="space-y-5 bg-[var(--surface-0)]">
      <SectionEyebrow>Latest Highlight</SectionEyebrow>
      <div className="flex flex-wrap items-center gap-2">
        <VersionBadge version={entry.version} />
        <UpdateTypeBadge type={entry.updateType} />
        <ReleaseStatusBadge status={entry.status} />
        <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">{displayDate}</p>
      </div>
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{entry.title}</h2>
      <p className="max-w-4xl text-sm leading-relaxed text-[var(--text-subtle)] sm:text-base">{entry.summary}</p>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Product Scope</p>
          <div className="flex flex-wrap gap-2">
            {entry.productScope.map((scopeId) => (
              <ProductScopeBadge key={scopeId} scopeId={scopeId} />
            ))}
          </div>
        </div>

        <div className="space-y-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Platform Scope</p>
          <div className="flex flex-wrap gap-2">
            {entry.platformScope.map((scopeId) => (
              <PlatformScopeBadge key={scopeId} scopeId={scopeId} />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-4">
        {entry.detailNotes.map((note) => (
          <p key={note} className="text-sm leading-relaxed text-[var(--text-subtle)]">
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)] align-middle" />
            {note}
          </p>
        ))}
      </div>

      <DownloadCTAGroup
        actions={[
          ...(entry.relatedRoute ? [{ label: "Open Related Route", href: entry.relatedRoute }] : []),
          ...(entry.roadmapRoute ? [{ label: "View Roadmap Context", href: entry.roadmapRoute, variant: "ghost" as const }] : []),
          { label: "Support For Updates", href: "/support#contact-form", variant: "ghost" }
        ]}
      />
    </Card>
  );
}
