"use client";

import { useState } from "react";
import { BellRing, UserRoundCog } from "lucide-react";
import { AuthPanel } from "@/components/auth/auth-panel";
import { categoryLabels, educationLabels, roleLabels } from "@/lib/i18n";
import {
  categories,
  currentRoles,
  educationLevels,
  indianStates,
  type Category,
} from "@/lib/types";
import { useLanguage } from "@/contexts/language-context";

export function AccountPage() {
  const { locale, t } = useLanguage();
  const [interests, setInterests] = useState<Category[]>([
    "education-scholarships",
    "government-jobs-vacancies",
  ]);

  const toggleInterest = (category: Category) => {
    setInterests((items) =>
      items.includes(category)
        ? items.filter((item) => item !== category)
        : [...items, category],
    );
  };

  return (
    <div className="space-y-7">
      <section className="rounded-[2rem] border border-border bg-white p-6 shadow-soft md:p-8">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-teal">
          {t("account")}
        </p>
        <h1 className="mt-3 max-w-3xl text-3xl font-black tracking-tight text-ink md:text-5xl">
          {t("accountBenefit")}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate">
          Accounts are optional. You can browse, search, open official links and
          save locally without signing in.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <AuthPanel />

        <section className="rounded-[1.5rem] border border-border bg-white p-5 shadow-soft md:p-6">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-mint text-teal-dark">
              <UserRoundCog className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-2xl font-black text-ink">
                Lightweight profile
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate">
                Used only to improve matches. AwsarSetu does not request
                Aadhaar, bank details, caste certificate details, disability
                records, detailed medical data or exact date of birth.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <ProfileSelect label="State">
              {indianStates.map((state) => (
                <option key={state}>{state}</option>
              ))}
            </ProfileSelect>
            <ProfileSelect label="Age">
              <option>19</option>
              <option>18-24</option>
              <option>25-34</option>
              <option>35-44</option>
              <option>45+</option>
            </ProfileSelect>
            <ProfileSelect label="Education level">
              {educationLevels.map((level) => (
                <option key={level}>{educationLabels[level][locale]}</option>
              ))}
            </ProfileSelect>
            <ProfileSelect label="Current role">
              {currentRoles.map((role) => (
                <option key={role}>{roleLabels[role][locale]}</option>
              ))}
            </ProfileSelect>
            <ProfileSelect label="Gender (optional)">
              <option>Prefer not to say</option>
              <option>Female</option>
              <option>Male</option>
              <option>Other</option>
            </ProfileSelect>
            <ProfileSelect label="Income range (optional)">
              <option>Prefer not to say</option>
              <option>Below 1 lakh</option>
              <option>1-3 lakh</option>
              <option>3-6 lakh</option>
              <option>6-12 lakh</option>
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
                  className={`rounded-full border px-4 py-2 text-sm font-bold ${
                    interests.includes(category)
                      ? "border-teal bg-mint text-teal-dark"
                      : "border-border bg-canvas text-slate"
                  }`}
                >
                  {categoryLabels[category][locale]}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      <section className="rounded-[1.5rem] border border-border bg-white p-5 shadow-soft md:p-6">
        <div className="flex items-start gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-saffron/20 text-coral">
            <BellRing className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-2xl font-black text-ink">
              Notification preferences
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate">
              Quiet by default: browser notifications for likely matches,
              vacancy matches and deadline reminders; email only for meaningful
              matches or important deadlines.
            </p>
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {[
            "Browser notifications",
            "Email alerts",
            "Preferred categories",
            "State preference",
            "Weekly alert frequency",
          ].map((item) => (
            <label
              key={item}
              className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-canvas p-4 text-sm font-bold text-ink"
            >
              {item}
              <input type="checkbox" className="h-5 w-5 accent-teal" />
            </label>
          ))}
        </div>
      </section>
    </div>
  );
}

function ProfileSelect({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-black uppercase tracking-[0.15em] text-slate">
        {label}
      </span>
      <select className="rounded-2xl border border-border bg-canvas px-4 py-3 text-sm font-bold text-ink outline-none focus:border-teal">
        {children}
      </select>
    </label>
  );
}
