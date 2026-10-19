"use client";
import { Card } from "@/components/ui/card";
import type { AdminData, AdminSection } from "@/lib/admin";
import { adminActionLabel, adminTime } from "@/lib/admin";
import { GuidedProductEditor } from "./guided-product-editor";
import { CustomerDirectory } from "./customer-directory";
import { AggregateReport } from "./aggregate-report";
import { RepositoryReferences } from "./repository-references";
import { AdminOverview, AdminReleases } from "./admin-overview";
export function AdminWorkspaces({
  data,
  active,
  busy,
  send,
  reload,
}: {
  data: AdminData;
  active: AdminSection;
  busy: boolean;
  send: (body: object) => Promise<boolean>;
  reload: () => Promise<AdminData>;
}) {
  return (
    <>
      <section
        id="overview"
        aria-label="overview"
        tabIndex={-1}
        hidden={active !== "overview"}
        className="min-w-0 scroll-mt-28 space-y-6"
      >
        <AdminOverview data={data} />
      </section>
      <section
        id="products"
        aria-label="products"
        tabIndex={-1}
        hidden={active !== "products"}
        className="min-w-0 scroll-mt-28 space-y-6"
      >
        <GuidedProductEditor
          products={data.products}
          drafts={data.drafts}
          onReload={reload}
        />
      </section>
      <section
        id="releases"
        aria-label="releases"
        tabIndex={-1}
        hidden={active !== "releases"}
        className="min-w-0 scroll-mt-28 space-y-6"
      >
        <AdminReleases data={data} />
      </section>
      <section
        id="customers"
        aria-label="customers"
        tabIndex={-1}
        hidden={active !== "customers"}
        className="min-w-0 scroll-mt-28 space-y-6"
      >
        <CustomerDirectory
          active={active === "customers"}
          refreshKey={data.updatedAt}
          products={data.products}
          onChanged={reload}
        />
      </section>
      <section
        id="support"
        aria-label="support"
        tabIndex={-1}
        hidden={active !== "support"}
        className="min-w-0 scroll-mt-28 space-y-6"
      >
        {" "}
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
      </section>
      <section
        id="email"
        aria-label="email"
        tabIndex={-1}
        hidden={active !== "email"}
        className="min-w-0 scroll-mt-28 space-y-6"
      >
        {" "}
        <Card className="space-y-4">
          <h2 className="text-2xl font-semibold">Email delivery</h2>
          <p>
            {data.summary.queuedMail} messages queued. Review delivery before
            retrying; expired account links need a fresh request.
          </p>
          <button
            className="action-button"
            disabled={busy}
            onClick={() => send({ action: "flush-mail" })}
          >
            Retry queued mail
          </button>
        </Card>
      </section>
      <section
        id="reports"
        aria-label="reports"
        tabIndex={-1}
        hidden={active !== "reports"}
        className="min-w-0 scroll-mt-28 space-y-6"
      >
        {" "}
        <Card>
          <AggregateReport metrics={data?.metrics ?? []} />
        </Card>
      </section>
      <section
        id="activity"
        aria-label="activity"
        tabIndex={-1}
        hidden={active !== "activity"}
        className="min-w-0 scroll-mt-28 space-y-6"
      >
        {" "}
        <Card className="overflow-x-auto">
          <h2 className="mb-4 text-2xl font-semibold">Audit trail</h2>
          <table className="w-full text-left text-xs">
            <thead>
              <tr>
                <th className="p-2">Date</th>
                <th className="p-2">Action</th>
                <th className="p-2">By</th>
                <th className="p-2">Resource</th>
              </tr>
            </thead>
            <tbody>
              {data?.audit.map((a) => (
                <tr key={String(a.id)}>
                  <td className="p-2">{adminTime(a.created_at)}</td>
                  <td className="p-2">{adminActionLabel(String(a.action))}</td>
                  <td className="p-2">{a.actor_name ?? "System"}</td>
                  <td className="p-2 break-all">{a.resource}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </section>
      <section
        id="repositories"
        aria-label="repositories"
        tabIndex={-1}
        hidden={active !== "repositories"}
        className="min-w-0 scroll-mt-28 space-y-6"
      >
        {" "}
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
      </section>
    </>
  );
}
