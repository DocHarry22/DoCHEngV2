import { cn } from "@/lib/cn";

type VersionBadgeProps = {
  version: string;
  className?: string;
};

export function VersionBadge({ version, className }: VersionBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[var(--border-strong)] bg-[var(--surface-2)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--text-main)]",
        className
      )}
      aria-label={`Version ${version}`}
    >
      {version}
    </span>
  );
}
