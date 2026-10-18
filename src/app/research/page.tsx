import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import Link from "next/link";

export const metadata = { title: "Research workflows", description: "Explore current workspace options and the planned DoCHEng Research Core.", alternates: { canonical: "/research" } };

export default function ResearchPage() {
  return (
    <Section>
      <Card>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent-secondary)]">Research</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Build a traceable research workflow</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--text-subtle)]">
          Keep source references, observations and calculation assumptions together. Explore DoCHEng Desk as a beta workspace, and review its product page for the scope of the public entry check before relying on a particular workflow.
        </p>
        <div className="notice mt-6 max-w-2xl">DoCHEng Research Core remains a planned product. No standalone research application or installer is advertised as available.</div>
        <div className="mt-8 flex flex-wrap gap-5"><Link className="action-button" href="/products/desk">Explore Desk</Link><Link className="text-link" href="/products/research-core">Research Core roadmap</Link><Link className="text-link" href="/methods">Review calculation methods</Link></div>
      </Card>
    </Section>
  );
}
