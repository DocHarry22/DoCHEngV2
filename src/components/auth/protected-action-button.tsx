"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";
import { buildAccessDecision } from "@/lib/auth/access";
import type { EcosystemProduct } from "@/lib/site-content";

type ProtectedActionButtonProps = {
  product: EcosystemProduct;
  className?: string;
};

export function ProtectedActionButton({ product, className }: ProtectedActionButtonProps) {
  const { session } = useAuth();
  const decision = buildAccessDecision(product, session);

  return (
    <Button href={decision.primaryHref} className={className}>
      {decision.primaryLabel}
    </Button>
  );
}
