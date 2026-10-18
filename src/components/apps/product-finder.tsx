"use client";
import { useState } from "react";
import Link from "next/link";
import type { CatalogueProduct } from "@/lib/catalogue";
import { Card } from "@/components/ui/card";
export function ProductFinder({ products }: { products: CatalogueProduct[] }) {
  const [query, setQuery] = useState("");
  const [asked, setAsked] = useState(false);
  const tokens = (
    query
      .toLowerCase()
      .replace(/\bcv\b/g, "resume")
      .match(/[a-z]{3,}/g) ?? []
  ).filter(
    (word) =>
      ![
        "the",
        "for",
        "which",
        "can",
        "use",
        "app",
        "apps",
        "with",
        "docheng",
        "help",
      ].includes(word),
  );
  const scored = products
    .map((p) => ({
      p,
      score: tokens.reduce(
        (n, word) =>
          n +
          ([p.name, p.summary, p.description, ...p.features]
            .join(" ")
            .toLowerCase()
            .includes(word)
            ? 1
            : 0),
        0,
      ),
    }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  const engineering =
    /calculator|pump|dosing|convert|head|velocity|tank|engineering|\bfree\b/.test(
      query.toLowerCase(),
    );
  return (
    <Card className="space-y-4">
      <h2 className="text-2xl font-semibold">Find the right tool</h2>
      <p className="text-sm text-[var(--text-subtle)]">
        Describe your task to search the published product information. This
        local product finder does not send your question to an AI service.
      </p>
      <form
        className="flex flex-wrap gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          setAsked(true);
        }}
      >
        <label className="flex-1 text-sm">
          What would you like to do?
          <input
            className="field mt-2"
            value={query}
            maxLength={300}
            onChange={(e) => {
              setQuery(e.target.value);
              setAsked(false);
            }}
            placeholder="Find an app for my CV or a pump calculator"
            required
          />
        </label>
        <button className="action-button self-end">Find tools</button>
      </form>
      {asked ? (
        <div aria-live="polite" className="space-y-3">
          {engineering ? (
            <p>
              <Link className="text-link" href="/tools">
                Explore free engineering calculators
              </Link>{" "}
              — see equations and assumptions before using results.
            </p>
          ) : null}
          {/windows|android|download|installer/i.test(query) ? (
            <p>
              <Link className="text-link" href="/downloads">
                Check verified installers and platform requirements
              </Link>
              . Core DoCHEng native installers are not yet verified.
            </p>
          ) : null}
          {/buy|purchase|licen[cs]e|business|team/i.test(query) ? (
            <p>
              <Link className="text-link" href="/pricing">
                Review proposed plans
              </Link>{" "}
              or{" "}
              <Link className="text-link" href="/support#contact-form">
                discuss commercial access
              </Link>
              . Live paid billing is not activated.
            </p>
          ) : null}
          {scored.map(({ p }) => (
            <p key={p.id}>
              <Link className="text-link" href={"/products/" + p.slug}>
                {p.name}
              </Link>{" "}
              — {p.summary}{" "}
              <span className="text-sm">
                ({p.status};{" "}
                {p.pricing === "unconfirmed" ? "pricing unverified" : p.pricing}
                )
              </span>
            </p>
          ))}
          {!scored.length && !engineering ? (
            <p>
              No verified product information matches that request.{" "}
              <Link className="text-link" href="/support#contact-form">
                Ask the DoCHEng team
              </Link>
              .
            </p>
          ) : null}
        </div>
      ) : null}
    </Card>
  );
}
