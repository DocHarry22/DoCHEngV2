"use client";
import { useState } from "react";
import Image from "next/image";
export function ScreenshotGallery({
  screenshots,
}: {
  screenshots: { url: string; caption: string }[];
}) {
  const [index, setIndex] = useState(0);
  if (!screenshots.length) return null;
  const current = screenshots[index];
  return (
    <figure className="space-y-4">
      <Image
        unoptimized
        src={current.url}
        alt={current.caption}
        width={1440}
        height={900}
        className="h-auto w-full rounded-2xl border border-[var(--border-subtle)]"
      />
      <figcaption className="text-sm text-[var(--text-subtle)]">
        {current.caption}
      </figcaption>
      {screenshots.length > 1 ? (
        <div className="flex flex-wrap gap-3">
          <button
            className="action-button"
            onClick={() =>
              setIndex((index + screenshots.length - 1) % screenshots.length)
            }
          >
            Previous screenshot
          </button>
          <span className="self-center text-sm" aria-live="polite">
            {index + 1} / {screenshots.length}
          </span>
          <button
            className="action-button"
            onClick={() => setIndex((index + 1) % screenshots.length)}
          >
            Next screenshot
          </button>
        </div>
      ) : null}
    </figure>
  );
}
