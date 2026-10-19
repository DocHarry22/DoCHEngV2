"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import type { CatalogueProduct } from "@/lib/catalogue";
import {
  GuidedProductEditor,
  type ProductDraft,
} from "./guided-product-editor";
import { CustomerOperations } from "./customer-operations";
import { AggregateReport } from "./aggregate-report";
import { RepositoryReferences } from "./repository-references";
type Row = Record<string, string | number | null>;
type AdminData = {
  products: CatalogueProduct[];
  drafts: ProductDraft[];
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
  const [notice, setNotice] = useState("");
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
      }
      return r.ok;
    } catch {
      setNotice("Administrator operation failed. Please retry.");
      return false;
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="space-y-8">
      {notice ? (
        <p role="status" className="notice">
          {notice}
        </p>
      ) : null}
      {data ? (
        <GuidedProductEditor
          products={data.products}
          drafts={data.drafts}
          onReload={reload}
        />
      ) : (
        <p>Loading administrator tools…</p>
      )}
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
