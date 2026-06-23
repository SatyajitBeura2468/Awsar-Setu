"use client";

import Link from "next/link";
import {
  ArrowRight,
  GraduationCap,
  HeartHandshake,
  Landmark,
  Leaf,
  Sparkles,
  UserRoundCheck,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import { useProfile } from "@/contexts/profile-context";
import { categoryLabels } from "@/lib/i18n";
import { matchOpportunity } from "@/lib/matching";
import {
  getClosingSoonOpportunities,
  getOfficialDirectoryOpportunities,
  getVacancies,
  guides,
} from "@/lib/opportunities";
import type { Category, CurrentRole } from "@/lib/types";
import { OpportunityCard } from "@/components/opportunities/opportunity-card";
import { SectionHeading } from "@/components/opportunities/section-heading";
import { EmptyState } from "./empty-state";
import { OpportunityAtlas } from "./opportunity-atlas";
import { ProfileSheet } from "./profile-sheet";
import { RevealSequence } from "@/components/experience/experience-primitives";

const needs: Array<{
  label: string;
  role: CurrentRole;
  category: Category;
  icon: typeof GraduationCap;
}> = [
  {
    label: "Student",
    role: "student",
    category: "education-scholarships",
    icon: GraduationCap,
  },
  {
    label: "Job Seeker",
    role: "job-seeker",
    category: "government-jobs-vacancies",
    icon: UserRoundCheck,
  },
  {
    label: "Farmer",
    role: "farmer",
    category: "agriculture-rural-livelihood",
    icon: Leaf,
  },
  {
    label: "Woman",
    role: "homemaker",
    category: "health-welfare-social-support",
    icon: HeartHandshake,
  },
  {
    label: "Entrepreneur",
    role: "entrepreneur",
    category: "schemes-financial-support",
    icon: Sparkles,
  },
  {
    label: "Senior Citizen",
    role: "senior-citizen",
    category: "health-welfare-social-support",
    icon: Landmark,
  },
  {
    label: "Person with Disability",
    role: "person-with-disability",
    category: "health-welfare-social-support",
    icon: HeartHandshake,
  },
];

export function HomePage() {
  const { locale, t } = useLanguage();
  const { profile, profileReady } = useProfile();
  const [profileSheetOpen, setProfileSheetOpen] = useState(false);
  const directories = getOfficialDirectoryOpportunities();
  const vacancies = getVacancies();
  const closingSoon = getClosingSoonOpportunities();

  const matchedDirectories = useMemo(() => {
    if (!profileReady) return [];
    return directories
      .map((opportunity) => ({
        opportunity,
        match: matchOpportunity(profile, opportunity),
      }))
      .filter((item) => item.match.level !== "check")
      .map((item) => item.opportunity)
      .slice(0, 3);
  }, [directories, profile, profileReady]);

  return (
    <div className="home-story space-y-18">
      <OpportunityAtlas />

      <RevealSequence>
        <section>
          <SectionHeading
            title={t("matchesForYou")}
            description={
              profileReady
                ? "Profile signals are active. These are cautious directory matches to start from, not guaranteed eligibility."
                : "Discovery is not personalised yet. Add a few lightweight signals when you want sharper matches."
            }
            action={
              !profileReady ? (
                <button
                  type="button"
                  onClick={() => setProfileSheetOpen(true)}
                  className="rounded-full bg-ink px-4 py-2 text-sm font-black text-white shadow-soft"
                >
                  Set up profile
                </button>
              ) : undefined
            }
          />
          {profileReady && matchedDirectories.length ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {matchedDirectories.map((opportunity, index) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  profile={profile}
                  priority={index === 0}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title={
                profileReady
                  ? "No strong profile matches yet"
                  : "Personal signal is waiting"
              }
              description={
                profileReady
                  ? "Verified active records are being added. You can still use official directories and broaden filters."
                  : "Choose state, age band, education, role and interests to make the atlas more relevant without creating an account."
              }
              actionHref="/explore"
              actionLabel="Open Explore"
            />
          )}
        </section>
      </RevealSequence>

      <RevealSequence>
        <section>
          <SectionHeading
            title={t("governmentJobs")}
            description="Vacancy discovery is source-first. Current records are official directories unless an individual notice is verified."
            action={
              <Link
                href="/vacancies"
                className="inline-flex items-center gap-2 text-sm font-black text-teal-dark"
              >
                {t("vacancies")} <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
          {vacancies.length ? (
            <div className="grid gap-5 lg:grid-cols-2">
              {vacancies.slice(0, 2).map((opportunity, index) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  profile={profileReady ? profile : null}
                  priority={index === 0}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No verified vacancy notices yet"
              description="Use official recruitment directories while AwsarSetu adds notice-level verified records."
              actionHref="/vacancies"
              actionLabel="Open vacancy hub"
            />
          )}
        </section>
      </RevealSequence>

      <RevealSequence>
        <section>
          <SectionHeading
            title={t("closingSoon")}
            description="Only verified active records with notice-level deadlines appear here."
          />
          {closingSoon.length ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {closingSoon.map((opportunity) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  profile={profileReady ? profile : null}
                  compact
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No verified deadlines are shown yet"
              description="AwsarSetu will only show deadlines after an individual official notice has been reviewed."
              actionHref="/explore?status=official-directory"
              actionLabel="Browse official directories"
            />
          )}
        </section>
      </RevealSequence>

      <RevealSequence>
        <section>
          <SectionHeading title={t("exploreByNeed")} />
          <div className="citizen-path-grid">
            {needs.map((need) => {
              const Icon = need.icon;
              return (
                <Link
                  key={need.role}
                  href={`/explore?role=${need.role}&category=${need.category}`}
                  className="citizen-path"
                >
                  <span>
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <strong>{need.label}</strong>
                  <small>{categoryLabels[need.category][locale]}</small>
                </Link>
              );
            })}
          </div>
        </section>
      </RevealSequence>

      <RevealSequence>
        <section>
          <SectionHeading
            title="Official pathways"
            description="Trusted directories are separated from verified active notices so you always know what you are opening."
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {directories.slice(0, 3).map((opportunity, index) => (
              <OpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
                profile={profileReady ? profile : null}
                compact
                priority={index === 0}
              />
            ))}
          </div>
        </section>
      </RevealSequence>

      <RevealSequence>
        <section>
          <SectionHeading title={t("helpfulGuides")} />
          <div className="guide-grid">
            {guides.map((guide) => (
              <Link key={guide.slug} href={`/guides/${guide.slug}`}>
                <p>{guide.title}</p>
                <span>{guide.summary}</span>
              </Link>
            ))}
          </div>
        </section>
      </RevealSequence>

      <ProfileSheet
        open={profileSheetOpen}
        onClose={() => setProfileSheetOpen(false)}
      />
    </div>
  );
}
