"use client";

import type { ReactNode } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { AccessRequirementNote } from "@/components/auth/access-requirement-note";
import { SignInPrompt } from "@/components/auth/sign-in-prompt";
import { hasProductAccess } from "@/lib/auth/access";
import type { EcosystemProduct } from "@/lib/site-content";

type AccessGateProps = {
  children: ReactNode;
  requireAuth?: boolean;
  entitlementSlug?: EcosystemProduct["slug"];
  signInNextHref?: string;
  fallback?: ReactNode;
};

export function AccessGate({
  children,
  requireAuth = true,
  entitlementSlug,
  signInNextHref = "/account",
  fallback
}: AccessGateProps) {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (requireAuth && session.state === "guest") {
    return fallback ?? <SignInPrompt nextHref={signInNextHref} />;
  }

  if (entitlementSlug && !hasProductAccess(session, entitlementSlug)) {
    return <AccessRequirementNote />;
  }

  return <>{children}</>;
}
