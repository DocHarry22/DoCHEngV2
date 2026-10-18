import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import Link from "next/link";

export const metadata = { title: "Beta and preview software", description: "Explore early DoCHEng software with clear availability and evaluation limits.", alternates: { canonical: "/labs" } };

export default function LabsPage() {
  return (
    <Section>
      <Card>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent-secondary)]">Labs</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Try early software with clear limits</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--text-subtle)]">
          Browse beta products and distinguish a working public entry from a fully accepted workflow. Use sample data during evaluation and report the product, steps and expected result when you encounter a problem.
        </p>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--text-subtle)]">The downloads centre lists the genuine Apologia Sancta Android preview with its verified checksum. Core DoCHEng Windows and Android installers remain unavailable until actual releases can be checked.</p>
        <div className="mt-8 flex flex-wrap gap-5"><Link className="action-button" href="/apps?status=beta">Explore beta applications</Link><Link className="text-link" href="/downloads">Preview release information</Link><Link className="text-link" href="/support#contact-form">Submit evaluation feedback</Link></div>
      </Card>
    </Section>
  );
}
