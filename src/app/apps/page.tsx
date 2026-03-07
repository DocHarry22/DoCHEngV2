import type { Metadata } from "next";

import { AppAvailabilityRow } from "@/components/apps/app-availability-row";
import { AppHubHero } from "@/components/apps/app-hub-hero";
import { AppSwitcherPanel } from "@/components/apps/app-switcher-panel";
import { EcosystemAppGrid } from "@/components/apps/ecosystem-app-grid";
import { SubdomainLinkCard } from "@/components/apps/subdomain-link-card";
import { SectionEyebrow } from "@/components/ecosystem/section-eyebrow";
import { Reveal } from "@/components/motion/reveal";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { ecosystemStructureRows, launchableApps, sortedEcosystemApps } from "@/lib/apps-content";
import { getEcosystemDiagnostics, getWorkspaceProjects } from "@/lib/ecosystem-registry";

export const metadata: Metadata = {
  title: "Apps Hub | DoCHEngV2",
  description:
    "Central Apps Hub for DoCHEng ecosystem branches, subdomain launch points, platform availability, and future downloadable distribution channels."
};

export default function AppsPage() {
  const workspaceProjects = getWorkspaceProjects();
  const diagnostics = getEcosystemDiagnostics();

  return (
    <>
      <Section className="ecosystem-hero scroll-mt-24 pb-10 pt-14 sm:pt-20">
        <AppHubHero />
      </Section>

      <Section className="py-10 sm:py-12">
        <Reveal>
          <EcosystemAppGrid apps={sortedEcosystemApps} />
        </Reveal>
      </Section>

      <Section className="py-10 sm:py-12">
        <Reveal>
          <AppSwitcherPanel apps={launchableApps} />
        </Reveal>
      </Section>

      <Section className="py-10 sm:py-12" id="availability">
        <Reveal>
          <SectionEyebrow>Availability Matrix</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Know what is live, what is planned, and how each app is delivered.
          </h2>
        </Reveal>

        <div className="mt-7 grid gap-4 lg:grid-cols-2">
          {sortedEcosystemApps.map((app) => (
            <Reveal key={`availability-${app.slug}`}>
              <AppAvailabilityRow app={app} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="py-10 sm:py-12" id="subdomains">
        <Reveal>
          <SectionEyebrow>Subdomain Launcher</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Jump directly into dedicated app environments.
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-[var(--text-subtle)] sm:text-lg">
            The parent site remains the strategic hub while each product branch can live on its own subdomain. When a branch is not yet live,
            the Apps Hub routes users to roadmap or waitlist pathways without dead ends.
          </p>
        </Reveal>

        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sortedEcosystemApps.map((app) => (
            <Reveal key={`subdomain-${app.slug}`}>
              <SubdomainLinkCard app={app} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="py-10 sm:py-12" id="ecosystem-structure">
        <Reveal>
          <Card className="space-y-5 bg-[var(--surface-0)]">
            <div>
              <SectionEyebrow>Ecosystem Structure</SectionEyebrow>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                Parent hub, subdomain branches, and downloadable runtimes work as one system.
              </h2>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {ecosystemStructureRows.map((row) => (
                <div key={row.layer} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-4">
                  <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">{row.layer}</p>
                  <p className="mt-1 text-sm font-semibold">{row.location}</p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-subtle)]">{row.responsibility}</p>
                </div>
              ))}
            </div>
          </Card>
        </Reveal>
      </Section>

      <Section className="py-10 sm:py-12" id="workspace-audit">
        <Reveal>
          <SectionEyebrow>Current Ecosystem Audit Model</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Real sibling folders are mapped as structured ecosystem nodes.
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-[var(--text-subtle)] sm:text-lg">
            This layer models the current reality first: sibling folders stay independent while the parent platform standardizes metadata,
            classifications, and migration readiness for gradual workspace-native evolution.
          </p>
        </Reveal>

        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {workspaceProjects.map((project) => (
            <Reveal key={`workspace-project-${project.id}`}>
              <Card className="h-full space-y-3 bg-[var(--surface-0)]">
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">{project.folderName ?? "unmapped-folder"}</p>
                  <h3 className="mt-1 text-lg font-semibold">{project.name}</h3>
                  <p className="mt-1 text-sm text-[var(--text-subtle)]">{project.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-[var(--text-subtle)]">
                  <p>Role: <span className="font-semibold text-[var(--text-main)]">{project.role}</span></p>
                  <p>Lifecycle: <span className="font-semibold text-[var(--text-main)]">{project.lifecycle}</span></p>
                  <p>Generation: <span className="font-semibold text-[var(--text-main)]">{project.generation}</span></p>
                  <p>Integration: <span className="font-semibold text-[var(--text-main)]">{project.integrationLevel}</span></p>
                </div>

                <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] px-3 py-2 text-xs text-[var(--text-subtle)]">
                  <p className="uppercase tracking-[0.1em] text-[var(--text-muted)]">Current Path</p>
                  <p className="mt-1 font-mono text-[11px] text-[var(--text-main)]">{project.currentRelativePath ?? "pending"}</p>
                  <p className="mt-1">Type: {project.currentPathType}</p>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <Card className="mt-6 space-y-4 bg-[var(--surface-0)]">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Registry Diagnostics</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">Migration Layer Health Snapshot</h3>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-3">
                <p className="text-xs uppercase tracking-[0.1em] text-[var(--text-muted)]">Registry Nodes</p>
                <p className="mt-1 text-xl font-semibold">{diagnostics.totals.registryEntries}</p>
              </div>
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-3">
                <p className="text-xs uppercase tracking-[0.1em] text-[var(--text-muted)]">Workspace Projects</p>
                <p className="mt-1 text-xl font-semibold">{diagnostics.totals.workspaceProjects}</p>
              </div>
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-3">
                <p className="text-xs uppercase tracking-[0.1em] text-[var(--text-muted)]">Launchable Public Apps</p>
                <p className="mt-1 text-xl font-semibold">{diagnostics.totals.launchableApps}</p>
              </div>
            </div>

            {diagnostics.warnings.length ? (
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-3">
                <p className="text-xs uppercase tracking-[0.1em] text-[var(--text-muted)]">Diagnostics Warnings</p>
                <ul className="mt-2 space-y-1 text-sm text-[var(--text-subtle)]">
                  {diagnostics.warnings.map((warning) => (
                    <li key={warning}>{warning}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-[var(--text-subtle)]">No critical registry completeness issues detected.</p>
            )}
          </Card>
        </Reveal>
      </Section>
    </>
  );
}
