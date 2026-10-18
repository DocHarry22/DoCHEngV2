import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/account",
        "/dashboard",
        "/admin",
        "/api/",
        "/signin",
        "/signup",
        "/verify",
        "/reset-password",
        "/subscriptions",
        "/checkout",
      ],
    },
    sitemap: "https://www.docheng.co.za/sitemap.xml",
    host: "https://www.docheng.co.za",
  };
}
