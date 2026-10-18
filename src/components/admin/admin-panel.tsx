"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import type { CatalogueProduct } from "@/lib/catalogue";
import { ReleaseUpload } from "./release-upload";
import { CustomerOperations } from "./customer-operations";
import { AggregateReport } from "./aggregate-report";
import { RepositoryReferences } from "./repository-references";
type Row = Record<string, string | number | null>;
type AdminData = {
  products: CatalogueProduct[];
  drafts: Row[];
  tickets: Row[];
  users: Row[];
  audit: Row[];
  mail: Row[];
  metrics: Row[];
  repositories: Row[];
  licences: Row[];
};
export function AdminPanel() {
  const [data, setData] = useState<AdminData>();
  const [slug, setSlug] = useState("");
  const [document, setDocument] = useState("");
  const [notice, setNotice] = useState("");
  const [approve, setApprove] = useState(false);
  const [busy, setBusy] = useState(false);
  async function reload(): Promise<AdminData> {
    const r = await fetch("/api/admin", { cache: "no-store" });
    if (!r.ok) throw new Error("Administrator access required.");
    const latest = (await r.json()) as AdminData;
    setData(latest);
    return latest;
  }
  useEffect(() => {
    fetch("/api/admin", { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) throw new Error("Administrator access required.");
        return r.json();
      })
      .then(setData)
      .catch((e) => setNotice(e.message));
  }, []);
  async function send(body: object) {
    setBusy(true);
    try {
      const r = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const value = await r.json();
      setNotice(value.message ?? JSON.stringify(value));
      if (r.ok) {
        await reload();
        setApprove(false);
        if (value.product) setDocument(JSON.stringify(value.product, null, 2));
      }
      return r.ok;
    } catch {
      setNotice("Administrator operation failed. Please retry.");
      return false;
    } finally {
      setBusy(false);
    }
  }
  function select(value: string) {
    setSlug(value);
    setApprove(false);
    const saved = data?.drafts.find((p) => p.slug === value);
    const p = saved
      ? JSON.parse(String(saved.document))
      : data?.products.find((p) => p.slug === value);
    setDocument(JSON.stringify(p, null, 2));
  }
  return (
    <div className="space-y-8">
      {notice ? (
        <p role="status" className="notice">
          {notice}
        </p>
      ) : null}
      <Card className="space-y-4">
        <h2 className="text-2xl font-semibold">Product management</h2>
        <p className="text-sm">
          Discovery candidates remain unpublished until you explicitly approve
          publication. Save a draft before verifying its launch URL. Edit
          descriptive metadata and proposed pricing here; billing activation is
          a separate release decision.
        </p>
        <label className="block text-sm">
          Choose a product
          <select
            className="field mt-2"
            value={slug}
            onChange={(e) => select(e.target.value)}
          >
            <option value="">Select a draft or publication candidate</option>
            {Array.from(
              new Set([
                ...(data?.products.map((p) => p.slug) ?? []),
                ...(data?.drafts.map((p) => String(p.slug)) ?? []),
              ]),
            ).map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
        <button
          className="text-link"
          disabled={!slug || busy}
          onClick={async () => {
            try {
              const latest = await reload();
              const draft = latest.drafts.find((p) => p.slug === slug);
              const product = draft
                ? JSON.parse(String(draft.document))
                : latest.products.find((p) => p.slug === slug);
              setDocument(JSON.stringify(product, null, 2));
              setApprove(false);
              setNotice("Selected draft reloaded from the server.");
            } catch {
              setNotice("Unable to reload the draft.");
            }
          }}
        >
          Reload selected draft (discard edits)
        </button>
        <button
          className="text-link"
          onClick={() => {
            const p = data?.products[0];
            if (p) {
              setSlug("new-product");
              setDocument(
                JSON.stringify(
                  {
                    ...p,
                    id: "app-new-product",
                    slug: "new-product",
                    name: "New product",
                    featured: false,
                    launch: undefined,
                    releases: [],
                    screenshots: [],
                    status: "planned",
                  },
                  null,
                  2,
                ),
              );
            }
          }}
        >
          Add an application
        </button>
        {document ? (
          <>
            <label className="block text-sm">
              Product metadata
              <textarea
                spellCheck={false}
                className="field mt-2 min-h-96 font-mono text-xs"
                value={document}
                onChange={(e) => setDocument(e.target.value)}
              />
            </label>
            <p className="text-xs">
              Screenshots use uploaded media URLs; launch evidence and release
              files are controlled by separate server operations. Private
              repository administration references must stay outside public
              metadata.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                disabled={busy}
                className="action-button"
                onClick={() => {
                  try {
                    const product = JSON.parse(document);
                    void send({
                      action: "save-product",
                      product,
                      revision: data?.drafts.find(
                        (p) => p.slug === product.slug,
                      )?.revision,
                    });
                  } catch {
                    setNotice("The product metadata is not valid JSON.");
                  }
                }}
              >
                Save draft
              </button>
              <button
                disabled={busy}
                className="action-button"
                onClick={() => {
                  try {
                    const product = JSON.parse(document);
                    void send({
                      action: "unpublish",
                      product,
                      revision: data?.drafts.find(
                        (p) => p.slug === product.slug,
                      )?.revision,
                    });
                  } catch {
                    setNotice("Invalid JSON.");
                  }
                }}
              >
                Withdraw draft publication
              </button>
            </div>
            <form
              className="flex flex-wrap gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                void send({
                  action: "verify-link",
                  slug: JSON.parse(document).slug,
                  url: f.get("url"),
                });
              }}
            >
              <label className="flex-1 text-sm">
                Public launch URL
                <input
                  className="field mt-2"
                  name="url"
                  type="url"
                  required
                  placeholder="https://your-verified-application.example"
                />
              </label>
              <button disabled={busy} className="action-button self-end">
                Verify entry page
              </button>
            </form>
            <label className="flex items-start gap-3 text-sm">
              <input
                className="mt-1"
                type="checkbox"
                checked={approve}
                onChange={(e) => setApprove(e.target.checked)}
              />
              <span>
                I have reviewed this product, its visibility, verified links and
                original assets. I explicitly approve public publication.
              </span>
            </label>
            <button
              disabled={!approve || busy}
              className="action-button"
              onClick={() => {
                try {
                  const product = JSON.parse(document);
                  void send({
                    action: "publish",
                    product,
                    revision: data?.drafts.find((p) => p.slug === product.slug)
                      ?.revision,
                    approvePublication: true,
                  });
                } catch {
                  setNotice("Invalid product JSON.");
                }
              }}
            >
              Approve and publish
            </button>
          </>
        ) : null}
      </Card>
      <Card className="space-y-4">
        <h2 className="text-2xl font-semibold">Logos and screenshots</h2>
        <form
          className="space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            const file = new FormData(e.currentTarget).get("image");
            if (!(file instanceof File)) return;
            setBusy(true);
            try {
              const r = await fetch("/api/admin/media", {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file,
              });
              const v = await r.json();
              setNotice(r.ok ? "Uploaded media: " + v.url : v.message);
            } catch {
              setNotice("Upload failed.");
            } finally {
              setBusy(false);
            }
          }}
        >
          <label className="block text-sm">
            PNG, JPEG or WebP image, up to 5 MB
            <input
              className="field mt-2"
              type="file"
              name="image"
              accept="image/png,image/jpeg,image/webp"
              required
            />
          </label>
          <button disabled={busy} className="action-button">
            Upload image
          </button>
        </form>
      </Card>
      <Card className="space-y-4">
        <h2 className="text-2xl font-semibold">Release artifacts</h2>
        <ReleaseUpload
          slugs={data?.drafts.map((p) => String(p.slug)) ?? []}
          onUploaded={async (slug) => {
            const latest = await reload();
            const draft = latest.drafts.find((p) => p.slug === slug);
            if (draft) {
              setSlug(slug);
              setDocument(String(draft.document));
              setApprove(false);
            }
          }}
        />
      </Card>
      <Card className="space-y-4">
        <h2 className="text-2xl font-semibold">Support enquiries</h2>
        {data?.tickets.map((t) => (
          <details
            key={String(t.id)}
            className="rounded-xl border border-[var(--border-subtle)] p-4"
          >
            <summary className="cursor-pointer">
              {t.id} · {t.status} · {t.enquiry_type}
            </summary>
            <p className="my-3 text-sm">
              {t.name} · {t.email} · {t.product}
            </p>
            <p className="whitespace-pre-wrap text-sm">{t.message}</p>
            <form
              className="mt-4 space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                void send({
                  action: "reply",
                  ticket: t.id,
                  message: f.get("reply"),
                  close: f.get("close") === "on",
                });
              }}
            >
              <label className="block text-sm">
                Reply
                <textarea
                  name="reply"
                  className="field mt-2"
                  required
                  minLength={10}
                  maxLength={8000}
                />
              </label>
              <label className="flex gap-2 text-sm">
                <input type="checkbox" name="close" />
                Close after replying
              </label>
              <button disabled={busy} className="action-button">
                Save reply and queue email
              </button>
            </form>
          </details>
        ))}
        {!data?.tickets.length ? <p>No enquiries.</p> : null}
      </Card>
      <Card className="space-y-4">
        <h2 className="text-2xl font-semibold">Customer access</h2>
        <form
          className="grid gap-3 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            const values = Object.fromEntries(new FormData(e.currentTarget));
            void send({ ...values, action: "entitlement" });
          }}
        >
          <label className="text-sm">
            User
            <select required className="field mt-2" name="userId">
              {data?.users.map((u) => (
                <option key={String(u.id)} value={String(u.id)}>
                  {u.email}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Product
            <select className="field mt-2" name="slug">
              {data?.products.map((p) => (
                <option key={p.id} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Access
            <select className="field mt-2" name="state">
              <option value="none">No access</option>
              <option value="trial">Trial</option>
              <option value="active">Manual grant</option>
            </select>
          </label>
          <label className="text-sm">
            Expiry (optional)
            <input
              className="field mt-2"
              type="datetime-local"
              name="expiresAt"
            />
          </label>
          <button className="action-button" disabled={busy}>
            Update access
          </button>
        </form>
      </Card>
      <Card className="space-y-4">
        <h2 className="text-2xl font-semibold">Email delivery</h2>
        <p>
          {data?.mail.filter((m) => m.status === "queued").length ?? 0} messages
          queued. Missing provider credentials leave messages queued.
        </p>
        <button
          className="action-button"
          disabled={busy}
          onClick={() => send({ action: "flush-mail" })}
        >
          Retry queued mail
        </button>
      </Card>
      <Card className="overflow-x-auto">
        <h2 className="mb-4 text-2xl font-semibold">Audit trail</h2>
        <table className="w-full text-left text-xs">
          <thead>
            <tr>
              <th className="p-2">Date</th>
              <th className="p-2">Action</th>
              <th className="p-2">Resource</th>
            </tr>
          </thead>
          <tbody>
            {data?.audit.map((a) => (
              <tr key={String(a.id)}>
                <td className="p-2">
                  {new Date(Number(a.created_at)).toISOString()}
                </td>
                <td className="p-2">{a.action}</td>
                <td className="p-2">{a.resource}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Card>
        <CustomerOperations
          users={data?.users ?? []}
          licences={data?.licences ?? []}
          send={send}
        />
      </Card>
      <Card>
        <AggregateReport metrics={data?.metrics ?? []} />
      </Card>
      <Card>
        <RepositoryReferences
          slugs={Array.from(
            new Set([
              ...(data?.products.map((p) => p.slug) ?? []),
              ...(data?.drafts.map((p) => String(p.slug)) ?? []),
            ]),
          )}
          rows={data?.repositories ?? []}
          send={send}
        />
      </Card>
    </div>
  );
}
