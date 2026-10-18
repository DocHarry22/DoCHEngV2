# DoCHEng

DoCHEngV2 is the parent GitHub repository for the DoCHEng web platform.

This is the existing parent platform at https://www.docheng.co.za/. It provides verified product discovery, customer accounts, private support tickets, release distribution, engineering tools and protected administration. Independent applications retain their own identity and data permissions.

## Repository Goals

- Act as the single source of truth for platform-wide UI, auth, and shared libraries.
- Host the main marketing/product site and control-plane routes.
- Provide conventions and CI guardrails for future subdomain applications.
- Keep implementation quality high with lint, typecheck, and tests on every PR.

## Current Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS v4
- Vitest + Testing Library
- `next-themes` for theming
- Node.js 22.13+ and a private single-instance SQLite store
- Playwright and axe-core for browser and accessibility checks

## Current Structure

```text
DoCHEngV2/
  .github/
    workflows/
  apps/                      # Reserved for future subdomain apps
  docs/
  public/
  src/
    app/
    components/
    lib/
  tests/
  .gitignore
  eslint.config.mjs
  next.config.ts
  package.json
  tsconfig.json
  vitest.config.mts
```

## Local Development

```bash
npm install
npm run dev
```

Quality gates:

```bash
npm run lint
npm run typecheck
npm run test
```

## GitHub + CI

CI runs on pull requests and pushes to `main` and `master`:

- Lint
- Typecheck
- Test

See `.github/workflows/ci.yml`.

Operational governance docs:

- `docs/GITHUB_BOOTSTRAP.md`
- `docs/GITHUB_REPO_SETTINGS_CHECKLIST.md`
- `CONTRIBUTING.md`
- `SECURITY.md`

## Subdomain App Expansion Plan

Future subdomain applications should live under `apps/` using a dedicated folder per app.

Suggested naming:

- `apps/desk-web`
- `apps/chatpdf-web`
- `apps/resume-web`
- `apps/compass-web`

Shared logic should remain in this parent repository (or be extracted into shared packages if/when a workspace tool is introduced).

## Auth Foundation

- The browser adapter calls server APIs; browser storage is never authorization.
- Passwords use salted scrypt hashes. Sessions use opaque tokens stored as hashes.
- Production cookies use the __Host- prefix, Secure, HttpOnly, SameSite=Lax, Path=/ and no Domain attribute.
- Server routes revalidate account status, roles, verification and entitlements. Recovery links expire and are single-use.
- Centralized sign-on is not enabled; tokens are never passed to unrelated frontends.

Routes and protection:

- `GET /signin`
- `GET /signup`
- `GET /account` (protected)
- `GET /dashboard` (redirects to `/account`)
- Protected administration: `/admin`; API ownership and role checks are independent of page routing.

## Next Operational Step

Use [the operations runbook](docs/OPERATIONS.md) for persistent storage, backups, email, first-administrator provisioning and rollback. Copy `.env.example` for configuration; keep credentials in the hosting environment.

The actual Hostinger deployment uses this repository. Separate uploaded folders are preserved. [The audit](docs/UPGRADE-AUDIT.md) and [delivery ledger](docs/UPGRADE-DELIVERY.md) record evidence, checks and remaining acceptance gates.

Live paid billing is inactive. Test offers require approved server configuration, test provider credentials and a separate licence secret. Cart totals and entitlements are reconciled against provider verification; browser callbacks never fulfil orders. Existing plan amounts remain proposals.
