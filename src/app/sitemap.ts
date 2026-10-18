import type { MetadataRoute } from "next";
import { publishedCatalogue } from "@/lib/server/catalogue";
export const dynamic = "force-dynamic";
import { engineeringTools } from "@/lib/engineering-tools";
import { docsArticles } from "@/lib/docs-content";
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/apps",
    "/products",
    "/compare",
    "/downloads",
    "/pricing",
    "/support",
    "/about",
    "/docs",
    "/roadmap",
    "/changelog",
    "/ecosystem",
    "/tools",
    "/privacy",
    "/terms",
    ...publishedCatalogue().map((p) => "/products/" + p.slug),
    "/tools/unit-converter",
    ...engineeringTools.map((t) => "/tools/" + t.slug),
    ...docsArticles.map((d) => "/docs/" + d.slug),
  ];
  return [...new Set(paths)].map((path) => ({
    url: "https://www.docheng.co.za" + path,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
