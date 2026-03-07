import Link from "next/link";

import { cn } from "@/lib/cn";
import { getProductScopeMeta, type ReleaseProductScopeId } from "@/lib/changelog-content";

type ProductScopeBadgeProps = {
  scopeId: ReleaseProductScopeId;
  className?: string;
};

export function ProductScopeBadge({ scopeId, className }: ProductScopeBadgeProps) {
  const scope = getProductScopeMeta(scopeId);

  return (
    <Link
      href={scope.href}
      className={cn(
        "inline-flex items-center rounded-full border border-[var(--border-strong)] bg-[var(--surface-2)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-main)] transition hover:bg-[var(--surface-1)]",
        className
      )}
    >
      {scope.label}
    </Link>
  );
}
