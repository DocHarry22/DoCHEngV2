import type { ReleaseChannel } from "@/lib/distribution-content";
import { cn } from "@/lib/cn";

type ReleaseChannelBadgeProps = {
  channel: ReleaseChannel;
  className?: string;
};

const channelTone: Record<ReleaseChannel, string> = {
  stable: "border-emerald-500/35 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  beta: "border-amber-500/35 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  preview: "border-sky-500/35 bg-sky-500/10 text-sky-700 dark:text-sky-300"
};

export function ReleaseChannelBadge({ channel, className }: ReleaseChannelBadgeProps) {
  return (
    <span
      className={cn(
        "rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em]",
        channelTone[channel],
        className
      )}
    >
      {channel}
    </span>
  );
}
