"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { DistributionBuildCard } from "@/components/ecosystem/distribution-build-card";
import { SectionEyebrow } from "@/components/ecosystem/section-eyebrow";
import { Card } from "@/components/ui/card";
import type { BuildStatus, DistributionBuild } from "@/lib/distribution-content";
import { cn } from "@/lib/cn";
import { ecosystemProducts, type Platform } from "@/lib/site-content";

type PlatformFilter = "All" | Platform;
type StatusFilter = "all" | BuildStatus;

type DistributionCatalogProps = {
  builds: DistributionBuild[];
};

const platformFilterOptions: PlatformFilter[] = ["All", "Desktop", "Android"];
const statusFilterOptions: StatusFilter[] = ["all", "available", "limited", "coming-soon"];

const statusFilterLabel: Record<StatusFilter, string> = {
  all: "All Statuses",
  available: "Available",
  limited: "Limited",
  "coming-soon": "Coming Soon"
};

const defaultPlatformFilter: PlatformFilter = "All";
const defaultStatusFilter: StatusFilter = "all";

function toPlatformQueryValue(platform: PlatformFilter) {
  return platform.toLowerCase();
}

function parsePlatformFilter(input: string | null): PlatformFilter {
  if (!input) {
    return defaultPlatformFilter;
  }

  switch (input.toLowerCase()) {
    case "desktop":
      return "Desktop";
    case "android":
      return "Android";
    default:
      return defaultPlatformFilter;
  }
}

function parseStatusFilter(input: string | null): StatusFilter {
  if (!input) {
    return defaultStatusFilter;
  }

  switch (input.toLowerCase()) {
    case "available":
      return "available";
    case "limited":
      return "limited";
    case "coming-soon":
      return "coming-soon";
    default:
      return defaultStatusFilter;
  }
}

export function DistributionCatalog({ builds }: DistributionCatalogProps) {
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>(defaultPlatformFilter);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(defaultStatusFilter);
  const isQuerySyncReadyRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const applyQueryFilters = () => {
      const params = new URLSearchParams(window.location.search);
      setPlatformFilter(parsePlatformFilter(params.get("platform")));
      setStatusFilter(parseStatusFilter(params.get("status")));
    };

    applyQueryFilters();
    isQuerySyncReadyRef.current = true;

    const handlePopState = () => applyQueryFilters();
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    if (!isQuerySyncReadyRef.current || typeof window === "undefined") {
      return;
    }

    const url = new URL(window.location.href);

    if (platformFilter === defaultPlatformFilter) {
      url.searchParams.delete("platform");
    } else {
      url.searchParams.set("platform", toPlatformQueryValue(platformFilter));
    }

    if (statusFilter === defaultStatusFilter) {
      url.searchParams.delete("status");
    } else {
      url.searchParams.set("status", statusFilter);
    }

    const nextRelativeUrl = `${url.pathname}${url.search}${url.hash}`;
    window.history.replaceState(window.history.state, "", nextRelativeUrl);
  }, [platformFilter, statusFilter]);

  const filteredBuilds = useMemo(
    () =>
      builds.filter((build) => {
        const platformMatch = platformFilter === "All" || build.platform === platformFilter;
        const statusMatch = statusFilter === "all" || build.status === statusFilter;
        return platformMatch && statusMatch;
      }),
    [builds, platformFilter, statusFilter]
  );

  const filteredBuildCount = filteredBuilds.length;

  return (
    <div className="mt-8 space-y-7">
      <Card className="space-y-5 bg-[var(--surface-0)]">
        <div className="space-y-2">
          <SectionEyebrow>Catalog Controls</SectionEyebrow>
          <p className="text-sm leading-relaxed text-[var(--text-subtle)]">
            Filter distribution builds by platform and release status. Product anchors stay stable for external route deep-links.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {platformFilterOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setPlatformFilter(option)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] transition",
                platformFilter === option
                  ? "border-[var(--border-strong)] bg-[var(--surface-2)] text-[var(--text-main)]"
                  : "border-[var(--border-subtle)] bg-[var(--surface-1)] text-[var(--text-subtle)] hover:text-[var(--text-main)]"
              )}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {statusFilterOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setStatusFilter(option)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] transition",
                statusFilter === option
                  ? "border-[var(--border-strong)] bg-[var(--surface-2)] text-[var(--text-main)]"
                  : "border-[var(--border-subtle)] bg-[var(--surface-1)] text-[var(--text-subtle)] hover:text-[var(--text-main)]"
              )}
            >
              {statusFilterLabel[option]}
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] px-4 py-3">
          <p className="text-sm text-[var(--text-subtle)]">
            Showing <span className="font-semibold text-[var(--text-main)]">{filteredBuildCount}</span> build
            {filteredBuildCount === 1 ? "" : "s"} with {platformFilter} / {statusFilterLabel[statusFilter]} filters.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setPlatformFilter(defaultPlatformFilter);
              setStatusFilter(defaultStatusFilter);
            }}
            className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-1)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-subtle)] transition hover:text-[var(--text-main)]"
          >
            Reset Filters
          </button>
          <p className="text-xs text-[var(--text-muted)]">Filter selections are persisted in the URL for sharing.</p>
        </div>
      </Card>

      <Card className="space-y-4 bg-[var(--surface-0)]">
        <SectionEyebrow>Product Deep Links</SectionEyebrow>
        <div className="flex flex-wrap gap-2">
          {ecosystemProducts.map((product) => (
            <a
              key={product.slug}
              href={`#${product.slug}`}
              className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-1)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-subtle)] transition hover:text-[var(--text-main)]"
            >
              {product.name}
            </a>
          ))}
        </div>
      </Card>

      <div className="space-y-8">
        {ecosystemProducts.map((product) => {
          const productBuilds = filteredBuilds.filter((build) => build.productSlug === product.slug);

          return (
            <div key={product.slug} id={product.slug} className="scroll-mt-24 space-y-4">
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] px-4 py-3">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="mt-1 text-sm text-[var(--text-subtle)]">{product.positioning}</p>
              </div>

              {productBuilds.length ? (
                <div className="grid gap-5 md:grid-cols-2">
                  {productBuilds.map((build) => (
                    <DistributionBuildCard key={build.id} build={build} />
                  ))}
                </div>
              ) : (
                <Card className="bg-[var(--surface-0)]">
                  <p className="text-sm text-[var(--text-subtle)]">
                    No builds match the current filters for this branch. Adjust platform or status controls above to view releases.
                  </p>
                </Card>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
