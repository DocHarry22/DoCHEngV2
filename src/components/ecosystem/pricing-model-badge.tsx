import type { PricingModel } from "@/lib/site-content";
import { cn } from "@/lib/cn";

type PricingModelBadgeProps = {
  model: PricingModel;
  className?: string;
};

const toneByModel: Record<PricingModel, string> = {
  free: "border-emerald-300/60 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300",
  "free-trial": "border-cyan-300/60 bg-cyan-50 text-cyan-700 dark:border-cyan-500/40 dark:bg-cyan-500/10 dark:text-cyan-300",
  "one-time": "border-violet-300/60 bg-violet-50 text-violet-700 dark:border-violet-500/40 dark:bg-violet-500/10 dark:text-violet-300",
  monthly: "border-sky-300/60 bg-sky-50 text-sky-700 dark:border-sky-500/40 dark:bg-sky-500/10 dark:text-sky-300",
  annual: "border-indigo-300/60 bg-indigo-50 text-indigo-700 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-300",
  tiered: "border-amber-300/60 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300"
};

const labelByModel: Record<PricingModel, string> = {
  free: "Free",
  "free-trial": "Free Trial",
  "one-time": "One-time",
  monthly: "Monthly",
  annual: "Annual",
  tiered: "Tiered"
};

export function PricingModelBadge({ model, className }: PricingModelBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.09em]",
        toneByModel[model],
        className
      )}
    >
      {labelByModel[model]}
    </span>
  );
}
