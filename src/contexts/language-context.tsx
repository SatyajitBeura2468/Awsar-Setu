"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { copy, defaultLocale, type Locale } from "@/lib/i18n";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: keyof (typeof copy)["en"]) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);
const localeStorageKey = "awsarsetu-locale";
const localeChangeEvent = "awsarsetu-locale-change";
let cachedLocaleRaw: string | null = null;
let cachedLocale: Locale = defaultLocale;

function parseLocale(value: string | null): Locale {
  return value === "en" || value === "hi" ? value : defaultLocale;
}

function getLocaleSnapshot() {
  if (typeof window === "undefined") return defaultLocale;
  const rawValue = window.localStorage.getItem(localeStorageKey);
  if (rawValue === cachedLocaleRaw) return cachedLocale;
  cachedLocaleRaw = rawValue;
  cachedLocale = parseLocale(rawValue);
  return cachedLocale;
}

function getServerLocaleSnapshot() {
  return defaultLocale;
}

function subscribeLocale(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const handleStorage = (event: StorageEvent) => {
    if (event.key === localeStorageKey) callback();
  };
  const handleLocalChange = () => callback();

  window.addEventListener("storage", handleStorage);
  window.addEventListener(localeChangeEvent, handleLocalChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(localeChangeEvent, handleLocalChange);
  };
}

function writeLocale(nextLocale: Locale) {
  if (typeof window === "undefined") return;
  cachedLocaleRaw = nextLocale;
  cachedLocale = nextLocale;
  window.localStorage.setItem(localeStorageKey, nextLocale);
  window.dispatchEvent(new Event(localeChangeEvent));
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(
    subscribeLocale,
    getLocaleSnapshot,
    getServerLocaleSnapshot,
  );

  useEffect(() => {
    document.documentElement.lang = locale === "hi" ? "hi" : "en";
  }, [locale]);

  const setLocale = useCallback((nextLocale: Locale) => {
    writeLocale(nextLocale);
    document.documentElement.lang = nextLocale === "hi" ? "hi" : "en";
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key) => copy[locale][key] ?? copy.en[key],
    }),
    [locale, setLocale],
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
