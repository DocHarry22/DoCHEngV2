"use client";

import { useMemo, useState } from "react";

import { ReleaseEntryCard } from "@/components/changelog/release-entry-card";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import type { ReleaseNoteEntry, ReleasePlatformScopeId, ReleaseProductScopeId, ReleaseUpdateType } from "@/lib/changelog-content";

type ReleaseNotesBoardProps = {
  entries: ReleaseNoteEntry[];
};

type ProductFilter = "all" | ReleaseProductScopeId;
type PlatformFilter = "all" | ReleasePlatformScopeId;
type TypeFilter = "all" | ReleaseUpdateType;

const productFilterOptions: Array<{ label: string; value: ProductFilter }> = [
  { label: "All Scope", value: "all" },
  { label: "Parent Platform", value: "parent-platform" },
  { label: "Desk", value: "desk" },
  { label: "Resume", value: "resume" },
  { label: "Compass", value: "compass" }
];

const platformFilterOptions: Array<{ label: string; value: PlatformFilter }> = [
  { label: "All Platforms", value: "all" },
  { label: "Web", value: "web" },
  { label: "Desktop", value: "desktop" },
  { label: "Android", value: "android" },
  { label: "Parent", value: "parent-platform" }
];

const typeFilterOptions: Array<{ label: string; value: TypeFilter }> = [
  { label: "All Types", value: "all" },
  { label: "Major", value: "major" },
  { label: "Improvement", value: "improvement" },
  { label: "Fix", value: "fix" },
  { label: "Minor", value: "minor" },
  { label: "Upcoming", value: "upcoming" }
];

function byNewestDate(left: ReleaseNoteEntry, right: ReleaseNoteEntry) {
  return new Date(right.date).getTime() - new Date(left.date).getTime();
}

export function ReleaseNotesBoard({ entries }: ReleaseNotesBoardProps) {
  const [productFilter, setProductFilter] = useState<ProductFilter>("all");
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

  const filteredEntries = useMemo(() => {
    return [...entries]
      .filter((entry) => (productFilter === "all" ? true : entry.productScope.includes(productFilter)))
      .filter((entry) => (platformFilter === "all" ? true : entry.platformScope.includes(platformFilter)))
      .filter((entry) => (typeFilter === "all" ? true : entry.updateType === typeFilter))
      .sort(byNewestDate);
  }, [entries, platformFilter, productFilter, typeFilter]);

  return (
    <div className="space-y-6">
      <Card className="space-y-4 bg-[var(--surface-0)]">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Product Scope</p>
            <div className="flex flex-wrap gap-2">
              {productFilterOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setProductFilter(option.value)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] transition",
                    productFilter === option.value
                      ? "border-[var(--accent-primary)] bg-[var(--surface-2)] text-[var(--text-main)]"
                      : "border-[var(--border-subtle)] bg-[var(--surface-1)] text-[var(--text-subtle)] hover:text-[var(--text-main)]"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Platform Scope</p>
            <div className="flex flex-wrap gap-2">
              {platformFilterOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPlatformFilter(option.value)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] transition",
                    platformFilter === option.value
                      ? "border-[var(--accent-primary)] bg-[var(--surface-2)] text-[var(--text-main)]"
                      : "border-[var(--border-subtle)] bg-[var(--surface-1)] text-[var(--text-subtle)] hover:text-[var(--text-main)]"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Update Type</p>
            <div className="flex flex-wrap gap-2">
              {typeFilterOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTypeFilter(option.value)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] transition",
                    typeFilter === option.value
                      ? "border-[var(--accent-primary)] bg-[var(--surface-2)] text-[var(--text-main)]"
                      : "border-[var(--border-subtle)] bg-[var(--surface-1)] text-[var(--text-subtle)] hover:text-[var(--text-main)]"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {filteredEntries.length ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {filteredEntries.map((entry) => (
            <ReleaseEntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      ) : (
        <Card className="bg-[var(--surface-0)]">
          <p className="text-sm leading-relaxed text-[var(--text-subtle)]">No release entries match this filter combination yet. Reset filters to view all updates.</p>
        </Card>
      )}
    </div>
  );
}
