"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { adminSection, adminTime, type AdminData } from "@/lib/admin";
import { AdminNavigation } from "./admin-navigation";
import { AdminWorkspaces } from "./admin-workspaces";
function subscribe(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}
const snapshot = () => adminSection(window.location.hash);
const serverSnapshot = () => "overview" as const;
function failure(status: number) {
  return status === 401 || status === 403
    ? "Administrator access required. Sign in with your verified administrator account."
    : "Unable to load administrator data. Please retry.";
}
export function AdminPanel() {
  const active = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const previous = useRef(active);
  const [data, setData] = useState<AdminData>();
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [refreshing, setRefreshing] = useState(true);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/admin", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(failure(response.status));
        setData(await response.json());
      })
      .catch((caught) => {
        if (!controller.signal.aborted)
          setError(
            caught instanceof Error
              ? caught.message
              : "Unable to load administrator data.",
          );
      })
      .finally(() => {
        if (!controller.signal.aborted) setRefreshing(false);
      });
    return () => controller.abort();
  }, []);
  useEffect(() => {
    if (previous.current !== active && data) {
      const panel = document.getElementById(active);
      panel?.focus({ preventScroll: true });
      panel?.scrollIntoView({ block: "start" });
    }
    previous.current = active;
  }, [active, data]);
  async function reload(): Promise<AdminData> {
    setRefreshing(true);
    setError("");
    try {
      const response = await fetch("/api/admin", { cache: "no-store" });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403)
          setData(undefined);
        throw new Error(failure(response.status));
      }
      const latest = (await response.json()) as AdminData;
      setData(latest);
      return latest;
    } catch (caught) {
      const message =
        caught instanceof Error
          ? caught.message
          : "Dashboard refresh failed. Please retry.";
      setError(message);
      throw new Error(message);
    } finally {
      setRefreshing(false);
    }
  }
  async function send(body: object) {
    setBusy(true);
    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const value = await response.json();
      setNotice(value.message ?? "Administrator operation completed.");
      if (response.ok) {
        try {
          await reload();
        } catch {
          setNotice(
            (value.message ?? "Changes saved.") +
              " Refresh the dashboard to see the latest data.",
          );
        }
      }
      return response.ok;
    } catch {
      setNotice("Administrator operation failed. Please retry.");
      return false;
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[13rem_minmax(0,1fr)]">
      <AdminNavigation active={active} summary={data?.summary} />
      <div className="min-w-0 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-[var(--text-subtle)]">
            {data
              ? "Updated " + adminTime(Date.parse(data.updatedAt))
              : "Administrator workspace"}
            {data && refreshing ? " · Refreshing…" : ""}
          </p>
          <button
            type="button"
            className="text-link text-sm"
            disabled={refreshing || busy}
            onClick={() => void reload().catch(() => {})}
          >
            {refreshing ? "Refreshing…" : "Refresh dashboard"}
          </button>
        </div>
        {error ? (
          <div role="alert" className="notice space-y-2">
            <p>{error}</p>
            {data ? (
              <p className="text-sm">
                Showing the last successfully loaded data.
              </p>
            ) : (
              <a className="text-link" href="/signin?next=%2Fadmin">
                Sign in
              </a>
            )}
            <button
              type="button"
              className="text-link ml-4"
              disabled={refreshing}
              onClick={() => void reload().catch(() => {})}
            >
              Retry loading dashboard
            </button>
          </div>
        ) : null}
        {notice ? (
          <p role="status" className="notice">
            {notice}
          </p>
        ) : null}
        {data ? (
          <AdminWorkspaces
            data={data}
            active={active}
            busy={busy}
            send={send}
            reload={reload}
          />
        ) : !error ? (
          <p role="status">Loading administrator tools…</p>
        ) : null}
      </div>
    </div>
  );
}
