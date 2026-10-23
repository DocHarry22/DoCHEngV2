# Water Nest product page

The public `/products/water-nest` page describes Water Nest’s independent storefront for physical products and service enquiries. It does not publish an internal operations product, provide software subscriptions, or process store payments through DoCHEng.

The public site was reviewed on 23 October 2026. Hostinger confirmed the enabled Node.js website and its completed 13 October deployment. Local browser DNS lookups and direct HTTPS connections failed, while independent DNS-over-HTTPS resolved the domain. A TinyFish remote browser successfully inspected the home and catalogue views, and fresh remote fetches verified the shop, product detail, services, labour-only service request, quote, contact and empty-cart pages. No account, enquiry, order or payment was created.

The browser connector did not export screenshot files. A separate screenshot attempt captured the storefront’s browser-check screen rather than its catalogue and was rejected. The existing original homepage capture from 18 October is retained: the deployed build is unchanged and its content matches the current remote review. The public caption and page give both the original capture date and the 23 October review date. Do not describe it as a newly captured image or use a browser-check screen as the store preview.

The current catalogue showed these ZAR examples: Melted Spray Sediment Filters R50; T33 Taste and Odour Filter R85; Sediment Filter 10" x 4.5" – 1 Micron R120; Inline Alkaline Filter R395; Melted Spray Antibacterial Filters R115, marked out of stock. Stock and prices are snapshots, not reserved inventory, binding quotes or guarantees of final order totals. The parent page emits no merchant offer or review rating in structured data.

Customer-facing features verified include search, category and price filters, sorting, product SKU/stock/quantity details, product and service cart entry points, custom quotes, and a three-step labour-only service configurator with optional parts. Requested hours, crew, urgency and travel remain preliminary until Water Nest confirms a written quote. Store certifications, water-purity/health claims, ratings, warranties, payment processing and fulfilment were not independently accepted by this review and must not be presented as DoCHEng endorsements.

Update `src/lib/water-nest-content.ts`, the selected product record and screenshot caption together when the store changes. Keep private source URLs, credentials, customer data and internal operational tools out of public client code and assets. Publish only the parent website through its existing Hostinger Git deployment.

Validation checks the dated prices and stock status, actual storefront/service/quote links, screenshot provenance, absence of software/merchant offers, and responsive rendering.
