"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/components/auth/auth-provider";
import { cn } from "@/lib/cn";
import { groupedNavigation, homeNavigationItem } from "@/lib/navigation-content";
import { BrandLockup } from "@/components/branding/brand-lockup";
import { AppLauncherMenu } from "@/components/apps/app-launcher-menu";
import { Button } from "@/components/ui/button";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { BackgroundThemeSelector } from "@/components/theme/background-selector";

export function Navbar() {
  const pathname = usePathname() ?? "";
  const currentPath = pathname ?? "/";
  const { session } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [openDesktopGroup, setOpenDesktopGroup] = useState<string | null>(null);
  const [openMobileGroup, setOpenMobileGroup] = useState<string | null>(null);
  const [currentHash, setCurrentHash] = useState("");
  const navRef = useRef<HTMLElement>(null);

  const safeGroups = (groupedNavigation ?? [])
    .filter((group): group is (typeof groupedNavigation)[number] => Boolean(group?.key && group?.label))
    .map((group) => ({
      ...group,
      sections: (group.sections ?? [])
        .filter((section) => Boolean(section?.heading))
        .map((section) => ({
          ...section,
          links: (section.links ?? []).filter((item) => Boolean(item?.href && item?.label))
        }))
    }));

  useEffect(() => {
    const updateHash = () => {
      setCurrentHash(window.location.hash.replace("#", ""));
    };

    updateHash();
    window.addEventListener("hashchange", updateHash);

    return () => {
      window.removeEventListener("hashchange", updateHash);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setOpenDesktopGroup(null);
  }, [pathname, currentHash]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (navRef.current && !navRef.current.contains(target)) {
        setOpenDesktopGroup(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenDesktopGroup(null);
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const isActiveLink = (href: string) => {
    const [pathPart, hashPart] = href.split("#");

    if (!hashPart) {
      if (href === "/") {
        return currentPath === "/";
      }
      return currentPath === href || currentPath.startsWith(`${href}/`);
    }

    const normalizedPath = pathPart || "/";
    if (currentPath !== normalizedPath) {
      return false;
    }

    const hash = hashPart ?? "";

    if (hash === "home") {
      return currentHash === "" || currentHash === "home";
    }

    return currentHash === hash;
  };

  const isGroupActive = (groupKey: string) => {
    const group = safeGroups.find((entry) => entry.key === groupKey);
    if (!group) {
      return false;
    }
    return group.sections.some((section) => section.links.some((item) => isActiveLink(item.href)));
  };

  return (
    <header ref={navRef} className="sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[var(--surface-1)]">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <BrandLockup />

        <nav className="hidden items-center gap-1 lg:gap-1.5 md:flex" aria-label="Primary">
          <Link
            href={homeNavigationItem.href}
            className={cn(
              "rounded-md px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors",
              isActiveLink(homeNavigationItem.href) ? "bg-[var(--surface-2)] text-[var(--text-main)]" : "text-[var(--text-subtle)] hover:text-[var(--text-main)]"
            )}
          >
            {homeNavigationItem.label}
          </Link>

          {safeGroups.map((group) => (
            <div
              key={group.key}
              className="relative"
              onMouseEnter={() => setOpenDesktopGroup(group.key)}
              onMouseLeave={() => setOpenDesktopGroup((prev) => (prev === group.key ? null : prev))}
            >
              <button
                type="button"
                className={cn(
                  "inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors",
                  isGroupActive(group.key)
                    ? "bg-[var(--surface-2)] text-[var(--text-main)]"
                    : "text-[var(--text-subtle)] hover:text-[var(--text-main)]"
                )}
                aria-label={`Toggle ${group.label} menu`}
                aria-expanded={openDesktopGroup === group.key}
                aria-haspopup="menu"
                aria-controls={`desktop-nav-group-${group.key}`}
                onFocus={() => setOpenDesktopGroup(group.key)}
                onClick={() => setOpenDesktopGroup((prev) => (prev === group.key ? null : group.key))}
              >
                <span>{group.label}</span>
                <span className={cn("text-[10px] transition-transform", openDesktopGroup === group.key && "rotate-180")} aria-hidden="true">
                  ▾
                </span>
              </button>

              <div
                id={`desktop-nav-group-${group.key}`}
                role="menu"
                aria-label={`${group.label} navigation`}
                className={cn(
                  "absolute left-0 top-[calc(100%+0.4rem)] z-[70] w-[min(38rem,calc(100vw-3rem))] rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-3 shadow-[var(--shadow-soft)] transition duration-150",
                  openDesktopGroup === group.key ? "visible translate-y-0 opacity-100 pointer-events-auto" : "invisible -translate-y-1 opacity-0 pointer-events-none"
                )}
              >
                <div className="mb-2 flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.11em] text-[var(--text-main)]">
                    {group.label}
                  </p>
                  {group.featured ? (
                    <Link
                      href={group.featured.href}
                      className="text-[11px] font-medium text-[var(--accent-primary)] hover:underline"
                      onClick={() => setOpenDesktopGroup(null)}
                    >
                      {group.featured.label}
                    </Link>
                  ) : null}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {group.sections.map((section) => (
                    <div key={section.heading} className="space-y-1">
                      <p className="px-2 text-[10px] font-semibold uppercase tracking-[0.11em] text-[var(--text-muted)]">{section.heading}</p>
                      <div className="space-y-0.5">
                        {section.links.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            className={cn(
                              "block rounded-md px-2 py-1.5 transition",
                              isActiveLink(item.href)
                                ? "bg-[var(--surface-2)] text-[var(--text-main)]"
                                : "text-[var(--text-subtle)] hover:bg-[var(--surface-1)] hover:text-[var(--text-main)]"
                            )}
                            onClick={() => setOpenDesktopGroup(null)}
                          >
                            <p className="text-sm font-medium leading-tight">{item.label}</p>
                            {item.description ? <p className="mt-0.5 text-[11px] leading-relaxed text-[var(--text-muted)]">{item.description}</p> : null}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {group.featured?.description ? (
                  <p className="mt-2 border-t border-[var(--border-subtle)] pt-2 text-[11px] text-[var(--text-subtle)]">
                    {group.featured.description}
                  </p>
                ) : null}
              </div>
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <AppLauncherMenu className="hidden md:block" />

          <BackgroundThemeSelector className="hidden sm:block" compact />

          <div className="hidden items-center gap-1 md:flex">
            {session.state === "authenticated" ? (
              <Link
                href="/account"
                className={cn(
                  "rounded-md px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors",
                  isActiveLink("/account") ? "bg-[var(--surface-2)] text-[var(--text-main)]" : "text-[var(--text-subtle)] hover:text-[var(--text-main)]"
                )}
              >
                Account
              </Link>
            ) : (
              <Link href="/signin" className="rounded-md px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--text-subtle)] hover:text-[var(--text-main)]">
                Sign In
              </Link>
            )}
            <Button href="/products" className="px-3.5 py-2 text-[11px] tracking-[0.08em]">
              Explore Products
            </Button>
          </div>

          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-strong)] bg-[var(--surface-1)] text-[var(--text-main)] md:hidden"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <span className="font-mono text-sm">{isOpen ? "X" : "|||"}</span>
          </button>

          <ThemeToggle className="hidden sm:inline-flex" />
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-[var(--border-subtle)] bg-[var(--surface-1)] transition-[max-height,opacity] duration-300 md:hidden",
          isOpen ? "max-h-[85vh] opacity-100 pointer-events-auto" : "max-h-0 opacity-0 pointer-events-none"
        )}
      >
        <nav className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6" aria-label="Mobile primary">
          <Link
            href={homeNavigationItem.href}
            className={cn(
              "rounded-lg px-3 py-2 text-sm font-medium uppercase tracking-[0.1em]",
              isActiveLink(homeNavigationItem.href)
                ? "bg-[var(--surface-2)] text-[var(--text-main)]"
                : "text-[var(--text-subtle)] hover:bg-[var(--surface-2)] hover:text-[var(--text-main)]"
            )}
          >
            {homeNavigationItem.label}
          </Link>

          {safeGroups.map((group) => (
            <div key={group.key} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)]">
              <button
                type="button"
                className={cn(
                  "flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold uppercase tracking-[0.1em]",
                  isGroupActive(group.key) ? "text-[var(--text-main)]" : "text-[var(--text-subtle)]"
                )}
                onClick={() => setOpenMobileGroup((prev) => (prev === group.key ? null : group.key))}
                aria-expanded={openMobileGroup === group.key}
                aria-controls={`mobile-nav-group-${group.key}`}
              >
                {group.label}
                <span className="font-mono text-xs">{openMobileGroup === group.key ? "-" : "+"}</span>
              </button>

              <div
                id={`mobile-nav-group-${group.key}`}
                className={cn("grid transition-[grid-template-rows] duration-200", openMobileGroup === group.key ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
              >
                <div className="overflow-hidden">
                  <div className="space-y-2 px-2 pb-2">
                    {group.sections.map((section) => (
                      <div key={section.heading} className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-2)] p-2">
                        <p className="px-1 text-[10px] font-semibold uppercase tracking-[0.11em] text-[var(--text-muted)]">{section.heading}</p>
                        <div className="mt-1 space-y-0.5">
                          {section.links.map((item) => (
                            <Link
                              key={item.label}
                              href={item.href}
                              className={cn(
                                "block rounded-lg px-2 py-1.5",
                                isActiveLink(item.href)
                                  ? "bg-[var(--surface-2)] text-[var(--text-main)]"
                                  : "text-[var(--text-subtle)] hover:bg-[var(--surface-2)] hover:text-[var(--text-main)]"
                              )}
                            >
                              <p className="text-sm font-medium leading-tight">{item.label}</p>
                              {item.description ? <p className="mt-0.5 text-xs leading-relaxed text-[var(--text-muted)]">{item.description}</p> : null}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}

                    {group.featured ? (
                      <Link
                        href={group.featured.href}
                        className="block rounded-lg border border-[var(--border-subtle)] px-2.5 py-2 text-sm font-semibold text-[var(--text-main)]"
                      >
                        {group.featured.label}
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <AppLauncherMenu mobile />

          <BackgroundThemeSelector compact />

          {session.state === "authenticated" ? (
            <Link
              href="/account"
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium uppercase tracking-[0.1em]",
                isActiveLink("/account")
                  ? "bg-[var(--surface-2)] text-[var(--text-main)]"
                  : "text-[var(--text-subtle)] hover:bg-[var(--surface-2)] hover:text-[var(--text-main)]"
              )}
            >
              Account
            </Link>
          ) : (
            <Link href="/signin" className="rounded-lg px-3 py-2 text-sm font-medium uppercase tracking-[0.1em] text-[var(--accent-primary)]">
              Sign In
            </Link>
          )}

          <Button href="/products" className="mt-1 w-full justify-center py-2.5 text-xs tracking-[0.08em]">
            Explore Products
          </Button>

          <div className="sm:hidden pt-1">
            <ThemeToggle className="w-full justify-center" />
          </div>
        </nav>
      </div>
    </header>
  );
}
