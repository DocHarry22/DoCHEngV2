import { DownloadCTAGroup } from "@/components/ecosystem/download-cta-group";
import { Card } from "@/components/ui/card";
import { SectionEyebrow } from "@/components/ecosystem/section-eyebrow";

type InterestCTAProps = {
  title: string;
  summary: string;
};

export function InterestCTA({ title, summary }: InterestCTAProps) {
  return (
    <Card className="space-y-4 bg-[var(--surface-0)] sm:p-8">
      <SectionEyebrow>Future Access</SectionEyebrow>
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
      <p className="max-w-3xl text-sm leading-relaxed text-[var(--text-subtle)] sm:text-base">{summary}</p>
      <DownloadCTAGroup
        className="pt-2"
        actions={[
          { label: "Explore Active Products", href: "/products" },
          { label: "Review Pricing Models", href: "/pricing", variant: "ghost" },
          { label: "Open Support Pathways", href: "/support", variant: "ghost" },
          { label: "Browse Documentation", href: "/docs", variant: "ghost" }
        ]}
      />
    </Card>
  );
}
