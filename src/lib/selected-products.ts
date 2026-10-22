import type { CatalogueProduct } from "@/lib/catalogue";
// This curated set was explicitly named by the owner in the upgrade request.
// Repository discovery does not add entries here; newly discovered projects remain private candidates.
const common = {
  visibility: "public" as const,
  featured: false,
  pricing: "unconfirmed" as const,
  pricingNote:
    "No verified DoCHEng software offer or checkout is configured for this product. Independent stores publish their own product prices and terms.",
  screenshots: [],
  documentation: "/docs",
  related: [],
  releases: [],
  releaseNotes:
    "Public entry-page verification is separate from full workflow and production acceptance testing.",
};
export const selectedProducts: CatalogueProduct[] = [
  {
    ...common,
    id: "app-paperplane",
    slug: "paperplane",
    name: "Paperplane PDF Tools",
    category: "Documents and Business",
    summary: "Organize, edit and sign PDFs, build forms, make scans searchable and save repeatable workflows. Paperplane brings 24 browser tools together in a private preview.",
    description:
      "Paperplane brings everyday PDF tasks into one workspace: page organization, editing and annotations, electronic signatures, interactive forms, local OCR and reusable workflows. Browser tools process files on your device. Additional conversions and document operations use a separate processing service when available. The app is currently an invitation-only engineering preview, with public launch and paid checkout still pending.",
    audience: "Students, professionals and small business owners",
    features: [
      "24 browser tools for organizing, converting and editing PDFs",
      "Text, images, annotations and electronic signatures",
      "Interactive PDF form creation, filling and flattening",
      "Local OCR for scans and document photos in four languages",
      "Reusable browser workflow presets and batch processing",
      "Optional processing-service tools with explicit uploads",
    ],
    platforms: ["Web"],
    status: "beta",
    pricingNote: "Free browser tools within the private preview. Draft Pro prices: R99 / 30 days or R990 / 365 days; Business: R249 or R2,490. Paid checkout is disabled. One-person passes, no automatic renewal.",
    releaseNotes: "Private preview interfaces, local PDF workflows and draft plan catalogue checked on 22 October 2026. Public workspace launch and paid checkout remain pending.",
    icon: "paperplane",
    support: "/support?product=paperplane#contact-form",
  },
  {
    ...common,
    id: "app-research-core",
    slug: "research-core",
    name: "DoCHEng Research Core",
    category: "Research and Development",
    summary:
      "A planned branch for source management and technical literature work.",
    description:
      "Research Core describes a future product direction for literature synthesis, source management and structured research. No independent application build or production deployment has been verified. Current notebook and research functionality is represented by DoCHEng Desk instead.",
    audience: "Researchers, postgraduate students and technical teams",
    features: [
      "Literature synthesis concept",
      "Source management concept",
      "Future connection to technical research workflows",
    ],
    platforms: ["Web"],
    status: "planned",
    icon: "research",
    related: ["desk"],
    support: "/support?product=research-core#contact-form",
  },
  {
    ...common,
    id: "app-apologia-sancta",
    slug: "apologia-sancta",
    name: "Apologia Sancta",
    category: "Sister Projects",
    summary:
      "Independent Catholic formation, learning and source-led research.",
    description:
      "Apologia Sancta brings learning, quiz experiences, research and knowledge exploration together under its own identity. Its public landing page was checked on 18 October 2026. Hostinger's latest attempted UI build had failed while a previous public application remained accessible; full production workflow acceptance is therefore pending.",
    audience: "Learners, educators and Catholic research communities",
    features: [
      "Catholic formation and learning experiences",
      "Quiz and research entry points",
      "A separately published Android package",
    ],
    platforms: ["Web", "Android"],
    status: "beta",
    icon: "apologia-sancta",
    support: "/support?product=apologia-sancta#contact-form",
    launch: {
      url: "https://sandybrown-bear-488955.hostingersite.com/",
      checkedAt: "2026-10-18",
      scope:
        "Public landing page; production workflows and latest failed build require separate verification.",
    },
    releases: [
      {
        id: "apologia-android-1-0-3",
        version: "1.0.3",
        channel: "preview",
        platform: "Android",
        fileName: "apologia-sancta.apk",
        sha256:
          "e170aec135e1e4dcdfe38e91ac54b357a5f9a75e0a5de2099ec8ed5366925cd1",
        bytes: 7301602,
        releasedAt: "2026-08-24",
        requirements:
          "Android compatibility must be checked against the publisher release. The android-v1.0.3 publisher source declares Android API 23 minimum; binary installation is not tested here.",
        notes:
          "Public android-v1.0.3 APK. Downloaded bytes match the GitHub SHA-256 digest. Listed as a preview because installation, signing and live service workflows have not completed independent acceptance checks.",
        access: "public",
        publisherUrl:
          "https://github.com/DocHarry22/apologiasancta-ui/releases/tag/android-v1.0.3",
        externalUrl:
          "https://github.com/DocHarry22/apologiasancta-ui/releases/download/android-v1.0.3/apologia-sancta.apk",
      },
    ],
  },
  {
    ...common,
    id: "app-thasi-etoile",
    slug: "thasi-etoile",
    name: "Thasi Étoile Boutique",
    category: "Sister Projects",
    summary:
      "An independent fashion boutique with its own shopping experience.",
    description:
      "Thasi Étoile is a South African fashion boutique project with its own catalogue and visual identity. The public storefront entry page was verified against the existing Hostinger deployment. Store transactions, fulfilment, account security and third-party affiliate workflows are independently operated and have not been validated by this software hub.",
    audience: "Fashion shoppers and boutique customers",
    features: [
      "Independent fashion storefront",
      "Product discovery and catalogue browsing",
      "Separate store policies and customer workflows",
    ],
    platforms: ["Web"],
    status: "beta",
    icon: "thasi-etoile",
    support: "/support?product=thasi-etoile#contact-form",
    launch: {
      url: "https://lightsalmon-kingfisher-947477.hostingersite.com/",
      checkedAt: "2026-10-18",
      scope:
        "Public storefront entry page only; commerce workflows not tested.",
    },
  },
  {
    ...common,
    id: "app-water-nest",
    slug: "water-nest",
    name: "Water Nest E-commerce",
    category: "Sister Projects",
    summary: "An independent store for water treatment products and equipment.",
    description:
      "Water Nest has a public water-treatment storefront at its own South African domain. Hostinger's completed deployment identifies the existing store source, and the public landing page was verified. Its store billing, invoices, fulfilment and customer data remain separate from DoCHEng software licensing; internal operating tools are not listed as public products.",
    audience: "Water treatment customers and equipment buyers",
    features: [
      "Water-treatment product storefront",
      "Independent store and customer experience",
      "Separate product pricing and order policies",
    ],
    platforms: ["Web"],
    status: "beta",
    icon: "water-nest",
    support: "/support?product=water-nest#contact-form",
    launch: {
      url: "https://waternest.co.za/",
      checkedAt: "2026-10-18",
      scope:
        "Public water-treatment storefront entry page only; transactions not tested.",
    },
  },
];
