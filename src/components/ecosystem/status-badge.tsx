import type { EcosystemProduct } from "@/lib/site-content";

import { cn } from "@/lib/cn";

type ProductStatus = EcosystemProduct["status"];

type StatusBadgeProps = {
  status: ProductStatus;
  className?: string;
};

const statusTone: Record<ProductStatus, string> = {
  live: "text-emerald-600 dark:text-emerald-300",
  beta: "text-amber-600 dark:text-amber-300",
  "coming-soon": "text-sky-700 dark:text-sky-300"
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <p className={cn("text-xs font-semibold uppercase tracking-[0.12em]", statusTone[status], className)} aria-label={`Status ${status}`}>
      {status}
    </p>
  );
}
