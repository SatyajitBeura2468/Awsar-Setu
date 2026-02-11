// --- types.ts (The Crash Fixer) ---

export interface UserProfile {
  name: string;
  age: number;
  location: string;
  notificationsEnabled: boolean;
  isLoggedIn: boolean;
}

// 1. We define SchemeType as a REAL OBJECT so it never says "undefined"
export const SchemeType = {
  CENTRAL: 'Central',
  STATE: 'State',
  EDUCATION: 'Education',
  HEALTH: 'Health',
  BUSINESS: 'Business',
  FARMERS: 'Farmers',
  WOMEN: 'Women',
  SC_ST: 'SC/ST',
  OTHER: 'Other'
} as const;

// 2. We also export it as a Type for TypeScript
export type SchemeType = typeof SchemeType[keyof typeof SchemeType] | string;

export interface Scheme {
  id: string;
  title: string;
  provider: string; // "Central Govt" or "Odisha Govt"
  type: string;     // Just a simple string now
  description: string;
  eligibility: string[];
  benefits: string[];
  applicationProcess?: string[]; // Optional
  tags: string[];
  minAge?: number;
  maxAge?: number;
  state?: string;
}

export type ViewState = 'ONBOARDING' | 'DASHBOARD' | 'SCHEME_DETAILS';
