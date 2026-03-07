import { DownloadCTAGroup } from "@/components/ecosystem/download-cta-group";
import { SectionEyebrow } from "@/components/ecosystem/section-eyebrow";

type RoadmapHeroProps = {
  title: string;
  summary: string;
};

export function RoadmapHero({ title, summary }: RoadmapHeroProps) {
  return (
    <div className="space-y-5">
      <SectionEyebrow className="tracking-[0.2em]">Roadmap / Future Vision</SectionEyebrow>
      <h1 className="max-w-5xl text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">{title}</h1>
      <p className="max-w-3xl text-base leading-relaxed text-[var(--text-subtle)] sm:text-lg">{summary}</p>
      <DownloadCTAGroup
        className="pt-2"
        actions={[
          { label: "Explore Current Products", href: "/products" },
          { label: "Open Architecture Layer", href: "/ecosystem", variant: "ghost" },
          { label: "Contact DoCHEng", href: "/support", variant: "ghost" }
        ]}
      />
    </div>
  );
}
