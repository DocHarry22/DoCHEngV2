"use client";

import { EntitlementBadge } from "@/components/auth/entitlement-badge";
import { SectionEyebrow } from "@/components/ecosystem/section-eyebrow";
import { Card } from "@/components/ui/card";
import { getAccessLabel } from "@/lib/auth/access";
import type { AppSession } from "@/lib/auth/types";
import { ecosystemProducts } from "@/lib/site-content";

type AccountSummaryCardProps = {
  session: AppSession;
};

export function AccountSummaryCard({ session }: AccountSummaryCardProps) {
  const accessCount = session.entitlements.filter((entry) => entry.state === "active" || entry.state === "trial").length;

  return (
    <Card className="space-y-5 bg-[var(--surface-0)]">
      <SectionEyebrow>Account Summary</SectionEyebrow>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-3">
          <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Session</p>
          <p className="mt-1 text-lg font-semibold">{session.state}</p>
        </div>
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-3">
          <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Accessible Branches</p>
          <p className="mt-1 text-lg font-semibold">{accessCount}</p>
        </div>
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-3">
          <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Role</p>
          <p className="mt-1 text-lg font-semibold">{session.user?.role ?? "guest"}</p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {ecosystemProducts.map((product) => {
          const entitlement = session.entitlements.find((entry) => entry.productSlug === product.slug);
          const state = entitlement?.state ?? "none";

          return (
            <div key={product.slug} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-4">
              <p className="text-sm font-semibold">{product.name}</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">{product.subdomain}</p>
              <EntitlementBadge state={state} className="mt-3" />
              <p className="mt-2 text-xs text-[var(--text-subtle)]">{getAccessLabel(state)}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
