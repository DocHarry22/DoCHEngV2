import { cn } from "@/lib/cn";
import type { ReleaseStatus } from "@/lib/changelog-content";

type ReleaseStatusBadgeProps = {
  status: ReleaseStatus;
  className?: string;
};

const toneByStatus: Record<ReleaseStatus, string> = {
  shipped: "text-emerald-700 dark:text-emerald-300",
  "in-progress": "text-amber-700 dark:text-amber-300",
  planned: "text-sky-700 dark:text-sky-300"
};

export function ReleaseStatusBadge({ status, className }: ReleaseStatusBadgeProps) {
  return (
    <p className={cn("text-xs font-semibold uppercase tracking-[0.12em]", toneByStatus[status], className)} aria-label={`Status ${status}`}>
      {status}
    </p>
  );
}
