# DoCHEng platform audit — 18 October 2026

## Verified deployment baseline

Hostinger's authenticated `hosting_websites_list` and `hosting_nodejs_list-builds` identify `docheng.co.za` as a Next.js Node 22 application on the existing account. Its latest completed deployment is sourced from `DocHarry22/DoCHEngV2`, `main`, commit `8300c2d1d15356b20297eb6067bd493565d8a128`, build `019cf659-74a3-70b8-83af-a41cbf525707` (16 March 2026). This is the verified baseline, rather than a similarly named local folder.

Configured environment variable **names only**: `NEXT_PUBLIC_APP_URL_PARENT`, `NEXT_PUBLIC_APP_URL_DESK`. Values are masked by the provider. No existing secret was exported. Hosting configuration was inspected read-only; no billing was activated.

The OneDrive checkout has cloud-backed files and timed out on reads, including package.json and .git. Its package.json length differs from the canonical repository, so it must not be overwritten or assumed clean. Work proceeds in a fresh clone of the canonical repository on `codex/verified-ecosystem-upgrade`.

## Findings before implementation

| Severity | Finding | Required correction |
|---|---|---|
| Critical | Mock auth accepts any password, trusts localStorage, and assigns admin/entitlements from email substrings. | Opaque HttpOnly server sessions, real password verification, database roles and entitlements; no client state as authorization. |
| High | Support form never sends or persists; published response-time promises have no operational evidence. | Durable tickets, server validation, abuse controls, email outbox and honest delivery status. |
| High | Desk/Resume/Compass installer versions and platform availability are hard-coded without binaries or checksums. | Withdraw unverified availability; require a verified artifact manifest before enabling downloads. |
| High | Public Apps page renders internal/hidden entries and workspace filesystem details. | Apply publication/visibility filters at the data boundary; keep administration server-only. |
| High | Metadata uses `dochengv2.example`; builds explicitly ignore TypeScript and ESLint errors. | Real canonical origin and enforced quality gates. |
| Medium | Launcher constructs external URLs from intended subdomains. | Launch only exact URLs supported by successful application checks. |
| Medium | Advertised prices have no configured provider products or checkout. | Preserve existing amounts as proposals, mark unverified and keep paid billing unavailable. |
| Medium | Search/filter/comparison and support/account workflows lack backend coverage. | Functional marketplace controls and independent security/end-to-end tests. |

The live homepage and support page were fetched. The support page explicitly describes the form as non-sending. Public subdomain fetch failures do not establish that applications are unavailable, but cannot justify a verified launch claim either.

## Inventory evidence and publication boundary

Authenticated GitHub enumeration found 18 repositories. Known main website, Desk generations, resume service, Compass generations and Apologia repositories were identified. Paperplane, Thasi, Water Nest and operational repositories include private source; their repository URLs and implementation details must not be included in public client bundles. WaterNestOps and internal prototypes are excluded from the customer catalogue. New Mzansi Android source is an internal discovery candidate, not an approved public listing.

README evidence establishes implementation intent, not hosted functional availability: Desk v2 is a Next.js/Postgres research notebook workspace; Resume is a Python/FastAPI parsing backend; Paperplane is a PDF workspace with browser-local tools and separate processing services. The Compass v2 root README is absent; clients/README.md and the client/server manifests establish a React/Vite static frontend with a separate Express/MongoDB API. Apologia's README explicitly distinguishes implemented architecture from verified production readiness. No README alone licenses a stable installer claim.

## Release gates

Each stage must record actual files, checks, limitations, commit and deployment status in `UPGRADE-DELIVERY.md`. Full acceptance requires persistent storage outside deployment output, verified sending credentials for actual email delivery, evidence for public app links and binaries, and passing lint/typecheck/tests/build/browser checks. Missing mail configuration keeps messages queued and is reported separately from ticket persistence. Paid billing and price activation require the owner's separate approval. New product publication requires explicit approval; discovery never auto-publishes repositories.

## Hosting filesystem and release evidence

The authenticated file-browser audit confirms Passenger runs the main application from `/home/u836398163/domains/docheng.co.za/nodejs`. The root `.htaccess` points to Node 22 and protects `.builds`. Separate uploaded `desk`, `resume`, `coursecampass` and `calc` folders remain in public_html. Desk's uploaded folder currently serves CourseCompass; its verified Desk v2 public sign-in is on the existing Vercel deployment. Compass's intended subdomain serves a Hostinger default page. Neither is silently relabelled as the intended working product.

Apologia Sancta has a genuine public Android 1.0.3 APK. Downloaded bytes independently match SHA-256 `e170aec135e1e4dcdfe38e91ac54b357a5f9a75e0a5de2099ec8ed5366925cd1` (7,301,602 bytes). The exact android-v1.0.3 source tag declares minimum Android API 23. Installation and signing are not independently accepted, so it is a preview. Core DoCHEng installer claims remain withdrawn.

Public screenshots are captured from entry interfaces, labelled by their actual scope. Resume's original marketing page contains review and customer claims that this audit does not validate; the scanner interface is used instead. Sister-store entry checks do not validate their transactions or marketing assertions.

The runtime registry now contains only public parent/core records. Internal discovery records and filesystem paths were removed from client-shared data rather than merely hidden by a UI filter. A private inventory is retained outside this public repository.
