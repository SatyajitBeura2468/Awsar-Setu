"use client";

import {
  BellRing,
  Check,
  ChevronRight,
  Compass,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useState, type ReactNode } from "react";
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

const steps = ["Profile signals", "Sync across devices", "Quiet alerts", "Review"];

export function AccountPage() {
  const { locale } = useLanguage();
  const {
    profile,
    profileStrength,
    notificationPreferences,
    updateProfile,
    updateNotificationPreferences,
    resetProfile,
  } = useProfile();
  const [step, setStep] = useState(0);
  const env = getPublicEnv();
  const notificationsConfigured = Boolean(env.vapidPublicKey && isSupabaseConfigured());

  const toggleInterest = (category: Category) => {
    updateProfile({
      interests: profile.interests.includes(category)
        ? profile.interests.filter((item) => item !== category)
        : [...profile.interests, category],
    });
  };

  return (
    <div className="v5-account-page">
      <aside className="account-story">
        <h1 aria-label="Account">Your opportunity compass</h1>
        <p>Add only what helps improve your matches.</p>
        <div className="account-story-points">
          <StoryPoint icon={<Compass />} title="Better matches">Signals help rank relevant paths without hiding the rest.</StoryPoint>
          <StoryPoint icon={<ShieldCheck />} title="You are in control">Share a little or a lot. Edit or clear it anytime.</StoryPoint>
          <StoryPoint icon={<LockKeyhole />} title="Privacy first">Your guest data stays on this device and is never sold.</StoryPoint>
        </div>
        <div className="account-privacy-note">
          <ShieldCheck aria-hidden="true" />
          <p>We never ask for Aadhaar, bank details, exact date of birth or sensitive documents.</p>
        </div>
      </aside>

      <main className="account-workspace">
        <nav className="account-stepper" aria-label="Account setup steps">
          {steps.map((label, index) => (
            <button
              key={label}
              type="button"
              onClick={() => setStep(index)}
              className={step === index ? "is-active" : index < step ? "is-complete" : ""}
            >
              <span>{index < step ? <Check aria-hidden="true" /> : index + 1}</span>
              {label}
            </button>
          ))}
        </nav>

        {step === 0 && (
          <section className="account-panel profile-panel">
            <header>
              <div>
                <small>Profile preferences</small>
                <h2>Profile signals</h2>
                <p>These are optional. Add any, or keep browsing without them.</p>
              </div>
              <span className="profile-strength">{profileStrength}% complete</span>
            </header>
            <div className="profile-progress" aria-label={`Profile ${profileStrength}% complete`}><span style={{ width: `${profileStrength}%` }} /></div>

            <div className="account-fields">
              <ProfileSelect label="State" value={profile.state ?? ""} onChange={(value) => updateProfile({ state: value ? value as IndianState : undefined })}>
                <option value="">Select state</option>
                {indianStates.map((state) => <option key={state} value={state}>{state}</option>)}
              </ProfileSelect>
              <ProfileSelect label="Age band" value={profile.ageBand ?? ""} onChange={(value) => updateProfile({ ageBand: value ? value as AgeBand : undefined })}>
                <option value="">Select age band</option>
                {ageBands.map((item) => <option key={item} value={item}>{ageBandLabels[item]}</option>)}
              </ProfileSelect>
              <ProfileSelect label="Education level" value={profile.educationLevel ?? ""} onChange={(value) => updateProfile({ educationLevel: value ? value as EducationLevel : undefined })}>
                <option value="">Select education level</option>
                {educationLevels.map((item) => <option key={item} value={item}>{educationLabels[item][locale]}</option>)}
              </ProfileSelect>
              <ProfileSelect label="Current role" value={profile.currentRole ?? ""} onChange={(value) => updateProfile({ currentRole: value ? value as CurrentRole : undefined })}>
                <option value="">Select current role</option>
                {currentRoles.map((item) => <option key={item} value={item}>{roleLabels[item][locale]}</option>)}
              </ProfileSelect>
            </div>

            <div className="account-interests">
              <p>Areas of interest</p>
              <div>
                {categories.map((category) => (
                  <button key={category} type="button" onClick={() => toggleInterest(category)} className={profile.interests.includes(category) ? "is-selected" : ""}>
                    {profile.interests.includes(category) && <Check aria-hidden="true" />}
                    {categoryLabels[category][locale]}
                  </button>
                ))}
              </div>
            </div>

            <div className="account-panel-actions">
              <button type="button" className="button-primary" onClick={() => setStep(1)}>Use these signals<ChevronRight aria-hidden="true" /></button>
              <button type="button" className="button-secondary" onClick={() => setStep(1)}>Skip for now</button>
            </div>
          </section>
        )}

        {step === 1 && <div className="account-panel"><AuthPanel /><button type="button" className="button-primary account-continue" onClick={() => setStep(2)}>Continue to alerts<ChevronRight aria-hidden="true" /></button></div>}

        {step === 2 && (
          <section className="account-panel alerts-panel">
            <header><div><small>Preferences</small><h2>Quiet alerts</h2><p>Choose only the updates that are genuinely useful.</p></div><BellRing aria-hidden="true" /></header>
            {!notificationsConfigured && <p className="account-config-note">Notifications are not configured yet. Guest preferences remain saved locally until VAPID and Supabase are connected.</p>}
            <div className="toggle-list">
              <PreferenceToggle label="Browser notifications" disabled={!notificationsConfigured} checked={notificationsConfigured && notificationPreferences.browserEnabled} onChange={(checked) => updateNotificationPreferences({ browserEnabled: checked })} />
              <PreferenceToggle label="Email alerts" checked={notificationPreferences.emailEnabled} onChange={(checked) => updateNotificationPreferences({ emailEnabled: checked })} />
              {([[
                "likelyMatch", "Likely matches"],
                ["verifiedVacancy", "Verified vacancies"],
                ["approachingDeadline", "Approaching deadlines"],
                ["savedItemReminder", "Saved reminders"],
              ] as const).map(([key, label]) => (
                <PreferenceToggle key={key} label={label} checked={notificationPreferences.categories[key]} onChange={(checked) => updateNotificationPreferences({ categories: { [key]: checked } })} />
              ))}
            </div>
            <div className="account-panel-actions"><button type="button" className="button-primary" onClick={() => setStep(3)}>Review preferences<ChevronRight aria-hidden="true" /></button></div>
          </section>
        )}

        {step === 3 && (
          <section className="account-panel review-panel">
            <span className="review-icon"><Sparkles aria-hidden="true" /></span>
            <h2>Your compass is ready</h2>
            <p>Keep exploring everything, or use “For you” to rank likely and possible matches from your optional signals.</p>
            <dl>
              <div><dt>State</dt><dd>{profile.state ?? "Not set"}</dd></div>
              <div><dt>Age band</dt><dd>{profile.ageBand ? ageBandLabels[profile.ageBand] : "Not set"}</dd></div>
              <div><dt>Current role</dt><dd>{profile.currentRole ? roleLabels[profile.currentRole][locale] : "Not set"}</dd></div>
              <div><dt>Interests</dt><dd>{profile.interests.length || "None selected"}</dd></div>
            </dl>
            <div className="account-panel-actions">
              <a href="/explore?lens=for-you&sort=best" className="button-primary">Explore for you<ChevronRight aria-hidden="true" /></a>
              <button type="button" className="button-secondary" onClick={() => setStep(0)}>Edit signals</button>
              <button type="button" className="danger-text-action" onClick={resetProfile}>Clear profile</button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function StoryPoint({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return <div><span>{icon}</span><p><strong>{title}</strong>{children}</p></div>;
}

function ProfileSelect({ label, value, onChange, children }: { label: string; value: string; onChange: (value: string) => void; children: ReactNode }) {
  return <label><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{children}</select></label>;
}

function PreferenceToggle({ label, checked, onChange, disabled = false }: { label: string; checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean }) {
  return (
    <label className="preference-toggle">
      <span>{label}{disabled && <small>Not configured</small>}</span>
      <input type="checkbox" checked={checked} disabled={disabled} onChange={(event) => onChange(event.target.checked)} />
    </label>
  );
}
