import type { CatalogueProduct, Release } from "./catalogue";
export type AdminRow = Record<string, string | number | null>;
export type AdminSection =
  | "overview"
  | "products"
  | "releases"
  | "customers"
  | "support"
  | "email"
  | "reports"
  | "activity"
  | "repositories";
export const adminSections: { id: AdminSection; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "products", label: "Products" },
  { id: "releases", label: "Releases" },
  { id: "customers", label: "Customers" },
  { id: "support", label: "Support" },
  { id: "email", label: "Email" },
  { id: "reports", label: "Reports" },
  { id: "activity", label: "Activity" },
  { id: "repositories", label: "Repositories" },
];
export function adminSection(hash: string): AdminSection {
  const value = hash.replace(/^#/, "");
  return adminSections.find((s) => s.id === value)?.id ?? "overview";
}
export type AdminSummary = {
  publishedProducts: number;
  liveProducts: number;
  accounts: number;
  newAccounts7Days: number;
  openTickets: number;
  queuedMail: number;
  sendingMail: number;
  draftChanges: number;
  publishedReleases: number;
  unpublishedReleases: number;
  emailConfigured: boolean;
};
export type AdminRelease = {
  productSlug: string;
  productName: string;
  published: boolean;
  release: Release;
};
export type AdminData = {
  products: CatalogueProduct[];
  drafts: {
    slug: string;
    document: string;
    revision: number;
    approved_at: number | null;
  }[];
  tickets: AdminRow[];
  users: AdminRow[];
  audit: AdminRow[];
  mail: AdminRow[];
  metrics: AdminRow[];
  licences: AdminRow[];
  repositories: AdminRow[];
  summary: AdminSummary;
  releases: AdminRelease[];
  updatedAt: string;
};
const actions: Record<string, string> = {
  "user.state-changed": "Account state updated",
  "licence.revoked": "Licence revoked",
  "product.save-product": "Product draft saved",
  "product.publish": "Product published",
  "product.unpublish": "Product withdrawn",
  "product.link-verified": "Launch URL verified",
  "product.repository-changed": "Repository reference updated",
  "release.uploaded": "Release uploaded",
  "media.uploaded": "Image uploaded",
  "account.created": "Account created",
  "account.verify": "Email verified",
  "account.reset": "Password reset",
  "admin.bootstrapped": "Initial administrator activated",
  "admin.granted": "Administrator access granted",
  "support.replied": "Support reply saved",
  "entitlement.changed": "Product access updated",
  "user.disabled": "Account disabled",
  "user.enabled": "Account enabled",
};
export function adminActionLabel(action: string) {
  return actions[action] ?? action.replaceAll(/[._-]/g, " ");
}
export function adminActionSection(action: string): AdminSection {
  if (action === "product.repository-changed") return "repositories";
  if (action.startsWith("product.") || action.startsWith("media."))
    return "products";
  if (action.startsWith("release.")) return "releases";
  if (action.startsWith("support.")) return "support";
  if (/^(account|user|entitlement|licence)\./.test(action)) return "customers";
  return "activity";
}
export function adminTime(value: string | number | null) {
  const date = new Date(Number(value));
  return value !== null && Number.isFinite(date.getTime())
    ? new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date)
    : "Time unavailable";
}
