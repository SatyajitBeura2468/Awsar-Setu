"use client";

import { Bell } from "lucide-react";
import { useState } from "react";
import { useProfile } from "@/contexts/profile-context";
import { getPublicEnv } from "@/lib/env";

function urlBase64ToUint8Array(value: string) {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export function NotificationBell() {
  const [message, setMessage] = useState<string | null>(null);
  const { updateNotificationPreferences } = useProfile();

  const requestPermission = async () => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setMessage("Browser notifications are not supported here.");
      return;
    }

    const env = getPublicEnv();
    if (!env.vapidPublicKey) {
      setMessage("Notifications are not configured yet. Add VAPID keys first.");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      setMessage("Notifications are off. You can keep browsing normally.");
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    const subscription =
      (await registration.pushManager.getSubscription()) ??
      (await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(env.vapidPublicKey),
      }));

    const response = await fetch("/api/notifications/subscribe", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(subscription),
    });
    const result = (await response.json().catch(() => null)) as
      | { ok: boolean; error?: string }
      | null;

    if (!response.ok || !result?.ok) {
      setMessage(
        result?.error ??
          "Notification permission was granted, but the subscription was not stored.",
      );
      return;
    }

    updateNotificationPreferences({ browserEnabled: true });
    setMessage("Notifications are configured for quiet, meaningful alerts.");
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={requestPermission}
        className="relative grid h-11 w-11 place-items-center rounded-full border border-white/80 bg-white/86 text-ink shadow-soft transition hover:-translate-y-0.5 hover:border-teal hover:shadow-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
        aria-label="Notification preferences"
      >
        <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-coral pulse-dot" />
        <Bell className="h-5 w-5" aria-hidden="true" />
      </button>
      {message && (
        <div
          role="status"
          className="absolute right-0 z-20 mt-3 w-72 rounded-2xl border border-border bg-white p-4 text-sm leading-6 text-slate shadow-card"
        >
          {message}
        </div>
      )}
    </div>
  );
}
