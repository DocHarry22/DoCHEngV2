"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { AppStatusBadge } from "@/components/apps/app-status-badge";
import { cn } from "@/lib/cn";
import { launchableApps, getAppLauncherTarget } from "@/lib/apps-content";

type AppLauncherMenuProps = {
  mobile?: boolean;
  className?: string;
};

export function AppLauncherMenu({
  mobile = false,
  className,
}: AppLauncherMenuProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mobile) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (wrapperRef.current && !wrapperRef.current.contains(target)) {
        setOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onEscape);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [mobile]);

  if (mobile) {
    return (
      <div
        className={cn(
          "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)]",
          className,
        )}
      >
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold uppercase tracking-[0.1em] text-[var(--text-main)]"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-controls="mobile-app-launcher"
        >
          Apps Launcher
          <span className="font-mono text-xs">{open ? "-" : "+"}</span>
        </button>
        <div
          id="mobile-app-launcher"
          className={cn(
            "grid transition-[grid-template-rows] duration-200",
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          <div className="overflow-hidden">
            <div className="space-y-1 px-2 pb-2">
              <Link
                href="/apps"
                className="block rounded-lg border border-[var(--border-subtle)] px-2.5 py-2 text-sm font-semibold text-[var(--text-main)]"
              >
                Open Apps Hub
              </Link>
              {launchableApps.map((app) => (
                <a
                  key={`mobile-${app.slug}`}
                  href={getAppLauncherTarget(app).href}
                  target={
                    getAppLauncherTarget(app).external ? "_blank" : undefined
                  }
                  rel={
                    getAppLauncherTarget(app).external
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="block rounded-lg px-2.5 py-2 text-sm text-[var(--text-subtle)] hover:bg-[var(--surface-2)] hover:text-[var(--text-main)]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span>{app.name}</span>
                    <AppStatusBadge
                      status={app.status}
                      className="text-[9px]"
                    />
                  </div>
                  <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                    {app.subdomain ?? "Route in parent site"}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className={cn("relative", className)}>
      <button
        type="button"
        className={cn(
          "rounded-md px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors",
          open
            ? "bg-[var(--surface-2)] text-[var(--text-main)]"
            : "text-[var(--text-subtle)] hover:text-[var(--text-main)]",
        )}
        aria-label="Open apps launcher"
        aria-expanded={open}
        aria-controls="desktop-app-launcher"
        onClick={() => setOpen((prev) => !prev)}
      >
        Apps
      </button>

      <div
        id="desktop-app-launcher"
        className={cn(
          "absolute right-0 top-[calc(100%+0.4rem)] z-[70] w-[22rem] rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-2.5 shadow-[var(--shadow-soft)] transition duration-150",
          open
            ? "visible translate-y-0 opacity-100 pointer-events-auto"
            : "invisible -translate-y-1 opacity-0 pointer-events-none",
        )}
      >
        <div className="space-y-2">
          <Link
            href="/apps"
            className="block rounded-lg border border-[var(--border-subtle)] px-2.5 py-2"
          >
            <p className="text-sm font-semibold text-[var(--text-main)]">
              Open Full Apps Hub
            </p>
            <p className="mt-0.5 text-[11px] text-[var(--text-subtle)]">
              Compare app statuses and access pathways.
            </p>
          </Link>
          {launchableApps.map((app) => (
            <a
              key={`desktop-${app.slug}`}
              href={getAppLauncherTarget(app).href}
              target={getAppLauncherTarget(app).external ? "_blank" : undefined}
              rel={
                getAppLauncherTarget(app).external
                  ? "noopener noreferrer"
                  : undefined
              }
              className="block rounded-lg border border-transparent px-2.5 py-1.5 transition hover:border-[var(--border-subtle)] hover:bg-[var(--surface-1)]"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-[var(--text-main)]">
                  {app.name}
                </p>
                <AppStatusBadge status={app.status} className="text-[9px]" />
              </div>
              <p className="mt-0.5 line-clamp-2 text-[11px] text-[var(--text-subtle)]">
                {app.shortDescription}
              </p>
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.08em] text-[var(--text-muted)]">
                {app.subdomain ?? "Parent route"}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
