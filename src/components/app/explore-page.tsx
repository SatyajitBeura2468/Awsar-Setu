"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Filter, RotateCcw, Search, X } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/contexts/language-context";
import { useProfile } from "@/contexts/profile-context";
import {
  benefitLabels,
  categoryLabels,
  educationLabels,
  roleLabels,
} from "@/lib/i18n";
import { ageBandOverlaps, matchOpportunity } from "@/lib/matching";
import { opportunities } from "@/lib/opportunities";
import {
  ageBands,
  benefitTypes,
  categories,
  currentRoles,
  educationLevels,
  indianStates,
  type AgeBand,
  type BenefitType,
  type Category,
  type ContentStatus,
  type CurrentRole,
  type EducationLevel,
  type IndianState,
  type MatchLevel,
  type UserProfile,
} from "@/lib/types";
import { OpportunityCard } from "@/components/opportunities/opportunity-card";
import { EmptyState } from "./empty-state";
import { ProfileSheet } from "./profile-sheet";

type Sort = "newest" | "closing" | "best" | "checked";
type DeadlineFilter = "all" | "dated" | "rolling";
type StatusFilter = Extract<ContentStatus, "verified-active" | "official-directory"> | "all";
type StateFilter = IndianState | "all" | "profile";

const sortOptions = ["newest", "closing", "best", "checked"] as const;
const deadlineOptions = ["all", "dated", "rolling"] as const;
const statusOptions = ["all", "verified-active", "official-directory"] as const;

const ageBandLabels: Record<AgeBand, string> = {
  "under-18": "Under 18",
  "18-24": "18-24",
  "25-34": "25-34",
  "35-44": "35-44",
  "45-59": "45-59",
  "60-plus": "60+",
  "not-specified": "Any age band",
};

export function ExplorePage() {
  const params = useSearchParams();
  const reduceMotion = useReducedMotion();
  const { locale, t } = useLanguage();
  const { profile, profileReady } = useProfile();
  const [profileSheetOpen, setProfileSheetOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [category, setCategory] = useState<Category | "all">(
    safeParam(params.get("category"), categories) ?? "all",
  );
  const [state, setState] = useState<StateFilter>(
    safeStateParam(params.get("state")) ?? "profile",
  );
  const [ageBand, setAgeBand] = useState<AgeBand | "all">(
    safeParam(params.get("ageBand") ?? params.get("age"), ageBands) ??
      profile.ageBand ??
      "all",
  );
  const [role, setRole] = useState<CurrentRole | "all">(
    safeParam(params.get("role"), currentRoles) ?? profile.currentRole ?? "all",
  );
  const [education, setEducation] = useState<EducationLevel | "all">(
    safeParam(params.get("education"), educationLevels) ??
      profile.educationLevel ??
      "all",
  );
  const [benefit, setBenefit] = useState<BenefitType | "all">(
    safeParam(params.get("benefit"), benefitTypes) ?? "all",
  );
  const [deadline, setDeadline] = useState<DeadlineFilter>(
    safeParam(params.get("deadline"), deadlineOptions) ?? "all",
  );
  const [status, setStatus] = useState<StatusFilter>(
    safeParam(params.get("status"), statusOptions) ?? "all",
  );
  const [sort, setSort] = useState<Sort>(
    safeParam(params.get("sort"), sortOptions) ?? "newest",
  );
  const [forYou, setForYou] = useState(
    params.get("lens") === "for-you" && profileReady,
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFiltersOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const nextParams = new URLSearchParams();
    const normalizedQuery = query.trim();

    if (normalizedQuery) nextParams.set("q", normalizedQuery);
    if (category !== "all") nextParams.set("category", category);
    if (state !== "profile") nextParams.set("state", state);
    if (ageBand !== "all") nextParams.set("ageBand", ageBand);
    if (role !== "all") nextParams.set("role", role);
    if (education !== "all") nextParams.set("education", education);
    if (benefit !== "all") nextParams.set("benefit", benefit);
    if (deadline !== "all") nextParams.set("deadline", deadline);
    if (status !== "all") nextParams.set("status", status);
    if (sort !== "newest") nextParams.set("sort", sort);
    if (forYou) nextParams.set("lens", "for-you");

    const nextQueryString = nextParams.toString();
    const nextUrl = `/explore${nextQueryString ? `?${nextQueryString}` : ""}`;
    const currentUrl = `${window.location.pathname}${window.location.search}`;
    if (nextUrl !== currentUrl) {
      window.history.replaceState(window.history.state, "", nextUrl);
    }
  }, [
    ageBand,
    benefit,
    category,
    deadline,
    education,
    forYou,
    query,
    role,
    sort,
    state,
    status,
  ]);

  const activeProfile = useMemo<UserProfile | null>(() => {
    if (!forYou || !profileReady) return null;
    return profile;
  }, [forYou, profile, profileReady]);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const effectiveState = state === "profile" ? profile.state ?? "all" : state;

    return opportunities
      .filter((opportunity) => {
        if (
          opportunity.contentStatus === "development-sample" ||
          opportunity.contentStatus === "archived" ||
          opportunity.contentStatus === "unavailable"
        ) {
          return false;
        }

        const text = [
          opportunity.title,
          opportunity.description,
          opportunity.organisation,
          opportunity.eligibilitySummary,
          opportunity.sourceDomain,
        ]
          .join(" ")
          .toLowerCase();
        const match = matchOpportunity(activeProfile, opportunity);
        const chosenAgeBand = ageBand === "all" ? activeProfile?.ageBand : ageBand;

        return (
          (!normalized || text.includes(normalized)) &&
          (category === "all" || opportunity.category === category) &&
          (benefit === "all" || opportunity.benefitType === benefit) &&
          (status === "all" || opportunity.contentStatus === status) &&
          (deadline === "all" ||
            (deadline === "dated"
              ? Boolean(opportunity.deadline)
              : !opportunity.deadline)) &&
          (effectiveState === "all" ||
            opportunity.scope.kind === "national" ||
            opportunity.scope.states.includes(effectiveState)) &&
          (role === "all" ||
            !opportunity.currentRoleRelevance?.length ||
            opportunity.currentRoleRelevance.includes(role)) &&
          (education === "all" ||
            opportunity.educationRequirements.includes(education) ||
            opportunity.educationRequirements.includes("not-specified")) &&
          (chosenAgeBand === undefined ||
            ageBandOverlaps(chosenAgeBand, opportunity.ageBounds) !== false) &&
          (!forYou || match.level !== "check")
        );
      })
      .sort((a, b) => {
        if (sort === "closing") {
          return (a.deadline ?? "9999-12-31").localeCompare(
            b.deadline ?? "9999-12-31",
          );
        }
        if (sort === "best" || forYou) {
          const order: Record<MatchLevel, number> = {
            likely: 0,
            possible: 1,
            check: 2,
          };
          return (
            order[matchOpportunity(activeProfile, a).level] -
            order[matchOpportunity(activeProfile, b).level]
          );
        }
        if (sort === "checked") {
          return b.lastChecked.localeCompare(a.lastChecked);
        }
        return b.updatedAt.localeCompare(a.updatedAt);
      });
  }, [
    activeProfile,
    ageBand,
    benefit,
    category,
    deadline,
    education,
    forYou,
    profile.state,
    query,
    role,
    sort,
    state,
    status,
  ]);

  const activeChips = [
    category !== "all" && {
      label: categoryLabels[category][locale],
      reset: () => setCategory("all"),
    },
    state !== "profile" && {
      label: state === "all" ? "All states" : state,
      reset: () => setState("profile"),
    },
    ageBand !== "all" && {
      label: ageBandLabels[ageBand],
      reset: () => setAgeBand("all"),
    },
    role !== "all" && {
      label: roleLabels[role][locale],
      reset: () => setRole("all"),
    },
    education !== "all" && {
      label: educationLabels[education][locale],
      reset: () => setEducation("all"),
    },
    benefit !== "all" && {
      label: benefitLabels[benefit][locale],
      reset: () => setBenefit("all"),
    },
    status !== "all" && {
      label: status === "verified-active" ? "Verified active" : "Official directory",
      reset: () => setStatus("all"),
    },
    deadline !== "all" && {
      label: deadline === "dated" ? "Has deadline" : "Open or directory",
      reset: () => setDeadline("all"),
    },
  ].filter(Boolean) as Array<{ label: string; reset: () => void }>;

  const resetFilters = () => {
    setCategory("all");
    setState("profile");
    setAgeBand("all");
    setRole("all");
    setEducation("all");
    setBenefit("all");
    setDeadline("all");
    setStatus("all");
    setQuery("");
    setForYou(false);
  };

  const enableForYou = () => {
    if (!profileReady) {
      setProfileSheetOpen(true);
      return;
    }
    setForYou(true);
    setSort("best");
  };

  return (
    <div className="explore-page v5-explore">
      <section className="explore-hero v5-page-intro">
        <div>
          <h1>{locale === "hi" ? "अवसर खोजें" : "Explore opportunities"}</h1>
          <p>
            Search trusted pathways and verified notices. Match labels are
            guidance only.
          </p>
        </div>
        <a href="/explore?category=government-jobs-vacancies" className="v5-arrow-link">
          Browse vacancies
        </a>
      </section>

      <section className="v5-discovery-toolbar" aria-label="Search and sorting">
        <div className="explore-search v5-discovery-search">
          <Search className="h-5 w-5" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("searchPlaceholder")}
          />
        </div>
        <button
          type="button"
          className="button-secondary mobile-filter-trigger"
          onClick={() => setFiltersOpen(true)}
        >
          <Filter className="h-4 w-4" aria-hidden="true" />
          Filters
        </button>
      </section>

      <div className="v5-sort-row">
        <span>Sort by</span>
        <div className="v5-sort-options" aria-label="Sort opportunities">
          {([
            ["best", "Best match"],
            ["newest", "Newest verified"],
            ["closing", "Closing soon"],
            ["checked", "Recently checked"],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setSort(value)}
              className={sort === value ? "is-active" : ""}
              aria-pressed={sort === value}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="segmented-control" aria-label="Personalisation lens">
          <button
            type="button"
            onClick={() => setForYou(false)}
            className={!forYou ? "is-active" : ""}
          >
            All
          </button>
          <button
            type="button"
            onClick={enableForYou}
            className={forYou ? "is-active" : ""}
          >
            For You
          </button>
        </div>
      </div>

      {activeChips.length > 0 && (
        <div className="active-filter-row" aria-label="Active filters">
          {activeChips.map((chip) => (
            <button key={chip.label} type="button" onClick={chip.reset}>
              {chip.label}
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          ))}
          <button type="button" onClick={resetFilters}>
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Reset
          </button>
        </div>
      )}

      <div className="v5-discovery-layout">
        <aside className="v5-filter-rail" aria-label="Filters">
          <div className="v5-filter-rail-heading">
            <strong>Filters</strong>
            <button type="button" onClick={resetFilters}>Reset all</button>
          </div>
          <FilterSelect label="Opportunity type" value={category} onChange={setCategory}>
            <option value="all">All categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>{categoryLabels[item][locale]}</option>
            ))}
          </FilterSelect>
          <FilterSelect label="Location" value={state} onChange={setState}>
            <option value="profile">Use current context</option>
            <option value="all">India-wide and all states</option>
            {indianStates.map((item) => <option key={item} value={item}>{item}</option>)}
          </FilterSelect>
          <FilterSelect label="Who it is for" value={role} onChange={setRole}>
            <option value="all">Any role</option>
            {currentRoles.map((item) => (
              <option key={item} value={item}>{roleLabels[item][locale]}</option>
            ))}
          </FilterSelect>
          <FilterSelect label="Education" value={education} onChange={setEducation}>
            <option value="all">Any education</option>
            {educationLevels.map((item) => (
              <option key={item} value={item}>{educationLabels[item][locale]}</option>
            ))}
          </FilterSelect>
          <FilterSelect label="Age band" value={ageBand} onChange={setAgeBand}>
            <option value="all">Any age band</option>
            {ageBands.filter((item) => item !== "not-specified").map((item) => (
              <option key={item} value={item}>{ageBandLabels[item]}</option>
            ))}
          </FilterSelect>
          <FilterSelect label="Benefit" value={benefit} onChange={setBenefit}>
            <option value="all">Any benefit</option>
            {benefitTypes.map((item) => (
              <option key={item} value={item}>{benefitLabels[item][locale]}</option>
            ))}
          </FilterSelect>
          <FilterSelect label="Trust status" value={status} onChange={setStatus}>
            <option value="all">Trusted records</option>
            <option value="verified-active">Verified active</option>
            <option value="official-directory">Official directory</option>
          </FilterSelect>
          <FilterSelect label="Deadline" value={deadline} onChange={setDeadline}>
            <option value="all">Any deadline</option>
            <option value="dated">Has verified deadline</option>
            <option value="rolling">Open or directory</option>
          </FilterSelect>
        </aside>

        <section className="v5-results" aria-live="polite">
          <div className="results-summary">
            <strong>{results.length} result{results.length === 1 ? "" : "s"}</strong>
            <span>
              {forYou
                ? "Showing likely and possible matches from your profile."
                : "Showing trusted public pathways."}
            </span>
          </div>
          {results.length ? (
            <div className="opportunity-list">
              {results.map((opportunity) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  profile={activeProfile}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No results in this search"
              description="Try fewer filters, official directories, or a nearby category. AwsarSetu will not fill gaps with unverified records."
              actionHref="/explore?status=official-directory"
              actionLabel="Show official directories"
            />
          )}
        </section>
      </div>

      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            className="filter-sheet-backdrop"
            role="dialog"
            aria-modal="true"
            aria-labelledby="filter-sheet-title"
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setFiltersOpen(false);
            }}
          >
            <motion.aside
              className="filter-sheet"
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? { opacity: 1 } : { opacity: 0, x: 24 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
            >
              <div className="sheet-header">
                <div>
                  <h2 id="filter-sheet-title">Filters</h2>
                  <p>Keep only what helps narrow the search.</p>
                </div>
                <button
                  type="button"
                  className="icon-button"
                  onClick={() => setFiltersOpen(false)}
                  aria-label="Close filters"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              <div className="filter-fields">
                <FilterSelect label="Category" value={category} onChange={setCategory}>
                  <option value="all">All categories</option>
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {categoryLabels[item][locale]}
                    </option>
                  ))}
                </FilterSelect>
                <FilterSelect label="Location" value={state} onChange={setState}>
                  <option value="profile">Use current context</option>
                  <option value="all">India-wide and all states</option>
                  {indianStates.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </FilterSelect>
                <FilterSelect label="Age band" value={ageBand} onChange={setAgeBand}>
                  <option value="all">Any age band</option>
                  {ageBands.filter((item) => item !== "not-specified").map((item) => (
                    <option key={item} value={item}>
                      {ageBandLabels[item]}
                    </option>
                  ))}
                </FilterSelect>
                <FilterSelect label="Education" value={education} onChange={setEducation}>
                  <option value="all">Any education</option>
                  {educationLevels.map((item) => (
                    <option key={item} value={item}>
                      {educationLabels[item][locale]}
                    </option>
                  ))}
                </FilterSelect>
                <FilterSelect label="Role" value={role} onChange={setRole}>
                  <option value="all">Any role</option>
                  {currentRoles.map((item) => (
                    <option key={item} value={item}>
                      {roleLabels[item][locale]}
                    </option>
                  ))}
                </FilterSelect>
                <FilterSelect label="Benefit type" value={benefit} onChange={setBenefit}>
                  <option value="all">Any benefit</option>
                  {benefitTypes.map((item) => (
                    <option key={item} value={item}>
                      {benefitLabels[item][locale]}
                    </option>
                  ))}
                </FilterSelect>
                <FilterSelect label="Status" value={status} onChange={setStatus}>
                  <option value="all">Trusted records</option>
                  <option value="verified-active">Verified active</option>
                  <option value="official-directory">Official directory</option>
                </FilterSelect>
                <FilterSelect label="Deadline" value={deadline} onChange={setDeadline}>
                  <option value="all">Any deadline</option>
                  <option value="dated">Has verified deadline</option>
                  <option value="rolling">Open or directory</option>
                </FilterSelect>
              </div>

              <div className="sheet-actions">
                <button type="button" className="button-primary" onClick={() => setFiltersOpen(false)}>
                  Apply filters
                </button>
                <button type="button" className="button-secondary" onClick={resetFilters}>
                  Reset
                </button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <ProfileSheet
        open={profileSheetOpen}
        onClose={() => {
          setProfileSheetOpen(false);
          if (profileReady) {
            setForYou(true);
            setSort("best");
          }
        }}
      />
    </div>
  );
}

function safeParam<T extends readonly string[]>(
  value: string | null,
  allowed: T,
): T[number] | null {
  if (!value) return null;
  return (allowed as readonly string[]).includes(value) ? value : null;
}

function safeStateParam(value: string | null): StateFilter | null {
  if (value === "all" || value === "profile") return value;
  return safeParam(value, indianStates);
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
  children: ReactNode;
}) {
  return (
    <label className="filter-field">
      <span>{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
      >
        {children}
      </select>
    </label>
  );
}
