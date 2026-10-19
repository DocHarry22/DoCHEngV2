"use client";
import { useState } from "react";
import {
  adminSections,
  type AdminSection,
  type AdminSummary,
} from "@/lib/admin";
export function AdminNavigation({
  active,
  summary,
}: {
  active: AdminSection;
  summary?: AdminSummary;
}) {
  const [expanded, setExpanded] = useState(false);
  const badges: Partial<Record<AdminSection, number>> = summary
    ? {
        support: summary.openTickets,
        email: summary.queuedMail,
        releases: summary.unpublishedReleases,
      }
    : {};
  return (
    <nav
      aria-label="Administrator navigation"
      className="min-w-0 self-start rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-3 lg:sticky lg:top-24"
    >
      <p className="hidden px-3 py-3 text-xs font-semibold uppercase tracking-widest text-[var(--text-subtle)] lg:block">
        Administration
      </p>
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls="admin-navigation-links"
        className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-semibold lg:hidden"
        onClick={() => setExpanded(!expanded)}
      >
        Admin menu · {adminSections.find((s) => s.id === active)?.label}
        <span aria-hidden="true">{expanded ? "−" : "+"}</span>
      </button>
      <div
        id="admin-navigation-links"
        className={(expanded ? "grid" : "hidden lg:grid") + " gap-1"}
      >
        {adminSections.map((section) => (
          <a
            key={section.id}
            href={"#" + section.id}
            aria-current={active === section.id ? "page" : undefined}
            onClick={() => setExpanded(false)}
            className={
              "flex min-w-0 items-center justify-between gap-3 rounded-lg px-3 py-3 text-sm " +
              (active === section.id
                ? "bg-blue-700 font-semibold text-white"
                : "hover:bg-[var(--surface-2)]")
            }
          >
            <span>{section.label}</span>
            {Boolean(badges[section.id]) ? (
              <span
                aria-hidden="true"
                className="rounded-full border border-current px-2 text-xs"
              >
                {badges[section.id]?.toLocaleString()}
              </span>
            ) : null}
          </a>
        ))}
      </div>
    </nav>
  );
}
