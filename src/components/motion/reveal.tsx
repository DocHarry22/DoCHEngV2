import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
};

export function Reveal({ children, className, delayMs = 0 }: RevealProps) {
  return (
    <div className={cn("reveal-up", className)} style={{ animationDelay: `${delayMs}ms` }}>
      {children}
    </div>
  );
}
