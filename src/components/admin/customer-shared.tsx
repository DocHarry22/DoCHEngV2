"use client";
import { useEffect, useRef, useState } from "react";
import type { CustomerPage } from "@/lib/customers";

export function useCustomerResource<T>(
  url: string | null,
  version: string,
  keepPages = false,
) {
  const key = url + "|" + version;
  const [result, setResult] = useState<{
    url: string;
    key: string;
    data?: T;
    error?: string;
  }>();
  useEffect(() => {
    if (!url) return;
    const controller = new AbortController();
    let forbidden = false;
    fetch(url, { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        forbidden = response.status === 401 || response.status === 403;
        const value = await response.json();
        if (!response.ok)
          throw new Error(
            value.message ?? "Unable to load customers. Please retry.",
          );
        if (!controller.signal.aborted) setResult({ url, key, data: value });
      })
      .catch((error) => {
        if (!controller.signal.aborted)
          setResult((previous) => ({
            url,
            key,
            data:
              !forbidden && previous?.url === url ? previous.data : undefined,
            error:
              error instanceof Error
                ? error.message
                : "Unable to load customers. Please retry.",
          }));
      });
    return () => controller.abort();
  }, [url, key]);
  return {
    data:
      result &&
      url &&
      (result.url === url ||
        (keepPages &&
          result.key !== key &&
          result.url.split("?")[0] === url.split("?")[0]))
        ? result.data
        : undefined,
    error: result?.key === key ? result.error : undefined,
    loading: Boolean(url && result?.key !== key),
  };
}
export function CustomerPager({
  value,
  label,
  onPage,
  disabled,
}: {
  value: CustomerPage<unknown>;
  label: string;
  onPage: (page: number) => void;
  disabled: boolean;
}) {
  return (
    <nav
      aria-label={label + " pages"}
      className="flex flex-wrap items-center justify-between gap-3 text-sm"
    >
      <span>
        {value.total ? (value.page - 1) * value.pageSize + 1 : 0}–
        {Math.min(value.page * value.pageSize, value.total)} of{" "}
        {value.total.toLocaleString()} · Page {value.page} of {value.pages}
      </span>
      <div className="flex flex-wrap gap-4">
        <button
          type="button"
          className="text-link"
          disabled={disabled || value.page <= 1}
          onClick={() => onPage(value.page - 1)}
          aria-label={"Previous " + label + " page"}
        >
          Previous
        </button>
        <button
          type="button"
          className="text-link"
          disabled={disabled || value.page >= value.pages}
          onClick={() => onPage(value.page + 1)}
          aria-label={"Next " + label + " page"}
        >
          Next
        </button>
      </div>
    </nav>
  );
}
export type CustomerChange = {
  title: string;
  description: string;
  payload: Record<string, unknown>;
};
export function CustomerConfirmation({
  change,
  email,
  busy,
  error,
  onCancel,
  onConfirm,
}: {
  change: CustomerChange;
  email: string;
  busy: boolean;
  error: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);
  return (
    <dialog
      ref={ref}
      aria-labelledby="customer-confirm-title"
      aria-describedby="customer-confirm-description"
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onCancel();
      }}
      className="m-auto w-[calc(100%_-_2rem)] max-w-lg rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-6 text-[var(--text-main)] backdrop:bg-black/70"
    >
      <h3 id="customer-confirm-title" className="text-xl font-semibold">
        {change.title}
      </h3>
      <p className="mt-3 break-all font-semibold">{email}</p>
      <p id="customer-confirm-description" className="mt-3 text-sm">
        {change.description}
      </p>
      {error ? (
        <p role="alert" className="notice mt-4">
          {error}
        </p>
      ) : null}
      <div className="mt-6 flex flex-wrap gap-4">
        <button
          autoFocus
          type="button"
          className="text-link"
          disabled={busy}
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          className="action-button"
          disabled={busy}
          onClick={onConfirm}
        >
          {busy ? "Saving…" : "Confirm change"}
        </button>
      </div>
    </dialog>
  );
}
