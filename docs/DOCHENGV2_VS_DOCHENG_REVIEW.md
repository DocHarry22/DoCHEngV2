# DoCHEngV2 vs DoCHEng: Architecture and Delivery Review

## Scope
- Compared `DocHarry22/DoCHEngV2` (this repository) against `DocHarry22/docheng` (legacy sibling repo).
- Focus areas: architecture, feature parity, missing capabilities, security posture, scalability, and delivery readiness.

## Architecture Review
### DoCHEng (legacy)
- Single-surface marketing-oriented app with one primary route and one API route (`/api/waitlist`).
- Heavy visual rendering stack (`three`, `@react-three/fiber`, `@react-three/drei`, `framer-motion`).
- Centralized UI components under `src/components/*`, minimal route segmentation.

### DoCHEngV2 (current)
- Multi-route platform shell with segmented product, docs, pricing, support, apps, account, and roadmap experiences.
- Typed content/registry architecture (`src/lib/*-content.ts`, `ecosystem-registry.ts`, `ecosystem-manifest.ts`) supporting multi-app ecosystem modeling.
- Auth abstraction seam (`src/lib/auth/adapter.ts`) with mock provider and entitlement model.
- Stronger test coverage with Vitest + Testing Library for routes and auth flows.

## Feature Comparison
### Areas where DoCHEngV2 is ahead
- Route breadth and information architecture (product/docs/support/changelog/pricing/account workflows).
- Typed ecosystem metadata and app launch model.
- Auth/account UX scaffolding with entitlement-aware components.
- CI-oriented quality gates (lint, typecheck, tests).

### Areas where DoCHEng is ahead
- Explicit security headers in `next.config.ts`.
- Existing waitlist API route workflow (`/api/waitlist`).
- Aggressive above-the-fold performance strategy via dynamic section loading in homepage composition.

## Missing Features (in DoCHEngV2 relative to DoCHEng)
- No waitlist submission API endpoint equivalent to `/api/waitlist`.
- Dynamic import strategy is not consistently applied for heavier page sections.
- Security header hardening was previously absent (now addressed in this change set).

## Security Review
### Findings
- Build config previously bypassed lint/type failures during production builds (`ignoreDuringBuilds`, `ignoreBuildErrors`).
- Route protection middleware referenced in docs/changelog was missing from runtime.
- Production security headers were not configured.

### Remediation included in this task
- Added platform-wide security headers in `next.config.ts`.
- Added actual middleware-based route protection for `/account` and `/dashboard`.
- Removed build-time bypasses for lint/type errors in production builds.

## Scalability Review
### Strengths
- Content-driven architecture and typed registries in DoCHEngV2 support ecosystem growth.
- Route-level decomposition and reusable UI primitives allow incremental app/domain expansion.

### Constraints
- Single package/runtime boundary: no workspace package extraction yet.
- No formal backend/service integration layer for app-level APIs.
- Mock auth still powers route access decisions; not ready for multi-tenant scale.

## Fixes Delivered in This PR
- **Build issue:** Removed network-dependent `next/font/google` usage in `src/app/layout.tsx`, preventing build failures in restricted environments.
- **Runtime issue:** Added missing `src/middleware.ts` to enforce protected route redirects based on auth cookie.
- **TypeScript/deployment issue:** Removed build-time lint/type bypass settings so deployment reflects true code quality.
- **Deployment/security issue:** Added hardened response headers for all routes.

## Migration Strategy
1. Preserve DoCHEngV2 as parent control-plane repository.
2. Migrate feature-specific logic from DoCHEng into typed modules (`src/lib`) before UI merge.
3. Introduce API compatibility layer (`/api/waitlist`-equivalent) with server-side validation and durable storage.
4. Move from mock auth adapter to provider-backed adapter while preserving adapter contract.
5. Extract shared packages (types/registry/auth contracts/ui primitives) into workspace structure once cross-repo reuse is stable.
6. Decommission DoCHEng UI routes only after parity checks and traffic cutover validation.

## Technical Debt Report
- Mock auth remains production-incomplete; cookie is non-HTTP-only and client-authored.
- Some docs/changelog statements had drifted from implementation (middleware presence).
- Ecosystem growth plan exists, but package/workspace boundaries are still pending.
- Dependency vulnerability backlog exists (`npm audit` reported moderate/high/critical findings at install time).

## Optimization Recommendations
1. Add route/API-level observability and error budgets before broader rollout.
2. Introduce selective dynamic imports for heavy sections on high-content pages.
3. Replace mock auth with server-validated sessions and HTTP-only signed cookies.
4. Add API rate limiting and request schema validation for future public endpoints.
5. Stand up workspace package extraction for shared registry/auth/ui contracts.
6. Add production CI step to run `npm run build` in an environment mirroring deployment network constraints.
