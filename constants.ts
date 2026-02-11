import { Scheme } from './types';

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
  "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh"
];

export const MOCK_SCHEMES: Scheme[] = [
  {
    id: "mock-1",
    title: "Pradhan Mantri Awas Yojana",
    provider: "Central Govt",
    type: "Housing",
    description: "Affordable housing scheme for the urban poor.",
    eligibility: ["Annual income < 3 Lakhs", "No pucca house"],
    benefits: ["Subsidy on home loan interest", "Financial assistance"],
    tags: ["Housing", "Central"],
    minAge: 18
  },
  {
    id: "mock-2",
    title: "Kalia Scholarship",
    provider: "Odisha Govt",
    type: "Education",
    description: "Scholarship for children of Kalia beneficiaries.",
    eligibility: ["Resident of Odisha", "Child of Kalia beneficiary"],
    benefits: ["Full tuition fee waiver", "Hostel charges covered"],
    tags: ["Education", "Scholarship", "Odisha"],
    minAge: 16,
    state: "Odisha"
  }
];
