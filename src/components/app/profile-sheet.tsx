"use client";

import { Compass, X } from "lucide-react";
import type { ReactNode } from "react";
import { useProfile } from "@/contexts/profile-context";
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
import { categoryLabels, educationLabels, roleLabels } from "@/lib/i18n";
import { useLanguage } from "@/contexts/language-context";
import { ProfilePulse } from "@/components/experience/experience-primitives";

const ageBandLabels: Record<AgeBand, string> = {
  "under-18": "Under 18",
  "18-24": "18-24",
  "25-34": "25-34",
  "35-44": "35-44",
  "45-59": "45-59",
  "60-plus": "60+",
  "not-specified": "Prefer not to say",
};

export function ProfileSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { locale } = useLanguage();
  const { profile, profileStrength, updateProfile } = useProfile();

  if (!open) return null;

  const toggleInterest = (category: Category) => {
    const interests = profile.interests.includes(category)
      ? profile.interests.filter((item) => item !== category)
      : [...profile.interests, category];
    updateProfile({ interests });
  };

  return (
    <div
      className="profile-sheet-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-sheet-title"
    >
      <section className="profile-sheet">
        <button
          type="button"
          onClick={onClose}
          className="profile-sheet-close"
          aria-label="Close profile setup"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
        <div className="flex items-start gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-mint text-teal-dark">
            <Compass className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-teal">
              Opportunity compass
            </p>
            <h2 id="profile-sheet-title">
              Add a few signals for safer personal matches.
            </h2>
            <p>
              These details stay lightweight: no Aadhaar, exact date of birth,
              bank details or sensitive documents.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_12rem]">
          <div className="grid gap-4 sm:grid-cols-2">
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
          <ProfilePulse strength={profileStrength} label="Profile signal" />
        </div>

        <div className="mt-5">
          <p className="text-xs font-black uppercase tracking-[0.15em] text-slate">
            Interests
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

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl bg-gradient-to-r from-ink to-peacock px-5 py-3 text-sm font-black text-white shadow-glow"
          >
            Use these signals
          </button>
          <p className="max-w-xl text-sm leading-6 text-slate">
            Missing fields simply make match labels more cautious. You can still
            browse all opportunities.
          </p>
        </div>
      </section>
    </div>
  );
}

function ProfileSelect<T extends string>({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: T;
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
        className="rounded-2xl border border-white/80 bg-white/86 px-4 py-3 text-sm font-black text-ink shadow-soft outline-none focus:border-teal"
      >
        {children}
      </select>
    </label>
  );
}
