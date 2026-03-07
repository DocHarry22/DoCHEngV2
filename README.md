# DoCHEngV2

DoCHEngV2 is the parent GitHub repository for the DoCHEng web platform.

It currently contains the main web experience and shared platform code, and it is structured to scale into a multi-app subdomain architecture over time (for example: `desk.docheng.com`, `chatpdf.docheng.com`, `resume.docheng.com`).

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
  vitest.config.ts
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

## Subdomain App Expansion Plan

Future subdomain applications should live under `apps/` using a dedicated folder per app.

Suggested naming:

- `apps/desk-web`
- `apps/chatpdf-web`
- `apps/resume-web`
- `apps/compass-web`

Shared logic should remain in this parent repository (or be extracted into shared packages if/when a workspace tool is introduced).

## Auth Foundation

- Provider-agnostic auth adapter seam exists at `src/lib/auth/adapter.ts`.
- Current implementation uses `src/lib/auth/adapters/mock-auth-adapter.ts`.
- Session state is persisted in local storage and mirrored to a lightweight cookie (`dochengv2-auth`) for middleware route protection.

Routes and protection:

- `GET /signin`
- `GET /signup`
- `GET /account` (protected)
- `GET /dashboard` (redirects to `/account`)
- Middleware: `src/middleware.ts`

## Next Operational Step

If this folder has not been published yet, use the bootstrap guide in `docs/GITHUB_BOOTSTRAP.md` to initialize and push this repository to GitHub.
