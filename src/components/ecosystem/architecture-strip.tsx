import { Card } from "@/components/ui/card";

type ArchitectureStripProps = {
  parentDomain: string;
  subdomains: readonly string[];
  description?: string;
  className?: string;
};

export function ArchitectureStrip({ parentDomain, subdomains, description, className }: ArchitectureStripProps) {
  return (
    <Card className={className}>
      {description ? <p className="text-sm leading-relaxed text-[var(--text-subtle)]">{description}</p> : null}
      <div className="tree-architecture-grid mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[var(--border-strong)] bg-[var(--surface-2)] p-3">
          <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Parent</p>
          <p className="mt-1 text-sm font-semibold">{parentDomain}</p>
        </div>
        {subdomains.map((domain) => (
          <div key={domain} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-3">
            <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Product Domain</p>
            <p className="mt-1 text-sm font-semibold">{domain}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
