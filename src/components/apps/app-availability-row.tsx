import type { EcosystemApp } from "@/lib/apps-content";

import { AccessTypeBadge } from "@/components/apps/access-type-badge";
import { AppStatusBadge } from "@/components/apps/app-status-badge";

type AppAvailabilityRowProps = {
  app: EcosystemApp;
};

export function AppAvailabilityRow({ app }: AppAvailabilityRowProps) {
  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-0)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-semibold">{app.name}</h3>
        <AppStatusBadge status={app.status} />
      </div>

      <p className="mt-1 text-sm text-[var(--text-subtle)]">{app.shortDescription}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {app.accessTypes.map((type) => (
          <AccessTypeBadge key={`${app.slug}-${type}`} accessType={type} />
        ))}
      </div>

      <div className="mt-3 grid gap-2 text-xs text-[var(--text-muted)] sm:grid-cols-2">
        <p>
          <span className="font-semibold text-[var(--text-subtle)]">Subdomain:</span>{" "}
          {app.subdomain ?? "Planned"}
        </p>
        <p>
          <span className="font-semibold text-[var(--text-subtle)]">Hub Route:</span>{" "}
          {app.routeHref ?? "TBD"}
        </p>
      </div>
    </div>
  );
}
