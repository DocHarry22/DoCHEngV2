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

export function ContactFormShell({ enquiryTypes, productOptions }: ContactFormShellProps) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <Card className="space-y-5 bg-[var(--surface-0)]">
      <div>
        <h3 className="text-2xl font-semibold tracking-tight">Contact DoCHEng support</h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-subtle)]">
          This form is frontend-ready and structured for backend integration. Submissions are currently staged as a non-sending placeholder.
        </p>
      </div>

      <form
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
        }}
        aria-describedby="support-form-note"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span className="font-semibold">Name</span>
            <input
              required
              name="name"
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
          <span className="font-semibold">Company or organization (optional)</span>
          <input
            name="organization"
            autoComplete="organization"
            className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-main)] outline-none transition focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
          />
        </label>

        <label className="space-y-2 text-sm">
          <span className="font-semibold">Priority or context (optional)</span>
          <input
            name="priorityContext"
            placeholder="e.g. blocked release, billing deadline, pilot timeline"
            className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-main)] outline-none transition focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
          />
        </label>

        <label className="space-y-2 text-sm">
          <span className="font-semibold">Message</span>
          <textarea
            required
            name="message"
            rows={5}
            className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface-1)] px-3 py-2 text-sm leading-relaxed text-[var(--text-main)] outline-none transition focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
            placeholder="Describe your question, current setup, and desired outcome."
          />
        </label>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-xl bg-[var(--accent-primary)] px-5 py-2.5 text-xs font-semibold tracking-[0.04em] text-white shadow-[var(--shadow-soft)] transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]"
          >
            Submit Request
          </button>
          {submitted ? (
            <p className="text-xs font-medium text-[var(--accent-secondary)]">Captured locally. Backend submission will be connected in a future stage.</p>
          ) : null}
        </div>
      </form>

      <p id="support-form-note" className="text-xs text-[var(--text-muted)]">
        Transparency note: This interface currently demonstrates the final contact schema and UX flow. It does not send live tickets yet.
      </p>
    </Card>
  );
}
