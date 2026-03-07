import type { Platform } from "@/lib/site-content";

import { cn } from "@/lib/cn";

type PlatformBadgeProps = {
  platform: Platform;
  className?: string;
};

export function PlatformBadge({ platform, className }: PlatformBadgeProps) {
  return (
    <span
      className={cn(
        "rounded-full border border-[var(--border-strong)] bg-[var(--surface-2)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-main)]",
        className
      )}
    >
      {platform}
    </span>
  );
}
