"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  BriefcaseBusiness,
  ExternalLink,
  GraduationCap,
  HeartHandshake,
  Leaf,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import {
  getOfficialDirectoryOpportunities,
  getVerifiedActiveOpportunities,
  guides,
} from "@/lib/opportunities";
import type { Category, CurrentRole } from "@/lib/types";
import { categoryLabels } from "@/lib/i18n";
import type { Opportunity } from "@/lib/types";
import { OpportunityAtlas } from "./opportunity-atlas";
import { ProfileSheet } from "./profile-sheet";

const pathways: Array<{
  label: { en: string; hi: string };
  summary: { en: string; hi: string };
  role: CurrentRole;
  category: Category;
  icon: typeof GraduationCap;
}> = [
  {
    label: { en: "Student", hi: "विद्यार्थी" },
    summary: {
      en: "Scholarships, exams, fellowships",
      hi: "छात्रवृत्ति, परीक्षा, फेलोशिप",
    },
    role: "student",
    category: "education-scholarships",
    icon: GraduationCap,
  },
  {
    label: { en: "Job seeker", hi: "नौकरी खोजने वाले" },
    summary: {
      en: "Jobs, vacancies, career support",
      hi: "नौकरियां, रिक्तियां, करियर सहायता",
    },
    role: "job-seeker",
    category: "government-jobs-vacancies",
    icon: BriefcaseBusiness,
  },
  {
    label: { en: "Farmer", hi: "किसान" },
    summary: {
      en: "Schemes, training, resources",
      hi: "योजनाएं, प्रशिक्षण, संसाधन",
    },
    role: "farmer",
    category: "agriculture-rural-livelihood",
    icon: Leaf,
  },
  {
    label: { en: "Citizen support", hi: "नागरिक सहायता" },
    summary: {
      en: "Welfare, support services, help",
      hi: "कल्याण, सहायता सेवाएं, मदद",
    },
    role: "homemaker",
    category: "health-welfare-social-support",
    icon: HeartHandshake,
  },
];

const homeCopy = {
  en: {
    startTitle: "Start where you are",
    startDescription: "Choose the path closest to your current need.",
    officialTitle: "Trusted official pathways",
    officialDescription:
      "Directories are source pathways, not invented active notices.",
    viewAll: "View all",
    verifiedTitle: "Verified notices",
    verifiedDescription:
      "Notice-level records appear here only after official-source review.",
    noVerifiedTitle: "No verified notices right now",
    noVerifiedDescription:
      "Use trusted official pathways or broaden your search while verified records are added.",
    openExplore: "Open Explore",
    guidesDescription: "Simple guidance before you open an official source.",
  },
  hi: {
    startTitle: "जहां हैं, वहीं से शुरू करें",
    startDescription: "अपनी जरूरत के सबसे करीब रास्ता चुनें।",
    officialTitle: "भरोसेमंद आधिकारिक रास्ते",
    officialDescription:
      "ये स्रोत तक जाने के रास्ते हैं, गढ़ी गई सक्रिय सूचनाएं नहीं।",
    viewAll: "सभी देखें",
    verifiedTitle: "सत्यापित सूचनाएं",
    verifiedDescription:
      "सूचना-स्तर के रिकॉर्ड आधिकारिक स्रोत समीक्षा के बाद ही दिखते हैं।",
    noVerifiedTitle: "अभी कोई सत्यापित सूचना नहीं",
    noVerifiedDescription:
      "सत्यापित रिकॉर्ड जोड़े जाने तक भरोसेमंद आधिकारिक रास्ते देखें या खोज को व्यापक करें।",
    openExplore: "खोज खोलें",
    guidesDescription: "आधिकारिक स्रोत खोलने से पहले सरल मार्गदर्शन।",
  },
} as const;

const guideTitleBySlug: Record<string, { en: string; hi: string }> = {
  "how-to-apply-safely": {
    en: "How to apply safely",
    hi: "सुरक्षित आवेदन कैसे करें",
  },
  "common-documents-you-may-need": {
    en: "Common documents you may need",
    hi: "जरूरी दस्तावेज",
  },
  "identify-official-sources": {
    en: "How to identify official sources",
    hi: "आधिकारिक स्रोत कैसे पहचानें",
  },
  "avoid-fraud-misleading-links": {
    en: "Avoiding fraud and misleading links",
    hi: "धोखाधड़ी और भ्रामक लिंक से बचें",
  },
};

export function HomePage() {
  const { locale, t } = useLanguage();
  const [profileSheetOpen, setProfileSheetOpen] = useState(false);
  const directories = getOfficialDirectoryOpportunities();
  const verified = getVerifiedActiveOpportunities();
  const copy = homeCopy[locale];

  return (
    <div className="home-page v5-home">
      <OpportunityAtlas onSetupProfile={() => setProfileSheetOpen(true)} />

      <section className="route-start" aria-labelledby="start-heading">
        <div className="v5-section-heading">
          <h2 id="start-heading">{copy.startTitle}</h2>
          <p>{copy.startDescription}</p>
        </div>
        <div className="route-role-rail">
          {pathways.map((pathway) => {
            const Icon = pathway.icon;
            return (
              <Link
                key={pathway.role}
                href={`/explore?role=${pathway.role}&category=${pathway.category}`}
                className="route-role"
              >
                <span className="route-role-icon">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <strong>{pathway.label[locale]}</strong>
                  <p>{pathway.summary[locale]}</p>
                </div>
                <ArrowRight aria-hidden="true" />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="source-rail-section" aria-labelledby="official-heading">
        <div className="v5-section-heading inline">
          <div>
            <h2 id="official-heading">{copy.officialTitle}</h2>
            <p>{copy.officialDescription}</p>
          </div>
          <Link href="/explore?status=official-directory" className="v5-arrow-link">
            {copy.viewAll}<ArrowRight aria-hidden="true" />
          </Link>
        </div>
        <div className="source-rail">
          {directories.slice(0, 5).map((opportunity) => (
            <DirectoryRailItem key={opportunity.id} opportunity={opportunity} locale={locale} />
          ))}
        </div>
      </section>

      <div className="home-lower-grid">
        <section className="verified-lane" aria-labelledby="verified-heading">
          <div className="v5-section-heading inline">
            <div>
              <h2 id="verified-heading">{copy.verifiedTitle}</h2>
              <p>{copy.verifiedDescription}</p>
            </div>
            <ShieldCheck aria-hidden="true" />
          </div>
          {verified.length ? (
            <div className="verified-timeline">
              {verified.slice(0, 3).map((opportunity) => (
                <DirectoryRailItem key={opportunity.id} opportunity={opportunity} locale={locale} />
              ))}
            </div>
          ) : (
            <div className="verified-empty">
              <span className="verified-empty-node" aria-hidden="true" />
              <div>
                <strong>{copy.noVerifiedTitle}</strong>
                <p>{copy.noVerifiedDescription}</p>
                <Link href="/explore" className="v5-arrow-link">
                  {copy.openExplore}<ArrowRight aria-hidden="true" />
                </Link>
              </div>
            </div>
          )}
        </section>

        <section className="guide-lane" aria-labelledby="guides-heading">
          <div className="v5-section-heading inline">
            <div>
              <h2 id="guides-heading">{t("helpfulGuides")}</h2>
              <p>{copy.guidesDescription}</p>
            </div>
            <BookOpenText aria-hidden="true" />
          </div>
          <div className="v5-guide-list">
            {guides.map((guide, index) => (
              <Link key={guide.slug} href={`/guides/${guide.slug}`}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{guideTitleBySlug[guide.slug]?.[locale] ?? guide.title}</strong>
                <ArrowRight aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>
      </div>

      <footer className="home-trust-footer">
        <ShieldCheck aria-hidden="true" />
        <p>
          AwsarSetu is independent and source-first. Always confirm eligibility,
          dates and instructions on the official website.
        </p>
        <Link href="/privacy">How trust works</Link>
      </footer>

      <ProfileSheet
        open={profileSheetOpen}
        onClose={() => setProfileSheetOpen(false)}
      />
    </div>
  );
}

function DirectoryRailItem({
  opportunity,
  locale,
}: {
  opportunity: Opportunity;
  locale: "en" | "hi";
}) {
  return (
    <Link href={`/opportunities/${opportunity.slug}`} className="source-rail-item">
      <span className="source-rail-mark" aria-hidden="true">
        <ShieldCheck />
      </span>
      <span>
        <strong>{opportunity.title}</strong>
        <small>{categoryLabels[opportunity.category][locale]}</small>
      </span>
      <ExternalLink aria-hidden="true" />
    </Link>
  );
}
