"use client";

import { useState } from "react";

export function ReleaseUpload({
  slugs,
  onUploaded,
  productSlug,
  onBusyChange,
}: {
  slugs: string[];
  onUploaded?: (slug: string) => Promise<void>;
  productSlug?: string;
  onBusyChange?: (busy: boolean) => void;
}) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        const values = new FormData(event.currentTarget);
        const file = values.get("artifact");
        if (!(file instanceof File) || !file.size) return;
        const params = new URLSearchParams();
        for (const key of [
          "slug",
          "version",
          "platform",
          "channel",
          "notes",
          "requirements",
          "access",
        ])
          params.set(key, String(values.get(key) ?? ""));
        params.set(
          "extension",
          file.name.split(".").at(-1)?.toLowerCase() ?? "",
        );
        params.set(
          "installationTested",
          String(values.get("installationTested") === "on"),
        );
        params.set(
          "publisherReviewed",
          String(values.get("publisherReviewed") === "on"),
        );
        setBusy(true);
        onBusyChange?.(true);
        try {
          const response = await fetch("/api/admin/artifacts?" + params, {
            method: "POST",
            headers: { "Content-Type": "application/octet-stream" },
            body: file,
          });
          const result = await response.json();
          setMessage(result.message);
          if (response.ok) {
            try {
              await onUploaded?.(String(values.get("slug")));
            } catch {
              setMessage(
                "Release uploaded. Reload the saved draft to review it before publishing.",
              );
            }
          }
        } catch {
          setMessage("Upload failed. Please retry.");
        } finally {
          setBusy(false);
          onBusyChange?.(false);
        }
      }}
    >
      <p className="text-sm">
        Save a product draft first. Every upload is hashed twice, stored
        privately, and held for explicit publication. Stable releases require
        installation and publisher review.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm">
          Product
          <select
            name="slug"
            className="field mt-2"
            required
            value={productSlug}
            onChange={productSlug ? () => {} : undefined}
            disabled={busy}
          >
            {slugs.map((slug) => (
              <option key={slug}>{slug}</option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Version
          <input
            name="version"
            className="field mt-2"
            placeholder="1.0.0"
            required
            pattern={String.raw`v?[0-9]+\.[0-9]+\.[0-9]+(-[a-z0-9.\-]+)?`}
          />
        </label>
        <label className="text-sm">
          Platform
          <select name="platform" className="field mt-2">
            <option>Windows</option>
            <option>Android</option>
          </select>
        </label>
        <label className="text-sm">
          Channel
          <select name="channel" className="field mt-2">
            <option>preview</option>
            <option>beta</option>
            <option>stable</option>
          </select>
        </label>
        <label className="text-sm">
          Access
          <select name="access" className="field mt-2">
            <option value="public">Public</option>
            <option value="account">Verified account</option>
            <option value="paid">Paid entitlement</option>
          </select>
        </label>
        <label className="text-sm">
          Installer (up to 100 MB)
          <input
            type="file"
            name="artifact"
            className="field mt-2"
            accept=".exe,.msi,.apk,.zip"
            required
          />
        </label>
      </div>
      <label className="block text-sm">
        System requirements
        <textarea
          name="requirements"
          className="field mt-2"
          minLength={10}
          maxLength={1000}
          required
        />
      </label>
      <label className="block text-sm">
        Release notes
        <textarea
          name="notes"
          className="field mt-2"
          minLength={20}
          maxLength={3000}
          required
        />
      </label>
      <label className="flex gap-2 text-sm">
        <input name="installationTested" type="checkbox" />I tested installation
        on the declared platform.
      </label>
      <label className="flex gap-2 text-sm">
        <input name="publisherReviewed" type="checkbox" />I reviewed publisher
        identity and signing.
      </label>
      <button className="action-button" disabled={busy}>
        {busy ? "Uploading…" : "Upload release for review"}
      </button>
      {message ? <p role="status">{message}</p> : null}
    </form>
  );
}
