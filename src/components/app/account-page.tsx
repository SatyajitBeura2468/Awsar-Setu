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
    <div className="space-y-8">
      <section className="surface-glass relative overflow-hidden rounded-[2rem] p-6 md:p-8">
        <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-teal/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-32 w-32 rounded-full bg-saffron/20 blur-3xl" />
        <p className="text-sm font-black uppercase tracking-[0.16em] text-teal">
          {t("account")}
        </p>
        <h1 className="relative mt-3 max-w-3xl text-3xl font-black tracking-tight text-ink md:text-5xl">
          {t("accountBenefit")}
        </h1>
        <p className="relative mt-4 max-w-3xl text-base leading-7 text-slate">
          Sign in only when you want synced saves, profile-shaped matches and
          quiet reminders. Searching and opening official sources stays open to
          everyone.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <AuthPanel />

        <section className="surface-glass rounded-[1.5rem] p-5 md:p-6">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-mint to-white text-teal-dark shadow-soft">
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
                      ? "border-teal bg-mint text-teal-dark shadow-soft"
                      : "border-white/80 bg-white/72 text-slate hover:border-teal"
                  }`}
                >
                  {categoryLabels[category][locale]}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      <section className="surface-glass rounded-[1.5rem] p-5 md:p-6">
        <div className="flex items-start gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-saffron/30 to-white text-coral shadow-soft">
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
              className="dock-item flex items-center justify-between gap-4 rounded-2xl border border-white/80 bg-white/72 p-4 text-sm font-bold text-ink shadow-soft transition hover:-translate-y-0.5"
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
      <select className="rounded-2xl border border-white/80 bg-white/78 px-4 py-3 text-sm font-bold text-ink shadow-soft outline-none transition focus:border-teal focus:bg-white">
        {children}
      </select>
    </label>
  );
}
