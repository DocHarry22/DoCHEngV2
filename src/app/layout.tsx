import type { Metadata } from "next";
import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/ibm-plex-mono/600.css";
import type { ReactNode } from "react";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Providers } from "@/app/providers";
import { AggregateAnalytics } from "@/components/marketing/aggregate-analytics";

import "./globals.css";
import "./marketplace.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.docheng.co.za"),
  icons: {
    icon: [
      {
        url: "/nav-logo-symbol-whitebackground.png",
        type: "image/png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/nav-logo-symbol.png",
        type: "image/png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    shortcut: ["/nav-logo-symbol-whitebackground.png"],
    apple: ["/nav-logo-symbol-whitebackground.png"],
  },
  title: {
    default: "DoCHEng — Driven by Curiosity",
    template: "%s | DoCHEng",
  },
  description:
    "Parent ecosystem website for DoCHEng technical applications across engineering, science, and productivity domains.",
  openGraph: {
    title: "DoCHEng",
    description:
      "Umbrella platform for DoCHEng apps, downloads, pricing, and ecosystem architecture.",
    url: "/",
    siteName: "DoCHEng",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "DoCHEng",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DoCHEng",
    description:
      "DoCHEng parent ecosystem for specialized engineering and productivity applications.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-[var(--bg-canvas)] font-sans text-[var(--text-main)] antialiased"
      >
        <Providers>
          <AggregateAnalytics />
          <div className="relative flex min-h-screen flex-col">
            <a href="#main-content" className="skip-link">
              Skip to content
            </a>
            <Navbar />
            <main id="main-content" className="page-ambient flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
