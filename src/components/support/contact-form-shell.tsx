"use client";

import { useState } from "react";

import { Card } from "@/components/ui/card";

type Option = {
  value: string;
  label: string;
};

type ContactFormShellProps = {
  enquiryTypes: readonly Option[];
  productOptions: readonly Option[];
};

export function ContactFormShell({
  enquiryTypes,
  productOptions,
}: ContactFormShellProps) {
  const [result, setResult] = useState<{
    ok: boolean;
    message: string;
    ticket?: string;
  } | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <Card className="space-y-5 bg-[var(--surface-0)]">
      <div>
        <h3 className="text-2xl font-semibold tracking-tight">
          Contact DoCHEng support
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-subtle)]">
          Send a product, installation, billing, or general enquiry. Keep the
          ticket reference shown after submission.
        </p>
      </div>

      <form
        className="grid gap-4"
        onSubmit={async (event) => {
          event.preventDefault();
          const form = event.currentTarget;
          const values = Object.fromEntries(new FormData(form));
          setBusy(true);
          setResult(null);
          try {
            const response = await fetch("/api/support", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...values,
                consent: values.consent === "on",
              }),
            });
            const data = await response.json();
            setResult({
              ok: response.ok,
              message: data.message,
              ticket: data.ticket,
            });
            if (response.ok) form.reset();
          } catch {
            setResult({
              ok: false,
              message:
                "Unable to reach support. Your enquiry has not been submitted. Please retry.",
            });
          } finally {
            setBusy(false);
          }
        }}
        aria-describedby="support-form-note"
      >
        <div className="hidden" aria-hidden="true">
          <label>
            Website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span className="font-semibold">Name</span>
            <input
              required
              name="name"
              minLength={2}
              maxLength={100}
              autoComplete="name"
              className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-main)] outline-none transition focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
            />
          </label>

          <label className="space-y-2 text-sm">
            <span className="font-semibold">Email</span>
            <input
              required
              type="email"
              name="email"
              maxLength={254}
              autoComplete="email"
              className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-main)] outline-none transition focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span className="font-semibold">Enquiry type</span>
            <select
              required
              name="enquiryType"
              aria-label="Enquiry type"
              defaultValue=""
              className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-main)] outline-none transition focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
            >
              <option value="" disabled>
                Select enquiry type
              </option>
              {enquiryTypes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm">
            <span className="font-semibold">Product</span>
            <select
              required
              name="product"
              aria-label="Product"
              defaultValue=""
              className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-main)] outline-none transition focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
            >
              <option value="" disabled>
                Select product or ecosystem area
              </option>
              {productOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="space-y-2 text-sm">
          <span className="font-semibold">
            Company or organization (optional)
          </span>
          <input
            name="organization"
            maxLength={200}
            autoComplete="organization"
            className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-main)] outline-none transition focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
          />
        </label>

        <label className="space-y-2 text-sm">
          <span className="font-semibold">Priority or context (optional)</span>
          <input
            name="priorityContext"
            maxLength={300}
            placeholder="e.g. blocked release, billing deadline, pilot timeline"
            className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-main)] outline-none transition focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
          />
        </label>

        <label className="space-y-2 text-sm">
          <span className="font-semibold">Message</span>
          <textarea
            required
            name="message"
            minLength={20}
            maxLength={8000}
            rows={5}
            className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface-1)] px-3 py-2 text-sm leading-relaxed text-[var(--text-main)] outline-none transition focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
            placeholder="Describe your question, current setup, and desired outcome."
          />
        </label>

        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" name="consent" required className="mt-1" />
          <span>
            I agree to the{" "}
            <a href="/privacy" className="underline">
              privacy notice
            </a>{" "}
            and processing of my details to answer this enquiry.
          </span>
        </label>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center justify-center rounded-xl bg-[#075fbe] px-5 py-2.5 text-xs font-semibold tracking-[0.04em] text-white shadow-[var(--shadow-soft)] transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]"
          >
            {busy ? "Submitting…" : "Submit Request"}
          </button>
          {result ? (
            <p
              role={result.ok ? "status" : "alert"}
              className="text-sm font-medium"
            >
              {result.ticket ? `${result.ticket} — ` : ""}
              {result.message}
            </p>
          ) : null}
        </div>
      </form>

      <p id="support-form-note" className="text-xs text-[var(--text-muted)]">
        Never include passwords, licence secrets or payment card details. Email
        delivery status is shown separately from ticket storage.
      </p>
    </Card>
  );
}
