"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function AggregateAnalytics() {
  const pathname = usePathname();
  useEffect(() => {
    if (
      navigator.doNotTrack === "1" ||
      (navigator as Navigator & { globalPrivacyControl?: boolean })
        .globalPrivacyControl
    )
      return;
    const ref = new URLSearchParams(location.search).get("ref") ?? "direct";
    void fetch("/api/metrics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname, campaign: ref }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);
  return null;
}
