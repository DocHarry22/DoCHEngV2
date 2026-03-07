"use client";

import type { ReactNode } from "react";

import { AuthProvider } from "@/components/auth/auth-provider";
import { BackgroundThemeProvider } from "@/components/theme/background-theme-provider";
import { ThemeProvider } from "@/components/theme/theme-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <BackgroundThemeProvider>
        <AuthProvider>{children}</AuthProvider>
      </BackgroundThemeProvider>
    </ThemeProvider>
  );
}
