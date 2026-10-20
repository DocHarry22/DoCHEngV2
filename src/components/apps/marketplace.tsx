"use client";
import { useSyncExternalStore, useMemo, useState } from "react";
import Link from "next/link";
import {
  type CatalogueProduct,
  filterCatalogue,
  categories,
} from "@/lib/catalogue";
import { ProductIcon } from "./product-icon";
import { ProductAccessLinks } from "./product-access-links";
import { Card } from "@/components/ui/card";
const subscribeLocation = (listener: () => void) => {
  window.addEventListener("popstate", listener);
  return () => window.removeEventListener("popstate", listener);
};
export function Marketplace({ products }: { products: CatalogueProduct[] }) {
  const search = useSyncExternalStore(
    subscribeLocation,
    () => location.search,
    () => "",
  );
  const filters = useMemo(() => {
    const params = new URLSearchParams(search);
    return {
      query: params.get("q") ?? "",
      category: params.get("category") ?? "",
      platform: params.get("platform") ?? "",
      status: params.get("status") ?? "",
      pricing: params.get("pricing") ?? "",
    };
  }, [search]);
  const [selected, setSelected] = useState<string[]>([]);
  const filtered = useMemo(
    () => filterCatalogue(products, filters),
    [products, filters],
  );
  function update(
    key: "query" | "category" | "platform" | "status" | "pricing",
    value: string,
  ) {
    const next = { ...filters, [key]: value };
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(next))
      if (v) params.set(k === "query" ? "q" : k, v);
    history.replaceState(
      null,
      "",
      `${location.pathname}${params.size ? "?" + params : ""}`,
    );
    window.dispatchEvent(new PopStateEvent("popstate"));
  }
  const compared = products.filter((p) => selected.includes(p.slug));
  const options: [keyof typeof filters, string, string[]][] = [
    ["category", "Category", [...categories]],
    [
      "platform",
      "Platform",
      [...new Set(products.flatMap((p) => p.platforms))],
    ],
    ["status", "Release status", ["live", "beta", "coming-soon", "planned"]],
    ["pricing", "Pricing", ["free", "paid", "unconfirmed"]],
  ];
  function cards(items: CatalogueProduct[], title: string) {
    return items.length ? (
      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((p) => {
            return (
              <Card
                key={p.id}
                className="market-card flex h-full flex-col gap-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <ProductIcon slug={p.icon} imageUrl={p.logoUrl} />
                  <span className="status-pill">
                    {p.status.replaceAll("-", " ")}
                  </span>
                </div>
                <div>
                  <p className="eyebrow">{p.category}</p>
                  <Link
                    href={`/products/${p.slug}`}
                    className="mt-2 block text-2xl font-semibold hover:underline"
                  >
                    {p.name}
                  </Link>
                </div>
                <p className="flex-1 text-sm leading-relaxed text-[var(--text-subtle)]">
                  {p.summary}
                </p>
                <div className="flex flex-wrap gap-2">
                  {p.platforms.map((platform) => (
                    <span className="status-pill" key={platform}>
                      {platform}
                    </span>
                  ))}
                </div>
                <p className="text-sm">
                  {p.pricing === "unconfirmed"
                    ? "Pricing under review"
                    : p.pricing === "free"
                      ? "Free"
                      : "Paid · see details"}
                </p>
                <div className="flex flex-wrap gap-3">
                  <ProductAccessLinks product={p} />
                  <Link
                    className="text-link self-center"
                    href={`/products/${p.slug}`}
                  >
                    Details
                  </Link>
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selected.includes(p.slug)}
                    disabled={
                      selected.length >= 3 && !selected.includes(p.slug)
                    }
                    onChange={(e) =>
                      setSelected(
                        e.target.checked
                          ? [...selected, p.slug]
                          : selected.filter((s) => s !== p.slug),
                      )
                    }
                  />
                  Compare {p.name}
                </label>
              </Card>
            );
          })}
        </div>
      </section>
    ) : null;
  }
  return (
    <div className="space-y-10">
      <Card className="space-y-5">
        <label className="block text-sm font-medium">
          Search apps
          <input
            className="field mt-2"
            type="search"
            placeholder="Try documents, research or career…"
            value={filters.query}
            onChange={(e) => update("query", e.target.value)}
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {options.map(([key, label, values]) => (
            <label className="text-sm" key={key}>
              {label}
              <select
                aria-label={label}
                className="field mt-2"
                value={filters[key]}
                onChange={(e) => update(key, e.target.value)}
              >
                <option value="">All {label.toLowerCase()}</option>
                {values.map((v) => (
                  <option key={v} value={v}>
                    {v.replaceAll("-", " ")}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
        <div className="flex items-center justify-between gap-3">
          <p role="status" className="text-sm">
            {filtered.length} applications found
          </p>
          <button
            className="text-link"
            onClick={() => {
              history.replaceState(null, "", location.pathname);
              window.dispatchEvent(new PopStateEvent("popstate"));
            }}
          >
            Reset filters
          </button>
        </div>
      </Card>
      {!filtered.length ? (
        <Card>
          <p>
            No apps match these filters. Reset the filters or try another
            search.
          </p>
        </Card>
      ) : null}
      {cards(
        filtered.filter((p) => p.category !== "Sister Projects" && p.featured),
        "Featured applications",
      )}
      {cards(
        filtered.filter(
          (p) =>
            p.category !== "Sister Projects" &&
            !p.featured &&
            p.status === "live",
        ),
        "New releases",
      )}
      {cards(
        filtered.filter(
          (p) =>
            p.category !== "Sister Projects" &&
            !p.featured &&
            p.status === "beta",
        ),
        "Beta applications",
      )}
      {cards(
        filtered.filter(
          (p) =>
            p.category !== "Sister Projects" &&
            !p.featured &&
            (p.status === "planned" || p.status === "coming-soon"),
        ),
        "Coming soon",
      )}
      {cards(
        filtered.filter((p) => p.category === "Sister Projects"),
        "Sister projects · independent products",
      )}
      {compared.length ? (
        <Card id="comparison" className="overflow-x-auto">
          <h2 className="mb-4 text-2xl font-semibold">Compare applications</h2>
          <Link
            className="text-link mb-4 inline-block"
            href={
              "/compare?" +
              selected
                .map((slug) => "product=" + encodeURIComponent(slug))
                .join("&")
            }
          >
            Open a shareable comparison
          </Link>
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Selected product comparison</caption>
            <thead>
              <tr>
                <th className="p-3">Product</th>
                <th className="p-3">Status</th>
                <th className="p-3">Platforms</th>
                <th className="p-3">Pricing</th>
                <th className="p-3">Best for</th>
              </tr>
            </thead>
            <tbody>
              {compared.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-[var(--border-subtle)]"
                >
                  <th className="p-3">
                    <Link href={`/products/${p.slug}`}>{p.name}</Link>
                  </th>
                  <td className="p-3">{p.status}</td>
                  <td className="p-3">{p.platforms.join(", ")}</td>
                  <td className="p-3">{p.pricing}</td>
                  <td className="p-3">{p.audience}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ) : null}
    </div>
  );
}
