import type { AgeBand, MatchLevel, Opportunity, UserProfile } from "./types";

const educationRank = [
  "school",
  "class-10",
  "class-12",
  "vocational",
  "diploma",
  "graduate",
  "postgraduate",
  "phd",
  "not-specified",
] as const;

function educationMeets(profileEducation?: string, required: string[] = []) {
  if (!required.length || required.includes("not-specified")) return true;
  if (!profileEducation) return false;
  const profileRank = educationRank.indexOf(
    profileEducation as (typeof educationRank)[number],
  );
  return required.some((level) => {
    const requiredRank = educationRank.indexOf(
      level as (typeof educationRank)[number],
    );
    return profileRank >= requiredRank || level === profileEducation;
  });
}

const ageBandRanges: Record<AgeBand, { min: number; max: number } | null> = {
  "under-18": { min: 0, max: 17 },
  "18-24": { min: 18, max: 24 },
  "25-34": { min: 25, max: 34 },
  "35-44": { min: 35, max: 44 },
  "45-59": { min: 45, max: 59 },
  "60-plus": { min: 60, max: 120 },
  "not-specified": null,
};

export function ageBandOverlaps(
  ageBand: AgeBand | undefined,
  bounds: Opportunity["ageBounds"],
) {
  if (!bounds) return true;
  if (!ageBand || ageBand === "not-specified") return null;
  const range = ageBandRanges[ageBand];
  if (!range) return null;
  const min = bounds.min ?? 0;
  const max = bounds.max ?? 120;
  return range.max >= min && range.min <= max;
}

export function isProfileReadyForMatching(profile: UserProfile | null | undefined) {
  return Boolean(
    profile?.state &&
      profile.ageBand &&
      profile.ageBand !== "not-specified" &&
      profile.educationLevel &&
      profile.currentRole &&
      profile.interests.length,
  );
}

export function matchOpportunity(
  profile: UserProfile | null | undefined,
  opportunity: Opportunity,
): { level: MatchLevel; reasons: string[] } {
  if (!profile) {
    return {
      level: "check",
      reasons: ["Add a lightweight profile to compare this opportunity."],
    };
  }

  if (
    opportunity.contentStatus === "development-sample" ||
    opportunity.contentStatus === "unavailable" ||
    opportunity.contentStatus === "archived"
  ) {
    return {
      level: "check",
      reasons: ["This record is not an active verified opportunity."],
    };
  }

  const reasons: string[] = [];
  let matched = 0;
  let blocked = 0;
  let unknown = 0;

  if (opportunity.scope.kind === "national") {
    matched += 1;
    reasons.push("Available across India.");
  } else if (
    profile.state &&
    opportunity.scope.states.includes(profile.state)
  ) {
    matched += 2;
    reasons.push(`Covers ${profile.state}.`);
  } else {
    blocked += 1;
    reasons.push("State coverage needs checking.");
  }

  if (opportunity.ageBounds) {
    const ageMatch = ageBandOverlaps(profile.ageBand, opportunity.ageBounds);
    if (ageMatch === true) {
      matched += 2;
      reasons.push("Your age band overlaps the listed range.");
    } else if (ageMatch === false) {
      blocked += 2;
      reasons.push("Your age band may fall outside the listed range.");
    } else {
      unknown += 1;
      reasons.push("Age range exists; add an age band to compare.");
    }
  }

  if (
    educationMeets(
      profile.educationLevel,
      opportunity.educationRequirements,
    )
  ) {
    matched += 2;
    reasons.push("Education level appears relevant.");
  } else {
    unknown += 1;
    reasons.push("Education criteria should be checked.");
  }

  if (
    !opportunity.currentRoleRelevance?.length ||
    (profile.currentRole &&
      opportunity.currentRoleRelevance.includes(profile.currentRole))
  ) {
    matched += 1;
  } else {
    unknown += 1;
  }

  if (
    profile.interests.some(
      (interest) =>
        interest === opportunity.category ||
        opportunity.eligibilityTags.interests?.includes(interest),
    )
  ) {
    matched += 1;
    reasons.push("Matches your selected interests.");
  }

  if (opportunity.genderRelevance?.length) {
    if (profile.gender && opportunity.genderRelevance.includes(profile.gender)) {
      matched += 1;
    } else {
      unknown += 1;
      reasons.push("Gender-specific criteria may apply.");
    }
  }

  if (opportunity.incomeRelevance?.length) {
    if (
      profile.incomeRange &&
      opportunity.incomeRelevance.includes(profile.incomeRange)
    ) {
      matched += 1;
    } else {
      unknown += 1;
      reasons.push("Income criteria may apply.");
    }
  }

  if (blocked >= 2) {
    return { level: "check", reasons };
  }

  if (
    opportunity.contentStatus === "verified-active" &&
    matched >= 5 &&
    unknown <= 2
  ) {
    return { level: "likely", reasons };
  }

  if (matched >= 2) {
    return { level: "possible", reasons };
  }

  return { level: "check", reasons };
}
