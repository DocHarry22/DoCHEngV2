import { notFound } from "next/navigation";
import Link from "next/link";
import { engineeringTools } from "@/lib/engineering-tools";
import { Calculator, UnitConverter } from "@/components/tools/calculator";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return [
    { slug: "unit-converter" },
    ...engineeringTools.map((t) => ({ slug: t.slug })),
  ];
}
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const tool = engineeringTools.find((t) => t.slug === slug);
  return {
    title:
      slug === "unit-converter"
        ? "Unit converter"
        : (tool?.name ?? "Tool not found"),
    description: tool?.summary,
    alternates: { canonical: "/tools/" + slug },
  };
}
export default async function Tool({ params }: Props) {
  const { slug } = await params;
  const tool = engineeringTools.find((t) => t.slug === slug);
  if (!tool && slug !== "unit-converter") notFound();
  return (
    <Section className="space-y-7 py-16">
      <Link className="text-link" href="/tools">
        ← All engineering tools
      </Link>
      <p className="eyebrow">Free screening calculation</p>
      <h1 className="text-4xl font-semibold">
        {tool?.name ?? "Unit converter"}
      </h1>
      <p className="max-w-3xl text-lg text-[var(--text-subtle)]">
        {tool?.summary ??
          "Convert compatible quantities with explicit dimensions."}
      </p>
      {tool ? <Calculator slug={slug} /> : <UnitConverter />}
      {tool ? (
        <Card className="space-y-4">
          <h2 className="text-2xl font-semibold">Equation and assumptions</h2>
          <p className="overflow-x-auto rounded-lg bg-[var(--surface-0)] p-4 font-mono text-sm">
            {tool.equation}
          </p>
          <p className="leading-relaxed text-[var(--text-subtle)]">
            {tool.assumptions}
          </p>
          <p className="text-sm">
            The source below supports the underlying unit, mass-balance or
            hydraulic method. It does not validate this software or a proposed
            engineering design.
          </p>
          <a
            className="text-link"
            href={tool.reference.url}
            rel="noopener noreferrer"
            target="_blank"
          >
            {tool.reference.label}
          </a>
        </Card>
      ) : null}
      <p className="notice">
        Use for preliminary screening. Verify inputs, physical assumptions and
        results independently before engineering design, operational changes or
        safety decisions.
      </p>
      <Link className="text-link" href="/products/desk">
        Continue research in DoCHEng Desk
      </Link>
    </Section>
  );
}
