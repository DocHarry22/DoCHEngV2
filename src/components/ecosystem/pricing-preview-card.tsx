import { DownloadCTAGroup, type CTAAction } from "@/components/ecosystem/download-cta-group";
import { PricingModelBadge } from "@/components/ecosystem/pricing-model-badge";
import { Card } from "@/components/ui/card";
import type { PricingModel } from "@/lib/site-content";

type PricingPreviewCardProps = {
  productName: string;
  pricingModel: PricingModel;
  startingPrice: string;
  summary: string;
  planNote?: string;
  cta?: CTAAction;
  className?: string;
};

export function PricingPreviewCard({ productName, pricingModel, startingPrice, summary, planNote, cta, className }: PricingPreviewCardProps) {
  return (
    <Card className={className}>
      <PricingModelBadge model={pricingModel} />
      <h3 className="mt-2 text-xl font-semibold">{productName}</h3>
      <p className="mt-2 text-2xl font-semibold leading-none">{startingPrice}</p>
      <p className="mt-3 text-sm leading-relaxed text-[var(--text-subtle)]">{summary}</p>
      {planNote ? <p className="mt-3 text-xs uppercase tracking-[0.1em] text-[var(--text-muted)]">{planNote}</p> : null}
      {cta ? <DownloadCTAGroup className="mt-4" actions={[cta]} /> : null}
    </Card>
  );
}
