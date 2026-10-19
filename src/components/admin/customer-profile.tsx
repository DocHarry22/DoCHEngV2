"use client";
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { adminActionLabel, adminTime } from "@/lib/admin";
import type { CatalogueProduct } from "@/lib/catalogue";
import type { CustomerProfileData } from "@/lib/customers";
import {
  CustomerConfirmation,
  CustomerPager,
  useCustomerResource,
  type CustomerChange,
} from "./customer-shared";

export function CustomerProfile({
  id,
  active,
  refreshKey,
  products,
  onChanged,
}: {
  id: string;
  active: boolean;
  refreshKey: string;
  products: CatalogueProduct[];
  onChanged: () => Promise<unknown>;
}) {
  const [pages, setPages] = useState({
    licencePage: 1,
    ticketPage: 1,
    activityPage: 1,
  });
  const [retry, setRetry] = useState(0);
  const [change, setChange] = useState<CustomerChange | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [mutationError, setMutationError] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const params = new URLSearchParams(
    Object.fromEntries(
      Object.entries(pages).map(([key, value]) => [key, String(value)]),
    ),
  );
  const { data, error, loading } = useCustomerResource<CustomerProfileData>(
    active ? "/api/admin/customers/" + id + "?" + params : null,
    refreshKey + ":" + retry,
    true,
  );
  const loaded = Boolean(data);
  useEffect(() => {
    if (loaded && active) heading.current?.focus({ preventScroll: true });
  }, [loaded, active]);
  const productName = (slug: string) =>
    products.find((p) => p.slug === slug)?.name ?? slug;
  function review(value: CustomerChange) {
    setMutationError("");
    setChange(value);
  }
  async function confirm() {
    if (!change || busy) return;
    setBusy(true);
    setMutationError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(change.payload),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message ?? "Unable to save this change.");
      setChange(null);
      setNotice(result.message ?? "Customer updated.");
      setRetry((value) => value + 1);
      try {
        await onChanged();
      } catch {
        setNotice(
          (result.message ?? "Customer updated.") +
            " The overview could not refresh. Use Refresh dashboard to retry.",
        );
      }
    } catch (caught) {
      setMutationError(
        caught instanceof Error
          ? caught.message
          : "Unable to save this change. Please retry.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="min-w-0 space-y-5" aria-busy={loading || busy}>
      <a href="#customers" className="text-link">
        ← Back to customer directory
      </a>
      <h2
        ref={heading}
        tabIndex={-1}
        className="break-words text-2xl font-semibold"
      >
        Customer profile{data ? ": " + data.customer.name : ""}
      </h2>
      {loading ? <p role="status">Loading customer profile…</p> : null}
      {notice ? (
        <p role="status" className="notice">
          {notice}
        </p>
      ) : null}
      {error ? (
        <div role="alert" className="notice">
          <p>{error}</p>
          <button
            type="button"
            className="text-link mt-2"
            onClick={() => setRetry(retry + 1)}
          >
            Retry customer profile
          </button>
        </div>
      ) : null}
      {data ? (
        <>
          <Card className="min-w-0 space-y-4" aria-label="Account details">
            <h3 className="text-xl font-semibold">Account details</h3>
            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-[var(--text-subtle)]">Email</dt>
                <dd className="break-all">{data.customer.email}</dd>
              </div>
              <div>
                <dt className="text-[var(--text-subtle)]">Joined</dt>
                <dd>{adminTime(data.customer.created_at)}</dd>
              </div>
              <div>
                <dt className="text-[var(--text-subtle)]">Verification</dt>
                <dd>{data.customer.verified ? "Verified" : "Unverified"}</dd>
              </div>
              <div>
                <dt className="text-[var(--text-subtle)]">Account status</dt>
                <dd>{data.customer.disabled ? "Disabled" : "Enabled"}</dd>
              </div>
              <div>
                <dt className="text-[var(--text-subtle)]">Role</dt>
                <dd>{data.customer.role}</dd>
              </div>
              <div>
                <dt className="text-[var(--text-subtle)]">Account ID</dt>
                <dd className="break-all font-mono text-xs">
                  {data.customer.id}
                </dd>
              </div>
            </dl>
            {data.customer.id === data.currentUserId ? (
              <p className="text-sm">
                You are viewing your own account. Its enabled state cannot be
                changed here.
              </p>
            ) : (
              <button
                type="button"
                className="action-button"
                disabled={busy || loading || Boolean(error)}
                onClick={() =>
                  review({
                    title: data.customer.disabled
                      ? "Enable account?"
                      : "Disable account?",
                    description: data.customer.disabled
                      ? "This customer will be able to sign in again. Product access and verification status stay as shown in this profile."
                      : "This customer will be signed out of every session and unable to sign in. Product access and licences remain on record.",
                    payload: {
                      action: "user-state",
                      userId: id,
                      disabled: !data.customer.disabled,
                    },
                  })
                }
              >
                {data.customer.disabled ? "Enable account" : "Disable account"}
              </button>
            )}
          </Card>
          <Card className="min-w-0 space-y-4" aria-label="Product access">
            <h3 className="text-xl font-semibold">Product access</h3>
            {data.entitlements.length ? (
              <ul className="space-y-3">
                {data.entitlements.map((entry) => (
                  <li
                    key={entry.product_slug}
                    className="rounded-xl border border-[var(--border-subtle)] p-3 text-sm"
                  >
                    <strong>{productName(entry.product_slug)}</strong>
                    <p>
                      {entry.state} · {entry.source}
                      {entry.expires_at !== null &&
                      entry.expires_at <= data.asOf
                        ? " · expired"
                        : ""}
                    </p>
                    <p>
                      {entry.expires_at === null
                        ? "No expiry"
                        : "Expires " + adminTime(entry.expires_at)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm">No product access has been assigned.</p>
            )}
            <form
              className="grid items-end gap-3 sm:grid-cols-2"
              onSubmit={(event) => {
                event.preventDefault();
                const form = new FormData(event.currentTarget);
                const slug = String(form.get("slug")),
                  state = String(form.get("state")),
                  raw = String(form.get("expiry"));
                const expiresAt = raw ? new Date(raw).toISOString() : "";
                review({
                  title: "Change product access?",
                  description:
                    productName(slug) +
                    " → " +
                    (state === "none"
                      ? "No access"
                      : state === "trial"
                        ? "Trial"
                        : "Manual grant") +
                    ". " +
                    (expiresAt
                      ? "Expires " + adminTime(Date.parse(expiresAt)) + "."
                      : "No expiry.") +
                    " This replaces the current access entry for this product. Existing licences require separate revocation; provider billing is unchanged.",
                  payload: {
                    action: "entitlement",
                    userId: id,
                    slug,
                    state,
                    expiresAt,
                  },
                });
              }}
            >
              <label className="text-sm">
                Product
                <select name="slug" className="field mt-2" required>
                  {products.map((product) => (
                    <option key={product.slug} value={product.slug}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm">
                Access
                <select name="state" className="field mt-2">
                  <option value="active">Manual grant</option>
                  <option value="trial">Trial</option>
                  <option value="none">No access</option>
                </select>
              </label>
              <label className="text-sm sm:col-span-2">
                Expiry (your local time, optional)
                <input
                  name="expiry"
                  type="datetime-local"
                  className="field mt-2"
                />
              </label>
              <button
                className="action-button sm:col-span-2"
                disabled={busy || loading || Boolean(error)}
              >
                Review access change
              </button>
            </form>
          </Card>
          <Card className="min-w-0 space-y-4" aria-label="Customer licences">
            <h3 className="text-xl font-semibold">Licences</h3>
            <ul className="space-y-3">
              {data.licences.items.map((licence) => (
                <li
                  key={licence.id}
                  className="min-w-0 space-y-2 rounded-xl border border-[var(--border-subtle)] p-4 text-sm"
                >
                  <p className="break-words font-semibold">
                    {(licence.products.length
                      ? licence.products
                      : [licence.product_slug]
                    )
                      .map(productName)
                      .join(", ")}
                  </p>
                  <p>
                    Ending {licence.key_hint} ·{" "}
                    {licence.revoked
                      ? "Revoked"
                      : licence.expires_at !== null &&
                          licence.expires_at <= data.asOf
                        ? "Expired"
                        : "Active"}
                  </p>
                  <p>
                    {licence.devices} of {licence.device_limit} devices ·{" "}
                    {licence.expires_at === null
                      ? "No expiry"
                      : "Expires " + adminTime(licence.expires_at)}
                  </p>
                  {!licence.revoked ? (
                    <button
                      type="button"
                      className="text-link"
                      disabled={busy || loading || Boolean(error)}
                      onClick={() =>
                        review({
                          title: "Revoke licence?",
                          description:
                            "Licence ending " +
                            licence.key_hint +
                            " will be revoked and its registered devices removed. Plan access is removed when no other valid licence covers the product. Manual access stays in place. Provider billing is unchanged.",
                          payload: {
                            action: "revoke-licence",
                            licenceId: licence.id,
                          },
                        })
                      }
                    >
                      Revoke licence ending {licence.key_hint}
                    </button>
                  ) : null}
                </li>
              ))}
            </ul>
            {!data.licences.total ? (
              <p className="text-sm">No licences for this customer.</p>
            ) : null}
            <CustomerPager
              value={data.licences}
              label="licences"
              disabled={busy || loading}
              onPage={(licencePage) => setPages({ ...pages, licencePage })}
            />
          </Card>
          <Card
            className="min-w-0 space-y-4"
            aria-label="Customer support history"
          >
            <h3 className="text-xl font-semibold">Support history</h3>
            <p className="text-xs text-[var(--text-subtle)]">
              Tickets submitted while signed in to this account. Guest enquiries
              remain in Support.
            </p>
            {data.tickets.items.map((ticket) => (
              <details
                key={ticket.id}
                className="min-w-0 rounded-xl border border-[var(--border-subtle)] p-4 text-sm"
              >
                <summary className="cursor-pointer break-words">
                  {ticket.id} · {ticket.status} · {productName(ticket.product)}
                </summary>
                <p className="mt-3 text-xs">
                  {ticket.enquiry_type} · {adminTime(ticket.created_at)}
                </p>
                <p className="mt-3 whitespace-pre-wrap break-words">
                  {ticket.message}
                </p>
                <ol className="mt-3 space-y-3">
                  {ticket.replies.map((reply) => (
                    <li
                      key={reply.id}
                      className="border-l border-[var(--border-subtle)] pl-3"
                    >
                      <p className="text-xs">
                        {reply.author_name} · {adminTime(reply.created_at)}
                      </p>
                      <p className="whitespace-pre-wrap break-words">
                        {reply.message}
                      </p>
                    </li>
                  ))}
                </ol>
              </details>
            ))}
            {!data.tickets.total ? (
              <p className="text-sm">No account-linked support tickets.</p>
            ) : null}
            <CustomerPager
              value={data.tickets}
              label="support"
              disabled={busy || loading}
              onPage={(ticketPage) => setPages({ ...pages, ticketPage })}
            />
          </Card>
          <Card className="min-w-0 space-y-4" aria-label="Customer activity">
            <h3 className="text-xl font-semibold">Customer activity</h3>
            <ol className="divide-y divide-[var(--border-subtle)]">
              {data.activity.items.map((item) => (
                <li key={String(item.id)} className="space-y-1 py-3 text-sm">
                  <p className="font-semibold">
                    {adminActionLabel(String(item.action))}
                  </p>
                  <p className="break-words text-xs text-[var(--text-subtle)]">
                    {String(item.actor_name ?? "System")} ·{" "}
                    {adminTime(item.created_at)}
                  </p>
                  <p className="break-all text-xs">
                    {String(item.resource)}
                    {item.detail ? " · " + item.detail : ""}
                  </p>
                </li>
              ))}
            </ol>
            {!data.activity.total ? (
              <p className="text-sm">No recorded customer activity.</p>
            ) : null}
            <CustomerPager
              value={data.activity}
              label="activity"
              disabled={busy || loading}
              onPage={(activityPage) => setPages({ ...pages, activityPage })}
            />
          </Card>
          {active && change ? (
            <CustomerConfirmation
              change={change}
              email={data.customer.email}
              busy={busy}
              error={mutationError}
              onCancel={() => setChange(null)}
              onConfirm={() => void confirm()}
            />
          ) : null}
        </>
      ) : null}
    </div>
  );
}
