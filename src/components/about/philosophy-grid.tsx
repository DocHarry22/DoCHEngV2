import { Card } from "@/components/ui/card";
import type { OperatingPrinciple } from "@/lib/company-content";

type PhilosophyGridProps = {
  principles: OperatingPrinciple[];
};

export function PhilosophyGrid({ principles }: PhilosophyGridProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {principles.map((principle) => (
        <Card key={principle.title} className="h-full space-y-3 bg-[var(--surface-0)]">
          <h3 className="text-lg font-semibold tracking-tight">{principle.title}</h3>
          <p className="text-sm leading-relaxed text-[var(--text-subtle)]">{principle.summary}</p>
          <p className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-3 text-sm leading-relaxed text-[var(--text-subtle)]">
            <span className="font-semibold text-[var(--text-main)]">Execution:</span> {principle.executionNote}
          </p>
        </Card>
      ))}
    </div>
  );
}
