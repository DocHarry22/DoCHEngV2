import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type CardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
};

export function Card({ children, className, ...rest }: CardProps) {
  return (
    <article
      {...rest}
      className={cn(
        "rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-6 shadow-[var(--shadow-soft)]",
        className
      )}
    >
      {children}
    </article>
  );
}
