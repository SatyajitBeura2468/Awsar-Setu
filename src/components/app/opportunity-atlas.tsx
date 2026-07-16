"use client";

import Link from "next/link";
import { ArrowRight, Search, ShieldCheck, UserRound } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useProfile } from "@/contexts/profile-context";

const nodes = [
  [151, 223, "trusted"],
  [197, 193, "route"],
  [236, 154, "trusted"],
  [285, 177, "route"],
  [324, 139, "trusted"],
  [347, 217, "route"],
  [292, 252, "trusted"],
  [264, 310, "route"],
  [218, 346, "trusted"],
  [166, 300, "route"],
] as const;

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
    <section className="v5-hero" aria-labelledby="home-hero-title">
      <div className="v5-hero-copy">
        <h1 id="home-hero-title">{t("promise")}</h1>
        <p className="v5-hero-support">{t("support")}</p>

        <form action={searchAction} className="v5-search">
          <label className="sr-only" htmlFor="atlas-search">
            {isHindi ? "अवसर खोजें" : "Search opportunities"}
          </label>
          <Search aria-hidden="true" />
          <input
            id="atlas-search"
            name="q"
            placeholder={t("searchPlaceholder")}
          />
          <button type="submit">
            {isHindi ? "खोजें" : "Search"}
            <ArrowRight aria-hidden="true" />
          </button>
        </form>

        <div className="v5-hero-actions">
          <Link href="/explore" className="button-primary">
            {isHindi ? "अवसर खोजें" : "Explore opportunities"}
            <ArrowRight aria-hidden="true" />
          </Link>
          <button type="button" className="button-secondary" onClick={onSetupProfile}>
            <UserRound aria-hidden="true" />
            {isHindi ? "प्रोफाइल सेट करें" : "Set up profile"}
          </button>
        </div>

        <div className="v5-trust-line">
          <ShieldCheck aria-hidden="true" />
          <span>
            {isHindi
              ? "आधिकारिक स्रोतों से चुनी गई जानकारी।"
              : "Source-first information, checked before it reaches you."}
          </span>
        </div>
      </div>

      <div className="route-map" aria-label={`Opportunity routes focused on ${context}`}>
        <svg viewBox="0 0 520 430" role="img" aria-hidden="true">
          <defs>
            <filter id="node-glow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            className="map-outline"
            d="M221 29l25 22 28-3 18 25 39 12 9 31 42 13 15 25 38 8-19 31-34 9-26 28-31 1-8 27-26 17-7 35-22 23-7 45-25 31-14-49-23-26-3-37-31-26 4-35-31-23 13-30-19-34 25-22 8-37 35-3 20-29 23-3 17-31z"
          />
          <path className="route route-a" d="M92 248C151 229 167 190 236 154S316 179 347 217" />
          <path className="route route-b" d="M92 248C147 272 194 323 218 346S256 334 264 310" />
          <path className="route route-c" d="M92 248C151 237 219 245 292 252S363 225 426 184" />
          <path className="route route-d" d="M92 248C164 220 211 171 285 177S303 148 324 139" />
          <path className="route route-alt" d="M92 248C152 260 186 291 166 300" />
          <circle className="origin-ripple ripple-one" cx="92" cy="248" r="31" />
          <circle className="origin-ripple ripple-two" cx="92" cy="248" r="20" />
          <circle className="origin" cx="92" cy="248" r="10" />
          {nodes.map(([cx, cy, tone], index) => (
            <g key={`${cx}-${cy}`} className={`map-node map-node-${index}`}>
              <circle cx={cx} cy={cy} r="7" className={tone} />
              {tone === "trusted" && <path d={`M${cx - 3} ${cy}l2 2 4-5`} />}
            </g>
          ))}
          <path className="direction-arrow" d="M414 188l15-7-7 15-2-7-6-1z" />
        </svg>
        <div className="route-map-label">
          <span className="route-map-origin" />
          <div>
            <strong>{context}</strong>
            <small>{isHindi ? "आपका शुरुआती बिंदु" : "Your starting point"}</small>
          </div>
        </div>
        <div className="route-legend" aria-hidden="true">
          <span><i className="legend-route" />Opportunity routes</span>
          <span><i className="legend-trust" />Verified sources</span>
          <span><i className="legend-ahead" />Opportunities ahead</span>
        </div>
      </div>
    </section>
  );
}
