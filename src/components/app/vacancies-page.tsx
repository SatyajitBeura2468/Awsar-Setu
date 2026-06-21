"use client";

import { useState } from "react";
import { BriefcaseBusiness, GraduationCap, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { getVacancies } from "@/lib/opportunities";
import type { Opportunity, UserProfile } from "@/lib/types";
import { OpportunityCard } from "@/components/opportunities/opportunity-card";

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

const profile: UserProfile = {
  state: "Odisha",
  age: 19,
  educationLevel: "class-12",
  currentRole: "student",
  interests: ["government-jobs-vacancies", "jobs-internships-apprenticeships"],
};

export function VacanciesPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<VacancyTab>("all");
  const vacancies = getVacancies().filter(
    (opportunity) =>
      activeTab === "all" || opportunity.vacancyType === activeTab,
  );

  return (
    <div className="space-y-7">
      <section className="rounded-[2rem] border border-border bg-ink p-6 text-white shadow-card md:p-8">
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
          <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-5">
            <p className="text-sm font-bold text-mint">Quiet alert example</p>
            <p className="mt-3 text-xl font-black leading-snug">
              New match: A vacancy in Odisha may fit your education profile.
            </p>
            <p className="mt-3 text-sm leading-6 text-blue-100">
              Notifications never imply guaranteed eligibility.
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
                ? "border-ink bg-ink text-white"
                : "border-border bg-white text-slate hover:border-teal"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {vacancies.map((opportunity) => (
          <VacancyCard key={opportunity.id} opportunity={opportunity} />
        ))}
      </div>
    </div>
  );
}

function VacancyCard({ opportunity }: { opportunity: Opportunity }) {
  const scope =
    opportunity.scope.kind === "national"
      ? "India-wide"
      : opportunity.scope.states.join(", ");

  return (
    <div className="rounded-[1.5rem] border border-border bg-white p-4 shadow-soft">
      <OpportunityCard opportunity={opportunity} profile={profile} compact />
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
