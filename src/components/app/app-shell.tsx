"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bookmark,
  BriefcaseBusiness,
  Compass,
  Home,
  MapPin,
  UserRound,
} from "lucide-react";
import type { ReactNode } from "react";
import { useLanguage } from "@/contexts/language-context";
import { Logo } from "@/components/ui/logo";
import { LanguageSwitcher } from "./language-switcher";
import { NotificationBell } from "./notification-bell";

const navItems = [
  { href: "/", key: "home", icon: Home },
  { href: "/explore", key: "explore", icon: Compass },
  { href: "/vacancies", key: "vacancies", icon: BriefcaseBusiness },
  { href: "/saved", key: "saved", icon: Bookmark },
  { href: "/account", key: "account", icon: UserRound },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[17.5rem] border-r border-border bg-white/92 px-5 py-6 backdrop-blur xl:block">
        <Logo />
        <nav className="mt-10 space-y-2" aria-label="Primary navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
                  active
                    ? "bg-ink text-white shadow-soft"
                    : "text-slate hover:bg-mist hover:text-ink"
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                {t(item.key)}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-6 left-5 right-5 rounded-3xl border border-border bg-canvas p-4 text-sm leading-6 text-slate">
          <p className="font-bold text-ink">{t("browseFirst")}</p>
          <p className="mt-1">{t("noGuarantee")}</p>
        </div>
      </aside>

      <div className="xl:pl-[17.5rem]">
        <header className="sticky top-0 z-30 border-b border-border bg-canvas/88 px-4 py-3 backdrop-blur md:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
            <div className="flex items-center gap-3 xl:hidden">
              <Logo compact />
              <span className="text-base font-black tracking-tight">
                AwsarSetu
              </span>
            </div>
            <div className="hidden items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-bold text-slate shadow-soft md:flex">
              <MapPin className="h-4 w-4 text-teal" aria-hidden="true" />
              India
            </div>
            <div className="ml-auto flex items-center gap-3">
              <LanguageSwitcher />
              <NotificationBell />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 pb-28 pt-5 md:px-8 md:pb-10">
          {children}
        </main>
      </div>

      <nav
        className="fixed bottom-0 left-0 right-0 z-50 grid grid-cols-5 border-t border-border bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] pt-2 shadow-[0_-14px_40px_rgba(8,47,73,0.12)] backdrop-blur xl:hidden"
        aria-label="Mobile primary navigation"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl text-[0.7rem] font-bold transition ${
                active ? "bg-ink text-white" : "text-slate hover:bg-mist"
              }`}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              {t(item.key)}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
