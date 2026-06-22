"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bookmark,
  BriefcaseBusiness,
  Compass,
  Globe2,
  Home,
  MapPin,
  ShieldCheck,
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
    <div className="relative min-h-screen bg-transparent text-ink">
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[18rem] border-r border-white/70 bg-white/76 px-5 py-6 shadow-[18px_0_70px_rgba(7,31,74,0.08)] backdrop-blur-2xl xl:block">
        <Logo />
        <nav className="mt-10 space-y-2" aria-label="Primary navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-[1.15rem] px-4 py-3 text-sm font-black transition duration-300 ${
                  active
                    ? "bg-gradient-to-r from-ink to-peacock text-white shadow-glow"
                    : "text-slate hover:bg-white hover:text-ink hover:shadow-soft"
                }`}
              >
                <span
                  className={`grid h-9 w-9 place-items-center rounded-xl transition ${
                    active ? "bg-white/16" : "bg-mist group-hover:bg-mint"
                  }`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-5 right-5 overflow-hidden rounded-[1.4rem] border border-white/70 bg-gradient-to-br from-white via-[#fff6e7] to-mint p-4 shadow-soft">
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-saffron/25 blur-2xl" />
          <div className="relative flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-ink text-white">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-black text-ink">Source paths</p>
              <p className="text-xs font-semibold leading-5 text-slate">
                Clear links, saved progress, quiet alerts.
              </p>
            </div>
          </div>
        </div>
      </aside>

      <div className="xl:pl-[18rem]">
        <header className="sticky top-0 z-30 border-b border-white/60 bg-canvas/78 px-4 py-3 backdrop-blur-2xl md:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
            <div className="flex items-center gap-3 xl:hidden">
              <Logo compact />
              <span className="text-base font-black tracking-tight">
                AwsarSetu
              </span>
            </div>
            <div className="hidden items-center gap-3 md:flex">
              <div className="flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm font-black text-ink shadow-soft">
                <MapPin className="h-4 w-4 text-coral" aria-hidden="true" />
                India
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/80 bg-white/60 px-4 py-2 text-sm font-bold text-slate shadow-soft">
                <Globe2 className="h-4 w-4 text-teal" aria-hidden="true" />
                Change state
              </div>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <LanguageSwitcher />
              <NotificationBell />
            </div>
          </div>
        </header>

        <main className="relative z-10 mx-auto max-w-[86rem] px-4 pb-28 pt-5 md:px-8 md:pb-12">
          {children}
        </main>
      </div>

      <nav
        className="fixed bottom-0 left-0 right-0 z-50 grid grid-cols-5 border-t border-white/70 bg-white/88 px-2 pb-[env(safe-area-inset-bottom)] pt-2 shadow-[0_-18px_58px_rgba(7,31,74,0.15)] backdrop-blur-2xl xl:hidden"
        aria-label="Mobile primary navigation"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-[1.1rem] text-[0.7rem] font-black transition duration-300 ${
                active
                  ? "bg-gradient-to-br from-ink to-peacock text-white shadow-glow"
                  : "text-slate hover:bg-mist"
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
