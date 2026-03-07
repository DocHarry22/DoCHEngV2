import { Card } from "@/components/ui/card";
import type { FAQGroup as FAQGroupModel } from "@/lib/support-content";

type FAQGroupProps = {
  group: FAQGroupModel;
};

export function FAQGroup({ group }: FAQGroupProps) {
  return (
    <Card className="space-y-3 bg-[var(--surface-0)]">
      <h3 className="text-lg font-semibold tracking-tight">{group.title}</h3>
      {group.items.map((item) => (
        <details key={item.question} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-4">
          <summary className="cursor-pointer list-none text-sm font-semibold leading-relaxed text-[var(--text-main)] focus-visible:outline-none">
            {item.question}
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-[var(--text-subtle)]">{item.answer}</p>
        </details>
      ))}
    </Card>
  );
}
