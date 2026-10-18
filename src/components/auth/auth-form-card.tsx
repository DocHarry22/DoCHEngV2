"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Card } from "@/components/ui/card";
import { createSignInHref } from "@/lib/auth/access";
import { useAuth } from "@/components/auth/auth-provider";
import { safeNextPath } from "@/lib/auth/redirect";

type AuthMode = "signin" | "signup";

type AuthFormCardProps = {
  mode: AuthMode;
  nextHref?: string;
};

export function AuthFormCard({
  mode,
  nextHref = "/account",
}: AuthFormCardProps) {
  const router = useRouter();
  const { isLoading, signIn, signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const title =
    mode === "signin" ? "Sign in to continue" : "Create your DoCHEng account";
  const description =
    mode === "signin"
      ? "Access your product branches, entitlements, and account controls."
      : "Create an account to unlock branch access and manage product entitlements.";

  const helperHref = useMemo(() => {
    if (mode === "signin") {
      return `/signup?next=${encodeURIComponent(nextHref)}`;
    }

    return createSignInHref(nextHref);
  }, [mode, nextHref]);

  const helperLabel =
    mode === "signin"
      ? "Need an account? Sign up"
      : "Already registered? Sign in";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "signin") {
        const result = await signIn({ email, password });
        if (!result.ok) throw new Error(result.message);
      } else {
        const result = await signUp({ email, password, name });
        if (!result.ok) throw new Error(result.message);
      }

      router.push(safeNextPath(nextHref));
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not complete authentication. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-xl space-y-5 bg-(--surface-0)">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm leading-relaxed text-(--text-subtle)">
          {description}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block space-y-2 text-sm font-medium">
          <span>Email</span>
          <input
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            disabled={isLoading || isSubmitting}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-(--border-strong) bg-(--surface-1) px-4 py-3 text-sm outline-none transition focus:border-(--accent-primary)"
            placeholder="you@example.com"
          />
        </label>

        {mode === "signup" ? (
          <label className="block space-y-2 text-sm font-medium">
            <span>Full Name</span>
            <input
              type="text"
              required
              maxLength={100}
              autoComplete="name"
              disabled={isLoading || isSubmitting}
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-xl border border-(--border-strong) bg-(--surface-1) px-4 py-3 text-sm outline-none transition focus:border-(--accent-primary)"
              placeholder="DoCHEng Member"
            />
          </label>
        ) : null}

        <label className="block space-y-2 text-sm font-medium">
          <span>Password</span>
          <input
            type="password"
            required
            minLength={12}
            disabled={isLoading || isSubmitting}
            maxLength={128}
            autoComplete={
              mode === "signin" ? "current-password" : "new-password"
            }
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-(--border-strong) bg-(--surface-1) px-4 py-3 text-sm outline-none transition focus:border-(--accent-primary)"
            placeholder="At least 12 characters"
          />
        </label>

        {error ? (
          <p role="alert" className="text-sm text-rose-600 dark:text-rose-300">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isLoading || isSubmitting}
          className="inline-flex w-full items-center justify-center rounded-xl bg-[#075fbe] px-5 py-3 text-sm font-semibold tracking-[0.04em] text-white transition hover:brightness-105"
        >
          {isLoading || isSubmitting
            ? "Processing..."
            : mode === "signin"
              ? "Sign In"
              : "Create Account"}
        </button>
      </form>

      <Link href={helperHref} className="text-link inline-block">
        {helperLabel}
      </Link>
      {mode === "signin" ? (
        <Link href="/forgot-password" className="text-link block">
          Forgot password?
        </Link>
      ) : null}
    </Card>
  );
}
