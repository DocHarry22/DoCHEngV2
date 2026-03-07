import { cn } from "@/lib/cn";
import type { EntitlementState } from "@/lib/auth/types";

type EntitlementBadgeProps = {
  state: EntitlementState;
  className?: string;
};

const toneMap: Record<EntitlementState, string> = {
  none: "border-[var(--border-subtle)] bg-[var(--surface-2)] text-[var(--text-muted)]",
  trial: "border-amber-300/60 bg-amber-100/60 text-amber-700 dark:border-amber-400/40 dark:bg-amber-500/10 dark:text-amber-300",
  active: "border-emerald-300/60 bg-emerald-100/60 text-emerald-700 dark:border-emerald-400/40 dark:bg-emerald-500/10 dark:text-emerald-300"
};

const labelMap: Record<EntitlementState, string> = {
  none: "No Access",
  trial: "Trial Access",
  active: "Included"
};

export function EntitlementBadge({ state, className }: EntitlementBadgeProps) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em]", toneMap[state], className)}>
      {labelMap[state]}
    </span>
  );
}
