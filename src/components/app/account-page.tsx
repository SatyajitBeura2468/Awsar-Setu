"use client";

import { BellRing, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { AuthPanel } from "@/components/auth/auth-panel";
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
    <div className="settings-page">
      <header className="page-heading">
        <h1>{t("account")}</h1>
        <p>
          Save opportunities, track applications and receive quiet alerts when
          configuration is available. Your profile remains optional.
        </p>
      </header>

      <AuthPanel />

      <section className="settings-section">
        <div className="section-title-row">
          <div>
            <h2>Profile preferences</h2>
            <p>Only add details that improve matching. You can browse without them.</p>
          </div>
          <span className="progress-label">{profileStrength}% complete</span>
        </div>
        <div className="profile-progress" aria-label={`Profile ${profileStrength}% complete`}>
          <span style={{ width: `${profileStrength}%` }} />
        </div>

        <div className="settings-grid">
          <ProfileSelect
            label="State"
            value={profile.state ?? ""}
            onChange={(value) =>
              updateProfile({ state: value ? (value as IndianState) : undefined })
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
              updateProfile({ ageBand: value ? (value as AgeBand) : undefined })
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
                educationLevel: value ? (value as EducationLevel) : undefined,
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

        <div className="interest-group">
          <p>Areas of interest</p>
          <div>
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
      </section>

      <section className="settings-section">
        <div className="section-title-row">
          <div>
            <h2>Notification preferences</h2>
            <p>
              {notificationsConfigured
                ? "Notifications can be enabled after permission and subscription storage succeed."
                : "Notifications are not configured yet. Add VAPID and Supabase credentials before enabling browser alerts."}
            </p>
          </div>
          <BellRing className="h-5 w-5 text-blue" aria-hidden="true" />
        </div>
        <div className="toggle-list">
          <PreferenceToggle
            label="Browser notifications"
            disabled={!notificationsConfigured}
            checked={notificationsConfigured && notificationPreferences.browserEnabled}
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
                updateNotificationPreferences({ categories: { [key]: checked } })
              }
            />
          ))}
        </div>
      </section>

      <section className="settings-section privacy-note">
        <ShieldCheck className="h-5 w-5" aria-hidden="true" />
        <p>
          AwsarSetu does not ask for Aadhaar, exact date of birth, bank details,
          caste certificate details, disability records, detailed medical data
          or sensitive documents.
        </p>
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
    <label className="settings-field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
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
    <label className="preference-toggle">
      <span>
        {label}
        {disabled && <small>Not configured</small>}
      </span>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  );
}
