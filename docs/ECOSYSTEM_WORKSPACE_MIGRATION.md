# DoCHEng Ecosystem Workspace Migration

## Purpose
This document defines a safe transition path from the current sibling-folder reality to a future workspace-native platform, without destructive rewrites.

## Current Reality Model
DoCHEng currently spans sibling folders under `webapps/` (for example: `DoCHEngV2`, `docheng`, `docheng_desk`, `docheng_desk2`, `resume_parser`, `apologia_sancta`).

The parent platform now models this explicitly using `src/lib/ecosystem-registry.ts`.

## Registry Layers
The registry supports two coexistence layers:

1. `workspace-project` entries:
- represent real sibling folders and their lifecycle/integration state
- preserve ambiguity where needed
- avoid forced merge assumptions

2. `ecosystem-app` entries:
- represent launchable/public product surfaces for parent-site UX
- include subdomain/download/pricing/support/docs metadata
- can be linked to one or more workspace projects

## Classification Semantics
Each entry carries migration-focused classifications:
- `role`: parent | product | experimental | legacy | sibling | support-project
- `lifecycle`: active | planned | deprecated | replacing | internal
- `generation`: v1 | v2 | successor | unknown
- `deploymentTarget`: parent-domain | subdomain | desktop | android | hybrid
- `integrationLevel`: linked-only | metadata-shared | package-shared | workspace-native

## Integration Levels and Upgrade Path
Recommended progression per project:

1. `linked-only`
- project remains independent
- parent only references metadata and links

2. `metadata-shared`
- project contributes typed metadata to registry
- parent uses shared registry selectors and diagnostics

3. `package-shared`
- selective extraction of shared packages (`types`, `registry`, `pricing metadata`, utility modules)
- app runtime can still remain outside a single workspace

4. `workspace-native`
- app resides in unified workspace layout
- consumes shared packages directly

## Future Target Layout (When Ready)
Do not force this immediately; phase by phase:

```text
webapps/
  apps/
    parent-platform/
    desk/
    resume/
    compass/
  packages/
    ecosystem-registry/
    shared-types/
    ui/
    pricing/
    distribution/
  services/
    resume-parser/
    docs-api/
```

## Parent Platform Contract
The parent platform consumes a compatibility layer in `src/lib/ecosystem-manifest.ts`, which is now derived from `src/lib/ecosystem-registry.ts`.

This means:
- UI remains stable
- app launcher and app hub stay config-driven
- migration can proceed incrementally

## How To Add a New Sibling Folder Safely
1. Add a `workspace-project` entry to `src/lib/ecosystem-registry.ts`.
2. Classify `role`, `lifecycle`, `generation`, and `integrationLevel` conservatively.
3. Add path metadata (`currentPathType`, `currentRelativePath`, and route/url fields where known).
4. If user-facing, add a paired `ecosystem-app` entry.
5. Fill support/pricing/docs/download links as available (incomplete metadata is allowed).
6. Run diagnostics (`getEcosystemDiagnostics`) and resolve critical warnings.

## Governance Notes
- `docheng_desk2` may be classified as replacing candidate, not automatically replacing `docheng_desk`.
- `apologia_sancta` is modeled as an adjacent sibling until a formal product strategy says otherwise.
- Missing metadata should be marked explicitly, not guessed.
- No folder is deleted or merged by default.

## Next Step Recommendation
Introduce a lightweight shared package for registry/types first (`package-shared` step), then incrementally point sibling projects at that package while keeping runtime isolation.
