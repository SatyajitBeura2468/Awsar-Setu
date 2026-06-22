"use client";

import Image from "next/image";
import Link from "next/link";
import { Bookmark, CalendarDays, ExternalLink, MapPin } from "lucide-react";
import type { PointerEvent } from "react";
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

function formatDeadline(deadline: string | null) {
  if (!deadline) return "Check official portal";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(deadline));
}

export function OpportunityCard({
  opportunity,
  profile,
  priority = false,
  compact = false,
}: {
  opportunity: Opportunity;
  profile?: UserProfile | null;
  priority?: boolean;
  compact?: boolean;
}) {
  const { locale, t } = useLanguage();
  const { isSaved, toggleSaved } = useSaved();
  const saved = isSaved(opportunity.id);
  const match = matchOpportunity(profile, opportunity);
  const scope =
    opportunity.scope.kind === "national"
      ? "India-wide"
      : opportunity.scope.states.join(", ");
  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rx = ((y / rect.height - 0.5) * -5).toFixed(2);
    const ry = ((x / rect.width - 0.5) * 5).toFixed(2);
    event.currentTarget.style.setProperty("--mx", `${x}px`);
    event.currentTarget.style.setProperty("--my", `${y}px`);
    event.currentTarget.style.setProperty("--rx", `${rx}deg`);
    event.currentTarget.style.setProperty("--ry", `${ry}deg`);
  };

  return (
    <article
      onPointerMove={handlePointerMove}
      onPointerLeave={(event) => {
        event.currentTarget.style.setProperty("--rx", "0deg");
        event.currentTarget.style.setProperty("--ry", "0deg");
      }}
      className="interactive-card group relative overflow-hidden rounded-[1.55rem] border border-white/78 bg-white/86 shadow-soft backdrop-blur"
    >
      <Link href={`/opportunities/${opportunity.slug}`} className="block">
        <div className="relative aspect-[16/9] overflow-hidden bg-mist">
          <Image
            src={coverMap[opportunity.visualCover]}
            alt=""
            fill
            sizes="(min-width: 1024px) 360px, 100vw"
            priority={priority}
            className="object-cover transition duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/14 via-transparent to-white/10" />
          <div className="absolute left-3 top-3 max-w-[80%] rounded-full bg-white/92 px-3 py-1 text-xs font-black text-ink shadow-soft backdrop-blur">
            {categoryLabels[opportunity.category][locale]}
          </div>
          {opportunity.verificationStatus === "development-sample" && (
            <div className="absolute bottom-3 left-3 rounded-full bg-saffron/95 px-3 py-1 text-xs font-black text-ink shadow-soft backdrop-blur">
              Sample record
            </div>
          )}
        </div>
      </Link>

      <div className={`relative z-10 space-y-4 ${compact ? "p-4" : "p-5"}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-teal">
              {benefitLabels[opportunity.benefitType][locale]}
            </p>
            <Link href={`/opportunities/${opportunity.slug}`}>
              <h3 className="mt-2 text-lg font-black leading-snug text-ink hover:text-teal">
                {opportunity.title}
              </h3>
            </Link>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate">
              {opportunity.description}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void toggleSaved(opportunity.id)}
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal ${
              saved
                ? "scale-105 border-saffron bg-saffron text-ink shadow-glow"
                : "border-white bg-white/86 text-slate shadow-soft hover:border-teal hover:text-ink"
            }`}
            aria-label={saved ? t("savedLabel") : t("save")}
          >
            <Bookmark
              className="h-5 w-5"
              fill={saved ? "currentColor" : "none"}
              aria-hidden="true"
            />
          </button>
        </div>

        <div className="grid gap-2 text-sm text-slate">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-teal" aria-hidden="true" />
            <span>{scope}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-coral" aria-hidden="true" />
            <span>{formatDeadline(opportunity.deadline)}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-black ${
              match.level === "likely"
                ? "bg-teal/15 text-teal-dark ring-1 ring-teal/20"
                : match.level === "possible"
                  ? "bg-mint text-ink ring-1 ring-teal/10"
                  : "bg-mist text-slate ring-1 ring-border"
            }`}
          >
            {t(match.level)}
          </span>
          <span className="rounded-full bg-mist px-3 py-1 text-xs font-bold text-slate">
            {t("officialSource")}: {opportunity.sourceDomain}
          </span>
        </div>

        <a
          href={opportunity.officialUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-ink to-peacock px-4 py-2 text-sm font-black text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-glow"
        >
          {opportunity.officialActionLabel}
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}
