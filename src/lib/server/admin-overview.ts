import "server-only";
import type { AdminData, AdminRelease, AdminSummary } from "@/lib/admin";
import { rows } from "./database";
import { publishedCatalogue, validateProduct } from "./catalogue";
import { mailConfigured } from "./mail";

export function adminOverview(drafts: AdminData["drafts"]) {
  const published = publishedCatalogue();
  const counts = rows<
    Pick<
      AdminSummary,
      | "accounts"
      | "newAccounts7Days"
      | "openTickets"
      | "queuedMail"
      | "sendingMail"
    >
  >(
    `
    SELECT (SELECT COUNT(*) FROM users) AS accounts,
    (SELECT COUNT(*) FROM users WHERE created_at>=?) AS newAccounts7Days,
    (SELECT COUNT(*) FROM tickets WHERE status IN ('open','in-progress')) AS openTickets,
    (SELECT COUNT(*) FROM mail_outbox WHERE status='queued') AS queuedMail,
    (SELECT COUNT(*) FROM mail_outbox WHERE status='sending') AS sendingMail
  `,
    Date.now() - 7 * 86400000,
  )[0];
  const files = new Map<string, AdminRelease>();
  for (const product of published)
    for (const release of product.releases)
      files.set(product.slug + ":" + release.id, {
        productSlug: product.slug,
        productName: product.name,
        published: true,
        release,
      });
  const publishedReleases = files.size;
  for (const draft of drafts) {
    const product = validateProduct(JSON.parse(draft.document));
    for (const release of product.releases) {
      const key = product.slug + ":" + release.id;
      if (!files.has(key))
        files.set(key, {
          productSlug: product.slug,
          productName: product.name,
          published: false,
          release,
        });
    }
  }
  const summary: AdminSummary = {
    ...counts,
    publishedProducts: published.length,
    liveProducts: published.filter(
      (p) => p.status === "live" || p.status === "beta",
    ).length,
    draftChanges: drafts.filter((d) => d.approved_at === null).length,
    publishedReleases,
    unpublishedReleases: files.size - publishedReleases,
    emailConfigured: mailConfigured(),
  };
  return {
    summary,
    releases: [...files.values()]
      .sort((a, b) => b.release.releasedAt.localeCompare(a.release.releasedAt))
      .slice(0, 100),
    updatedAt: new Date().toISOString(),
  };
}
