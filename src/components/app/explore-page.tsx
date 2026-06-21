"use client";

import { useMemo, useState } from "react";
import { Filter, Search, SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/contexts/language-context";
import {
  benefitLabels,
  categoryLabels,
  educationLabels,
  roleLabels,
} from "@/lib/i18n";
import { matchOpportunity } from "@/lib/matching";
import { opportunities } from "@/lib/opportunities";
import {
  benefitTypes,
  categories,
  currentRoles,
  educationLevels,
  indianStates,
  type BenefitType,
  type Category,
  type CurrentRole,
  type EducationLevel,
  type IndianState,
  type UserProfile,
} from "@/lib/types";
import { OpportunityCard } from "@/components/opportunities/opportunity-card";

type Sort = "newest" | "closing" | "best";
type Confidence = "all" | "likely" | "check";

const defaultProfile: UserProfile = {
  state: "Odisha",
  age: 19,
  educationLevel: "class-12",
  currentRole: "student",
  interests: ["education-scholarships", "skills-training"],
};

export function ExplorePage() {
  const params = useSearchParams();
  const { locale, t } = useLanguage();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [category, setCategory] = useState<Category | "all">(
    (params.get("category") as Category | null) ?? "all",
  );
  const [state, setState] = useState<IndianState | "all">("all");
  const [role, setRole] = useState<CurrentRole | "all">(
    (params.get("role") as CurrentRole | null) ?? "all",
  );
  const [education, setEducation] = useState<EducationLevel | "all">("all");
  const [benefit, setBenefit] = useState<BenefitType | "all">("all");
  const [deadline, setDeadline] = useState<"all" | "open" | "dated">("all");
  const [confidence, setConfidence] = useState<Confidence>("all");
  const [sort, setSort] = useState<Sort>("newest");
  const [forYou, setForYou] = useState(false);

  const activeProfile = useMemo(
    () =>
      forYou
        ? {
            ...defaultProfile,
            state: state === "all" ? defaultProfile.state : state,
            currentRole: role === "all" ? defaultProfile.currentRole : role,
            educationLevel:
              education === "all" ? defaultProfile.educationLevel : education,
          }
        : null,
    [education, forYou, role, state],
  );

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return opportunities
      .filter((opportunity) => {
        const text = [
          opportunity.title,
          opportunity.description,
          opportunity.organisation,
          opportunity.eligibilitySummary,
        ]
          .join(" ")
          .toLowerCase();
        const match = matchOpportunity(activeProfile, opportunity);
        return (
          (!normalized || text.includes(normalized)) &&
          (category === "all" || opportunity.category === category) &&
          (benefit === "all" || opportunity.benefitType === benefit) &&
          (deadline === "all" ||
            (deadline === "dated" ? opportunity.deadline : !opportunity.expired)) &&
          (state === "all" ||
            opportunity.scope.kind === "national" ||
            opportunity.scope.states.includes(state)) &&
          (role === "all" ||
            !opportunity.currentRoleRelevance?.length ||
            opportunity.currentRoleRelevance.includes(role)) &&
          (education === "all" ||
            opportunity.educationRequirements.includes(education) ||
            opportunity.educationRequirements.includes("not-specified")) &&
          (confidence === "all" ||
            (confidence === "likely"
              ? match.level === "likely"
              : match.level === "check"))
        );
      })
      .sort((a, b) => {
        if (sort === "closing") {
          return (a.deadline ?? "9999-12-31").localeCompare(
            b.deadline ?? "9999-12-31",
          );
        }
        if (sort === "best") {
          const order = { likely: 0, possible: 1, check: 2 };
          return (
            order[matchOpportunity(activeProfile, a).level] -
            order[matchOpportunity(activeProfile, b).level]
          );
        }
        return b.updatedAt.localeCompare(a.updatedAt);
      });
  }, [
    activeProfile,
    benefit,
    category,
    confidence,
    deadline,
    education,
    query,
    role,
    sort,
    state,
  ]);

  return (
    <div className="space-y-7">
      <section className="rounded-[2rem] border border-border bg-white p-5 shadow-soft md:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-ink md:text-5xl">
              {t("explore")}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate">
              Search and filter opportunities. AwsarSetu can suggest likely
              matches, but final eligibility always belongs to the official
              criteria.
            </p>
          </div>
          <div className="flex rounded-full border border-border bg-canvas p-1">
            <button
              type="button"
              onClick={() => setForYou(false)}
              className={`rounded-full px-4 py-2 text-sm font-black ${
                !forYou ? "bg-ink text-white" : "text-slate"
              }`}
            >
              All Opportunities
            </button>
            <button
              type="button"
              onClick={() => setForYou(true)}
              className={`rounded-full px-4 py-2 text-sm font-black ${
                forYou ? "bg-ink text-white" : "text-slate"
              }`}
            >
              For You
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 rounded-[1.35rem] border border-border bg-canvas p-3 md:flex-row md:items-center">
          <div className="flex flex-1 items-center gap-3 rounded-2xl bg-white px-4 py-3">
            <Search className="h-5 w-5 text-teal" aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full bg-transparent text-base font-semibold outline-none placeholder:text-slate/70"
            />
          </div>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as Sort)}
            className="rounded-2xl border border-border bg-white px-4 py-3 text-sm font-bold text-ink outline-none"
            aria-label="Sort opportunities"
          >
            <option value="newest">Newest</option>
            <option value="closing">Closing Soon</option>
            <option value="best">Best Match</option>
          </select>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          {["scholarships", "Odisha vacancies", "training certificate"].map(
            (suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setQuery(suggestion)}
                className="rounded-full border border-border bg-white px-4 py-2 font-bold text-slate hover:border-teal hover:text-ink"
              >
                {suggestion}
              </button>
            ),
          )}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[19rem_1fr]">
        <aside className="h-fit rounded-[1.5rem] border border-border bg-white p-5 shadow-soft lg:sticky lg:top-24">
          <div className="mb-4 flex items-center gap-2 text-lg font-black text-ink">
            <SlidersHorizontal className="h-5 w-5 text-teal" />
            Filters
          </div>
          <div className="space-y-4">
            <FilterSelect label="Category" value={category} onChange={setCategory}>
              <option value="all">All categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {categoryLabels[item][locale]}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect label="Coverage / State" value={state} onChange={setState}>
              <option value="all">National or all states</option>
              {indianStates.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect label="Age range" value="19" onChange={() => undefined}>
              <option value="19">Age 19 sample</option>
              <option value="all">Any age</option>
            </FilterSelect>
            <FilterSelect
              label="Education level"
              value={education}
              onChange={setEducation}
            >
              <option value="all">Any education</option>
              {educationLevels.map((item) => (
                <option key={item} value={item}>
                  {educationLabels[item][locale]}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect label="Current role" value={role} onChange={setRole}>
              <option value="all">Any role</option>
              {currentRoles.map((item) => (
                <option key={item} value={item}>
                  {roleLabels[item][locale]}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect label="Deadline range" value={deadline} onChange={setDeadline}>
              <option value="all">Any deadline</option>
              <option value="dated">Has a visible date</option>
              <option value="open">Open or rolling</option>
            </FilterSelect>
            <FilterSelect label="Benefit type" value={benefit} onChange={setBenefit}>
              <option value="all">Any benefit</option>
              {benefitTypes.map((item) => (
                <option key={item} value={item}>
                  {benefitLabels[item][locale]}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect
              label="Eligibility confidence"
              value={confidence}
              onChange={setConfidence}
            >
              <option value="all">All</option>
              <option value="likely">Likely Match</option>
              <option value="check">Check Criteria</option>
            </FilterSelect>
          </div>
        </aside>

        <section>
          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="text-sm font-bold text-slate">
              {results.length} results. {t("likelyHint")}
            </p>
            <Filter className="h-5 w-5 text-teal" aria-hidden="true" />
          </div>
          {results.length ? (
            <div className="grid gap-5 md:grid-cols-2">
              {results.map((opportunity) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  profile={activeProfile}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-border bg-white p-8 text-center">
              <p className="text-xl font-black text-ink">No close matches yet</p>
              <p className="mt-2 text-slate">
                Widen filters or check official criteria for related
                opportunities.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function FilterSelect<T extends string>({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: T;
  onChange: (value: T) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-black uppercase tracking-[0.15em] text-slate">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="rounded-2xl border border-border bg-canvas px-4 py-3 text-sm font-bold text-ink outline-none focus:border-teal"
      >
        {children}
      </select>
    </label>
  );
}
