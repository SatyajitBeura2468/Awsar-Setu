"use client";

import { useLanguage } from "@/contexts/language-context";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div
      className="flex rounded-full border border-border bg-white p-1"
      aria-label="Language switcher"
    >
      {(["en", "hi"] as const).map((nextLocale) => (
        <button
          key={nextLocale}
          type="button"
          onClick={() => setLocale(nextLocale)}
          className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
            locale === nextLocale
              ? "bg-ink text-white"
              : "text-slate hover:bg-mist"
          }`}
          aria-pressed={locale === nextLocale}
        >
          {nextLocale === "en" ? "EN" : "हिंदी"}
        </button>
      ))}
    </div>
  );
}
