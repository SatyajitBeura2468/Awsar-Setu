"use client";

import Link from "next/link";
import { Search, ShieldCheck, UserRound } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useProfile } from "@/contexts/profile-context";

export function OpportunityAtlas({
  onSetupProfile,
  searchAction = "/explore",
}: {
  onSetupProfile?: () => void;
  searchAction?: string;
}) {
  const { locale, t } = useLanguage();
  const { profile } = useProfile();
  const context = profile.state ?? "India";
  const isHindi = locale === "hi";

  return (
    <section className="home-hero" aria-labelledby="home-hero-title">
      <div className="home-hero-copy">
        <p className="trust-line">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          {isHindi
            ? "आधिकारिक स्रोतों से चुनी गई भरोसेमंद जानकारी।"
            : "Curated from official sources. Information you can trust."}
        </p>
        <h1 id="home-hero-title">{t("promise")}</h1>
        <p className="hero-support">{t("support")}</p>

        <form action={searchAction} className="hero-search">
          <label className="sr-only" htmlFor="atlas-search">
            {isHindi ? "अवसर खोजें" : "Search opportunities"}
          </label>
          <Search className="h-5 w-5" aria-hidden="true" />
          <input
            id="atlas-search"
            name="q"
            placeholder={t("searchPlaceholder")}
          />
          <button type="submit">{isHindi ? "खोजें" : "Search"}</button>
        </form>

        <div className="hero-actions">
          <Link href="/explore" className="button-primary">
            {isHindi ? "अवसर खोजें" : "Explore opportunities"}
          </Link>
          <button type="button" className="button-secondary" onClick={onSetupProfile}>
            <UserRound className="h-4 w-4" aria-hidden="true" />
            {isHindi ? "प्रोफाइल सेट करें" : "Set up profile"}
          </button>
        </div>
      </div>

      <div className="compass-visual" aria-hidden="true">
        <svg viewBox="0 0 520 420">
          <path
            className="india-line"
            d="M257 37c22 29 58 39 69 73 9 28-22 50-12 81 10 35 55 43 68 76 12 31-25 57-57 67-38 12-52 47-89 51-41 4-45-49-77-64-36-17-84 2-103-29-18-32 24-59 33-93 9-36-26-69-5-99 21-32 71-9 103-31 25-17 38-50 70-32Z"
          />
          <circle className="compass-ring" cx="258" cy="210" r="112" />
          <circle className="compass-ring subtle" cx="258" cy="210" r="168" />
          <path className="compass-wave" d="M32 198c72-48 132-57 203-28 71 30 138 23 232-39" />
          <g className="compass-needle">
            <path d="M278 188l80-68-56 90-24-22Z" />
            <path d="M242 232l-80 68 56-90 24 22Z" />
            <circle cx="260" cy="210" r="15" />
          </g>
        </svg>
        <p>{isHindi ? `${context} पर केंद्रित` : `${context} focus`}</p>
      </div>
    </section>
  );
}
