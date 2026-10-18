"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
export function RecoveryForm({
  mode,
  token,
}: {
  mode: "forgot" | "reset" | "verify";
  token?: string;
}) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <Card className="mx-auto max-w-xl space-y-5">
      <h1 className="text-3xl font-semibold">
        {mode === "forgot"
          ? "Reset your password"
          : mode === "reset"
            ? "Choose a new password"
            : "Verify your email"}
      </h1>
      <form
        className="space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          setBusy(true);
          const values = Object.fromEntries(new FormData(event.currentTarget));
          try {
            const response = await fetch(`/api/auth/${mode}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...values, token }),
            });
            const result = await response.json();
            setMessage(result.message);
          } catch {
            setMessage("Unable to reach the account service. Please retry.");
          } finally {
            setBusy(false);
          }
        }}
      >
        {mode === "forgot" ? (
          <label className="block">
            Email
            <input
              className="field mt-2"
              type="email"
              name="email"
              required
              maxLength={254}
              autoComplete="email"
            />
          </label>
        ) : mode === "reset" ? (
          <label className="block">
            New password
            <input
              className="field mt-2"
              name="password"
              type="password"
              required
              minLength={12}
              maxLength={128}
              autoComplete="new-password"
            />
          </label>
        ) : (
          <p>
            Confirm that this email address belongs to you. The link can only be
            used once.
          </p>
        )}
        <button disabled={busy} className="action-button">
          {busy
            ? "Processing…"
            : mode === "verify"
              ? "Verify email"
              : mode === "forgot"
                ? "Send reset instructions"
                : "Save new password"}
        </button>
        <p role="status">{message}</p>
      </form>
      <a className="text-link" href="/signin">
        Return to sign in
      </a>
    </Card>
  );
}
