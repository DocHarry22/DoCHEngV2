import Link from "next/link";

import { getAppLauncherTarget, type EcosystemApp } from "@/lib/apps-content";
import { Card } from "@/components/ui/card";

type SubdomainLinkCardProps = {
  app: EcosystemApp;
};

export function SubdomainLinkCard({ app }: SubdomainLinkCardProps) {
  const launcherTarget = getAppLauncherTarget(app);

  return (
    <Card className="space-y-2 p-4">
      <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Subdomain Route</p>
      <h3 className="text-base font-semibold">{app.name}</h3>
      <p className="text-sm text-[var(--text-subtle)]">{app.subdomain ?? "Subdomain TBD"}</p>
      {launcherTarget.external ? (
        <a
          href={launcherTarget.href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex text-xs font-semibold uppercase tracking-[0.08em] text-[var(--accent-primary)] hover:opacity-85"
        >
          {launcherTarget.label}
        </a>
      ) : (
        <Link href={launcherTarget.href} className="inline-flex text-xs font-semibold uppercase tracking-[0.08em] text-[var(--accent-primary)] hover:opacity-85">
          {launcherTarget.label}
        </Link>
      )}
    </Card>
  );
}
