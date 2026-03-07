"use client";

import * as React from "react";

import { cn } from "@/lib/cn";
import { useOptionalBackgroundTheme } from "@/components/theme/background-theme-provider";
import { backgroundThemePresets, defaultBackgroundThemeId } from "@/lib/background-themes";

function formatModeTag(label: string) {
  return label.replace("-", " ");
}

export function BackgroundThemeSelector({ className, compact = false }: { className?: string; compact?: boolean }) {
  const backgroundTheme = useOptionalBackgroundTheme();
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const themeId = backgroundTheme?.themeId ?? defaultBackgroundThemeId;
  const presets = backgroundTheme?.presets ?? backgroundThemePresets;
  const mounted = backgroundTheme?.mounted ?? false;

  React.useEffect(() => {
    if (!backgroundTheme) {
      return;
    }

    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current) {
        return;
      }

      const target = event.target as Node;
      if (!containerRef.current.contains(target)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [backgroundTheme]);

  const activePreset = React.useMemo(
    () => presets.find((preset) => preset.id === themeId) ?? presets[0],
    [presets, themeId]
  );

  if (!backgroundTheme) {
    return null;
  }

  const { setThemeId } = backgroundTheme;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        aria-label="Open background theme selector"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "inline-flex h-9 items-center rounded-lg border border-[var(--border-strong)] bg-[var(--surface-1)] text-xs font-semibold uppercase tracking-[0.11em] text-[var(--text-subtle)] transition-colors hover:text-[var(--text-main)]",
          compact ? "gap-1.5 px-2.5" : "gap-2 px-3",
          open && "text-[var(--text-main)]"
        )}
      >
        <span aria-hidden="true">BG</span>
        {compact ? null : <span className="hidden sm:inline">{mounted ? activePreset.label : "Background"}</span>}
      </button>

      <div
        role="dialog"
        aria-label="Background theme selector"
        className={cn(
          "absolute right-0 top-[calc(100%+0.5rem)] z-[60] w-[min(24rem,calc(100vw-2rem))] rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-0)] p-3 shadow-[var(--shadow-soft)] transition duration-150",
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0 pointer-events-none"
        )}
      >
        <div className="mb-3 border-b border-[var(--border-subtle)] px-1 pb-2">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-main)]">Background Theme</p>
          <p className="mt-1 text-xs text-[var(--text-subtle)]">Independent from light/dark mode.</p>
        </div>

        <div role="radiogroup" aria-label="Background themes" className="grid gap-2">
          {presets.map((preset) => {
            const selected = preset.id === themeId;

            return (
              <button
                key={preset.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => {
                  setThemeId(preset.id);
                  setOpen(false);
                }}
                className={cn(
                  "rounded-xl border px-3 py-2.5 text-left transition",
                  selected
                    ? "border-[var(--border-strong)] bg-[var(--surface-2)]"
                    : "border-transparent hover:border-[var(--border-subtle)] hover:bg-[var(--surface-1)]"
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-[var(--text-main)]">{preset.label}</p>
                  <span
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.11em]",
                      selected
                        ? "border-[var(--border-strong)] text-[var(--text-main)]"
                        : "border-[var(--border-subtle)] text-[var(--text-muted)]"
                    )}
                  >
                    {formatModeTag(preset.intensity ?? "balanced")}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-[var(--text-subtle)]">{preset.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
