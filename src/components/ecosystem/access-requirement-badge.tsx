import type { AccessRequirement } from "@/lib/distribution-content";
import { cn } from "@/lib/cn";

type AccessRequirementBadgeProps = {
  requirement: AccessRequirement;
  className?: string;
};

const requirementLabel: Record<AccessRequirement, string> = {
  public: "Public",
  account: "Account",
  paid: "Paid",
  waitlist: "Waitlist"
};

const requirementTone: Record<AccessRequirement, string> = {
  public: "border-[var(--border-subtle)] bg-[var(--surface-1)] text-[var(--text-main)]",
  account: "border-[var(--border-strong)] bg-[var(--surface-2)] text-[var(--text-main)]",
  paid: "border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300",
  waitlist: "border-sky-500/35 bg-sky-500/10 text-sky-700 dark:text-sky-300"
};

export function AccessRequirementBadge({ requirement, className }: AccessRequirementBadgeProps) {
  return (
    <span className={cn("rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em]", requirementTone[requirement], className)}>
      {requirementLabel[requirement]}
    </span>
  );
}
