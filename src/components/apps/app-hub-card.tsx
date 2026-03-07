import Link from "next/link";
import type { ReactNode } from "react";

import { AccessTypeBadge } from "@/components/apps/access-type-badge";
import { AppStatusBadge } from "@/components/apps/app-status-badge";
import { Card } from "@/components/ui/card";
import { appCategoryLabel, pricingStateLabel, type EcosystemApp } from "@/lib/apps-content";
import { cn } from "@/lib/cn";

type AppHubCardProps = {
  app: EcosystemApp;
  featured?: boolean;
};

function AppActionLink({ href, external, children }: { href: string; external?: boolean; children: ReactNode }) {
  const className =
    "inline-flex items-center justify-center rounded-lg border border-[var(--border-strong)] bg-[var(--surface-1)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-main)] transition hover:bg-[var(--surface-2)]";

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function iconFor(app: EcosystemApp) {
  const common = "h-9 w-9 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-0)]";

  switch (app.icon) {
    case "desk":
      return <div aria-hidden className={cn(common, "bg-[linear-gradient(145deg,rgba(31,142,255,0.2),transparent)]")} />;
    case "resume":
      return <div aria-hidden className={cn(common, "bg-[linear-gradient(145deg,rgba(250,179,30,0.24),transparent)]")} />;
    case "compass":
      return <div aria-hidden className={cn(common, "bg-[linear-gradient(145deg,rgba(67,191,143,0.24),transparent)]")} />;
    case "research":
      return <div aria-hidden className={cn(common, "bg-[linear-gradient(145deg,rgba(130,155,255,0.24),transparent)]")} />;
    case "labs":
      return <div aria-hidden className={cn(common, "bg-[linear-gradient(145deg,rgba(206,132,255,0.24),transparent)]")} />;
    default:
      return <div aria-hidden className={common} />;
  }
}

export function AppHubCard({ app, featured = false }: AppHubCardProps) {
  return (
    <Card className={cn("h-full space-y-4", featured && "border-[var(--border-strong)]")}> 
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {iconFor(app)}
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">{appCategoryLabel[app.category]}</p>
            <h3 className="text-xl font-semibold">{app.name}</h3>
          </div>
        </div>
        <AppStatusBadge status={app.status} />
      </div>

      <p className="text-sm leading-relaxed text-[var(--text-subtle)]">{app.longDescription}</p>
      <p className="text-sm text-[var(--text-subtle)]">
        <span className="font-semibold text-[var(--text-main)]">Audience:</span> {app.audience}
      </p>

      <div className="flex flex-wrap gap-2">
        {app.accessTypes.map((type) => (
          <AccessTypeBadge key={`${app.slug}-${type}`} accessType={type} />
        ))}
      </div>

      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-0)] p-3">
        <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Availability</p>
        <p className="mt-1 text-sm text-[var(--text-subtle)]">{app.availabilityNote ?? "Availability details will be announced."}</p>
        <p className="mt-2 text-xs text-[var(--text-muted)]">Subdomain: {app.subdomain ?? "Planned"}</p>
        <p className="mt-1 text-xs text-[var(--text-muted)]">Pricing: {pricingStateLabel[app.pricingModel]}</p>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        {app.ctas.map((action) => (
          <AppActionLink key={`${app.slug}-${action.type}-${action.href}`} href={action.href} external={action.external}>
            {action.label}
          </AppActionLink>
        ))}
      </div>
    </Card>
  );
}
