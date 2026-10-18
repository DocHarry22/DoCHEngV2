"use client";
import { useState } from "react";
export function SubscriptionConfirm({
  token,
  unsubscribe,
}: {
  token?: string;
  unsubscribe: boolean;
}) {
  const [message, setMessage] = useState("");
  return (
    <div className="space-y-5">
      <p>
        {unsubscribe
          ? "Confirm that you want to stop these updates."
          : "Confirm that you want to receive the selected DoCHEng updates."}
      </p>
      <button
        className="action-button"
        onClick={async () => {
          try {
            const r = await fetch("/api/subscriptions", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: unsubscribe ? "unsubscribe" : "confirm",
                token,
              }),
            });
            setMessage((await r.json()).message);
          } catch {
            setMessage("Unable to update your subscription. Please retry.");
          }
        }}
      >
        {unsubscribe ? "Unsubscribe" : "Confirm subscription"}
      </button>
      <p role="status">{message}</p>
    </div>
  );
}
