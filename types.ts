export interface UserProfile {
  name: string;
  age: number;
  location: string; // State name
  notificationsEnabled: boolean;
  isLoggedIn: boolean;
}

export enum SchemeType {
  CENTRAL = 'Central',
  STATE = 'State',
}

export interface Scheme {
  id: string;
  title: string;
  type: SchemeType;
  state?: string; // If type is STATE
  description: string;
  benefits: string[];
  eligibility: string[];
  applicationProcess: string[];
  tags: string[];
  minAge?: number;
  maxAge?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export type ViewState = 'ONBOARDING' | 'DASHBOARD' | 'SCHEME_DETAILS';