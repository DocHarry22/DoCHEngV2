import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";

export default function MethodsPage() {
  return (
    <Section>
      <Card>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent-secondary)]">Methods</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Methods and validation</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--text-subtle)]">
          This route is prepared for method templates, reproducibility pipelines, and benchmark verification layers.
        </p>
      </Card>
    </Section>
  );
}
