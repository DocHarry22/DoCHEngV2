# Paperplane product page

The public `/products/paperplane` page describes the owner's invitation-only engineering preview, checked on 22 October 2026. It does not grant access to the private workspace. The primary action opens the product-specific support form.

Six original 1440 × 1000 screenshots show the editor, page organizer, forms, local workflows, browser tool library and ZAR pricing comparison. The document examples were generated for these captures and contain fictional details. No private source URLs, service origins, account details or access credentials belong in public assets or client code.

The current app displays 24 browser tools. Local tools process files on the device; processing-service tools upload selected files. OCR, existing-text editing, Office conversion, compression and signature capabilities have limits described on the product page. Local workflow presets do not imply cloud scheduling or cross-device synchronization.

The current billing catalogue reports checkout disabled and no approved paid prices. The visible draft prices are Pro R99 / 30 days or R990 / 365 days, and Business R249 or R2,490; USD equivalents are separately configured at $9 / $90 and $24 / $240. These are planned one-time individual passes without automatic renewal. Business does not include shared seats. No active offer is emitted in structured data.

Update `src/lib/paperplane-content.ts`, the Paperplane record in `src/lib/selected-products.ts` and `src/lib/product-previews.ts` when the app or its approved prices change. Recheck the deployed app rather than assuming draft prices are live. Preserve the private audience until a separate public launch is authorized.

Validation covers exact draft prices, access links, absence of private origins and offers, gallery navigation, and responsive browser rendering. The parent website continues to deploy through its existing Hostinger Git integration.
