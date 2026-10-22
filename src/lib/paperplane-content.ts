// Verified against the current private preview on 22 October 2026.
// Paid prices are drafts. Do not expose the private workspace or service origins.
export const paperplaneFeatures = [
  {
    title: "Put your pages in order",
    description: "Merge PDFs, split or extract pages, and reorder, rotate, duplicate, crop or remove pages. Work with page previews and download a separate result while keeping your original files.",
  },
  {
    title: "Edit, annotate and sign",
    description: "Place text, images, highlights, shapes and freehand notes. Edit supported existing text, adjust objects and save an editable project. Add a drawn, typed or uploaded electronic signature.",
  },
  {
    title: "Create and complete forms",
    description: "Design text, checkbox, dropdown, radio and date fields. Fill existing fields, adjust their properties, move or resize them, or flatten a completed copy for sharing.",
  },
  {
    title: "Make scans searchable",
    description: "Run OCR on up to 20 pages in your browser, or turn document photos into a searchable PDF. English, Afrikaans, French and Portuguese are supported. Review recognized text before relying on it.",
  },
  {
    title: "Convert and inspect documents",
    description: "Turn images into PDFs, export pages as JPG or PNG, and extract text, Markdown or simple HTML. Compare page text, inspect basic PDF structure and remove standard document metadata. Office conversions use the processing service when available.",
  },
  {
    title: "Save a repeatable routine",
    description: "Chain compression, rotation, watermarks, page numbers and metadata cleanup into a local workflow. Save a preset in this browser and run it across your selected PDFs. Find everyday tools with search and favorites.",
  },
] as const;

export const paperplanePlans = [
  { name: "Free", zar30: "R0", zar365: "R0", usd30: "$0", usd365: "$0", jobs: "100", workflows: "10", keys: "5" },
  { name: "Pro", zar30: "R99", zar365: "R990", usd30: "$9", usd365: "$90", jobs: "500", workflows: "50", keys: "10" },
  { name: "Business", zar30: "R249", zar365: "R2,490", usd30: "$24", usd365: "$240", jobs: "2,000", workflows: "200", keys: "20" },
] as const;

export const paperplaneFaq = [
  {
    question: "Can I open Paperplane today?",
    answer: "Paperplane is currently an invitation-only engineering preview. Request early access through DoCHEng support. Screenshots show the current working preview; a public workspace launch and paid checkout are still pending.",
  },
  {
    question: "Where do my files go?",
    answer: "Tools marked “On your device” process files in your browser, including local OCR and workflows. Tools that use the processing service upload the files you choose. Download results and keep your originals; hosted job outputs are temporary and normally expire after one hour.",
  },
  {
    question: "What do the paid plans change?",
    answer: "The draft Pro and Business plans increase server-job, saved server-workflow and API-key capacity. All plans include the same browser tools. Each is for one individual account; Business has no shared team seats. Paid checkout is disabled and no paid plan is on sale yet.",
  },
  {
    question: "Will a pass renew automatically?",
    answer: "The planned paid options are one-time passes for 30 or 365 days, with no automatic renewal. The preview has 12 currency choices with separately set regional prices, rather than live currency conversion. Final prices must be confirmed when checkout opens.",
  },
  {
    question: "What should I check before sharing a PDF?",
    answer: "Review your downloaded document. Existing-text editing depends on the PDF’s fonts and structure; scans need OCR first. OCR can make mistakes, Office conversions may change layouts, and structural compression may not shrink an already optimized file. Electronic signatures are not certificate-based digital signatures. Whiteout covers an area visually; permanent redaction requires the processing-service redaction tool. Metadata cleanup alone does not remove hidden content.",
  },
] as const;
