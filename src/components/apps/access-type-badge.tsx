import { appAccessTypeLabel, type AppAccessType } from "@/lib/apps-content";
import { cn } from "@/lib/cn";

type AccessTypeBadgeProps = {
  accessType: AppAccessType;
  className?: string;
};

export function AccessTypeBadge({ accessType, className }: AccessTypeBadgeProps) {
  return (
    <span className={cn("inline-flex items-center rounded-md border border-[var(--border-subtle)] bg-[var(--surface-0)] px-2 py-1 text-[11px] font-medium text-[var(--text-subtle)]", className)}>
      {appAccessTypeLabel[accessType]}
    </span>
  );
}
