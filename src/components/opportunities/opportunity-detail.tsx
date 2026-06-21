"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Bookmark,
  CalendarDays,
  ExternalLink,
  Files,
  ListChecks,
  MapPin,
  Share2,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useSaved } from "@/contexts/saved-context";
import { benefitLabels, categoryLabels } from "@/lib/i18n";
import { matchOpportunity } from "@/lib/matching";
import type { Opportunity, UserProfile } from "@/lib/types";

const coverMap = {
  education: "/covers/education.svg",
  "government-jobs": "/covers/government-jobs.svg",
  internship: "/covers/internship.svg",
  training: "/covers/training.svg",
  agriculture: "/covers/agriculture.svg",
  welfare: "/covers/welfare.svg",
  health: "/covers/health.svg",
  finance: "/covers/finance.svg",
} as const;

const profile: UserProfile = {
  state: "Odisha",
  age: 19,
  educationLevel: "class-12",
  currentRole: "student",
  interests: ["education-scholarships", "government-jobs-vacancies"],
};

export function OpportunityDetail({ opportunity }: { opportunity: Opportunity }) {
  const { locale, t } = useLanguage();
  const { isSaved, toggleSaved } = useSaved();
  const saved = isSaved(opportunity.id);
  const match = matchOpportunity(profile, opportunity);
  const scope =
    opportunity.scope.kind === "national"
      ? "India-wide"
      : opportunity.scope.states.join(", ");

  const share = async () => {
    const url = `${window.location.origin}/opportunities/${opportunity.slug}`;
    if (navigator.share) {
      await navigator.share({ title: opportunity.title, url });
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  return (
    <div className="space-y-7">
      <section className="grid overflow-hidden rounded-[2rem] border border-border bg-white shadow-card lg:grid-cols-[1.05fr_0.95fr]">
        <div className="p-6 md:p-9">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-mint px-3 py-1 text-xs font-black text-teal-dark">
              {categoryLabels[opportunity.category][locale]}
            </span>
            <span className="rounded-full bg-mist px-3 py-1 text-xs font-black text-slate">
              {benefitLabels[opportunity.benefitType][locale]}
            </span>
            <span className="rounded-full bg-saffron/20 px-3 py-1 text-xs font-black text-ink">
              {opportunity.verificationStatus === "development-sample"
                ? "Development sample"
                : t("officialSource")}
            </span>
          </div>
          <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight text-ink md:text-5xl">
            {opportunity.title}
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate">
            {opportunity.description}
          </p>

          <div className="mt-6 grid gap-3 text-sm text-slate sm:grid-cols-2">
            <Fact icon={<MapPin />} label="Coverage" value={scope} />
            <Fact
              icon={<CalendarDays />}
              label="Deadline"
              value={opportunity.deadline ?? "Check official portal"}
            />
            <Fact label="Organisation" value={opportunity.organisation} />
            <Fact label="Last checked" value={opportunity.lastChecked} />
          </div>

          <div className="mt-6 rounded-2xl border border-teal/20 bg-mint p-4">
            <p className="text-sm font-black text-teal-dark">{t(match.level)}</p>
            <p className="mt-2 text-sm leading-6 text-ink">{t("likelyHint")}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate">
              {match.reasons.slice(0, 3).map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="relative min-h-[20rem] bg-canvas">
          <Image
            src={coverMap[opportunity.visualCover]}
            alt=""
            fill
            priority
            className="object-cover"
          />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_21rem]">
        <div className="space-y-6">
          <DetailBlock title="What it offers" items={opportunity.whatItOffers} />
          <DetailBlock title="Who can apply" items={opportunity.whoCanApply} />
          <DetailBlock
            title="Important conditions"
            items={opportunity.importantConditions}
          />
          <DetailBlock
            title="Documents commonly needed"
            items={opportunity.documents}
            icon={<Files />}
          />
          <DetailBlock
            title="How to apply"
            items={opportunity.howToApply}
            icon={<ListChecks />}
          />
        </div>

        <aside className="h-fit space-y-4 rounded-[1.5rem] border border-border bg-white p-5 shadow-soft lg:sticky lg:top-24">
          <a
            href={opportunity.officialUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-2xl bg-ink px-5 py-4 text-sm font-black text-white transition hover:bg-teal-dark"
          >
            {opportunity.officialActionLabel || t("continueOfficial")}
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
          <p className="text-center text-sm font-bold text-slate">
            {t("opensOfficial")}
          </p>
          <div className="grid gap-3">
            <button
              type="button"
              onClick={() => void toggleSaved(opportunity.id)}
              className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-canvas px-5 py-3 text-sm font-black text-ink"
            >
              <Bookmark
                className="h-4 w-4"
                fill={saved ? "currentColor" : "none"}
                aria-hidden="true"
              />
              {saved ? t("savedLabel") : t("save")}
            </button>
            <button
              type="button"
              onClick={() => void toggleSaved(opportunity.id)}
              className="rounded-2xl border border-border bg-canvas px-5 py-3 text-sm font-black text-ink"
            >
              {t("addTracker")}
            </button>
            <button
              type="button"
              onClick={() => void share()}
              className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-canvas px-5 py-3 text-sm font-black text-ink"
            >
              <Share2 className="h-4 w-4" aria-hidden="true" />
              {t("share")}
            </button>
          </div>
          <div className="rounded-2xl bg-saffron/15 p-4 text-sm leading-6 text-slate">
            {t("noGuarantee")}
          </div>
          <Link
            href="/privacy"
            className="block text-center text-sm font-black text-teal-dark"
          >
            Privacy and data use
          </Link>
        </aside>
      </div>
    </div>
  );
}

function Fact({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactElement;
}) {
  return (
    <div className="rounded-2xl border border-border bg-canvas p-4">
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-slate">
        {icon &&
          <span className="text-teal [&>svg]:h-4 [&>svg]:w-4">{icon}</span>}
        {label}
      </div>
      <p className="mt-2 font-bold text-ink">{value}</p>
    </div>
  );
}

function DetailBlock({
  title,
  items,
  icon,
}: {
  title: string;
  items: string[];
  icon?: React.ReactElement;
}) {
  return (
    <section className="rounded-[1.5rem] border border-border bg-white p-6 shadow-soft">
      <div className="flex items-center gap-3">
        {icon && (
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-mint text-teal-dark [&>svg]:h-5 [&>svg]:w-5">
            {icon}
          </span>
        )}
        <h2 className="text-2xl font-black text-ink">{title}</h2>
      </div>
      <ul className="mt-4 grid gap-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-6 text-slate">
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-teal" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
