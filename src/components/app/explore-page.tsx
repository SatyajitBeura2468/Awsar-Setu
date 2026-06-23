"use client";

import { AnimatePresence, motion } from "motion/react";
import { Filter, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
import {
  OpportunitySignal,
  TrustStatus,
} from "@/components/experience/experience-primitives";

type Sort = "newest" | "closing" | "best";
type DeadlineFilter = "all" | "dated" | "rolling";
type StatusFilter = ContentStatus | "all";
type ConfidenceFilter = MatchLevel | "all";
type StateFilter = IndianState | "all" | "profile";

const sortOptions = ["newest", "closing", "best"] as const;
const deadlineOptions = ["all", "dated", "rolling"] as const;
const statusOptions = [
  "all",
  "verified-active",
  "official-directory",
  "archived",
  "unavailable",
  "development-sample",
] as const;
const confidenceOptions = ["all", "likely", "possible", "check"] as const;

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
  const router = useRouter();
  const pathname = usePathname();
  const { locale, t } = useLanguage();
  const { profile, profileReady } = useProfile();
  const currentQueryString = params.toString();
  const [profileSheetOpen, setProfileSheetOpen] = useState(false);
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
  const [confidence, setConfidence] = useState<ConfidenceFilter>(
    safeParam(params.get("confidence"), confidenceOptions) ?? "all",
  );
  const [sort, setSort] = useState<Sort>(
    safeParam(params.get("sort"), sortOptions) ?? "newest",
  );
  const [forYou, setForYou] = useState(
    params.get("lens") === "for-you" && profileReady,
  );
  const [filtersOpen, setFiltersOpen] = useState(true);

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
    if (confidence !== "all") nextParams.set("confidence", confidence);
    if (sort !== "newest") nextParams.set("sort", sort);
    if (forYou) nextParams.set("lens", "for-you");

    const nextQueryString = nextParams.toString();
    if (nextQueryString !== currentQueryString) {
      router.replace(
        `${pathname}${nextQueryString ? `?${nextQueryString}` : ""}`,
        { scroll: false },
      );
    }
  }, [
    ageBand,
    benefit,
    category,
    confidence,
    currentQueryString,
    deadline,
    education,
    forYou,
    pathname,
    query,
    role,
    router,
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
    const effectiveState =
      state === "profile" ? profile.state ?? "all" : state;
    return opportunities
      .filter((opportunity) => {
        if (opportunity.contentStatus === "development-sample") return false;
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
        const chosenAgeBand =
          ageBand === "all" ? activeProfile?.ageBand : ageBand;

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
          (confidence === "all" || match.level === confidence)
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
    ageBand,
    benefit,
    category,
    confidence,
    deadline,
    education,
    query,
    role,
    sort,
    profile.state,
    state,
    status,
  ]);

  const activeChips = [
    category !== "all" && {
      label: categoryLabels[category][locale],
      reset: () => setCategory("all"),
    },
    state !== "all" && {
      label:
        state === "profile"
          ? profile.state
            ? `Context: ${profile.state}`
            : "Context: India"
          : state,
      reset: () => setState("all"),
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
    status !== "all" && {
      label: status.replace("-", " "),
      reset: () => setStatus("all"),
    },
    benefit !== "all" && {
      label: benefitLabels[benefit][locale],
      reset: () => setBenefit("all"),
    },
    deadline !== "all" && {
      label: deadline === "dated" ? "Has deadline" : "Open or directory",
      reset: () => setDeadline("all"),
    },
    confidence !== "all" && {
      label:
        confidence === "likely"
          ? "Likely Match"
          : confidence === "possible"
            ? "Possible Match"
            : "Check Criteria",
      reset: () => setConfidence("all"),
    },
  ].filter(Boolean) as Array<{ label: string; reset: () => void }>;

  const resetFilters = () => {
    setCategory("all");
    setState("all");
    setAgeBand("all");
    setRole("all");
    setEducation("all");
    setBenefit("all");
    setDeadline("all");
    setStatus("all");
    setConfidence("all");
    setQuery("");
  };

  const enableForYou = () => {
    if (!profileReady) {
      setProfileSheetOpen(true);
      return;
    }
    setForYou(true);
  };

  return (
    <div className="space-y-7">
      <section className="command-deck">
        <div className="command-deck-heading">
          <div>
            <OpportunitySignal
              label={forYou ? "For You lens active" : "All opportunities"}
              active={forYou}
            />
            <h1>{t("explore")}</h1>
            <p>
              Search and filter trusted opportunity pathways. Match labels are
              guidance only and never guarantee eligibility.
            </p>
          </div>
          <div className="command-toggle">
            <button
              type="button"
              onClick={() => setForYou(false)}
              className={!forYou ? "is-active" : ""}
            >
              All Opportunities
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

        <div className="command-search">
          <Search className="h-5 w-5 text-teal" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("searchPlaceholder")}
          />
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as Sort)}
            aria-label="Sort opportunities"
          >
            <option value="newest">Newest</option>
            <option value="closing">Closing Soon</option>
            <option value="best">Best Match</option>
          </select>
        </div>

        <div className="lens-row">
          {["scholarships", "Odisha vacancies", "digital skills"].map(
            (suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setQuery(suggestion)}
              >
                {suggestion}
              </button>
            ),
          )}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[20rem_1fr]">
        <aside className="filter-deck">
          <button
            type="button"
            onClick={() => setFiltersOpen((value) => !value)}
            className="filter-deck-title"
          >
            <span>
              <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />
            </span>
            Filters
            <Filter className="ml-auto h-4 w-4" aria-hidden="true" />
          </button>
          <AnimatePresence initial={false}>
            {filtersOpen && (
              <motion.div
                className="filter-deck-body"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <FilterSelect label="Category" value={category} onChange={setCategory}>
                  <option value="all">All categories</option>
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {categoryLabels[item][locale]}
                    </option>
                  ))}
                </FilterSelect>
                <FilterSelect label="State" value={state} onChange={setState}>
                  <option value="profile">Use current context</option>
                  <option value="all">National or all states</option>
                  {indianStates.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </FilterSelect>
                <FilterSelect label="Age band" value={ageBand} onChange={setAgeBand}>
                  <option value="all">Any age band</option>
                  {ageBands.map((item) => (
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
                <FilterSelect label="Current role" value={role} onChange={setRole}>
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
                <FilterSelect label="Deadline" value={deadline} onChange={setDeadline}>
                  <option value="all">Any deadline</option>
                  <option value="dated">Has notice deadline</option>
                  <option value="rolling">Open or directory</option>
                </FilterSelect>
                <FilterSelect label="Content status" value={status} onChange={setStatus}>
                  <option value="all">All trusted statuses</option>
                  <option value="verified-active">Verified active</option>
                  <option value="official-directory">Official directory</option>
                </FilterSelect>
                <FilterSelect
                  label="Eligibility confidence"
                  value={confidence}
                  onChange={setConfidence}
                >
                  <option value="all">All</option>
                  <option value="likely">Likely Match</option>
                  <option value="possible">Possible Match</option>
                  <option value="check">Check Criteria</option>
                </FilterSelect>
              </motion.div>
            )}
          </AnimatePresence>
        </aside>

        <section>
          <div className="result-toolbar">
            <div>
              <motion.p
                key={results.length}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {results.length} result{results.length === 1 ? "" : "s"}
              </motion.p>
              <span>
                {forYou
                  ? "Profile lens is active."
                  : "All trusted pathways are visible."}
              </span>
            </div>
            <button type="button" onClick={resetFilters}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reset
            </button>
          </div>

          {activeChips.length > 0 && (
            <div className="active-lenses">
              {activeChips.map((chip) => (
                <button key={chip.label} type="button" onClick={chip.reset}>
                  {chip.label}
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              ))}
            </div>
          )}

          {results.length ? (
            <motion.div layout className="grid gap-5 md:grid-cols-2">
              {results.map((opportunity, index) => (
                <motion.div layout key={opportunity.id}>
                  <OpportunityCard
                    opportunity={opportunity}
                    profile={activeProfile}
                    priority={index < 2}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <EmptyState
              title="No close matches in this lens"
              description="Try removing one filter, using official directories, or checking a nearby category. AwsarSetu avoids filling empty states with unverified sample content."
              actionHref="/explore?status=official-directory"
              actionLabel="Show official directories"
            />
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            <TrustStatus status="verified-active" />
            <TrustStatus status="official-directory" />
          </div>
        </section>
      </div>

      <ProfileSheet
        open={profileSheetOpen}
        onClose={() => {
          setProfileSheetOpen(false);
          if (profileReady) setForYou(true);
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
    <label className="grid gap-2">
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
