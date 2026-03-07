import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

type PillarCardProps = {
  title: string;
  description: string;
  icon?: ReactNode;
  emphasized?: boolean;
  className?: string;
};

export function PillarCard({ title, description, icon, emphasized = false, className }: PillarCardProps) {
  return (
    <Card
      className={cn(
        "h-full",
        emphasized && "border-[var(--border-strong)] bg-[var(--surface-0)]",
        className
      )}
    >
      {icon ? <div className="mb-3 text-[var(--accent-secondary)]">{icon}</div> : null}
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-[var(--text-subtle)]">{description}</p>
    </Card>
  );
}
