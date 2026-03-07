# apps/

This folder is reserved for future subdomain applications managed by the DoCHEngV2 parent repository.

Suggested app folders:

- `apps/desk-web`
- `apps/chatpdf-web`
- `apps/resume-web`
- `apps/compass-web`

Conventions:

- Use kebab-case folder names.
- Each app should have its own README and scripts.
- Prefer shared design/auth/domain contracts from root where practical.
- Keep app-level environment files out of git.

Do not add generated directories (`node_modules`, `.next`, `dist`, `coverage`) to source control.
