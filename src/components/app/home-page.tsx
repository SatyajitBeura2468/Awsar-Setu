"use client";

import Link from "next/link";
import {
  ArrowRight,
  GraduationCap,
  HeartHandshake,
  Landmark,
  Leaf,
  Search,
  Sparkles,
  UserRoundCheck,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { categoryLabels } from "@/lib/i18n";
import { guides, opportunities } from "@/lib/opportunities";
import type { Category, CurrentRole, UserProfile } from "@/lib/types";
import { OpportunityCard } from "@/components/opportunities/opportunity-card";
import { SectionHeading } from "@/components/opportunities/section-heading";

const quickCategories: Category[] = [
  "education-scholarships",
  "government-jobs-vacancies",
  "jobs-internships-apprenticeships",
  "schemes-financial-support",
  "skills-training",
  "health-welfare-social-support",
];

const guestProfile: UserProfile = {
  state: "Odisha",
  age: 19,
  educationLevel: "class-12",
  currentRole: "student",
  interests: [
    "education-scholarships",
    "government-jobs-vacancies",
    "skills-training",
  ],
};

const needs: Array<{ label: string; role: CurrentRole; icon: typeof GraduationCap }> =
  [
    { label: "Student", role: "student", icon: GraduationCap },
    { label: "Job Seeker", role: "job-seeker", icon: UserRoundCheck },
    { label: "Farmer", role: "farmer", icon: Leaf },
    { label: "Woman", role: "homemaker", icon: HeartHandshake },
    { label: "Entrepreneur", role: "entrepreneur", icon: Sparkles },
    { label: "Senior Citizen", role: "senior-citizen", icon: Landmark },
    {
      label: "Person with Disability",
      role: "person-with-disability",
      icon: HeartHandshake,
    },
  ];

export function HomePage() {
  const { locale, t } = useLanguage();
  const vacancies = opportunities.filter(
    (opportunity) =>
      opportunity.category === "government-jobs-vacancies" ||
      opportunity.vacancyType,
  );
  const closingSoon = opportunities.filter((opportunity) => opportunity.deadline);

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-[2rem] border border-border bg-hero px-5 py-8 shadow-soft md:px-10 md:py-12">
        <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-saffron/20 blur-3xl" />
        <div className="absolute bottom-0 right-28 h-40 w-40 rounded-full bg-teal/20 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-teal/20 bg-white/70 px-4 py-2 text-sm font-black text-teal-dark shadow-soft">
              {t("browseFirst")}
            </p>
            <h1 className="max-w-3xl text-4xl font-black tracking-tight text-ink md:text-6xl md:leading-[1.02]">
              {t("promise")}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate">
              {t("support")}
            </p>
            <form action="/explore" className="mt-7">
              <label className="sr-only" htmlFor="home-search">
                Search opportunities
              </label>
              <div className="flex flex-col gap-3 rounded-[1.4rem] border border-border bg-white p-2 shadow-card md:flex-row">
                <div className="flex flex-1 items-center gap-3 px-3">
                  <Search className="h-5 w-5 text-teal" aria-hidden="true" />
                  <input
                    id="home-search"
                    name="q"
                    placeholder={t("searchPlaceholder")}
                    className="min-h-12 flex-1 bg-transparent text-base font-semibold outline-none placeholder:text-slate/70"
                  />
                </div>
                <button className="rounded-2xl bg-ink px-6 py-3 text-sm font-black text-white transition hover:bg-teal-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal">
                  {t("explore")}
                </button>
              </div>
            </form>
            <div className="mt-5 flex flex-wrap gap-2">
              {quickCategories.map((category) => (
                <Link
                  key={category}
                  href={`/explore?category=${category}`}
                  className="rounded-full border border-border bg-white/80 px-4 py-2 text-sm font-bold text-slate transition hover:border-teal hover:text-ink"
                >
                  {categoryLabels[category][locale]}
                </Link>
              ))}
            </div>
          </div>

          <div className="relative rounded-[1.7rem] border border-white/80 bg-white/74 p-4 shadow-card backdrop-blur">
            <div className="rounded-[1.25rem] bg-ink p-5 text-white">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-mint">India context</p>
                <span className="rounded-full bg-white/14 px-3 py-1 text-xs font-bold">
                  EN / हिंदी
                </span>
              </div>
              <p className="mt-8 text-3xl font-black leading-tight">
                New match: A vacancy in Odisha may fit your education profile.
              </p>
              <p className="mt-3 text-sm leading-6 text-blue-100">
                Please verify official eligibility criteria before applying.
              </p>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {opportunities.slice(0, 2).map((opportunity) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  profile={guestProfile}
                  compact
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <SectionHeading title={t("matchesForYou")} description={t("matchesGuest")} />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {opportunities.slice(0, 3).map((opportunity, index) => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              profile={guestProfile}
              priority={index === 0}
            />
          ))}
        </div>
      </section>

      <section>
        <SectionHeading
          title={t("governmentJobs")}
          description="Government jobs, university posts, apprenticeships and public-sector vacancies get a dedicated, high-priority place."
          action={
            <Link
              href="/vacancies"
              className="inline-flex items-center gap-2 text-sm font-black text-teal-dark"
            >
              {t("vacancies")} <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        <div className="grid gap-5 lg:grid-cols-2">
          {vacancies.map((opportunity) => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              profile={guestProfile}
            />
          ))}
        </div>
      </section>

      <section>
        <SectionHeading
          title={t("closingSoon")}
          description="Clear deadline visibility without alarmist design."
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {closingSoon.map((opportunity) => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              profile={guestProfile}
              compact
            />
          ))}
        </div>
      </section>

      <section>
        <SectionHeading title={t("exploreByNeed")} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {needs.map((need) => {
            const Icon = need.icon;
            return (
              <Link
                key={need.role}
                href={`/explore?role=${need.role}`}
                className="flex items-center gap-4 rounded-2xl border border-border bg-white p-4 font-black text-ink shadow-soft transition hover:-translate-y-1 hover:border-teal"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-mint text-teal-dark">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                {need.label}
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <SectionHeading
          title={t("newNoteworthy")}
          description="Recently added or recently checked records from the content workflow."
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {opportunities.slice(3).map((opportunity) => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              profile={guestProfile}
              compact
            />
          ))}
        </div>
      </section>

      <section>
        <SectionHeading title={t("helpfulGuides")} />
        <div className="grid gap-5 md:grid-cols-2">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="rounded-[1.35rem] border border-border bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-card"
            >
              <p className="text-xl font-black text-ink">{guide.title}</p>
              <p className="mt-3 text-sm leading-6 text-slate">{guide.summary}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
