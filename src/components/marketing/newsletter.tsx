"use client";
import { useState } from "react";
export function Newsletter() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        const values = Object.fromEntries(new FormData(e.currentTarget));
        try {
          const r = await fetch("/api/subscriptions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...values,
              consent: values.consent === "on",
            }),
          });
          setMessage((await r.json()).message);
        } catch {
          setMessage("Subscription was not saved. Please retry.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <label className="text-sm">
          Email
          <input
            className="field mt-2"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
          />
        </label>
        <label className="text-sm">
          Updates
          <select className="field mt-2" name="topic">
            <option value="ecosystem">All ecosystem news</option>
            <option value="desk">DoCHEng Desk</option>
            <option value="resume">DoCHEng Resume</option>
            <option value="compass">Compass early access</option>
            <option value="engineering-tools">Engineering tools</option>
          </select>
        </label>
        <button disabled={busy} className="action-button self-end">
          {busy ? "Saving…" : "Subscribe"}
        </button>
      </div>
      <div hidden aria-hidden="true">
        <input name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <label className="flex items-start gap-3 text-sm">
        <input required type="checkbox" name="consent" className="mt-1" />
        <span>
          I agree to receive the selected updates and the{" "}
          <a className="underline" href="/privacy">
            privacy notice
          </a>
          . I can unsubscribe at any time.
        </span>
      </label>
      <p role="status" className="text-sm">
        {message}
      </p>
    </form>
  );
}
