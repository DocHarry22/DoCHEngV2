import { AppStatusBadge } from "@/components/apps/app-status-badge";
import { Card } from "@/components/ui/card";
import { getAppLauncherTarget, type EcosystemApp } from "@/lib/apps-content";

type AppSwitcherPanelProps = {
  apps: EcosystemApp[];
};

export function AppSwitcherPanel({ apps }: AppSwitcherPanelProps) {
  return (
    <Card className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Quick App Switcher</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">Move between branches instantly</h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {apps.map((app) => (
          <a
            key={`switch-${app.slug}`}
            href={getAppLauncherTarget(app).href}
            target={getAppLauncherTarget(app).external ? "_blank" : undefined}
            rel={getAppLauncherTarget(app).external ? "noreferrer" : undefined}
            className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-0)] p-3 transition hover:border-[var(--border-strong)]"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-[var(--text-main)]">{app.name}</p>
              <AppStatusBadge status={app.status} className="text-[9px]" />
            </div>
            <p className="mt-1 text-xs text-[var(--text-subtle)]">{app.shortDescription}</p>
            <p className="mt-2 text-[11px] uppercase tracking-[0.08em] text-[var(--text-muted)]">{getAppLauncherTarget(app).label}</p>
          </a>
        ))}
      </div>
    </Card>
  );
}
