import { DownloadCTAGroup } from "@/components/ecosystem/download-cta-group";
import { SectionEyebrow } from "@/components/ecosystem/section-eyebrow";
import type { CompanyHero } from "@/lib/company-content";

type AboutHeroProps = {
  hero: CompanyHero;
};

export function AboutHero({ hero }: AboutHeroProps) {
  return (
    <header>
      <SectionEyebrow className="tracking-[0.2em]">{hero.eyebrow}</SectionEyebrow>
      <h1 className="mt-5 text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">{hero.title}</h1>
      <p className="mt-6 max-w-3xl text-base leading-relaxed text-[var(--text-subtle)] sm:text-lg">{hero.summary}</p>
      <DownloadCTAGroup className="mt-8" actions={[hero.ctaPrimary, hero.ctaSecondary, hero.ctaTertiary]} />
    </header>
  );
}
