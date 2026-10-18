"use client";

import { useMemo, useState } from "react";

import { Card } from "@/components/ui/card";
import Link from "next/link";
import type { DocArticle } from "@/lib/docs-content";

type DocsSearchShellProps = {
  articles: DocArticle[];
};

function includesQuery(article: DocArticle, query: string) {
  const q = query.toLowerCase();

  return (
    article.title.toLowerCase().includes(q) ||
    article.summary.toLowerCase().includes(q) ||
    article.tags.some((tag) => tag.toLowerCase().includes(q))
  );
}

export function DocsSearchShell({ articles }: DocsSearchShellProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) {
      return articles;
    }

    return articles.filter((article) => includesQuery(article, query.trim()));
  }, [articles, query]);

  return (
    <Card className="space-y-4 bg-[var(--surface-0)]">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold tracking-tight">
          Search documentation
        </h3>
        <p className="text-sm text-[var(--text-subtle)]">
          Find setup guides, support pathways, and workflow articles quickly.
        </p>
      </div>

      <label className="space-y-2 text-sm">
        <span className="font-semibold">Search</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try: pricing, setup, account, desktop"
          className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-main)] outline-none transition focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
        />
      </label>

      <p className="text-xs text-[var(--text-muted)]">
        {filtered.length} article{filtered.length === 1 ? "" : "s"} match your
        query.
      </p>
      {query.trim() ? (
        <ul className="space-y-3">
          {filtered.map((article) => (
            <li key={article.slug}>
              <Link className="text-link" href={"/docs/" + article.slug}>
                {article.title}
              </Link>
              <p className="mt-1 text-sm text-[var(--text-subtle)]">
                {article.summary}
              </p>
            </li>
          ))}
        </ul>
      ) : null}
    </Card>
  );
}
