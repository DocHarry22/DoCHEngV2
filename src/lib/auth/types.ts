import type { EcosystemProduct } from "@/lib/site-content";

export type AuthRole = "user" | "admin";
export type SessionState = "guest" | "authenticated";
export type EntitlementState = "none" | "trial" | "active";

export type AccessSource = "plan" | "grant" | "beta" | "manual";

export type ProductEntitlement = {
  productSlug: EcosystemProduct["slug"];
  state: EntitlementState;
  source: AccessSource;
  note?: string;
};

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: AuthRole;
  emailVerified?: boolean;
};

export type AppSession = {
  state: SessionState;
  user: SessionUser | null;
  entitlements: ProductEntitlement[];
};

export type AccessDecisionState =
  "guest" | "included" | "requires-access" | "coming-soon";

export type AccessDecision = {
  state: AccessDecisionState;
  headline: string;
  detail: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export type AuthCredentialInput = {
  email: string;
  password: string;
  name?: string;
};

export type AuthResult = {
  ok: boolean;
  message?: string;
};
