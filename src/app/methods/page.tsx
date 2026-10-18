import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import Link from "next/link";

export const metadata = { title: "Methods and validation", description: "Check equations, units and assumptions before using an engineering screening result.", alternates: { canonical: "/methods" } };

export default function MethodsPage() {
  return (
    <Section>
      <Card>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent-secondary)]">Methods</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Methods and validation</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--text-subtle)]">
          A useful calculation records its inputs, units, governing equation and assumptions. Our engineering tools show that context alongside the result so you can review each step.
        </p>
        <h2 className="mt-8 text-xl font-semibold">A repeatable calculation check</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-[var(--text-subtle)]">
          <li>Convert inputs to the units requested by the tool. Distinguish mass, volume, flow rate and concentration.</li>
          <li>Read the equation and scope. For example, pump hydraulic power is density × gravity × flow × head; shaft power also accounts for efficiency.</li>
          <li>Compare a simple independent reference case and check whether the magnitude makes physical sense.</li>
          <li>Export the inputs and result with the assumptions. A screening estimate still needs project-specific design review.</li>
        </ol>
        <div className="mt-8 flex flex-wrap gap-5"><Link className="action-button" href="/tools">Open engineering tools</Link><Link className="text-link" href="/tools/pump-power">Work through pump power</Link><Link className="text-link" href="/support#contact-form">Report a calculation concern</Link></div>
      </Card>
    </Section>
  );
}
