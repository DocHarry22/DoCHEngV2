# Delivery ledger — 18–19 October 2026

Baseline: `8300c2d1d15356b20297eb6067bd493565d8a128`. Feature branch: `codex/verified-ecosystem-upgrade`. This is the pre-merge acceptance snapshot; the final operator evidence records the merge commit, Hostinger build and live checks after those operations complete.

Pull request: https://github.com/DocHarry22/DoCHEngV2/pull/3. Application candidate: `3ba9198a8ff570d3b6bd2f11629740180d08b880`. Successful Linux CI: https://github.com/DocHarry22/DoCHEngV2/actions/runs/39175576221 (71 unit/security tests, all 18 desktop/tablet/mobile browser tests, lint, TypeScript, production dependency audit and production build).

| Stage | Files and implementation | Verification | Remaining acceptance gates |
|---|---|---|---|
| Reliability | `src/lib/server/{auth,security,database,mail}.ts`, auth/support APIs, auth components. Real passwords, opaque server sessions, origin checks, durable rate limits, tickets and outbox. | Password/session/role/expiry/CSRF/ticket ownership and mail-response tests pass. | Actual sending-provider acceptance waits for the owner's included free Hostinger mail plan. |
| Inventory | Registry/manifest corrections, `selected-products.ts`, audit JSON files, public previews. Reviewed GitHub metadata, source/README architecture, releases and Hostinger build mappings. | Exact public entry URLs and APK digest checked. | Independent app account, processing, store and signing/installation acceptance is not implied by a working landing page. |
| Marketplace | Home, Apps Hub, Products, comparison, search/filter controls, product pages, original icons and real screenshots. | Component tests, metadata/slug/CTA invariants and browser regression pass, including light/dark automated accessibility. | Independent usability and app-specific acceptance can continue after release. |
| Distribution | Downloads, private media/artifact storage, streaming protected downloads, release publication controls. | Real public APK downloaded and hashed; nonexistent core installers removed. | Stable native installation and publisher-signing checks remain product-specific gates. |
| Accounts | Account/dashboard, profile/export/recovery, tickets, orders, licence/device management, protected administrator APIs. | Forged browser-state rejection and server ownership tests pass. | Owner account must verify email before the explicitly configured first administrator is assigned. |
| Commerce | Test-only Paystack adapter, server-priced cart and bundles, stored quote snapshots, verified atomic fulfilment, licences, expiry, device limits and revocation. | Exact webhook HMAC, mismatched amounts, idempotency, cart reconciliation and bundle tests pass. | No live billing or price activation. Recurring-provider acceptance, provider refunds, final VAT invoices and payment-method portals require approved business/provider configuration and a separate accepted commercial release. |
| Engineering | Twelve tools with units, equations, validation, references, assumptions and JSON export. | Independent reference calculations pass. | Screening calculations are not final engineering designs. |
| Growth | Searchable docs, product FAQs, newsletter double opt-in, local registry-based product finder, canonical metadata, sitemap/robots/Open Graph, aggregate analytics/referral campaigns. | No private-route/query/visitor data retained in metric tests; no invented AI answers or prices. | An external AI service is optional and unconfigured. Bulk campaign dispatch is not enabled without reviewed content, opt-in recipients and a working sender. |
| Release | CI quality gates, dependency updates, bundled fonts, operations/backup/rollback tools. | Production dependency audit: zero vulnerabilities. 71 tests pass across 20 files; all 18 browser tests, lint, production build and TypeScript pass in Linux CI. | Merge, Hostinger build and live verification follow the final documentation check. |

## Check history

- Initial unit run: 58 passed, one obsolete test still relied on mock browser authentication. Corrected to use server responses.
- Subsequent regression: 62 passed, then 70 passed after cart, publication, bootstrap and analytics coverage.
- Initial production build compiled but Windows denied creation of a generated `.next` directory. Regenerated only that task-owned output and reduced build worker count; subsequent production builds passed with TypeScript enforcement.
- An initial browser run reused another app already on local port 3100. Those results are invalid and excluded. The harness now uses an isolated port, disables reuse, and verifies the platform health response.
- Browser checks identified a hidden desktop dropdown extending the page width, implicit select labels including option values, locale-dependent decimal formatting, a calculator selector also matching Next's route announcer, and a global link rule overriding light-mode button colours. Corrections pass the full Linux browser regression. Local Windows registration, support persistence, logout and forged-session checks also pass on all three viewport sizes.
- The development lint dependency chain has an unresolved upstream `braces` advisory. Production dependency audit reports zero vulnerabilities. No framework downgrade or forced breaking audit fix was applied.
- A later CI run passed 17 browser checks but exposed a genuine readiness race in desktop signup: the first field accepted input before hydration, then the initial session refresh cleared it. Auth inputs now remain disabled until the initial session check completes. The normal registration workflow exercises this readiness boundary.

## Operational boundaries

The original OneDrive checkout is preserved. Work uses a separate clone of the canonical GitHub repository. Hostinger configuration and filesystem mappings were inspected before writing; no unrelated site, DNS record, uploaded folder or billing subscription has been changed. No email or payment credential is committed.

The owner requested an included free mailbox only. The connector can manage an existing mail order but does not expose a free-plan claim operation. hPanel activation is pending; no email plan was purchased and no auto-renewal was enabled. Until a verified sender is configured, ticket persistence works and email status remains queued.

Implementation commits: `c558065` (platform upgrade), `1fd6abe` (contrast and browser corrections), `3ba9198` (mobile theme interaction). The hosting Git installation is active and automatic deployment is enabled for the canonical repository's `main` branch. Observe that deployment after merge before issuing a separate build request.

## Production acceptance

- Hydration correction `718f7ad88cb128db9d8247bfbc62e5fb8b5a3518` passes all gates in CI run https://github.com/DocHarry22/DoCHEngV2/actions/runs/39176374512, including all 71 unit/security and all 18 browser checks.
- PR #3 merged as `9ba47909048dbc983cff17e29410d53068774905`. Hostinger automatically built that exact revision in build `01a15158-8f3a-7203-83d1-4e9b0fc6a0a0`, completed 18 October 2026 at 23:29:50 UTC.
- Live checks pass for all 44 public routes checked, sitemap, robots, Open Graph, canonical HTTPS/www redirects, security headers, disabled billing and protected APIs. The existing uploaded Desk and Resume entries still respond.
- A labelled production QA account completed signup, signout and real password login. Its ticket `DCH-2026-FF285E31B280` persists; ordinary-user administrator access is denied. Browser checks pass for live filters, pump-power reference output and mobile navigation, with no recorded runtime errors.
- A small follow-up corrects duplicated legacy page titles, adds canonical metadata, and connects the old Methods/Publishing/Research/Labs placeholders to current tools, documentation and clearly marked planned products. Persistence across its deployment is checked separately in operator release evidence.
- Email remains queued-only because no included DoCHEng mail plan has been activated. No email product was purchased. Live billing remains disabled, and the explicitly designated owner must verify their mailbox before administrator assignment.
