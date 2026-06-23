"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  ageBands,
  categories,
  currentRoles,
  educationLevels,
  genders,
  incomeRanges,
  indianStates,
  type Category,
  type IndianState,
  type NotificationPreferences,
  type UserProfile,
} from "@/lib/types";
import { isProfileReadyForMatching } from "@/lib/matching";

const profileStorageKey = "awsarsetu-profile-v3";
const notificationStorageKey = "awsarsetu-notification-preferences-v3";
const profileChangeEvent = "awsarsetu-profile-change";
const notificationChangeEvent = "awsarsetu-notification-preferences-change";

const emptyProfile: UserProfile = { interests: [] };
const defaultNotificationPreferences: NotificationPreferences = {
  browserEnabled: false,
  emailEnabled: false,
  preferredCategories: [],
  alertFrequency: "weekly",
  categories: {
    likelyMatch: true,
    verifiedVacancy: true,
    approachingDeadline: true,
    savedItemReminder: true,
  },
};

let cachedProfileRaw: string | null = null;
let cachedProfile: UserProfile = emptyProfile;
let cachedNotificationRaw: string | null = null;
let cachedNotificationPreferences: NotificationPreferences =
  defaultNotificationPreferences;

interface ProfileContextValue {
  profile: UserProfile;
  notificationPreferences: NotificationPreferences;
  hasProfile: boolean;
  profileReady: boolean;
  profileStrength: number;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setProfileState: (state: IndianState) => void;
  updateNotificationPreferences: (
    updates: Partial<Omit<NotificationPreferences, "categories">> & {
      categories?: Partial<NotificationPreferences["categories"]>;
    },
  ) => void;
  resetProfile: () => void;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

function parseProfile(value: string | null): UserProfile {
  if (!value) return emptyProfile;
  try {
    const parsed = JSON.parse(value) as Partial<UserProfile>;
    const interests = Array.isArray(parsed.interests)
      ? parsed.interests.filter((item): item is Category =>
          isOneOf(item, categories),
        )
      : [];

    return {
      state: isOneOf(parsed.state, indianStates) ? parsed.state : undefined,
      ageBand: isOneOf(parsed.ageBand, ageBands) ? parsed.ageBand : undefined,
      educationLevel: isOneOf(parsed.educationLevel, educationLevels)
        ? parsed.educationLevel
        : undefined,
      currentRole: isOneOf(parsed.currentRole, currentRoles)
        ? parsed.currentRole
        : undefined,
      interests,
      gender: isOneOf(parsed.gender, genders) ? parsed.gender : undefined,
      incomeRange: isOneOf(parsed.incomeRange, incomeRanges)
        ? parsed.incomeRange
        : undefined,
    };
  } catch {
    return emptyProfile;
  }
}

function isOneOf<T extends readonly string[]>(
  value: unknown,
  allowed: T,
): value is T[number] {
  return (
    typeof value === "string" && (allowed as readonly string[]).includes(value)
  );
}

function parseNotificationPreferences(
  value: string | null,
): NotificationPreferences {
  if (!value) return defaultNotificationPreferences;
  try {
    const parsed = JSON.parse(value) as Partial<NotificationPreferences>;
    return {
      ...defaultNotificationPreferences,
      ...parsed,
      preferredCategories: Array.isArray(parsed.preferredCategories)
        ? parsed.preferredCategories
        : [],
      categories: {
        ...defaultNotificationPreferences.categories,
        ...parsed.categories,
      },
    };
  } catch {
    return defaultNotificationPreferences;
  }
}

function getProfileSnapshot() {
  if (typeof window === "undefined") return emptyProfile;
  const rawValue = window.localStorage.getItem(profileStorageKey);
  if (rawValue === cachedProfileRaw) return cachedProfile;
  cachedProfileRaw = rawValue;
  cachedProfile = parseProfile(rawValue);
  return cachedProfile;
}

function getServerProfileSnapshot() {
  return emptyProfile;
}

function getNotificationSnapshot() {
  if (typeof window === "undefined") return defaultNotificationPreferences;
  const rawValue = window.localStorage.getItem(notificationStorageKey);
  if (rawValue === cachedNotificationRaw) return cachedNotificationPreferences;
  cachedNotificationRaw = rawValue;
  cachedNotificationPreferences = parseNotificationPreferences(rawValue);
  return cachedNotificationPreferences;
}

function getServerNotificationSnapshot() {
  return defaultNotificationPreferences;
}

function subscribeKey(eventName: string, storageKey: string) {
  return (callback: () => void) => {
    if (typeof window === "undefined") return () => {};
    const handleStorage = (event: StorageEvent) => {
      if (event.key === storageKey) callback();
    };
    const handleLocalChange = () => callback();
    window.addEventListener("storage", handleStorage);
    window.addEventListener(eventName, handleLocalChange);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(eventName, handleLocalChange);
    };
  };
}

function writeProfile(profile: UserProfile) {
  if (typeof window === "undefined") return;
  cachedProfileRaw = JSON.stringify(profile);
  cachedProfile = profile;
  window.localStorage.setItem(profileStorageKey, cachedProfileRaw);
  window.dispatchEvent(new Event(profileChangeEvent));
}

function writeNotificationPreferences(preferences: NotificationPreferences) {
  if (typeof window === "undefined") return;
  cachedNotificationRaw = JSON.stringify(preferences);
  cachedNotificationPreferences = preferences;
  window.localStorage.setItem(notificationStorageKey, cachedNotificationRaw);
  window.dispatchEvent(new Event(notificationChangeEvent));
}

function getProfileStrength(profile: UserProfile) {
  const checks = [
    Boolean(profile.state),
    Boolean(profile.ageBand && profile.ageBand !== "not-specified"),
    Boolean(profile.educationLevel),
    Boolean(profile.currentRole),
    profile.interests.length > 0,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

async function syncProfileToSupabase(profile: UserProfile) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return;

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return;

  await supabase.from("profiles").upsert({
    user_id: session.user.id,
    state: profile.state ?? null,
    age_band: profile.ageBand ?? null,
    education_level: profile.educationLevel ?? null,
    current_role: profile.currentRole ?? null,
    interests: profile.interests,
    gender: profile.gender ?? null,
    income_range: profile.incomeRange ?? null,
  });
}

async function syncNotificationPreferencesToSupabase(
  preferences: NotificationPreferences,
) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return;

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return;

  await supabase.from("notification_preferences").upsert({
    user_id: session.user.id,
    browser_enabled: preferences.browserEnabled,
    email_enabled: preferences.emailEnabled,
    preferred_categories: preferences.preferredCategories,
    state_preference: preferences.statePreference ?? null,
    alert_frequency: preferences.alertFrequency,
    likely_match_enabled: preferences.categories.likelyMatch,
    verified_vacancy_enabled: preferences.categories.verifiedVacancy,
    approaching_deadline_enabled: preferences.categories.approachingDeadline,
    saved_item_reminder_enabled: preferences.categories.savedItemReminder,
  });
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const profile = useSyncExternalStore(
    subscribeKey(profileChangeEvent, profileStorageKey),
    getProfileSnapshot,
    getServerProfileSnapshot,
  );
  const notificationPreferences = useSyncExternalStore(
    subscribeKey(notificationChangeEvent, notificationStorageKey),
    getNotificationSnapshot,
    getServerNotificationSnapshot,
  );

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    const nextProfile: UserProfile = {
      ...getProfileSnapshot(),
      ...updates,
      interests: updates.interests ?? getProfileSnapshot().interests,
    };
    writeProfile(nextProfile);
    void syncProfileToSupabase(nextProfile);
  }, []);

  const setProfileState = useCallback(
    (state: IndianState) => updateProfile({ state }),
    [updateProfile],
  );

  const updateNotificationPreferences = useCallback(
    (
      updates: Partial<Omit<NotificationPreferences, "categories">> & {
        categories?: Partial<NotificationPreferences["categories"]>;
      },
    ) => {
      const current = getNotificationSnapshot();
      const nextPreferences: NotificationPreferences = {
        ...current,
        ...updates,
        preferredCategories:
          updates.preferredCategories ?? current.preferredCategories,
        categories: {
          ...current.categories,
          ...updates.categories,
        },
      };
      writeNotificationPreferences(nextPreferences);
      void syncNotificationPreferencesToSupabase(nextPreferences);
    },
    [],
  );

  const resetProfile = useCallback(() => {
    writeProfile(emptyProfile);
    void syncProfileToSupabase(emptyProfile);
  }, []);

  const value = useMemo<ProfileContextValue>(
    () => ({
      profile,
      notificationPreferences,
      hasProfile:
        Boolean(profile.state) ||
        Boolean(profile.ageBand) ||
        Boolean(profile.educationLevel) ||
        Boolean(profile.currentRole) ||
        profile.interests.length > 0,
      profileReady: isProfileReadyForMatching(profile),
      profileStrength: getProfileStrength(profile),
      updateProfile,
      setProfileState,
      updateNotificationPreferences,
      resetProfile,
    }),
    [
      notificationPreferences,
      profile,
      resetProfile,
      setProfileState,
      updateNotificationPreferences,
      updateProfile,
    ],
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used inside ProfileProvider.");
  }
  return context;
}

export function defaultInterests(): Category[] {
  return categories.slice(0, 2);
}
