"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth-provider";
import { Card } from "@/components/ui/card";
import { productAction, type CatalogueProduct } from "@/lib/catalogue";
type Item = Record<string, string | number | null>;
type AccountData = {
  products: CatalogueProduct[];
  tickets: Item[];
  replies: Item[];
  orders: Item[];
  licences: Item[];
  devices: Item[];
};
export function AccountPanel() {
  const router = useRouter();
  const { session, signOut, refreshSession } = useAuth();
  const [data, setData] = useState<AccountData>();
  const [notice, setNotice] = useState("");
  useEffect(() => {
    fetch("/api/account", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error();
        setData(await response.json());
      })
      .catch(() =>
        setNotice(
          "Unable to load your account. Please sign in again or retry.",
        ),
      );
  }, []);
  async function action(body: Record<string, unknown>) {
    try {
      const response = await fetch("/api/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      setNotice(result.message);
      if (response.ok && body.action === "revoke-sessions")
        router.replace("/signin");
      else if (response.ok) {
        await refreshSession();
        const fresh = await fetch("/api/account", { cache: "no-store" });
        if (fresh.ok) setData(await fresh.json());
      }
    } catch {
      setNotice("Account update failed. Please retry.");
    }
  }
  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <div className="flex flex-wrap justify-between gap-4">
          <div>
            <p>Signed in as</p>
            <h2 className="text-2xl font-semibold">{session.user?.name}</h2>
            <p className="text-sm text-[var(--text-subtle)]">
              {session.user?.email}
            </p>
          </div>
          <button
            className="action-button"
            onClick={async () => {
              try {
                await signOut();
                router.replace("/signin");
              } catch {
                setNotice("Sign out failed. Please retry.");
              }
            }}
          >
            Sign Out
          </button>
        </div>
        {!session.user?.emailVerified ? (
          <div className="notice">
            <p>
              Verify your email before requesting paid or administrator access.
            </p>
            <button
              className="text-link"
              onClick={async () => {
                try {
                  const r = await fetch("/api/auth/resend", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: "{}",
                  });
                  setNotice((await r.json()).message);
                } catch {
                  setNotice("Unable to request verification email.");
                }
              }}
            >
              Resend verification email
            </button>
          </div>
        ) : (
          <p>Email verified</p>
        )}
        {notice ? <p role="status">{notice}</p> : null}
      </Card>
      <Card>
        <h2 className="text-2xl font-semibold">Your applications</h2>
        <p className="mt-2 text-sm text-[var(--text-subtle)]">
          Public web apps enforce their own account permissions. Your DoCHEng
          session is never passed in a URL.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {(data?.products ?? [])
            .filter(
              (app) =>
                app.launch ||
                session.entitlements.some((e) => e.productSlug === app.slug),
            )
            .map((app) => {
              const action = productAction(app);
              const entitlement = session.entitlements.find(
                (e) => e.productSlug === app.slug,
              );
              return (
                <article
                  key={app.id}
                  className="rounded-xl border border-[var(--border-subtle)] p-4"
                >
                  <h3 className="font-semibold">{app.name}</h3>
                  <p className="my-2 text-sm">
                    {entitlement
                      ? `${entitlement.state} access`
                      : "No current purchased access"}
                  </p>
                  <a
                    href={action.href}
                    rel={action.external ? "noopener noreferrer" : undefined}
                    target={action.external ? "_blank" : undefined}
                    className="text-link"
                  >
                    {action.label}
                  </a>
                  <Link
                    className="text-link mt-3 block"
                    href={"/downloads#" + app.slug}
                  >
                    Updates and release availability
                  </Link>
                </article>
              );
            })}
        </div>
      </Card>
      <Link className="text-link" href="/checkout">
        Review approved purchase offers
      </Link>
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <h2 className="text-xl font-semibold">Support tickets</h2>
          {!data ? (
            <p>Loading tickets…</p>
          ) : !data.tickets.length ? (
            <p className="mt-3 text-sm">
              No tickets are linked to your account. Sign in before submitting a
              new enquiry using your account email.
            </p>
          ) : (
            data.tickets.map((t) => (
              <article
                key={String(t.id)}
                className="mt-3 border-t border-[var(--border-subtle)] pt-3"
              >
                <p className="font-mono text-sm">
                  {t.id} · {t.status}
                </p>
                <p>
                  {t.product} · {t.enquiry_type}
                </p>
                {data.replies
                  .filter((r) => r.ticket_id === t.id)
                  .map((r, i) => (
                    <p key={i} className="mt-2 whitespace-pre-wrap text-sm">
                      {r.message}
                    </p>
                  ))}
              </article>
            ))
          )}
          <Link
            className="text-link mt-4 inline-block"
            href="/support#contact-form"
          >
            Submit an enquiry
          </Link>
        </Card>
        <Card>
          <h2 className="text-xl font-semibold">Orders and receipts</h2>
          {data?.orders.length ? (
            data.orders.map((o) => (
              <div key={String(o.id)} className="mt-3">
                <p>
                  {o.reference} · {o.status}
                </p>
                <p>
                  {new Intl.NumberFormat("en-ZA", {
                    style: "currency",
                    currency: String(o.currency),
                  }).format(Number(o.amount) / 100)}
                </p>
                {o.status === "paid" ? (
                  <a
                    className="text-link"
                    href={`/api/commerce/receipt?id=${encodeURIComponent(String(o.id))}`}
                  >
                    Download payment receipt
                  </a>
                ) : null}
              </div>
            ))
          ) : (
            <p className="mt-3 text-sm">
              No orders. Checkout is not currently activated. No subscription or
              saved payment method is on file.
            </p>
          )}
        </Card>
      </div>
      <Card>
        <h2 className="text-xl font-semibold">Licences and devices</h2>
        {data?.licences.length ? (
          data.licences.map((l) => (
            <p key={String(l.id)} className="mt-3">
              {l.product_slug} · ending {l.key_hint} ·{" "}
              {l.status}{" "}
              · {l.device_limit} devices ·{" "}
              <a
                className="text-link"
                href={
                  "/api/commerce/licence?id=" +
                  encodeURIComponent(String(l.order_id))
                }
              >
                View licence key
              </a>
            </p>
          ))
        ) : (
          <p className="mt-3 text-sm">
            No purchased licences or activated devices.
          </p>
        )}
        {data?.devices.map((d) => (
          <div key={String(d.id)} className="mt-3 flex justify-between gap-3">
            <span>{d.name}</span>
            <button
              className="text-link"
              onClick={() =>
                action({ action: "revoke-device", deviceId: d.id })
              }
            >
              Deactivate
            </button>
          </div>
        ))}
      </Card>
      <Card className="space-y-4">
        <h2 className="text-xl font-semibold">Account details and privacy</h2>
        <form
          className="flex flex-wrap gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            void action({ action: "profile", name: form.get("name") });
          }}
        >
          <label className="space-y-2">
            <span className="block text-sm">Display name</span>
            <input
              name="name"
              defaultValue={session.user?.name}
              minLength={2}
              maxLength={100}
              required
              className="field"
            />
          </label>
          <button className="action-button self-end">Save details</button>
        </form>
        <div className="flex flex-wrap gap-4">
          <a className="text-link" href="/api/account/export">
            Export my personal data
          </a>
          <Link className="text-link" href="/forgot-password">
            Reset password
          </Link>
          <button
            className="text-link"
            onClick={() => action({ action: "revoke-sessions" })}
          >
            End all sessions
          </button>
          <button
            className="text-link"
            onClick={() => action({ action: "erasure" })}
          >
            Request account erasure
          </button>
          {session.user?.role === "admin" ? (
            <Link className="text-link" href="/admin">
              Administration
            </Link>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
