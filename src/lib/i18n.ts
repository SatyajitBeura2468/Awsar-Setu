import type {
  BenefitType,
  Category,
  CurrentRole,
  EducationLevel,
} from "./types";

export type Locale = "en" | "hi";

export const defaultLocale: Locale = "en";

export const categoryLabels: Record<Category, Record<Locale, string>> = {
  "education-scholarships": {
    en: "Education and Scholarships",
    hi: "शिक्षा और छात्रवृत्ति",
  },
  "government-jobs-vacancies": {
    en: "Government Jobs and Vacancies",
    hi: "सरकारी नौकरियां और रिक्तियां",
  },
  "jobs-internships-apprenticeships": {
    en: "Jobs, Internships and Apprenticeships",
    hi: "नौकरियां, इंटर्नशिप और अप्रेंटिसशिप",
  },
  "skills-training": {
    en: "Skills and Training",
    hi: "कौशल और प्रशिक्षण",
  },
  "schemes-financial-support": {
    en: "Government Schemes and Financial Support",
    hi: "सरकारी योजनाएं और वित्तीय सहायता",
  },
  "agriculture-rural-livelihood": {
    en: "Agriculture and Rural Livelihood",
    hi: "कृषि और ग्रामीण आजीविका",
  },
  "health-welfare-social-support": {
    en: "Health, Welfare and Social Support",
    hi: "स्वास्थ्य, कल्याण और सामाजिक सहायता",
  },
};

export const benefitLabels: Record<BenefitType, Record<Locale, string>> = {
  "financial-support": { en: "Financial Support", hi: "वित्तीय सहायता" },
  job: { en: "Job", hi: "नौकरी" },
  training: { en: "Training", hi: "प्रशिक्षण" },
  certificate: { en: "Certificate", hi: "प्रमाणपत्र" },
  service: { en: "Service", hi: "सेवा" },
};

export const roleLabels: Record<CurrentRole, Record<Locale, string>> = {
  student: { en: "Student", hi: "विद्यार्थी" },
  "job-seeker": { en: "Job Seeker", hi: "नौकरी खोज रहे हैं" },
  employed: { en: "Employed", hi: "रोजगार में" },
  farmer: { en: "Farmer", hi: "किसान" },
  entrepreneur: { en: "Entrepreneur", hi: "उद्यमी" },
  homemaker: { en: "Homemaker", hi: "गृहिणी/गृहकर्ता" },
  "senior-citizen": { en: "Senior Citizen", hi: "वरिष्ठ नागरिक" },
  "person-with-disability": {
    en: "Person with Disability",
    hi: "दिव्यांगजन",
  },
};

export const educationLabels: Record<EducationLevel, Record<Locale, string>> = {
  school: { en: "School", hi: "स्कूल" },
  "class-10": { en: "Class 10", hi: "कक्षा 10" },
  "class-12": { en: "Class 12", hi: "कक्षा 12" },
  diploma: { en: "Diploma", hi: "डिप्लोमा" },
  graduate: { en: "Graduate", hi: "स्नातक" },
  postgraduate: { en: "Postgraduate", hi: "स्नातकोत्तर" },
  phd: { en: "PhD", hi: "पीएचडी" },
  vocational: { en: "Vocational", hi: "व्यावसायिक" },
  "not-specified": { en: "Not specified", hi: "निर्दिष्ट नहीं" },
};

export const copy = {
  en: {
    appName: "AwsarSetu",
    promise: "Find opportunities made for your next step.",
    support:
      "Scholarships, jobs, vacancies, schemes, training and support, all in one clear place.",
    searchPlaceholder: "Search scholarships, jobs, schemes, vacancies...",
    home: "Home",
    explore: "Explore",
    vacancies: "Vacancies",
    saved: "Saved",
    account: "Account",
    matchesForYou: "Matches for You",
    matchesGuest:
      "Set a lightweight profile when you want sharper matches. Discovery, search and official links stay open either way.",
    governmentJobs: "Government Jobs and Vacancies",
    closingSoon: "Closing Soon",
    exploreByNeed: "Explore by Need",
    newNoteworthy: "New and Noteworthy",
    helpfulGuides: "Helpful Guides",
    officialSource: "Official source",
    continueOfficial: "Continue to Official Portal",
    opensOfficial: "Opens the official source.",
    save: "Save",
    savedLabel: "Saved",
    addTracker: "Add to tracker",
    share: "Share",
    likely: "Likely Match",
    possible: "Possible Match",
    check: "Check Criteria",
    likelyHint:
      "Likely a match based on your profile. Please verify the official eligibility criteria before applying.",
    browseFirst: "Open discovery, account tools when useful",
    accountBenefit:
      "Save opportunities, track applications and receive alerts for openings that may fit you.",
    signIn: "Sign in",
    signOut: "Sign out",
    email: "Email",
    password: "Password",
    phone: "Phone number",
    continueGoogle: "Continue with Google",
    developmentNotice:
      "Authentication is ready, but this environment is missing provider credentials.",
    noGuarantee:
      "Match labels are guidance only. Final eligibility, selection and approval always rest with the official source.",
  },
  hi: {
    appName: "AwsarSetu",
    promise: "अपने अगले कदम के लिए बने अवसर खोजें।",
    support:
      "छात्रवृत्ति, नौकरियां, रिक्तियां, योजनाएं, प्रशिक्षण और सहायता, सब कुछ एक साफ जगह पर।",
    searchPlaceholder: "छात्रवृत्ति, नौकरी, योजना, रिक्तियां खोजें...",
    home: "होम",
    explore: "खोजें",
    vacancies: "रिक्तियां",
    saved: "सहेजे",
    account: "खाता",
    matchesForYou: "आपके लिए मिलान",
    matchesGuest:
      "राज्य, आयु, शिक्षा और रुचियां बताकर बेहतर मिलान देखें। बिना साइन-इन ब्राउज करना हमेशा खुला है।",
    governmentJobs: "सरकारी नौकरियां और रिक्तियां",
    closingSoon: "जल्द समाप्त",
    exploreByNeed: "जरूरत के अनुसार खोजें",
    newNoteworthy: "नया और महत्वपूर्ण",
    helpfulGuides: "सहायक गाइड",
    officialSource: "आधिकारिक स्रोत",
    continueOfficial: "आधिकारिक पोर्टल पर जाएं",
    opensOfficial: "आधिकारिक स्रोत खुलता है।",
    save: "सहेजें",
    savedLabel: "सहेजा गया",
    addTracker: "ट्रैकर में जोड़ें",
    share: "साझा करें",
    likely: "संभावित मिलान",
    possible: "संभव मिलान",
    check: "मानदंड जांचें",
    likelyHint:
      "आपकी प्रोफाइल के आधार पर यह संभावित मिलान है। आवेदन से पहले आधिकारिक पात्रता मानदंड अवश्य जांचें।",
    browseFirst: "पहले ब्राउज करें, साइन-इन वैकल्पिक",
    accountBenefit:
      "अवसर सहेजें, आवेदन ट्रैक करें और आपके लिए उपयुक्त खुली रिक्तियों की सूचनाएं पाएं।",
    signIn: "साइन इन",
    signOut: "साइन आउट",
    email: "ईमेल",
    password: "पासवर्ड",
    phone: "फोन नंबर",
    continueGoogle: "Google से जारी रखें",
    developmentNotice:
      "प्रमाणीकरण तैयार है, लेकिन इस वातावरण में प्रदाता क्रेडेंशियल नहीं हैं।",
    noGuarantee:
      "AwsarSetu संभावनाएं समझने में मदद करता है। यह पात्रता, चयन, लाभ स्वीकृति या नियुक्ति की गारंटी नहीं देता।",
  },
} satisfies Record<Locale, Record<string, string>>;
