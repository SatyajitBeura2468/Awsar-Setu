"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BriefcaseBusiness,
  GraduationCap,
  HeartHandshake,
  Leaf,
  Rocket,
  Search,
  Stethoscope,
  Wrench,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useProfile } from "@/contexts/profile-context";
import { categoryLabels } from "@/lib/i18n";
import type { Category } from "@/lib/types";
import { OpportunitySignal } from "@/components/experience/experience-primitives";

const atlasNodes: Array<{
  category: Category;
  label: string;
  icon: typeof GraduationCap;
  x: number;
  y: number;
}> = [
  {
    category: "education-scholarships",
    label: "Scholarships",
    icon: GraduationCap,
    x: 19,
    y: 24,
  },
  {
    category: "government-jobs-vacancies",
    label: "Vacancies",
    icon: BriefcaseBusiness,
    x: 74,
    y: 18,
  },
  {
    category: "jobs-internships-apprenticeships",
    label: "Internships",
    icon: Rocket,
    x: 30,
    y: 58,
  },
  {
    category: "skills-training",
    label: "Skills",
    icon: Wrench,
    x: 82,
    y: 48,
  },
  {
    category: "agriculture-rural-livelihood",
    label: "Agriculture",
    icon: Leaf,
    x: 22,
    y: 77,
  },
  {
    category: "health-welfare-social-support",
    label: "Health",
    icon: Stethoscope,
    x: 70,
    y: 78,
  },
  {
    category: "schemes-financial-support",
    label: "Support",
    icon: HeartHandshake,
    x: 54,
    y: 42,
  },
];

export function OpportunityAtlas({
  searchAction = "/explore",
}: {
  searchAction?: string;
}) {
  const { locale, t } = useLanguage();
  const { profile, profileReady } = useProfile();
  const [searchFocused, setSearchFocused] = useState(false);

  const contextLabel = profile.state
    ? `${profile.state}${profile.ageBand ? ` / ${profile.ageBand}` : ""}`
    : "India-wide discovery";

  return (
    <section
      className={`opportunity-atlas ${searchFocused ? "is-awake" : ""}`}
      aria-labelledby="opportunity-atlas-title"
    >
      <div className="opportunity-atlas-copy">
        <div className="atlas-context-row">
          <OpportunitySignal
            label={profileReady ? "Personal signal active" : "Not personalised yet"}
            active={profileReady}
          />
          <span>{contextLabel}</span>
        </div>
        <h1 id="opportunity-atlas-title">
          {locale === "hi" ? (
            t("promise")
          ) : (
            <>
              Find opportunities made for{" "}
              <span>your next step.</span>
            </>
          )}
        </h1>
        <p>
          {locale === "hi"
            ? t("support")
            : "Move from curiosity to official action with clear source status, careful match signals and a profile you control."}
        </p>

        <form action={searchAction} className="atlas-search">
          <label className="sr-only" htmlFor="atlas-search">
            Search opportunities
          </label>
          <Search className="h-6 w-6 text-teal" aria-hidden="true" />
          <input
            id="atlas-search"
            name="q"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder={t("searchPlaceholder")}
          />
          <button type="submit">Explore</button>
        </form>

        <div className="atlas-node-dock" aria-label="Quick categories">
          {atlasNodes.slice(0, 6).map(({ category, icon: Icon }) => (
            <Link key={category} href={`/explore?category=${category}`}>
              <Icon className="h-5 w-5" aria-hidden="true" />
              {categoryLabels[category][locale]}
            </Link>
          ))}
        </div>
      </div>

      <div className="atlas-map-panel" aria-hidden="true">
        <svg viewBox="0 0 640 520" role="img">
          <defs>
            <radialGradient id="atlas-core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0f9f91" stopOpacity="0.9" />
              <stop offset="55%" stopColor="#0d66d0" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
          </defs>
          <path
            className="atlas-country"
            d="M338 50c23 32 62 43 72 80 9 32-25 55-15 89 11 38 59 47 73 84 13 35-27 63-61 74-41 13-56 52-97 56-44 5-48-53-82-70-39-18-91 2-111-32-20-35 26-64 35-101 10-39-28-75-6-108 23-35 76-10 111-34 27-19 42-54 81-38Z"
          />
          <circle cx="320" cy="248" r="132" fill="url(#atlas-core)" />
          <circle className="atlas-core-ring ring-one" cx="320" cy="248" r="80" />
          <circle className="atlas-core-ring ring-two" cx="320" cy="248" r="128" />
          {atlasNodes.map((node) => (
            <path
              key={`${node.category}-path`}
              className="atlas-path"
              d={`M320 248 C ${node.x * 5.2} ${node.y * 4.6}, ${
                node.x * 6.2
              } ${node.y * 4.8}, ${node.x * 6.1} ${node.y * 4.8}`}
            />
          ))}
        </svg>

        {atlasNodes.map((node) => {
          const Icon = node.icon;
          return (
            <Link
              key={node.category}
              href={`/explore?category=${node.category}`}
              className="atlas-map-node"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              <span>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              {node.label}
            </Link>
          );
        })}

        <div className="atlas-source-panel">
          <p>Source preflight</p>
          <span>Official links open with a quick safety check.</span>
        </div>
      </div>
    </section>
  );
}
