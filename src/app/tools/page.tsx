import Link from "next/link";
import { engineeringTools } from "@/lib/engineering-tools";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
export const metadata = {
  title: "Free engineering tools",
  description:
    "Engineering screening calculators with inputs, units, equations, assumptions and source references.",
  alternates: { canonical: "/tools" },
};
export default function Tools() {
  return (
    <Section className="space-y-8 py-16">
      <p className="eyebrow">Open engineering workbench</p>
      <h1 className="max-w-3xl text-4xl font-semibold sm:text-5xl">
        A useful calculation.
        <br />A clearer next step.
      </h1>
      <p className="max-w-3xl text-lg leading-relaxed text-[var(--text-subtle)]">
        Free tools for first-pass technical checks. Each shows its units,
        equation and assumptions. Calculations run in your browser and can be
        exported.
      </p>
      <p className="notice">
        These simplified screening calculations require independent professional
        verification before design, operation, chemical handling or safety
        decisions.
      </p>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <Card>
          <p className="eyebrow">Units and dimensions</p>
          <h2 className="mt-3 text-xl font-semibold">Unit converter</h2>
          <p className="my-4 text-sm">
            Convert compatible length, pressure, volume, flow, mass and
            temperature units.
          </p>
          <Link className="text-link" href="/tools/unit-converter">
            Open converter →
          </Link>
        </Card>
        {engineeringTools.map((tool) => (
          <Card key={tool.slug} className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">{tool.name}</h2>
            <p className="flex-1 text-sm text-[var(--text-subtle)]">
              {tool.summary}
            </p>
            <Link className="text-link" href={"/tools/" + tool.slug}>
              Open calculator →
            </Link>
          </Card>
        ))}
      </div>
      <Link className="text-link" href="/products/desk">
        Explore DoCHEng Desk for research and technical work
      </Link>
    </Section>
  );
}
