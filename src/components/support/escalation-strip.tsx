import { DownloadCTAGroup } from "@/components/ecosystem/download-cta-group";
import { SectionEyebrow } from "@/components/ecosystem/section-eyebrow";
import { Card } from "@/components/ui/card";

type EscalationStripProps = {
  title: string;
  summary: string;
};

export function EscalationStrip({ title, summary }: EscalationStripProps) {
  return (
    <Card className="bg-[var(--surface-0)]">
      <SectionEyebrow>Still Need Help?</SectionEyebrow>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--text-subtle)] sm:text-base">{summary}</p>
      <DownloadCTAGroup
        className="mt-6"
        actions={[
          { label: "Open Support Form", href: "#contact-form" },
          { label: "Pricing Support", href: "#pricing-access", variant: "ghost" },
          { label: "Business Enquiry", href: "#business-pathway", variant: "ghost" }
        ]}
      />
    </Card>
  );
}
