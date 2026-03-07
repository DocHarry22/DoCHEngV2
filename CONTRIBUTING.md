# Contributing to DoCHEngV2

## Branching

- Base branch: `main`
- Branch naming:
  - `feat/<short-scope>`
  - `fix/<short-scope>`
  - `chore/<short-scope>`

## Commit Style

Use clear, scoped messages. Examples:

- `feat(apps): add app hub filters`
- `fix(auth): prevent stale session redirect`
- `chore(ci): tighten workflow cache settings`

## Required Checks Before PR

Run from repository root:

```bash
npm run lint
npm run typecheck
npm run test
```

## PR Expectations

- Keep PRs focused and reviewable.
- Update docs when behavior or structure changes.
- Include migration notes for any change affecting future `apps/*` onboarding.

## Architectural Guidance

- Keep shared contracts in `src/lib` unless a dedicated package strategy is introduced.
- Avoid introducing app-specific assumptions in shared modules.
- Preserve parent-repo role as platform control plane for future subdomain apps.
