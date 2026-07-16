"use client";

import { X } from "lucide-react";
import { type ReactNode } from "react";
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
import { useDialogFocus } from "@/hooks/use-dialog-focus";

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
  const { profile, updateProfile } = useProfile();
  const dialogRef = useDialogFocus<HTMLElement>(open, onClose);

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
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="profile-sheet" ref={dialogRef}>
        <button
          type="button"
          onClick={onClose}
          className="profile-sheet-close"
          aria-label="Close profile setup"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
        <h2 id="profile-sheet-title">Set up profile preferences</h2>
        <p>
          Add only what improves matching: state, age band, education, role and
          interests. You can browse without completing this.
        </p>

        <div className="mt-5">
          <div className="settings-grid">
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
        </div>

        <div className="mt-5">
          <p className="field-group-label">Interests</p>
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
            className="button-primary"
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
    <label className="settings-field">
      <span>{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {children}
      </select>
    </label>
  );
}
