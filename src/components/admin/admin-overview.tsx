import { Card } from "@/components/ui/card";
import {
  adminActionLabel,
  adminActionSection,
  adminTime,
  type AdminData,
} from "@/lib/admin";

export function AdminOverview({ data }: { data: AdminData }) {
  const s = data.summary;
  const stats = [
    {
      key: "publishedProducts",
      label: "Published apps",
      value: s.publishedProducts,
      hint: `${s.liveProducts} live or beta`,
      section: "products",
    },
    {
      key: "accounts",
      label: "Accounts",
      value: s.accounts,
      hint: `${s.newAccounts7Days} new in the past 7 days`,
      section: "customers",
    },
    {
      key: "openTickets",
      label: "Open tickets",
      value: s.openTickets,
      hint: "Open or in progress",
      section: "support",
    },
    {
      key: "queuedMail",
      label: "Queued emails",
      value: s.queuedMail,
      hint: `${s.sendingMail} marked as sending`,
      section: "email",
    },
    {
      key: "draftChanges",
      label: "Draft changes",
      value: s.draftChanges,
      hint: "Awaiting publication review",
      section: "products",
    },
    {
      key: "publishedReleases",
      label: "Published releases",
      value: s.publishedReleases,
      hint: `${s.unpublishedReleases} unpublished files`,
      section: "releases",
    },
  ];
  const alerts = [
    ...(!s.emailConfigured
      ? [
          {
            title: "Email sending needs configuration",
            text: "Review the sending setup before relying on confirmation emails.",
            section: "email",
          },
        ]
      : []),
    ...(s.queuedMail
      ? [
          {
            title: `${s.queuedMail} email${s.queuedMail === 1 ? "" : "s"} waiting to send`,
            text: "Review queued delivery before retrying. Expired account links need fresh requests.",
            section: "email",
          },
        ]
      : []),
    ...(s.sendingMail
      ? [
          {
            title: `${s.sendingMail} message${s.sendingMail === 1 ? "" : "s"} marked as sending`,
            text: "Check provider logs before retrying a delivery whose outcome is uncertain.",
            section: "email",
          },
        ]
      : []),
    ...(s.openTickets
      ? [
          {
            title: `${s.openTickets} support ticket${s.openTickets === 1 ? " needs" : "s need"} attention`,
            text: "Open the support queue to review enquiries and reply.",
            section: "support",
          },
        ]
      : []),
    ...(s.draftChanges
      ? [
          {
            title: `${s.draftChanges} draft${s.draftChanges === 1 ? "" : "s"} awaiting review`,
            text: "Review saved product changes before approving publication.",
            section: "products",
          },
        ]
      : []),
    ...(s.unpublishedReleases
      ? [
          {
            title: `${s.unpublishedReleases} release file${s.unpublishedReleases === 1 ? "" : "s"} unpublished`,
            text: "Review the files and their product draft before publishing.",
            section: "releases",
          },
        ]
      : []),
  ];
  return (
    <div className="min-w-0 space-y-6">
      <div>
        <p className="eyebrow">At a glance</p>
        <h2 className="mt-2 text-2xl font-semibold">Admin overview</h2>
        <p className="mt-2 text-sm text-[var(--text-subtle)]">
          Website totals and items needing your attention.
        </p>
      </div>
      <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <a
            key={stat.key}
            href={"#" + stat.section}
            aria-labelledby={"stat-" + stat.key}
            aria-describedby={"stat-value-" + stat.key}
            className="min-w-0 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-5 hover:border-[var(--accent-primary)]"
          >
            <span id={"stat-" + stat.key} className="block text-sm font-medium">
              {stat.label}
            </span>
            <strong
              data-testid={"count-" + stat.key}
              id={"stat-value-" + stat.key}
              className="mt-3 block text-4xl font-semibold"
            >
              {stat.value.toLocaleString()}
            </strong>
            <span className="mt-2 block text-xs text-[var(--text-subtle)]">
              {stat.hint}
            </span>
          </a>
        ))}
      </div>
      <Card aria-label="Needs attention" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xl font-semibold">Needs attention</h3>
          <span className="text-sm text-[var(--text-subtle)]">
            {alerts.length} {alerts.length === 1 ? "item" : "items"}
          </span>
        </div>
        {alerts.length ? (
          <ul className="divide-y divide-[var(--border-subtle)]">
            {alerts.map((alert) => (
              <li key={alert.title} className="py-4 first:pt-0 last:pb-0">
                <a
                  className="text-link font-semibold"
                  href={"#" + alert.section}
                >
                  {alert.title} →
                </a>
                <p className="mt-1 text-sm text-[var(--text-subtle)]">
                  {alert.text}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm">No outstanding admin alerts.</p>
        )}
      </Card>
      <Card aria-label="Recent activity" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xl font-semibold">Recent activity</h3>
          <a className="text-link text-sm" href="#activity">
            View all activity →
          </a>
        </div>
        {data.audit.length ? (
          <ol className="divide-y divide-[var(--border-subtle)]">
            {data.audit.slice(0, 8).map((item) => (
              <li key={String(item.id)} className="space-y-1 py-3 first:pt-0">
                <a
                  href={"#" + adminActionSection(String(item.action))}
                  className="text-link text-sm font-medium"
                >
                  {adminActionLabel(String(item.action))}
                </a>
                <p className="break-all text-xs text-[var(--text-subtle)]">
                  {String(item.actor_name ?? "System")} ·{" "}
                  {adminTime(item.created_at)} · {String(item.resource ?? "")}
                </p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm">No activity has been recorded yet.</p>
        )}
      </Card>
    </div>
  );
}

export function AdminReleases({ data }: { data: AdminData }) {
  return (
    <Card className="min-w-0 space-y-5">
      <h2 className="text-2xl font-semibold">Release files</h2>
      <p className="text-sm text-[var(--text-subtle)]">
        {data.summary.publishedReleases} published ·{" "}
        {data.summary.unpublishedReleases} unpublished. Showing up to 100 recent
        files. Open Products and select an app to upload or publish its
        releases.
      </p>
      <a className="text-link inline-block" href="#products">
        Manage products and releases →
      </a>
      {data.releases.length ? (
        <ul className="space-y-4">
          {data.releases.map((item) => (
            <li
              key={item.productSlug + item.release.id}
              className="min-w-0 space-y-3 rounded-xl border border-[var(--border-subtle)] p-4"
            >
              <div className="flex flex-wrap justify-between gap-2">
                <h3 className="break-words font-semibold">
                  {item.productName} · {item.release.version}
                </h3>
                <span className="text-xs">
                  {item.published ? "Published" : "Unpublished"}
                </span>
              </div>
              <p className="text-sm">
                {item.release.platform} · {item.release.channel} ·{" "}
                {item.release.releasedAt}
              </p>
              <p className="break-words text-sm text-[var(--text-subtle)]">
                {item.release.notes}
              </p>
              <details className="text-sm">
                <summary className="cursor-pointer">
                  File details and checksum
                </summary>
                <p className="mt-2 break-all">{item.release.fileName}</p>
                <p>
                  {item.release.bytes.toLocaleString()} bytes ·{" "}
                  {item.release.access} access
                </p>
                <p className="break-all font-mono text-xs">
                  SHA-256: {item.release.sha256}
                </p>
                <p className="mt-2">
                  Requirements: {item.release.requirements}
                </p>
              </details>
              {item.published ? (
                <a
                  className="text-link inline-block text-sm"
                  href={"/downloads#" + item.productSlug}
                >
                  Open download centre →
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <p>No release files have been recorded yet.</p>
      )}
    </Card>
  );
}
