"use client";
import { useId } from "react";

export function ProductImageUpload({
  label,
  disabled,
  onBusy,
  onUploaded,
  onError,
}: {
  label: string;
  disabled: boolean;
  onBusy: (value: boolean) => void;
  onUploaded: (url: string) => void;
  onError: (message: string) => void;
}) {
  const id = useId();
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        disabled={disabled}
        className="field w-full min-w-0 text-sm"
        onChange={async (event) => {
          const input = event.currentTarget;
          const file = input.files?.[0];
          if (!file) return;
          if (
            !["image/png", "image/jpeg", "image/webp"].includes(file.type) ||
            file.size > 5 * 1024 * 1024 ||
            !file.size
          ) {
            onError("Choose a PNG, JPEG or WebP image up to 5 MB.");
            input.value = "";
            return;
          }
          onBusy(true);
          try {
            const response = await fetch("/api/admin/media", {
              method: "POST",
              headers: { "Content-Type": file.type },
              body: file,
            });
            const data = await response.json();
            if (!response.ok)
              throw new Error(data.message ?? "Image upload failed.");
            onUploaded(data.url);
          } catch (error) {
            onError(
              error instanceof Error
                ? error.message
                : "Image upload failed. Please retry.",
            );
          } finally {
            input.value = "";
            onBusy(false);
          }
        }}
      />
      <p className="text-xs text-[var(--text-subtle)]">
        PNG, JPEG or WebP · up to 5 MB. Save your draft to keep the attached
        image.
      </p>
    </div>
  );
}
