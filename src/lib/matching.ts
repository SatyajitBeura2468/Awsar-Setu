import type { MatchLevel, Opportunity, UserProfile } from "./types";

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

  if (opportunity.ageBounds && profile.age) {
    const minOk =
      opportunity.ageBounds.min === undefined ||
      profile.age >= opportunity.ageBounds.min;
    const maxOk =
      opportunity.ageBounds.max === undefined ||
      profile.age <= opportunity.ageBounds.max;
    if (minOk && maxOk) {
      matched += 2;
      reasons.push("Age appears within the listed range.");
    } else {
      blocked += 2;
      reasons.push("Age may fall outside the listed range.");
    }
  } else if (opportunity.ageBounds) {
    unknown += 1;
    reasons.push("Age range exists; add age to compare.");
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

  if (matched >= 5 && unknown <= 2) {
    return { level: "likely", reasons };
  }

  if (matched >= 2) {
    return { level: "possible", reasons };
  }

  return { level: "check", reasons };
}
