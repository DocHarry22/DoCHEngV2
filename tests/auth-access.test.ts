import {
  buildAccessDecision,
  createSignInHref,
  hasProductAccess,
} from "@/lib/auth/access";
import { GUEST_SESSION } from "@/lib/auth/mock-auth";
import type { AppSession } from "@/lib/auth/types";
import { ecosystemProducts } from "@/lib/site-content";

describe("auth access model", () => {
  it("builds sign-in redirect href with next target", () => {
    expect(createSignInHref("/products/desk")).toBe(
      "/signin?next=%2Fproducts%2Fdesk",
    );
  });

  it("opens a verified public beta without treating site login as app authorization", () => {
    const product = ecosystemProducts.find((entry) => entry.slug === "desk");
    if (!product) throw new Error("Desk product missing in fixture.");

    const decision = buildAccessDecision(product, GUEST_SESSION);
    expect(decision.state).toBe("included");
    expect(decision.primaryHref).toBe("https://docheng-desk2.vercel.app/login");
  });

  it("returns included decision when entitlement is active", () => {
    const product = ecosystemProducts.find((entry) => entry.slug === "desk");
    if (!product) throw new Error("Desk product missing in fixture.");

    const session: AppSession = {
      state: "authenticated",
      user: {
        id: "user-1",
        name: "Member",
        email: "member@example.com",
        role: "user",
      },
      entitlements: [{ productSlug: "desk", state: "active", source: "plan" }],
    };

    expect(hasProductAccess(session, "desk")).toBe(true);
    const decision = buildAccessDecision(product, session);
    expect(decision.state).toBe("included");
    expect(decision.primaryHref).toBe("https://docheng-desk2.vercel.app/login");
  });
});
