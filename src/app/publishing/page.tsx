import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import Link from "next/link";

export const metadata = { title: "Publishing technical work", description: "Share calculation context and verify software release information before distribution.", alternates: { canonical: "/publishing" } };

export default function PublishingPage() {
  return (
    <Section>
      <Card>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent-secondary)]">Publishing</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Share technical work with context</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--text-subtle)]">
          Include the question, input values and units, equation, assumptions and result when sharing a calculation. The engineering tools provide a JSON export that you can retain with your own project notes.
        </p>
        <h2 className="mt-8 text-xl font-semibold">Check a software release</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--text-subtle)]">Use the published release channel, date, system requirements and SHA-256 checksum. Preview and beta files require evaluation; a matching checksum does not establish publisher signing or installation acceptance.</p>
        <div className="mt-8 flex flex-wrap gap-5"><Link className="action-button" href="/downloads">Review verified downloads</Link><Link className="text-link" href="/tools">Export a calculation</Link><Link className="text-link" href="/docs/release-notes-rollout-impact">Read the release guide</Link></div>
      </Card>
    </Section>
  );
}
