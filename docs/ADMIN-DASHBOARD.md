# Administrator dashboard

Open `/admin` with your verified administrator account. Overview is the landing screen. Use the sidebar on desktop or **Admin menu** on smaller screens to open Products, Releases, Customers, Support, Email, Reports, Activity or Repositories. Section links can be bookmarked, and browser back/forward navigation restores the selected section.

The overview shows published applications, accounts, open support tickets, queued emails, draft changes and published release files. Counts include all relevant records and are calculated on the server. Published counts follow the effective public catalogue, including withdrawals. The live/beta hint describes listing status; it does not establish full application readiness. Accounts include administrators, and new-account counts cover the preceding seven days.

Use **Refresh dashboard** to load the latest counts and activity. The last successful update time is displayed. Initial loading and errors do not show invented zero counts. If a refresh fails, the last successful data stays visible with an error and a retry control.

**Needs attention** links to the relevant workspace for queued or uncertain email delivery, open support enquiries, product draft review and unpublished releases. Use that workspace to review and confirm an action. Expired verification and password-reset links need fresh requests; reconcile messages marked sending with provider logs before retrying them.

**Recent activity** shows the latest eight audited events with readable action labels, actor names when available and timestamps. Activity contains up to 100 recent events. Support and Email prioritise pending items; their lists, Customers and Reports are bounded to 100 records. Overview totals remain complete even when those lists are truncated. Releases displays up to 100 recent published and unpublished files with platform, channel, access, notes and checksums. Select the associated product under Products to upload or publish a release.

The product editor remains mounted while changing sections or refreshing dashboard data, so unsaved product fields are preserved. Saving and publication retain their revision checks. Save drafts before closing or reloading the browser. See [Guided product editor](GUIDED-PRODUCT-EDITOR.md) for the complete product workflow.

Dashboard reads and mutations retain the server's verified-administrator checks. Repository references remain private administrator data. Email credentials and other secrets are excluded from overview responses.
