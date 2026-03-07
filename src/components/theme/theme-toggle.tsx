"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/cn";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle color mode"
      className={cn(
        "relative inline-flex h-9 w-16 items-center rounded-full border border-[var(--border-strong)] bg-[var(--surface-1)] p-1 transition-colors",
        className
      )}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <span className="absolute left-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-subtle)]">
        L
      </span>
      <span className="absolute right-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-subtle)]">
        D
      </span>
      <span
        className={cn(
          "h-7 w-7 rounded-full bg-[var(--accent-primary)] shadow-[var(--shadow-soft)] transition-transform",
          isDark ? "translate-x-7" : "translate-x-0"
        )}
      />
    </button>
  );
}
