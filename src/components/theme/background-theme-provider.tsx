"use client";

import * as React from "react";
import { useHydrated } from "@/lib/use-hydrated";
import { useTheme } from "next-themes";

import {
  backgroundThemePresets,
  backgroundThemeStorageKey,
  defaultBackgroundThemeId,
  getBackgroundThemeVariables,
  isBackgroundThemeId,
  type BackgroundMode,
  type BackgroundThemeId,
} from "@/lib/background-themes";

interface BackgroundThemeContextValue {
  themeId: BackgroundThemeId;
  setThemeId: (themeId: BackgroundThemeId) => void;
  presets: typeof backgroundThemePresets;
  mounted: boolean;
}

const BackgroundThemeContext =
  React.createContext<BackgroundThemeContextValue | null>(null);

const subscribeTheme = (listener: () => void) => {
  window.addEventListener("storage", listener);
  window.addEventListener("docheng-theme-change", listener);
  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener("docheng-theme-change", listener);
  };
};

function inferMode(resolvedTheme: string | undefined): BackgroundMode {
  return resolvedTheme === "dark" ? "dark" : "light";
}

function collectManagedVariables() {
  const vars = new Set<string>();

  for (const preset of backgroundThemePresets) {
    const lightVars = preset?.variants?.light?.vars ?? {};
    const darkVars = preset?.variants?.dark?.vars ?? {};

    Object.keys(lightVars).forEach((key) => vars.add(key));
    Object.keys(darkVars).forEach((key) => vars.add(key));
  }

  return Array.from(vars) as Array<`--${string}`>;
}

const managedVariables = collectManagedVariables();

function readStoredBackgroundTheme(): BackgroundThemeId {
  if (typeof window === "undefined") {
    return defaultBackgroundThemeId;
  }

  const raw = window.localStorage.getItem(backgroundThemeStorageKey);
  if (raw && isBackgroundThemeId(raw)) {
    return raw;
  }

  return defaultBackgroundThemeId;
}

function applyThemeVariables(themeId: BackgroundThemeId, mode: BackgroundMode) {
  const root = document.documentElement;
  const nextVars = getBackgroundThemeVariables(themeId, mode);
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  root.setAttribute("data-background-theme", themeId);

  managedVariables.forEach((varName) => {
    const nextValue = nextVars[varName];
    if (nextValue) {
      root.style.setProperty(varName, nextValue);
    } else {
      root.style.removeProperty(varName);
    }
  });

  if (reducedMotion) {
    root.style.setProperty("--bg-anim-play-state", "paused");
    root.style.setProperty("--bg-anim-global-1-duration", "0s");
    root.style.setProperty("--bg-anim-global-2-duration", "0s");
    root.style.setProperty("--bg-anim-global-orbit-duration", "0s");
    root.style.setProperty("--bg-anim-hero-1-duration", "0s");
    root.style.setProperty("--bg-anim-hero-2-duration", "0s");
    root.style.setProperty("--bg-anim-hero-orbit-duration", "0s");
    root.style.setProperty("--bg-anim-ecosystem-1-duration", "0s");
    root.style.setProperty("--bg-anim-ecosystem-2-duration", "0s");
    root.style.setProperty("--bg-anim-ecosystem-orbit-duration", "0s");
    root.style.setProperty("--bg-anim-twinkle-duration", "0s");
  }
}

export function BackgroundThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { resolvedTheme } = useTheme();
  const mounted = useHydrated();
  const themeId = React.useSyncExternalStore(
    subscribeTheme,
    readStoredBackgroundTheme,
    () => defaultBackgroundThemeId,
  );

  React.useEffect(() => {
    if (!mounted) {
      return;
    }

    const mode = inferMode(resolvedTheme);
    applyThemeVariables(themeId, mode);
  }, [mounted, resolvedTheme, themeId]);

  const setThemeId = React.useCallback((nextThemeId: BackgroundThemeId) => {
    window.localStorage.setItem(backgroundThemeStorageKey, nextThemeId);
    window.dispatchEvent(new Event("docheng-theme-change"));
  }, []);

  const value = React.useMemo<BackgroundThemeContextValue>(
    () => ({
      themeId,
      setThemeId,
      presets: backgroundThemePresets,
      mounted,
    }),
    [mounted, setThemeId, themeId],
  );

  return (
    <BackgroundThemeContext.Provider value={value}>
      {children}
    </BackgroundThemeContext.Provider>
  );
}

export function useBackgroundTheme() {
  const context = React.useContext(BackgroundThemeContext);
  if (!context) {
    throw new Error(
      "useBackgroundTheme must be used inside BackgroundThemeProvider",
    );
  }
  return context;
}

export function useOptionalBackgroundTheme() {
  return React.useContext(BackgroundThemeContext);
}
