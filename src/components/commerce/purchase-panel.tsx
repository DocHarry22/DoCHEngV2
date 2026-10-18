"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-provider";
import { Card } from "@/components/ui/card";
type Offer = {
  id: string;
  productSlug: string;
  amount: number;
  currency: string;
  deviceLimit: number;
  days?: number;
  bundleProducts?: string[];
};
const money = (amount: number) =>
  new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(
    amount / 100,
  );
export function PurchasePanel() {
  const { session } = useAuth();
  const [offers, setOffers] = useState<Offer[]>();
  const [cart, setCart] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    fetch("/api/commerce/offers", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error();
        return response.json();
      })
      .then((result) => setOffers(result.offers))
      .catch(() =>
        setMessage(
          "Unable to load approved offers. No payment has been taken.",
        ),
      );
  }, []);
  const selected = offers?.filter((o) => cart.includes(o.id)) ?? [];
  return (
    <div className="space-y-6">
      <Card className="space-y-3">
        <h2 className="text-2xl font-semibold">Purchase availability</h2>
        <p>
          No live paid billing is activated. Any offers shown here are
          explicitly configured sandbox offers for payment and entitlement
          testing. Existing plan proposals are not purchase offers.
        </p>
        {offers?.length === 0 ? (
          <p>
            There are currently no approved checkout offers. Explore the{" "}
            <Link className="text-link" href="/tools">
              free engineering tools
            </Link>{" "}
            or{" "}
            <Link className="text-link" href="/support#contact-form">
              send a commercial enquiry
            </Link>
            .
          </p>
        ) : !offers ? (
          <p>Checking availability…</p>
        ) : null}
      </Card>
      {offers?.length ? (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {offers.map((offer) => (
              <Card key={offer.id} className="space-y-3">
                <h2 className="text-xl font-semibold">
                  {[offer.productSlug, ...(offer.bundleProducts ?? [])].join(
                    " + ",
                  )}
                </h2>
                <p>{money(offer.amount)} · test payment only</p>
                <p className="text-sm">
                  {offer.deviceLimit} activated devices ·{" "}
                  {offer.days
                    ? offer.days + " days of access; no automatic renewal"
                    : "one-time licence"}
                  {offer.bundleProducts?.length
                    ? " · device allowance shared across this bundle"
                    : ""}
                </p>
                <label className="flex gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={cart.includes(offer.id)}
                    disabled={cart.length >= 5 && !cart.includes(offer.id)}
                    onChange={(event) =>
                      setCart(
                        event.target.checked
                          ? [...cart, offer.id]
                          : cart.filter((id) => id !== offer.id),
                      )
                    }
                  />
                  Add this approved test offer to the cart
                </label>
              </Card>
            ))}
          </div>
          <Card className="space-y-4">
            <h2 className="text-2xl font-semibold">Your test cart</h2>
            <p>
              {selected.length} selected ·{" "}
              {money(selected.reduce((total, o) => total + o.amount, 0))}
            </p>
            <p className="text-sm">
              The server recalculates and stores all prices. A return from the
              payment provider does not establish payment or grant access.
              Digital products remain subject to their actual release
              availability.
            </p>
            {!session.user ? (
              <Link className="action-button" href="/signin?next=/checkout">
                Sign in to continue
              </Link>
            ) : !session.user.emailVerified ? (
              <Link className="text-link" href="/account">
                Verify your email in your account before checkout
              </Link>
            ) : (
              <button
                className="action-button"
                disabled={!selected.length || busy}
                onClick={async () => {
                  setBusy(true);
                  try {
                    const response = await fetch("/api/commerce/checkout", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ offerIds: cart }),
                    });
                    const result = await response.json();
                    if (!response.ok) throw new Error(result.message);
                    const url = new URL(result.url);
                    if (
                      url.protocol !== "https:" ||
                      url.hostname !== "checkout.paystack.com"
                    )
                      throw new Error("Unexpected checkout destination.");
                    window.location.href = url.href;
                  } catch (error) {
                    setMessage(
                      error instanceof Error
                        ? error.message
                        : "Checkout unavailable.",
                    );
                    setBusy(false);
                  }
                }}
              >
                Continue to Paystack test checkout
              </button>
            )}
          </Card>
        </>
      ) : null}
      {message ? <p role="alert">{message}</p> : null}
    </div>
  );
}
