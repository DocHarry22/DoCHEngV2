import { AppHubCard } from "@/components/apps/app-hub-card";
import type { EcosystemApp } from "@/lib/apps-content";

type EcosystemAppGridProps = {
  apps: EcosystemApp[];
};

export function EcosystemAppGrid({ apps }: EcosystemAppGridProps) {
  const featured = apps.filter((app) => app.featured);
  const standard = apps.filter((app) => !app.featured);

  return (
    <div className="space-y-8">
      {featured.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Core Apps</h2>
          <div className="grid gap-5 lg:grid-cols-2">
            {featured.map((app) => (
              <AppHubCard key={app.slug} app={app} featured />
            ))}
          </div>
        </div>
      ) : null}

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Ecosystem Registry</h2>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {standard.map((app) => (
            <AppHubCard key={app.slug} app={app} />
          ))}
        </div>
      </div>
    </div>
  );
}
