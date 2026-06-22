"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  GraduationCap,
  HeartHandshake,
  Landmark,
  Leaf,
  MapPin,
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
    <div className="space-y-16">
      <section className="atlas-hero relative overflow-hidden rounded-[2.4rem] border border-white/80 px-5 py-8 shadow-card md:px-10 md:py-12 xl:min-h-[39rem]">
        <div className="journey-line" aria-hidden="true" />
        <div className="relative grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div className="reveal-up">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/78 px-4 py-2 text-sm font-black text-ink shadow-soft">
                <MapPin className="h-4 w-4 text-coral" aria-hidden="true" />
                India
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/60 px-4 py-2 text-sm font-bold text-slate shadow-soft">
                <span className="h-2 w-2 rounded-full bg-teal pulse-dot" />
                Discover paths, not portals
              </span>
            </div>
            <h1 className="max-w-4xl text-5xl font-black tracking-tight text-ink md:text-7xl md:leading-[0.98]">
              {locale === "hi" ? (
                t("promise")
              ) : (
                <>
                  Find opportunities made for{" "}
                  <span className="bg-gradient-to-r from-coral via-saffron to-teal bg-clip-text italic text-transparent">
                    your next step.
                  </span>
                </>
              )}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate md:text-xl">
              {locale === "hi"
                ? t("support")
                : "Discover scholarships, vacancies, schemes and training paths in one guided space, then move to the official source when you are ready."}
            </p>
            <form action="/explore" className="mt-8">
              <label className="sr-only" htmlFor="home-search">
                Search opportunities
              </label>
              <div className="magnetic-search flex flex-col gap-3 rounded-[1.6rem] border border-white bg-white/92 p-2 md:flex-row">
                <div className="relative z-10 flex flex-1 items-center gap-3 px-3">
                  <Search className="h-6 w-6 text-teal" aria-hidden="true" />
                  <input
                    id="home-search"
                    name="q"
                    placeholder={t("searchPlaceholder")}
                    className="min-h-14 flex-1 bg-transparent text-base font-bold outline-none placeholder:text-slate/68"
                  />
                </div>
                <button className="relative z-10 shrink-0 rounded-[1.2rem] bg-gradient-to-r from-ink to-peacock px-6 py-4 text-sm font-black text-white shadow-glow transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal">
                  Explore
                </button>
              </div>
            </form>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {quickCategories.map((category, index) => (
                <Link
                  key={category}
                  href={`/explore?category=${category}`}
                  className={`dock-item group rounded-[1.1rem] border border-white/80 bg-white/72 px-4 py-3 text-sm font-black text-ink shadow-soft transition hover:-translate-y-1 hover:shadow-card delay-${index > 1 ? 2 : 1}`}
                >
                  <span className="relative z-10">
                    {categoryLabels[category][locale]}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="relative min-h-[34rem] reveal-up delay-1">
            <Image
              src="/art/opportunity-atlas.svg"
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 720px, 100vw"
              className="object-contain drop-shadow-[0_34px_54px_rgba(7,31,74,0.16)]"
            />
            <div className="absolute left-3 top-8 rounded-[1.3rem] border border-white/80 bg-white/86 p-4 shadow-card backdrop-blur">
              <p className="text-xs font-black uppercase tracking-[0.15em] text-teal">
                Live context
              </p>
              <p className="mt-1 text-lg font-black text-ink">Odisha / Age 19</p>
              <p className="text-xs font-semibold text-slate">
                India-wide and state-specific paths appear together.
              </p>
            </div>
            <div className="absolute bottom-8 right-2 max-w-[18rem] rounded-[1.3rem] border border-white/80 bg-ink/94 p-4 text-white shadow-card backdrop-blur">
              <div className="flex items-center gap-2">
                <BellRing className="h-4 w-4 text-saffron" aria-hidden="true" />
                <p className="text-xs font-black uppercase tracking-[0.15em] text-mint">
                  Meaningful alert
                </p>
              </div>
              <p className="mt-2 text-lg font-black leading-snug">
                A vacancy in Odisha may fit your education profile.
              </p>
              <p className="mt-2 text-xs leading-5 text-blue-100">
                Always verify official eligibility criteria before applying.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <SectionHeading
          title={t("matchesForYou")}
          description="A profile-shaped preview that shows how matches will feel while keeping discovery open from the first tap."
        />
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
          description="Vacancy discovery has its own lane: recruitment notices, education posts, apprenticeships and public-sector openings with source-first actions."
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
          description="Deadlines stay visible and calm, so urgency helps without turning the page into a warning wall."
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {needs.map((need) => {
            const Icon = need.icon;
            return (
              <Link
                key={need.role}
                href={`/explore?role=${need.role}`}
                className="dock-item group flex min-h-28 items-center gap-4 rounded-[1.35rem] border border-white/80 bg-white/75 p-4 font-black text-ink shadow-soft backdrop-blur transition hover:-translate-y-1 hover:shadow-card"
              >
                <span className="relative z-10 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-mint to-white text-teal-dark shadow-soft transition group-hover:scale-105">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <span className="relative z-10">{need.label}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <SectionHeading
          title={t("newNoteworthy")}
          description="Recently shaped records that show how source-led discovery will feel as verified production content is added."
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
              className="interactive-card relative overflow-hidden rounded-[1.55rem] border border-white/80 bg-white/76 p-6 shadow-soft backdrop-blur transition hover:-translate-y-1 hover:shadow-card"
            >
              <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-saffron/15 blur-2xl" />
              <p className="relative text-xl font-black text-ink">{guide.title}</p>
              <p className="relative mt-3 text-sm font-medium leading-6 text-slate">
                {guide.summary}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
