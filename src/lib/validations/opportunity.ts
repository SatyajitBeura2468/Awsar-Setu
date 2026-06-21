import { z } from "zod";
import {
  benefitTypes,
  categories,
  currentRoles,
  educationLevels,
  genders,
  incomeRanges,
  indianStates,
} from "../types";

const officialHostAllowlist = [
  ".gov.in",
  ".nic.in",
  ".ac.in",
  "scholarships.gov.in",
  "apprenticeshipindia.gov.in",
  "skillindiadigital.gov.in",
  "services.india.gov.in",
] as const;

export const opportunityImportSchema = z.object({
  title: z.string().min(8),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  category: z.enum(categories),
  description: z.string().min(40),
  visualCover: z.enum([
    "education",
    "government-jobs",
    "internship",
    "training",
    "agriculture",
    "welfare",
    "health",
    "finance",
  ]),
  organisation: z.string().min(3),
  officialUrl: z.string().url().refine((value) => {
    const host = new URL(value).hostname.toLowerCase();
    return officialHostAllowlist.some(
      (allowed) => host === allowed || host.endsWith(allowed),
    );
  }, "Official URL must use an approved official-source domain."),
  officialActionLabel: z.string().min(8),
  scope: z.discriminatedUnion("kind", [
    z.object({ kind: z.literal("national") }),
    z.object({
      kind: z.literal("state"),
      states: z.array(z.enum(indianStates)).min(1),
    }),
  ]),
  deadline: z.string().date().nullable(),
  benefitType: z.enum(benefitTypes),
  eligibilitySummary: z.string().min(20),
  eligibilityTags: z.object({
    states: z.array(z.enum(indianStates)).optional(),
    education: z.array(z.enum(educationLevels)).optional(),
    roles: z.array(z.enum(currentRoles)).optional(),
    interests: z.array(z.enum(categories)).optional(),
    minAge: z.number().int().min(0).max(120).optional(),
    maxAge: z.number().int().min(0).max(120).optional(),
    gender: z.array(z.enum(genders)).optional(),
    incomeRanges: z.array(z.enum(incomeRanges)).optional(),
  }),
  educationRequirements: z.array(z.enum(educationLevels)),
  documents: z.array(z.string().min(3)),
  whatItOffers: z.array(z.string().min(3)),
  whoCanApply: z.array(z.string().min(3)),
  importantConditions: z.array(z.string().min(3)),
  howToApply: z.array(z.string().min(3)),
  lastChecked: z.string().date(),
  verificationStatus: z.enum([
    "officially-reviewed",
    "source-linked",
    "development-sample",
  ]),
  sourceDomain: z.string().min(4),
  expired: z.boolean(),
});

export type OpportunityImport = z.infer<typeof opportunityImportSchema>;

export function validateOfficialUrl(url: string) {
  return opportunityImportSchema.shape.officialUrl.safeParse(url).success;
}
