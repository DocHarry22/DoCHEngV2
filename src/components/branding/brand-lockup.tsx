"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";

import { cn } from "@/lib/cn";

type BrandLockupProps = {
  className?: string;
  linked?: boolean;
  showTagline?: boolean;
  compact?: boolean;
};

export function BrandLockup({ className, linked = true, showTagline = true, compact = false }: BrandLockupProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const symbolSrc = mounted && resolvedTheme === "dark" ? "/nav-logo-symbol.png" : "/nav-logo-symbol-whitebackground.png";

  const content = (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <span className={cn("relative shrink-0", compact ? "h-9 w-9" : "h-10 w-10")}>
        <Image
          src={symbolSrc}
          alt="DoCHEng symbol"
          fill
          sizes={compact ? "36px" : "40px"}
          className="object-contain"
          priority
        />
      </span>

      <span className="inline-flex min-w-0 flex-col">
        <span
          className={cn(
            "font-semibold tracking-[0.02em] text-[var(--text-primary)]",
            compact ? "text-base leading-none" : "text-lg leading-none"
          )}
        >
          DoCHEng
        </span>
        {showTagline ? (
          <span className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-[var(--text-subtle)]">
            Driven by Curiosity
          </span>
        ) : null}
      </span>
    </span>
  );

  if (!linked) {
    return content;
  }

  return (
    <Link href="/" aria-label="DoCHEng home" className="inline-flex items-center">
      {content}
    </Link>
  );
}
