export const categories = [
  "education-scholarships",
  "government-jobs-vacancies",
  "jobs-internships-apprenticeships",
  "skills-training",
  "schemes-financial-support",
  "agriculture-rural-livelihood",
  "health-welfare-social-support",
] as const;

export type Category = (typeof categories)[number];

export const benefitTypes = [
  "financial-support",
  "job",
  "training",
  "certificate",
  "service",
] as const;

export type BenefitType = (typeof benefitTypes)[number];

export const educationLevels = [
  "school",
  "class-10",
  "class-12",
  "diploma",
  "graduate",
  "postgraduate",
  "phd",
  "vocational",
  "not-specified",
] as const;

export type EducationLevel = (typeof educationLevels)[number];

export const currentRoles = [
  "student",
  "job-seeker",
  "employed",
  "farmer",
  "entrepreneur",
  "homemaker",
  "senior-citizen",
  "person-with-disability",
] as const;

export type CurrentRole = (typeof currentRoles)[number];

export const genders = ["female", "male", "other", "not-specified"] as const;

export type Gender = (typeof genders)[number];

export const incomeRanges = [
  "not-specified",
  "below-1-lakh",
  "1-3-lakh",
  "3-6-lakh",
  "6-12-lakh",
  "above-12-lakh",
] as const;

export type IncomeRange = (typeof incomeRanges)[number];

export const indianStates = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
] as const;

export type IndianState = (typeof indianStates)[number];

export type OpportunityScope =
  | { kind: "national" }
  | { kind: "state"; states: IndianState[] };

export type VerificationStatus =
  | "officially-reviewed"
  | "source-linked"
  | "development-sample";

export type MatchLevel = "likely" | "possible" | "check";

export type ApplicationStatus = "saved" | "preparing" | "applied" | "archived";

export type VisualCover =
  | "education"
  | "government-jobs"
  | "internship"
  | "training"
  | "agriculture"
  | "welfare"
  | "health"
  | "finance";

export interface EligibilityTags {
  states?: IndianState[];
  education?: EducationLevel[];
  roles?: CurrentRole[];
  interests?: Category[];
  minAge?: number;
  maxAge?: number;
  gender?: Gender[];
  incomeRanges?: IncomeRange[];
}

export interface Opportunity {
  id: string;
  title: string;
  slug: string;
  category: Category;
  description: string;
  visualCover: VisualCover;
  organisation: string;
  officialUrl: string;
  officialActionLabel: string;
  scope: OpportunityScope;
  deadline: string | null;
  benefitType: BenefitType;
  eligibilitySummary: string;
  eligibilityTags: EligibilityTags;
  educationRequirements: EducationLevel[];
  ageBounds?: {
    min?: number;
    max?: number;
  };
  genderRelevance?: Gender[];
  incomeRelevance?: IncomeRange[];
  currentRoleRelevance?: CurrentRole[];
  documents: string[];
  whatItOffers: string[];
  whoCanApply: string[];
  importantConditions: string[];
  howToApply: string[];
  lastChecked: string;
  verificationStatus: VerificationStatus;
  sourceDomain: string;
  createdAt: string;
  updatedAt: string;
  expired: boolean;
  vacancyType?:
    | "government"
    | "university-education"
    | "apprenticeship"
    | "internship"
    | "contractual-local";
  requiredQualification?: string;
  ageRequirementText?: string;
}

export interface UserProfile {
  state?: IndianState;
  age?: number;
  educationLevel?: EducationLevel;
  currentRole?: CurrentRole;
  interests: Category[];
  gender?: Gender;
  incomeRange?: IncomeRange;
}

export interface SavedOpportunity {
  opportunityId: string;
  status: ApplicationStatus;
  notes: string;
  reminderDate?: string;
  savedAt: string;
}
