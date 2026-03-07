import type { AppSession, AuthCredentialInput, ProductEntitlement, SessionUser } from "@/lib/auth/types";
import { ecosystemProducts } from "@/lib/site-content";

export const AUTH_STORAGE_KEY = "dochengv2.session.v1";

export const GUEST_SESSION: AppSession = {
  state: "guest",
  user: null,
  entitlements: []
};

function toDisplayName(email: string, providedName?: string) {
  if (providedName?.trim()) {
    return providedName.trim();
  }

  const localPart = email.split("@")[0] ?? "Member";
  const cleaned = localPart.replace(/[._-]+/g, " ").trim();

  return cleaned
    .split(" ")
    .filter(Boolean)
    .map((segment) => segment[0]?.toUpperCase() + segment.slice(1))
    .join(" ") || "DoCHEng Member";
}

function buildEntitlements(email: string): ProductEntitlement[] {
  const normalized = email.toLowerCase();
  const slugs = ecosystemProducts.map((product) => product.slug);

  if (normalized.includes("all") || normalized.includes("admin")) {
    return slugs.map((slug) => ({ productSlug: slug, state: "active", source: "manual", note: "Full ecosystem access" }));
  }

  const entitlements: ProductEntitlement[] = [{ productSlug: "desk", state: "active", source: "plan", note: "Starter branch access" }];

  if (normalized.includes("resume") || normalized.includes("pro") || normalized.includes("beta")) {
    entitlements.push({ productSlug: "resume", state: "trial", source: "beta", note: "Beta access window" });
  }

  if (normalized.includes("compass") || normalized.includes("pro")) {
    entitlements.push({ productSlug: "compass", state: "trial", source: "manual", note: "Early launch preview" });
  }

  return entitlements;
}

function buildUser(credentials: AuthCredentialInput): SessionUser {
  return {
    id: `user-${credentials.email.toLowerCase()}`,
    name: toDisplayName(credentials.email, credentials.name),
    email: credentials.email.toLowerCase(),
    role: credentials.email.toLowerCase().includes("admin") ? "admin" : "user"
  };
}

// Provider-agnostic auth shim for Stage G. Replace with a real auth adapter later.
export function createSessionFromCredentials(credentials: AuthCredentialInput): AppSession {
  return {
    state: "authenticated",
    user: buildUser(credentials),
    entitlements: buildEntitlements(credentials.email)
  };
}
