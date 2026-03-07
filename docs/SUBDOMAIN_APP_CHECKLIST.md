# Subdomain App Onboarding Checklist

Use this checklist whenever you add a new app under `apps/`.

## App setup

- Create `apps/<app-name>` with clear README.
- Define app ownership and intended subdomain.
- Add scripts for `dev`, `build`, `lint`, `typecheck`, and `test`.

## Technical alignment

- Reuse shared auth/session patterns where applicable.
- Follow shared design tokens and component conventions.
- Keep naming and route conventions consistent with the parent platform.

## CI and quality

- Ensure lint/typecheck/test pass locally.
- Add CI coverage for the app if a separate workflow is introduced.
- Avoid breaking parent app checks.

## Release readiness

- Define subdomain DNS target and hosting plan.
- Add monitoring and error reporting baseline.
- Document deployment command and rollback approach.

## Documentation

- Add app entry to `apps/README.md`.
- Add operational notes under `docs/` if app has unique requirements.
