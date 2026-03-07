import { DownloadCTAGroup } from "@/components/ecosystem/download-cta-group";
import { SectionEyebrow } from "@/components/ecosystem/section-eyebrow";
import { Card } from "@/components/ui/card";
import type { EcosystemAccessLayer } from "@/lib/site-content";

type AccessLayerStripProps = {
  layers: readonly EcosystemAccessLayer[];
};

export function AccessLayerStrip({ layers }: AccessLayerStripProps) {
  return (
    <Card className="space-y-6 bg-[var(--surface-0)]">
      <div>
        <SectionEyebrow>Access Layer</SectionEyebrow>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">Desktop and Android as coordinated runtime channels.</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {layers.map((layer) => (
          <div key={layer.channel} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">{layer.channel}</p>
            <h3 className="mt-2 text-lg font-semibold">{layer.label}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-subtle)]">{layer.summary}</p>
            <DownloadCTAGroup className="mt-4" actions={[{ label: layer.ctaLabel, href: layer.ctaHref, variant: "ghost" }]} />
          </div>
        ))}
      </div>
    </Card>
  );
}
