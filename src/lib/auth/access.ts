import type {
  AccessDecision,
  AppSession,
  EntitlementState,
  ProductEntitlement,
} from "@/lib/auth/types";
import type { EcosystemProduct } from "@/lib/site-content";
import { getAppBySlug, getAppPrimaryAction } from "@/lib/ecosystem-manifest";

export type ActionLink = {
  label: string;
  href: string;
  variant?: "primary" | "ghost";
};

export function getEntitlement(
  session: AppSession,
  productSlug: EcosystemProduct["slug"],
): ProductEntitlement | undefined {
  return session.entitlements.find(
    (entitlement) => entitlement.productSlug === productSlug,
  );
}

export function hasProductAccess(
  session: AppSession,
  productSlug: EcosystemProduct["slug"],
): boolean {
  const state = getEntitlement(session, productSlug)?.state;

  return state === "active" || state === "trial";
}

export function getAccessLabel(state: EntitlementState): string {
  if (state === "active") return "Included";
  if (state === "trial") return "Trial";
  return "No Access";
}

export function createSignInHref(nextHref: string) {
  return `/signin?next=${encodeURIComponent(nextHref)}`;
}

export function buildAccessDecision(
  product: EcosystemProduct,
  session: AppSession,
): AccessDecision {
  const productHref = `/products/${product.slug}`;
  const app = getAppBySlug(product.slug);
  if (app?.verifiedWeb) {
    const action = getAppPrimaryAction(app);
    return {
      state: "included",
      headline: "Public beta entry",
      detail: "This application enforces its own account and data permissions.",
      primaryLabel: action.label,
      primaryHref: action.href,
      secondaryLabel: "View Product",
      secondaryHref: productHref,
    };
  }

  if (product.status === "coming-soon") {
    return {
      state: "coming-soon",
      headline: "Launch pending",
      detail:
        "This branch is scheduled for release. Join waitlist updates to access launch announcements.",
      primaryLabel: "Join Waitlist",
      primaryHref: "/support#business",
      secondaryLabel: "View Branch",
      secondaryHref: productHref,
    };
  }

  if (session.state === "guest") {
    return {
      state: "guest",
      headline: "Sign in required",
      detail:
        "Authenticate to check your product access and unlock entitled branch actions.",
      primaryLabel: "Sign In To Continue",
      primaryHref: createSignInHref(productHref),
      secondaryLabel: "View Pricing",
      secondaryHref: "/pricing",
    };
  }

  if (hasProductAccess(session, product.slug)) {
    return {
      state: "included",
      headline: "Access included",
      detail:
        "Your account includes this branch. Continue to product workspace and runtime options.",
      primaryLabel: "Open Branch",
      primaryHref: productHref,
      secondaryLabel: "Manage Account",
      secondaryHref: "/account",
    };
  }

  return {
    state: "requires-access",
    headline: "Access required",
    detail:
      "Your account is authenticated but this branch is not currently included in your access layer.",
    primaryLabel: "Get Access",
    primaryHref: "/pricing",
    secondaryLabel: "View Branch",
    secondaryHref: productHref,
  };
}

export function createProductActions(
  product: EcosystemProduct,
  session: AppSession,
): ActionLink[] {
  const decision = buildAccessDecision(product, session);

  const actions: ActionLink[] = [
    { label: decision.primaryLabel, href: decision.primaryHref },
  ];

  if (decision.secondaryLabel && decision.secondaryHref) {
    actions.push({
      label: decision.secondaryLabel,
      href: decision.secondaryHref,
      variant: "ghost",
    });
  }

  return actions;
}
