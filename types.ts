export interface UserProfile {
  name: string;
  age: number;
  location: string;
  notificationsEnabled: boolean;
  isLoggedIn: boolean;
}

// THIS IS THE FIX: We define SchemeType as a real object.
// Any file looking for "SchemeType.EDUCATION" will now find it here.
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

export type SchemeType = typeof SchemeType[keyof typeof SchemeType] | string;

export interface Scheme {
  id: string;
  title: string;
  provider: string;
  type: string;
  description: string;
  eligibility: string[];
  benefits: string[];
  applicationProcess?: string[];
  tags: string[];
  minAge?: number;
  maxAge?: number;
  state?: string;
}

export type ViewState = 'ONBOARDING' | 'DASHBOARD' | 'SCHEME_DETAILS';
