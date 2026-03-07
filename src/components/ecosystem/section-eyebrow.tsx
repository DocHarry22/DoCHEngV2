import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type SectionEyebrowProps = {
  children: ReactNode;
  className?: string;
};

export function SectionEyebrow({ children, className }: SectionEyebrowProps) {
  return <p className={cn("font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent-secondary)]", className)}>{children}</p>;
}
