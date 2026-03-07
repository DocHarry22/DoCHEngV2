import { DownloadCTAGroup } from "@/components/ecosystem/download-cta-group";
import { SectionEyebrow } from "@/components/ecosystem/section-eyebrow";

type SupportHeroProps = {
  title: string;
  summary: string;
};

export function SupportHero({ title, summary }: SupportHeroProps) {
  return (
    <header>
      <SectionEyebrow className="tracking-[0.2em]">Support Hub</SectionEyebrow>
      <h1 className="mt-5 text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">{title}</h1>
      <p className="mt-6 max-w-3xl text-base leading-relaxed text-[var(--text-subtle)] sm:text-lg">{summary}</p>
      <DownloadCTAGroup
        className="mt-8"
        actions={[
          { label: "Find Help Topics", href: "#categories" },
          { label: "Contact Support", href: "#contact-form", variant: "ghost" },
          { label: "Business Enquiry", href: "#business-pathway", variant: "ghost" }
        ]}
      />
    </header>
  );
}
