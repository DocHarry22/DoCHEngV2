import { cn } from "@/lib/cn";
import type { ReleaseUpdateType } from "@/lib/changelog-content";

type UpdateTypeBadgeProps = {
  type: ReleaseUpdateType;
  className?: string;
};

const toneByType: Record<ReleaseUpdateType, string> = {
  major: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  minor: "border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  fix: "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  improvement: "border-cyan-500/40 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
  maintenance: "border-slate-500/40 bg-slate-500/10 text-slate-700 dark:text-slate-300",
  upcoming: "border-violet-500/40 bg-violet-500/10 text-violet-700 dark:text-violet-300"
};

export function UpdateTypeBadge({ type, className }: UpdateTypeBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em]",
        toneByType[type],
        className
      )}
      aria-label={`Update type ${type}`}
    >
      {type}
    </span>
  );
}
