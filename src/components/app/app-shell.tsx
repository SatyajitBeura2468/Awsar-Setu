"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, Compass, Home, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { useLanguage } from "@/contexts/language-context";
import { RouteTransition } from "@/components/experience/experience-primitives";
import { Logo } from "@/components/ui/logo";
import { LanguageSwitcher } from "./language-switcher";
import { NotificationBell } from "./notification-bell";
import { StateSelector } from "./state-selector";

const navItems = [
  { href: "/", key: "home", icon: Home },
  { href: "/explore", key: "explore", icon: Compass },
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
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <header className="site-header">
        <div className="site-header-inner">
          <Link href="/" className="site-logo-link" aria-label="AwsarSetu home">
            <Logo />
          </Link>

          <nav className="desktop-nav" aria-label="Primary navigation">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={active ? "is-active" : ""}
                  aria-current={active ? "page" : undefined}
                >
                  {t(item.key)}
                </Link>
              );
            })}
          </nav>

          <div className="header-actions">
            <StateSelector />
            <LanguageSwitcher />
            <NotificationBell />
          </div>
        </div>
      </header>

      <main className="site-main" id="main-content">
        <RouteTransition>{children}</RouteTransition>
      </main>

      <nav className="mobile-nav" aria-label="Mobile primary navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={active ? "is-active" : ""}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span>{t(item.key)}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
