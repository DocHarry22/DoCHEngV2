import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";

export default function ResearchPage() {
  return (
    <Section>
      <Card>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent-secondary)]">Research</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Research operations hub</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--text-subtle)]">
          This route is prepared for Stage 3 research intelligence modules including source discovery, synthesis boards, and citation controls.
        </p>
      </Card>
    </Section>
  );
}
