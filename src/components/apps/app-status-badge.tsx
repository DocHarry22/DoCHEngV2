import { appStatusLabel, type AppStatus } from "@/lib/apps-content";
import { cn } from "@/lib/cn";

const statusTone: Record<AppStatus, string> = {
  live: "text-emerald-700 dark:text-emerald-300",
  beta: "text-amber-700 dark:text-amber-300",
  "early-access": "text-cyan-700 dark:text-cyan-300",
  planned: "text-indigo-700 dark:text-indigo-300",
  "coming-soon": "text-sky-700 dark:text-sky-300",
  internal: "text-slate-700 dark:text-slate-300"
};

type AppStatusBadgeProps = {
  status: AppStatus;
  className?: string;
};

export function AppStatusBadge({ status, className }: AppStatusBadgeProps) {
  return (
    <span className={cn("inline-flex items-center rounded-full border border-[var(--border-subtle)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]", statusTone[status], className)}>
      {appStatusLabel[status]}
    </span>
  );
}
