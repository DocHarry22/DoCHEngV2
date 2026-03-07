import { SectionEyebrow } from "@/components/ecosystem/section-eyebrow";
import { Card } from "@/components/ui/card";

type SystemLayer = {
  id: string;
  title: string;
  summary: string;
};

type ConnectedSystemDiagramProps = {
  layers: readonly SystemLayer[];
};

export function ConnectedSystemDiagram({ layers }: ConnectedSystemDiagramProps) {
  return (
    <Card className="space-y-6">
      <div>
        <SectionEyebrow>Connected System</SectionEyebrow>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">How the ecosystem stays coherent as branches scale.</h2>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {layers.map((layer, index) => (
          <div key={layer.id} className="relative rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Layer {index + 1}</p>
            <h3 className="mt-2 text-base font-semibold tracking-tight">{layer.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-subtle)]">{layer.summary}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
