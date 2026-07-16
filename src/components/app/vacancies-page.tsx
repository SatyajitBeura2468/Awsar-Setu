"use client";

import { useState } from "react";
import Link from "next/link";
import { useProfile } from "@/contexts/profile-context";
import { getVacancies } from "@/lib/opportunities";
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
  { id: "all", label: "All vacancies" },
  { id: "government", label: "Government jobs" },
  { id: "university-education", label: "University and education" },
  { id: "apprenticeship", label: "Apprenticeships" },
  { id: "internship", label: "Internships" },
  { id: "contractual-local", label: "Local recruitment" },
];

export function VacanciesPage() {
  const { profile, profileReady } = useProfile();
  const [activeTab, setActiveTab] = useState<VacancyTab>("all");
  const vacancies = getVacancies().filter(
    (opportunity) =>
      activeTab === "all" || opportunity.vacancyType === activeTab,
  );

  return (
    <div className="explore-page v5-explore">
      <header className="v5-page-intro">
        <h1>Vacancies</h1>
        <p>
          Government jobs, university posts, apprenticeships, internships and
          local recruitment pathways from official sources.
        </p>
        <Link href="/explore?category=government-jobs-vacancies" className="text-link">
          Open in Explore filters
        </Link>
      </header>

      <div className="tab-row" role="tablist" aria-label="Vacancy categories">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={activeTab === tab.id ? "is-active" : ""}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {vacancies.length ? (
        <div className="opportunity-list">
          {vacancies.map((opportunity) => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              profile={profileReady ? profile : null}
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
