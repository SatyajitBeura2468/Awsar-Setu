"use client";

import { useState } from "react";
import { BriefcaseBusiness, GraduationCap, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useProfile } from "@/contexts/profile-context";
import { getVacancies } from "@/lib/opportunities";
import type { Opportunity } from "@/lib/types";
import { OpportunityCard } from "@/components/opportunities/opportunity-card";
import { EmptyState } from "./empty-state";

type VacancyTab =
  | "all"
  | "government"
  | "university-education"
  | "apprenticeship"
  | "internship"
  | "contractual-local";

const tabs: Array<{ id: VacancyTab; label: string }> = [
  { id: "all", label: "All Vacancies" },
  { id: "government", label: "Government Jobs" },
  { id: "university-education", label: "University and Education Posts" },
  { id: "apprenticeship", label: "Apprenticeships" },
  { id: "internship", label: "Internships" },
  { id: "contractual-local", label: "Contractual and Local Recruitment" },
];

export function VacanciesPage() {
  const { t } = useLanguage();
  const { profile, profileReady } = useProfile();
  const [activeTab, setActiveTab] = useState<VacancyTab>("all");
  const vacancies = getVacancies().filter(
    (opportunity) =>
      activeTab === "all" || opportunity.vacancyType === activeTab,
  );

  return (
    <div className="space-y-7">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-br from-ink via-[#073a75] to-teal-dark p-6 text-white shadow-card md:p-8">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-saffron/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-teal/30 blur-3xl" />
        <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-center">
          <div>
            <div className="mb-5 inline-grid h-14 w-14 place-items-center rounded-2xl bg-white/12 text-mint">
              <BriefcaseBusiness className="h-7 w-7" aria-hidden="true" />
            </div>
            <h1 className="text-3xl font-black tracking-tight md:text-5xl">
              {t("governmentJobs")}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-blue-100">
              Government jobs, university recruitment, apprenticeships,
              internships and local contractual openings deserve focused
              tracking. AwsarSetu highlights official-source links and careful
              likely-match language.
            </p>
          </div>
          <div className="relative rounded-[1.5rem] border border-white/20 bg-white/12 p-5 shadow-glow backdrop-blur">
            <p className="text-sm font-bold text-mint">Alert readiness</p>
            <p className="mt-3 text-xl font-black leading-snug">
              Vacancy alerts stay off until notifications are configured.
            </p>
            <p className="mt-3 text-sm leading-6 text-blue-100">
              When enabled, alerts use cautious language and never imply
              guaranteed eligibility.
            </p>
          </div>
        </div>
      </section>

      <div className="flex gap-2 overflow-x-auto pb-2" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-black transition ${
              activeTab === tab.id
                ? "border-ink bg-gradient-to-r from-ink to-peacock text-white shadow-glow"
                : "border-white/80 bg-white/76 text-slate shadow-soft backdrop-blur hover:border-teal"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {vacancies.length ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {vacancies.map((opportunity, index) => (
            <VacancyCard
              key={opportunity.id}
              opportunity={opportunity}
              profile={profileReady ? profile : null}
              priority={index === 0}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No records in this vacancy lane yet"
          description="AwsarSetu will show verified vacancy notices only after official-source review. Try all vacancies or official directories."
          actionHref="/vacancies"
          actionLabel="Show all vacancies"
        />
      )}
    </div>
  );
}

function VacancyCard({
  opportunity,
  profile,
  priority,
}: {
  opportunity: Opportunity;
  profile: Parameters<typeof OpportunityCard>[0]["profile"];
  priority?: boolean;
}) {
  const scope =
    opportunity.scope.kind === "national"
      ? "India-wide"
      : opportunity.scope.states.join(", ");

  return (
    <div className="surface-glass rounded-[1.5rem] p-4">
      <OpportunityCard
        opportunity={opportunity}
        profile={profile}
        compact
        priority={priority}
      />
      <dl className="mt-4 grid gap-3 rounded-[1.1rem] bg-canvas p-4 text-sm">
        <VacancyFact
          label="Recruiting authority"
          value={opportunity.organisation}
        />
        <VacancyFact
          label="Required qualification"
          value={opportunity.requiredQualification ?? "Check official notice"}
          icon={<GraduationCap className="h-4 w-4" aria-hidden="true" />}
        />
        <VacancyFact
          label="Age requirement"
          value={opportunity.ageRequirementText ?? "Notice-specific"}
        />
        <VacancyFact
          label="Coverage"
          value={scope}
          icon={<MapPin className="h-4 w-4" aria-hidden="true" />}
        />
        <VacancyFact
          label="Last date"
          value={opportunity.deadline ?? "Check official portal"}
        />
        <VacancyFact
          label="Source"
          value={`Official-source link: ${opportunity.sourceDomain}`}
        />
      </dl>
    </div>
  );
}

function VacancyFact({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      {icon && <span className="mt-0.5 text-teal">{icon}</span>}
      <div>
        <dt className="font-black text-ink">{label}</dt>
        <dd className="mt-1 text-slate">{value}</dd>
      </div>
    </div>
  );
}
