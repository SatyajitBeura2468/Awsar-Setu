import { describe, expect, it } from "vitest";
import { matchOpportunity } from "./matching";
import { opportunities } from "./opportunities";
import type { UserProfile } from "./types";

const odishaStudent: UserProfile = {
  state: "Odisha",
  ageBand: "18-24",
  educationLevel: "class-12",
  currentRole: "student",
  interests: ["education-scholarships", "government-jobs-vacancies"],
};

describe("matchOpportunity", () => {
  it("returns conservative match levels and never guaranteed eligibility", () => {
    const result = matchOpportunity(odishaStudent, opportunities[0]);
    expect(["likely", "possible", "check"]).toContain(result.level);
    expect(result.level).not.toBe("guaranteed");
  });

  it("recognizes Odisha vacancy relevance for an Odisha profile", () => {
    const vacancy = opportunities.find((item) => item.slug.includes("odisha"));
    expect(vacancy).toBeDefined();
    const result = matchOpportunity(odishaStudent, vacancy!);
    expect(result.reasons.join(" ")).toContain("Odisha");
  });

  it("asks guests to add a profile instead of pretending certainty", () => {
    const result = matchOpportunity(null, opportunities[0]);
    expect(result.level).toBe("check");
  });
});
