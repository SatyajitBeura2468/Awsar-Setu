"use client";

import { Bell } from "lucide-react";
import { useState } from "react";
import { getPublicEnv } from "@/lib/env";

export function NotificationBell() {
  const [message, setMessage] = useState<string | null>(null);

  const requestPermission = async () => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setMessage("Browser notifications are not supported here.");
      return;
    }

    const env = getPublicEnv();
    if (!env.vapidPublicKey) {
      setMessage("Add VAPID keys to enable browser alerts.");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      setMessage("Notifications are off. You can keep browsing normally.");
      return;
    }

    setMessage("Notifications are ready for meaningful matches and deadlines.");
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
