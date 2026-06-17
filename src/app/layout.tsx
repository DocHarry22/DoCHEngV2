import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Providers } from "@/app/providers";

import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  icons: {
    icon: [
      { url: "/nav-logo-symbol-whitebackground.png", type: "image/png", media: "(prefers-color-scheme: light)" },
      { url: "/nav-logo-symbol.png", type: "image/png", media: "(prefers-color-scheme: dark)" }
    ],
    shortcut: ["/nav-logo-symbol-whitebackground.png"],
    apple: ["/nav-logo-symbol-whitebackground.png"]
  },
  title: {
    default: "DoCHEngV2",
    template: "%s | DoCHEngV2"
  },
  description: "Parent ecosystem website for DoCHEng technical applications across engineering, science, and productivity domains.",
  openGraph: {
    title: "DoCHEngV2",
    description: "Umbrella platform for DoCHEng apps, downloads, pricing, and ecosystem architecture.",
    url: "/",
    siteName: "DoCHEngV2",
    type: "website",
    images: [
      {
        url: "/nav-logo-horizontal.png",
        width: 1200,
        height: 630,
        alt: "DoCHEngV2"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "DoCHEngV2",
    description: "DoCHEng parent ecosystem for specialized engineering and productivity applications.",
    images: ["/nav-logo-horizontal.png"]
  }
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-[var(--bg-canvas)] font-sans text-[var(--text-main)] antialiased"
      >
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="page-ambient flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
