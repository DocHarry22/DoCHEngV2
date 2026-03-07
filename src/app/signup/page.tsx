"use client";

import { useSearchParams } from "next/navigation";

import { AuthFormCard } from "@/components/auth/auth-form-card";
import { Section } from "@/components/ui/section";

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const nextHref = searchParams.get("next") ?? "/account";

  return (
    <Section className="scroll-mt-24 pb-16 pt-14 sm:pt-20">
      <AuthFormCard mode="signup" nextHref={nextHref} />
    </Section>
  );
}
