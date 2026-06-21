import type { Category, Opportunity } from "./types";

export const opportunities: Opportunity[] = [
  {
    id: "nsp-scholarship-portal",
    title: "National Scholarship Portal opportunities",
    slug: "national-scholarship-portal-opportunities",
    category: "education-scholarships",
    description:
      "A discovery record for scholarship opportunities listed through the National Scholarship Portal. Production imports must attach specific scheme notices and dates after official review.",
    visualCover: "education",
    organisation: "National Scholarship Portal",
    officialUrl: "https://scholarships.gov.in/",
    officialActionLabel: "Continue to Official Portal",
    scope: { kind: "national" },
    deadline: null,
    benefitType: "financial-support",
    eligibilitySummary:
      "Scholarship criteria vary by scheme, education stage, income rules and community-specific conditions. Verify each official scheme page before applying.",
    eligibilityTags: {
      education: ["school", "class-10", "class-12", "graduate"],
      roles: ["student"],
      interests: ["education-scholarships"],
    },
    educationRequirements: ["school"],
    ageBounds: { min: 10 },
    currentRoleRelevance: ["student"],
    documents: [
      "Recent academic marksheet",
      "Institution details",
      "Income certificate where required",
      "Bank details may be requested only on the official portal",
    ],
    whatItOffers: [
      "Scholarship discovery through an official national portal",
      "Scheme-wise application instructions",
      "Status tracking where supported by the portal",
    ],
    whoCanApply: [
      "Students who match a listed scholarship scheme",
      "Applicants with documents requested by the selected scheme",
    ],
    importantConditions: [
      "This starter record is not a verified scheme notice.",
      "Deadlines and eligibility must come from the specific official scheme page.",
    ],
    howToApply: [
      "Open the official portal.",
      "Search for the relevant scholarship scheme.",
      "Read eligibility, documents and deadline before registering.",
    ],
    lastChecked: "2026-06-22",
    verificationStatus: "development-sample",
    sourceDomain: "scholarships.gov.in",
    createdAt: "2026-06-22",
    updatedAt: "2026-06-22",
    expired: false,
  },
  {
    id: "opsc-vacancy-portal",
    title: "Odisha Public Service Commission recruitment notices",
    slug: "odisha-public-service-commission-recruitment-notices",
    category: "government-jobs-vacancies",
    description:
      "A state-specific vacancy discovery record for OPSC recruitment notices. Production data should import each notice with post, qualification, age, deadline and official PDF link.",
    visualCover: "government-jobs",
    organisation: "Odisha Public Service Commission",
    officialUrl: "https://www.opsc.gov.in/",
    officialActionLabel: "View Official Notice",
    scope: { kind: "state", states: ["Odisha"] },
    deadline: "2026-07-31",
    benefitType: "job",
    eligibilitySummary:
      "Eligibility depends on the individual recruitment notice, qualification, age rules and category relaxations. Check the official notice before applying.",
    eligibilityTags: {
      states: ["Odisha"],
      education: ["graduate", "postgraduate"],
      roles: ["job-seeker"],
      interests: ["government-jobs-vacancies"],
      minAge: 18,
      maxAge: 38,
    },
    educationRequirements: ["graduate"],
    ageBounds: { min: 18, max: 38 },
    currentRoleRelevance: ["job-seeker"],
    documents: [
      "Educational certificates",
      "Photograph and signature",
      "Identity proof requested by the official notice",
      "Category documents only if the official notice requires them",
    ],
    whatItOffers: [
      "State public-service recruitment notices",
      "Post-wise eligibility and exam details",
      "Official application links when notices are active",
    ],
    whoCanApply: [
      "Candidates who meet the post-specific qualification",
      "Applicants who satisfy age and residency rules listed in the notice",
    ],
    importantConditions: [
      "This starter record is a sample vacancy structure, not a current appointment notice.",
      "Age relaxation and reservation rules must be verified on the official notice.",
    ],
    howToApply: [
      "Open the official source.",
      "Find the recruitment advertisement number.",
      "Read the complete notice before registration.",
      "Apply only through the official application link.",
    ],
    lastChecked: "2026-06-22",
    verificationStatus: "development-sample",
    sourceDomain: "opsc.gov.in",
    createdAt: "2026-06-22",
    updatedAt: "2026-06-22",
    expired: false,
    vacancyType: "government",
    requiredQualification: "Graduation or post-specific qualification",
    ageRequirementText: "Usually notice-specific; sample range 18-38",
  },
  {
    id: "apprenticeship-india",
    title: "Apprenticeship India openings",
    slug: "apprenticeship-india-openings",
    category: "jobs-internships-apprenticeships",
    description:
      "A national apprenticeship discovery record for candidates exploring employer-led apprenticeship openings on the official portal.",
    visualCover: "internship",
    organisation: "Apprenticeship India",
    officialUrl: "https://www.apprenticeshipindia.gov.in/",
    officialActionLabel: "Begin Registration",
    scope: { kind: "national" },
    deadline: null,
    benefitType: "training",
    eligibilitySummary:
      "Openings vary by employer, trade, location, age and qualification. Verify each listing on the official portal.",
    eligibilityTags: {
      education: ["class-10", "class-12", "diploma", "graduate"],
      roles: ["student", "job-seeker"],
      interests: ["jobs-internships-apprenticeships", "skills-training"],
      minAge: 14,
    },
    educationRequirements: ["class-10"],
    ageBounds: { min: 14 },
    currentRoleRelevance: ["student", "job-seeker"],
    documents: [
      "Education proof",
      "Trade or skill certificate where required",
      "Photograph",
      "Identity proof requested by the official portal",
    ],
    whatItOffers: [
      "Apprenticeship listing discovery",
      "Employer and trade information",
      "Training-linked career pathway",
    ],
    whoCanApply: [
      "Candidates who match the specific apprenticeship listing",
      "Applicants who can complete the official registration requirements",
    ],
    importantConditions: [
      "Stipend, duration and eligibility vary by employer.",
      "Apply only through the official portal or employer link shown there.",
    ],
    howToApply: [
      "Open the official portal.",
      "Create or sign in to your candidate account.",
      "Search by trade, state and qualification.",
      "Verify employer details before applying.",
    ],
    lastChecked: "2026-06-22",
    verificationStatus: "development-sample",
    sourceDomain: "apprenticeshipindia.gov.in",
    createdAt: "2026-06-22",
    updatedAt: "2026-06-22",
    expired: false,
    vacancyType: "apprenticeship",
    requiredQualification: "Class 10, Class 12, ITI, diploma or listing-specific",
    ageRequirementText: "Listing-specific",
  },
  {
    id: "skill-india-digital-hub",
    title: "Skill India Digital learning and certification",
    slug: "skill-india-digital-learning-certification",
    category: "skills-training",
    description:
      "A training discovery record for skill courses, digital learning and certification pathways available through Skill India Digital Hub.",
    visualCover: "training",
    organisation: "Skill India Digital Hub",
    officialUrl: "https://www.skillindiadigital.gov.in/",
    officialActionLabel: "Check Official Details",
    scope: { kind: "national" },
    deadline: null,
    benefitType: "certificate",
    eligibilitySummary:
      "Course eligibility, fees, certification rules and availability vary. Verify details on the official portal before enrolling.",
    eligibilityTags: {
      education: ["school", "class-10", "class-12", "diploma", "graduate"],
      roles: ["student", "job-seeker", "employed", "entrepreneur"],
      interests: ["skills-training"],
    },
    educationRequirements: ["not-specified"],
    currentRoleRelevance: ["student", "job-seeker", "employed", "entrepreneur"],
    documents: [
      "Mobile number or email",
      "Education details where requested",
      "Identity proof only if requested by the official portal",
    ],
    whatItOffers: [
      "Skill discovery",
      "Training programmes",
      "Certification pathways where available",
    ],
    whoCanApply: [
      "Learners matching course-specific requirements",
      "People looking to improve job or self-employment skills",
    ],
    importantConditions: [
      "Course availability may change.",
      "Read fees, duration and certificate terms on the official portal.",
    ],
    howToApply: [
      "Open the official portal.",
      "Search for a course or pathway.",
      "Review provider, fee, duration and certificate details.",
    ],
    lastChecked: "2026-06-22",
    verificationStatus: "development-sample",
    sourceDomain: "skillindiadigital.gov.in",
    createdAt: "2026-06-22",
    updatedAt: "2026-06-22",
    expired: false,
  },
  {
    id: "pm-kisan-portal",
    title: "PM-KISAN farmer support information",
    slug: "pm-kisan-farmer-support-information",
    category: "agriculture-rural-livelihood",
    description:
      "A national agriculture-support discovery record pointing citizens to the official PM-KISAN portal for verified beneficiary and registration information.",
    visualCover: "agriculture",
    organisation: "PM-KISAN",
    officialUrl: "https://pmkisan.gov.in/",
    officialActionLabel: "Check Official Details",
    scope: { kind: "national" },
    deadline: null,
    benefitType: "financial-support",
    eligibilitySummary:
      "Eligibility and exclusion rules must be verified on the official PM-KISAN portal and through authorised local processes.",
    eligibilityTags: {
      roles: ["farmer"],
      interests: ["agriculture-rural-livelihood", "schemes-financial-support"],
    },
    educationRequirements: ["not-specified"],
    currentRoleRelevance: ["farmer"],
    documents: [
      "Land or farmer registration details where officially required",
      "Identity and bank details only through official channels",
      "State-specific supporting documents if requested",
    ],
    whatItOffers: [
      "Official programme information",
      "Beneficiary status tools where available",
      "Registration and correction guidance",
    ],
    whoCanApply: [
      "Farmers who satisfy official programme rules",
      "Applicants whose state process supports registration or update",
    ],
    importantConditions: [
      "Never share bank details or identity documents outside official channels.",
      "Eligibility exclusions and land rules must be checked officially.",
    ],
    howToApply: [
      "Open the official portal.",
      "Read farmer corner guidance.",
      "Use only official registration or status tools.",
    ],
    lastChecked: "2026-06-22",
    verificationStatus: "development-sample",
    sourceDomain: "pmkisan.gov.in",
    createdAt: "2026-06-22",
    updatedAt: "2026-06-22",
    expired: false,
  },
  {
    id: "health-welfare-services",
    title: "Health and welfare support discovery",
    slug: "health-welfare-support-discovery",
    category: "health-welfare-social-support",
    description:
      "A sample structure for health, disability, senior-citizen, women and social-support opportunities. Production records must link to specific official scheme pages.",
    visualCover: "welfare",
    organisation: "Official national or state welfare authority",
    officialUrl: "https://services.india.gov.in/",
    officialActionLabel: "Check Official Details",
    scope: { kind: "national" },
    deadline: null,
    benefitType: "service",
    eligibilitySummary:
      "Eligibility varies by programme, location, age, family income and documents. Verify the specific official service before acting.",
    eligibilityTags: {
      roles: ["senior-citizen", "person-with-disability", "homemaker"],
      interests: ["health-welfare-social-support"],
      minAge: 18,
    },
    educationRequirements: ["not-specified"],
    ageBounds: { min: 18 },
    currentRoleRelevance: [
      "senior-citizen",
      "person-with-disability",
      "homemaker",
    ],
    documents: [
      "Residence proof where requested",
      "Age proof where requested",
      "Official certificate only if the scheme requires it",
      "Income proof only if relevant",
    ],
    whatItOffers: [
      "Directory-style official service discovery",
      "Links to citizen services",
      "State and national service pathways",
    ],
    whoCanApply: [
      "Citizens who match a specific official welfare service",
      "Applicants with documents requested by the official service",
    ],
    importantConditions: [
      "This is a development sample, not a verified benefit page.",
      "Never upload sensitive medical or disability documents to unofficial websites.",
    ],
    howToApply: [
      "Open the official service directory.",
      "Search by need, state and department.",
      "Continue only through the official service link.",
    ],
    lastChecked: "2026-06-22",
    verificationStatus: "development-sample",
    sourceDomain: "services.india.gov.in",
    createdAt: "2026-06-22",
    updatedAt: "2026-06-22",
    expired: false,
  },
];

export const guides = [
  {
    slug: "how-to-apply-safely",
    title: "How to apply safely",
    summary:
      "A practical checklist for using official portals and avoiding risky shortcuts.",
    body: [
      "Start from the official source button on AwsarSetu or a known government, university or public-sector domain.",
      "Check the organisation name, last date, application fee, eligibility criteria and documents before registering.",
      "Do not pay anyone who promises guaranteed selection, faster approval or a reserved benefit.",
      "Keep screenshots or PDFs of submitted forms and acknowledgement numbers.",
    ],
  },
  {
    slug: "common-documents-you-may-need",
    title: "Common documents you may need",
    summary:
      "A non-intrusive document checklist for scholarships, jobs, training and schemes.",
    body: [
      "Most opportunities may ask for education certificates, photographs, signatures, contact details and address proof.",
      "Some financial-support schemes may request income information, but share it only through official channels.",
      "AwsarSetu does not ask for Aadhaar number, bank details, caste certificate details, disability records or medical data.",
      "Always read the official notice because document requirements differ by opportunity.",
    ],
  },
  {
    slug: "identify-official-sources",
    title: "How to identify official sources",
    summary:
      "Simple ways to recognise official portals, notices and safe external links.",
    body: [
      "Look for official department, university, public-sector or recognised portal domains.",
      "Treat shortened links, forwarded PDFs and social posts as leads, not proof.",
      "A genuine official-source page should clearly name the authority, notice date, application process and contact route.",
      "AwsarSetu shows the source domain and last checked date so content teams can audit records.",
    ],
  },
  {
    slug: "avoid-fraud-misleading-links",
    title: "Avoiding fraud and misleading links",
    summary:
      "Warning signs before you share documents, pay fees or click application links.",
    body: [
      "Be careful with sites that copy official names but use unrelated domains.",
      "Do not share OTPs, full identity numbers, bank passwords or sensitive records in chat apps.",
      "Never trust guaranteed eligibility or guaranteed job claims.",
      "When unsure, search for the recruiting authority or department website independently.",
    ],
  },
];

export function getOpportunityBySlug(slug: string) {
  return opportunities.find((opportunity) => opportunity.slug === slug);
}

export function getGuideBySlug(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}

export function getOpportunitiesByCategory(category: Category) {
  return opportunities.filter((opportunity) => opportunity.category === category);
}

export function getVacancies() {
  return opportunities.filter(
    (opportunity) =>
      opportunity.category === "government-jobs-vacancies" ||
      opportunity.vacancyType !== undefined,
  );
}
