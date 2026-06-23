"use client";

import { BellRing, ShieldCheck, UserRoundCog } from "lucide-react";
import type { ReactNode } from "react";
import { AuthPanel } from "@/components/auth/auth-panel";
import { ProfilePulse } from "@/components/experience/experience-primitives";
import { useLanguage } from "@/contexts/language-context";
import { useProfile } from "@/contexts/profile-context";
import { categoryLabels, educationLabels, roleLabels } from "@/lib/i18n";
import { getPublicEnv, isSupabaseConfigured } from "@/lib/env";
import {
  ageBands,
  categories,
  currentRoles,
  educationLevels,
  indianStates,
  type AgeBand,
  type Category,
  type CurrentRole,
  type EducationLevel,
  type IndianState,
} from "@/lib/types";

const ageBandLabels: Record<AgeBand, string> = {
  "under-18": "Under 18",
  "18-24": "18-24",
  "25-34": "25-34",
  "35-44": "35-44",
  "45-59": "45-59",
  "60-plus": "60+",
  "not-specified": "Prefer not to say",
};

export function AccountPage() {
  const { locale, t } = useLanguage();
  const {
    profile,
    profileStrength,
    notificationPreferences,
    updateProfile,
    updateNotificationPreferences,
  } = useProfile();
  const env = getPublicEnv();
  const notificationsConfigured = Boolean(
    env.vapidPublicKey && isSupabaseConfigured(),
  );

  const toggleInterest = (category: Category) => {
    updateProfile({
      interests: profile.interests.includes(category)
        ? profile.interests.filter((item) => item !== category)
        : [...profile.interests, category],
    });
  };

  return (
    <div className="space-y-8">
      <section className="account-hero">
        <div>
          <p>{t("account")}</p>
          <h1>{t("accountBenefit")}</h1>
          <span>
            Your profile is optional, local-first for guests, and used only to
            make match labels less generic.
          </span>
        </div>
        <ProfilePulse strength={profileStrength} label="Profile strength" />
      </section>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <AuthPanel />

        <section className="compass-panel">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-mint to-white text-teal-dark shadow-soft">
              <UserRoundCog className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <h2>Opportunity Compass</h2>
              <p>
                Add only what improves matching: state, age band, education,
                role and interests. Optional fields stay optional.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <ProfileSelect
              label="State"
              value={profile.state ?? ""}
              onChange={(value) =>
                updateProfile({
                  state: value ? (value as IndianState) : undefined,
                })
              }
            >
              <option value="">Choose state</option>
              {indianStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </ProfileSelect>
            <ProfileSelect
              label="Age band"
              value={profile.ageBand ?? ""}
              onChange={(value) =>
                updateProfile({
                  ageBand: value ? (value as AgeBand) : undefined,
                })
              }
            >
              <option value="">Choose age band</option>
              {ageBands.map((ageBand) => (
                <option key={ageBand} value={ageBand}>
                  {ageBandLabels[ageBand]}
                </option>
              ))}
            </ProfileSelect>
            <ProfileSelect
              label="Education level"
              value={profile.educationLevel ?? ""}
              onChange={(value) =>
                updateProfile({
                  educationLevel: value
                    ? (value as EducationLevel)
                    : undefined,
                })
              }
            >
              <option value="">Choose education</option>
              {educationLevels.map((level) => (
                <option key={level} value={level}>
                  {educationLabels[level][locale]}
                </option>
              ))}
            </ProfileSelect>
            <ProfileSelect
              label="Current role"
              value={profile.currentRole ?? ""}
              onChange={(value) =>
                updateProfile({
                  currentRole: value ? (value as CurrentRole) : undefined,
                })
              }
            >
              <option value="">Choose role</option>
              {currentRoles.map((role) => (
                <option key={role} value={role}>
                  {roleLabels[role][locale]}
                </option>
              ))}
            </ProfileSelect>
          </div>

          <div className="mt-5">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-slate">
              Areas of interest
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleInterest(category)}
                  className={
                    profile.interests.includes(category)
                      ? "profile-chip is-selected"
                      : "profile-chip"
                  }
                >
                  {categoryLabels[category][locale]}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-teal/20 bg-mint/60 p-4 text-sm leading-6 text-ink">
            <ShieldCheck className="mb-2 h-5 w-5 text-teal" aria-hidden="true" />
            AwsarSetu does not ask for Aadhaar, exact date of birth, bank
            details, caste certificate details, disability records, detailed
            medical data or sensitive documents.
          </div>
        </section>
      </div>

      <section className="compass-panel">
        <div className="flex items-start gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-saffron/30 to-white text-coral shadow-soft">
            <BellRing className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <h2>Notification preferences</h2>
            <p>
              {notificationsConfigured
                ? "Notifications can be enabled after permission and subscription storage succeed."
                : "Notifications are not configured yet. Add VAPID and Supabase credentials before enabling browser alerts."}
            </p>
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <PreferenceToggle
            label="Browser notifications"
            disabled={!notificationsConfigured}
            checked={
              notificationsConfigured && notificationPreferences.browserEnabled
            }
            onChange={(checked) =>
              updateNotificationPreferences({ browserEnabled: checked })
            }
          />
          <PreferenceToggle
            label="Email alerts"
            checked={notificationPreferences.emailEnabled}
            onChange={(checked) =>
              updateNotificationPreferences({ emailEnabled: checked })
            }
          />
          {[
            ["likelyMatch", "Likely match"],
            ["verifiedVacancy", "Verified vacancy"],
            ["approachingDeadline", "Approaching deadline"],
            ["savedItemReminder", "Saved-item reminder"],
          ].map(([key, label]) => (
            <PreferenceToggle
              key={key}
              label={label}
              checked={
                notificationPreferences.categories[
                  key as keyof typeof notificationPreferences.categories
                ]
              }
              onChange={(checked) =>
                updateNotificationPreferences({
                  categories: { [key]: checked },
                })
              }
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function ProfileSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-black uppercase tracking-[0.15em] text-slate">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-2xl border border-white/80 bg-white/78 px-4 py-3 text-sm font-bold text-ink shadow-soft outline-none transition focus:border-teal focus:bg-white"
      >
        {children}
      </select>
    </label>
  );
}

function PreferenceToggle({
  label,
  checked,
  onChange,
  disabled = false,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label className="dock-item flex items-center justify-between gap-4 rounded-2xl border border-white/80 bg-white/72 p-4 text-sm font-bold text-ink shadow-soft transition hover:-translate-y-0.5">
      <span>
        {label}
        {disabled && <small> Not configured</small>}
      </span>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 accent-teal disabled:opacity-40"
      />
    </label>
  );
}
