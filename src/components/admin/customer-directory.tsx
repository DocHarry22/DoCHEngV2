"use client";
import { useState, useSyncExternalStore } from "react";
import { Card } from "@/components/ui/card";
import { adminTime } from "@/lib/admin";
import {
  customerFromHash,
  customerHash,
  type CustomerDirectoryData,
} from "@/lib/customers";
import type { CatalogueProduct } from "@/lib/catalogue";
import { CustomerPager, useCustomerResource } from "./customer-shared";
import { CustomerProfile } from "./customer-profile";
function subscribe(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}
const snapshot = () => customerFromHash(window.location.hash);
const serverSnapshot = () => "";
export function CustomerDirectory({
  active,
  refreshKey,
  products,
  onChanged,
}: {
  active: boolean;
  refreshKey: string;
  products: CatalogueProduct[];
  onChanged: () => Promise<unknown>;
}) {
  const selected = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    q: "",
    verification: "all",
    state: "all",
    page: 1,
  });
  const [retry, setRetry] = useState(0);
  const params = new URLSearchParams({
    ...filters,
    page: String(filters.page),
  });
  const { data, error, loading } = useCustomerResource<CustomerDirectoryData>(
    active && !selected ? "/api/admin/customers?" + params : null,
    refreshKey + ":" + retry,
  );
  if (selected)
    return (
      <CustomerProfile
        key={selected}
        id={selected}
        active={active}
        refreshKey={refreshKey}
        products={products}
        onChanged={onChanged}
      />
    );
  return (
    <Card className="min-w-0 space-y-5" aria-busy={loading}>
      <h2 className="text-2xl font-semibold">Customer directory</h2>
      <p className="text-sm text-[var(--text-subtle)]">
        Find any account and open its profile to review access, licences and
        support history.
      </p>
      <form
        className="grid items-end gap-3 sm:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          setFilters({ ...filters, q: query.trim(), page: 1 });
          setRetry(retry + 1);
        }}
      >
        <label className="text-sm sm:col-span-2">
          Search customers
          <input
            type="search"
            className="field mt-2"
            placeholder="Name or email"
            maxLength={254}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <label className="text-sm">
          Verification
          <select
            className="field mt-2"
            value={filters.verification}
            onChange={(event) =>
              setFilters({
                ...filters,
                verification: event.target.value,
                page: 1,
              })
            }
          >
            <option value="all">All verification states</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </label>
        <label className="text-sm">
          Account status
          <select
            className="field mt-2"
            value={filters.state}
            onChange={(event) =>
              setFilters({ ...filters, state: event.target.value, page: 1 })
            }
          >
            <option value="all">All account states</option>
            <option value="enabled">Enabled</option>
            <option value="disabled">Disabled</option>
          </select>
        </label>
        <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
          <button className="action-button" type="submit">
            Search
          </button>
          <button
            type="button"
            className="text-link"
            onClick={() => {
              setQuery("");
              setFilters({ q: "", verification: "all", state: "all", page: 1 });
              setRetry(retry + 1);
            }}
          >
            Reset search
          </button>
        </div>
      </form>
      {loading ? <p role="status">Loading customers…</p> : null}
      {error ? (
        <div role="alert" className="notice">
          <p>{error}</p>
          <button
            type="button"
            className="text-link mt-2"
            onClick={() => setRetry(retry + 1)}
          >
            Retry customer search
          </button>
        </div>
      ) : null}
      {data ? (
        <>
          <p role={loading ? undefined : "status"} className="text-sm">
            {data.total.toLocaleString()}{" "}
            {data.total === 1 ? "customer" : "customers"} found
          </p>
          <ul className="divide-y divide-[var(--border-subtle)]">
            {data.items.map((customer) => (
              <li
                key={customer.id}
                className="flex min-w-0 flex-wrap justify-between gap-3 py-4"
              >
                <div className="min-w-0">
                  <a
                    className="text-link break-words font-semibold"
                    href={customerHash(customer.id)}
                  >
                    {customer.name}
                  </a>
                  <p className="break-all text-sm">{customer.email}</p>
                  <p className="mt-1 text-xs text-[var(--text-subtle)]">
                    Joined {adminTime(customer.created_at)}
                  </p>
                </div>
                <p className="text-xs">
                  {customer.verified ? "Verified" : "Unverified"} ·{" "}
                  {customer.disabled ? "Disabled" : "Enabled"} · {customer.role}
                </p>
              </li>
            ))}
          </ul>
          {!data.items.length ? (
            <p>
              No customers match these filters. Try another name or reset the
              search.
            </p>
          ) : null}
          <CustomerPager
            value={data}
            label="customers"
            disabled={loading}
            onPage={(page) => setFilters({ ...filters, page })}
          />
        </>
      ) : null}
    </Card>
  );
}
