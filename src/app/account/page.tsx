"use client";

import { AccessGate } from "@/components/auth/access-gate";
import { AccountSummaryCard } from "@/components/auth/account-summary-card";
import { useAuth } from "@/components/auth/auth-provider";
import { SectionEyebrow } from "@/components/ecosystem/section-eyebrow";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";

export default function AccountPage() {
  const { session, signOut } = useAuth();

  return (
    <Section className="scroll-mt-24 pb-16 pt-14 sm:pt-20">
      <Reveal>
        <SectionEyebrow>Your Account</SectionEyebrow>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Manage your access across product branches.</h1>
      </Reveal>

      <AccessGate signInNextHref="/account">
        <div className="mt-8 space-y-5">
          <Card className="flex flex-wrap items-center justify-between gap-3 bg-[var(--surface-0)]">
            <div>
              <p className="text-sm text-[var(--text-subtle)]">Signed in as</p>
              <p className="text-lg font-semibold">{session.user?.email}</p>
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl border border-[var(--border-strong)] bg-[var(--surface-1)] px-5 py-3 text-sm font-semibold tracking-[0.04em] transition hover:bg-[var(--surface-2)]"
              onClick={() => signOut()}
            >
              Sign Out
            </button>
          </Card>

          <AccountSummaryCard session={session} />

          <Card className="space-y-3 bg-[var(--surface-0)]">
            <h2 className="text-xl font-semibold">Next Actions</h2>
            <p className="text-sm text-[var(--text-subtle)]">Use pricing and product pages to upgrade access for locked branches.</p>
            <div className="flex flex-wrap gap-3">
              <Button href="/pricing">Compare Plans</Button>
              <Button href="/support#account" variant="ghost">
                Access Support
              </Button>
              <Button href="/products" variant="ghost">
                Browse Product Branches
              </Button>
            </div>
          </Card>
        </div>
      </AccessGate>
    </Section>
  );
}
