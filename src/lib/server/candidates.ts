import "server-only";
import type { CatalogueProduct, ProductCategory } from "@/lib/catalogue";
const candidates: [string, string, ProductCategory, string, string[]][] = [
  [
    "paperplane",
    "Paperplane PDF Tools",
    "Documents and Business",
    "A document workspace with browser-local PDF tools and a separate bounded processing service.",
    [
      "Merge, split and organize PDF pages",
      "Browser-local document operations",
      "Separate processing services for supported server tools",
    ],
  ],
  [
    "apologia-sancta",
    "Apologia Sancta",
    "Sister Projects",
    "An independent Catholic formation, apologetics and research platform built around governed sources and learning experiences.",
    [
      "Source-linked learning and research",
      "Quiz and knowledge exploration",
      "Separate production acceptance requirements",
    ],
  ],
  [
    "thasi-etoile",
    "Thasi Étoile Boutique",
    "Sister Projects",
    "An independent South African fashion boutique project with catalogue and affiliate shopping workflows.",
    [
      "Fashion discovery and product catalogue",
      "Independent boutique identity",
      "Launch link pending verification",
    ],
  ],
  [
    "water-nest",
    "Water Nest E-commerce",
    "Sister Projects",
    "An independent commerce project for water treatment products and equipment.",
    [
      "Water treatment product catalogue",
      "Independent store and customer workflows",
      "Operational administration stays private",
    ],
  ],
  [
    "research-core",
    "DoCHEng Research Core",
    "Research and Development",
    "A planned branch for literature synthesis, source management and technical research workflows.",
    [
      "Literature synthesis concept",
      "Structured source management concept",
      "No verified public release",
    ],
  ],
];
export const candidateProducts: CatalogueProduct[] = candidates.map(
  ([slug, name, category, summary, features]) => ({
    id: "app-" + slug,
    visibility: "public",
    slug,
    name,
    category,
    summary,
    description:
      summary +
      " This is a publication candidate. Repository discovery does not establish public production readiness.",
    audience:
      category === "Sister Projects"
        ? "Independent product audience"
        : "Document users, students and technical professionals",
    features,
    platforms: ["Web"],
    status: "planned",
    featured: false,
    pricing: "unconfirmed",
    pricingNote: "No verified public pricing or checkout has been approved.",
    icon: slug,
    screenshots: [],
    documentation: "/docs",
    support: "/support?product=" + slug + "#contact-form",
    related: [],
    releases: [],
    releaseNotes: "Publication and release verification are pending.",
  }),
);
