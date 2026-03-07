"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { EntitlementBadge } from "@/components/auth/entitlement-badge";
import { EcosystemProductCard } from "@/components/ecosystem/ecosystem-product-card";
import { createProductActions, getEntitlement } from "@/lib/auth/access";
import type { EcosystemProduct } from "@/lib/site-content";

type AuthGatedProductCardProps = {
  product: EcosystemProduct;
  featured?: boolean;
  compact?: boolean;
};

export function AuthGatedProductCard({ product, featured = false, compact = false }: AuthGatedProductCardProps) {
  const { session } = useAuth();
  const entitlement = getEntitlement(session, product.slug);

  return (
    <div className="space-y-2">
      <EcosystemProductCard product={product} featured={featured} compact={compact} actions={createProductActions(product, session)} />
      {session.state === "authenticated" ? (
        <div className="px-1">
          <EntitlementBadge state={entitlement?.state ?? "none"} />
        </div>
      ) : null}
    </div>
  );
}
