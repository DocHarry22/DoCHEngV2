import { DownloadCTAGroup } from "@/components/ecosystem/download-cta-group";
import { SectionEyebrow } from "@/components/ecosystem/section-eyebrow";

type EcosystemHeroProps = {
  title: string;
  summary: string;
};

export function EcosystemHero({ title, summary }: EcosystemHeroProps) {
  return (
    <header>
      <SectionEyebrow className="tracking-[0.2em]">Ecosystem Architecture</SectionEyebrow>
      <h1 className="mt-4 text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">{title}</h1>
      <p className="mt-5 max-w-3xl text-base leading-relaxed text-[var(--text-subtle)] sm:text-lg">{summary}</p>
      <DownloadCTAGroup
        className="mt-7"
        actions={[
          { label: "Explore Product Branches", href: "/products" },
          { label: "Support Center", href: "/support", variant: "ghost" }
        ]}
      />
    </header>
  );
}
