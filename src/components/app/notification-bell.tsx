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
        className="icon-button"
        aria-label="Notification preferences"
      >
        <Bell className="h-5 w-5" aria-hidden="true" />
      </button>
      {message && (
        <div
          role="status"
          className="notification-popover"
        >
          {message}
        </div>
      )}
    </div>
  );
}
