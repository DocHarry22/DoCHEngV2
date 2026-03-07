import { cn } from "@/lib/cn";
import { getPlatformScopeMeta, type ReleasePlatformScopeId } from "@/lib/changelog-content";

type PlatformScopeBadgeProps = {
  scopeId: ReleasePlatformScopeId;
  className?: string;
};

export function PlatformScopeBadge({ scopeId, className }: PlatformScopeBadgeProps) {
  const scope = getPlatformScopeMeta(scopeId);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface-1)] px-3 py-1 text-xs font-medium uppercase tracking-[0.08em] text-[var(--text-subtle)]",
        className
      )}
    >
      {scope.label}
    </span>
  );
}
