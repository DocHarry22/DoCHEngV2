# CareerForge product information — 21 October 2026

The `/products/resume` page now describes CareerForge, the app served at
`https://resume.docheng.co.za/`. The catalogue, launcher description and parent
pricing summary use the same current product information. Other product pages
keep their existing presentation.

## Live app and images

`tools/capture-resume-previews.mjs` opens the actual HTTPS application in an
isolated browser profile. It imports a fictional JSON résumé through the editor,
creates a fictional browser-local cover letter, checks all eight gallery
templates and captures six current screens. The workspace, checker, 90-day plan,
job search, tracker, salary analyzer, tailoring, version history, interview prep
and application-preparation routes were inspected. The capture submits no job
application, payment or document-processing request.

[Screenshot and route evidence](RESUME-SCREENSHOT-AUDIT.json) records the actual
URLs and scope. Fictional sample details are identified in the public gallery.
Screenshots are original browser captures, without generated replacement UI.

## Current access and future plans

The live browser tools are free, with local drafts and downloadable backups.
The app's `/pricing/` URL currently returns HTTP 404. Account registration,
cloud backups and checkout must not be advertised as live services.

The prepared CareerForge commerce source and its
`docs/ACCOUNTS_AND_PAYMENTS.md` define these preview prices (pricing revision
`d47599312abc6f5f2ed76d252ee7b5f8655464e2` in the résumé repository):

| Plan | ZAR / 30 days | ZAR / 365 days | USD / 30 days | USD / 365 days | Planned backup slots |
| --- | --- | --- | --- | --- | --- |
| Free | R0 | R0 | $0 | $0 | 1 |
| Plus | R19 | R190 | $1.49 | $14.90 | 10 |
| Pro | R39 | R390 | $2.99 | $29.90 | 50 |

The new page clearly labels cloud plans as previews, without checkout links.
Paid passes would be one-time purchases with no automatic renewal. Each
planned slot holds one explicitly uploaded JSON backup up to 1 MiB. Structured
data advertises only the free browser tools at price zero. This change does not
activate payments, accounts, cloud storage, synchronization or merchant services.

The old R399 Standard and R79/month Career Plus proposals are removed from the
résumé catalogue and parent pricing summary. Imports/checking/service exports
depend on document-service availability. Print / Save PDF preserves the visible
template; service exports can use a different layout.

## Publication

This is a parent-site source update. Its existing Hostinger Git deployment uses
`DocHarry22/DoCHEngV2` on `main`, as documented in [Operations](OPERATIONS.md).
The separate résumé subdomain files, processing backend and unpublished commerce
release are outside this update's deployment scope.
