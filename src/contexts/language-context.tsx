"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { copy, defaultLocale, type Locale } from "@/lib/i18n";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: keyof (typeof copy)["en"]) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === "undefined") return defaultLocale;
    const savedLocale = window.localStorage.getItem("awsarsetu-locale");
    if (savedLocale === "en" || savedLocale === "hi") {
      return savedLocale;
    }
    return defaultLocale;
  });

  const setLocale = (nextLocale: Locale) => {
    setLocaleState(nextLocale);
    window.localStorage.setItem("awsarsetu-locale", nextLocale);
    document.documentElement.lang = nextLocale === "hi" ? "hi" : "en";
  };

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key) => copy[locale][key] ?? copy.en[key],
    }),
    [locale],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider.");
  }
  return context;
}
