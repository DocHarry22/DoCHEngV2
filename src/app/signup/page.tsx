"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

import { useAuth } from "@/components/auth/auth-provider";
import { AuthFormCard } from "@/components/auth/auth-form-card";
import { Section } from "@/components/ui/section";

function SignUpPageContent() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const searchParams = useSearchParams();
  const nextHref = searchParams?.get("next") ?? "/account";

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/account");
    }
  }, [isAuthenticated, isLoading, router]);

  if (!isLoading && isAuthenticated) {
    return null;
  }

  return (
    <Section className="scroll-mt-24 pb-16 pt-14 sm:pt-20">
      <AuthFormCard mode="signup" nextHref={nextHref} />
    </Section>
  );
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <Section className="scroll-mt-24 pb-16 pt-14 sm:pt-20">
          <AuthFormCard mode="signup" nextHref="/account" />
        </Section>
      }
    >
      <SignUpPageContent />
    </Suspense>
  );
}
