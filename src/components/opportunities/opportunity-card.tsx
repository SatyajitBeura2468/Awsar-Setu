"use client";

import Link from "next/link";
import {
  Banknote,
  Bookmark,
  BriefcaseBusiness,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  HeartHandshake,
  Leaf,
  MapPin,
  Stethoscope,
  Wrench,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useSaved } from "@/contexts/saved-context";
import { categoryLabels } from "@/lib/i18n";
import { matchOpportunity } from "@/lib/matching";
import type { Opportunity, UserProfile, VisualCover } from "@/lib/types";
import {
  TrustStatus,
} from "@/components/experience/experience-primitives";

const iconMap: Record<VisualCover, typeof GraduationCap> = {
  education: GraduationCap,
  "government-jobs": BriefcaseBusiness,
  internship: BriefcaseBusiness,
  training: Wrench,
  agriculture: Leaf,
  welfare: HeartHandshake,
  health: Stethoscope,
  finance: Banknote,
};

function formatDeadline(
  deadline: string | null,
  status: Opportunity["contentStatus"],
) {
  if (status !== "verified-active") return null;
  if (!deadline) return null;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(deadline));
}

export function OpportunityCard({
  opportunity,
  profile,
}: {
  opportunity: Opportunity;
  profile?: UserProfile | null;
  priority?: boolean;
  compact?: boolean;
}) {
  const { locale, t } = useLanguage();
  const { isSaved, toggleSaved } = useSaved();
  const saved = isSaved(opportunity.id);
  const match = matchOpportunity(profile ?? null, opportunity);
  const Icon = iconMap[opportunity.visualCover];
  const deadline = formatDeadline(
    opportunity.deadline,
    opportunity.contentStatus,
  );
  const scope =
    opportunity.scope.kind === "national"
      ? "India-wide"
      : opportunity.scope.states.join(", ");

  return (
    <article className="opportunity-row v5-opportunity-row">
      <div className="opportunity-glyph" aria-hidden="true">
        <Icon className="h-5 w-5" />
      </div>

      <div className="opportunity-row-main">
        <div className="opportunity-kicker">
          <TrustStatus status={opportunity.contentStatus} compact />
          <span>{categoryLabels[opportunity.category][locale]}</span>
        </div>
        <Link href={`/opportunities/${opportunity.slug}`} className="row-title">
          {opportunity.title}
        </Link>
        <p>{opportunity.description}</p>

        <div className="row-meta">
          <span>{opportunity.sourceDomain}</span>
          <span className="meta-dot" aria-hidden="true" />
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            {scope}
          </span>
          {deadline && (
            <>
              <span className="meta-dot" aria-hidden="true" />
              <span>Last date: {deadline}</span>
            </>
          )}
        </div>

        {profile && (
          <details className="match-details">
            <summary>
              <span>{t(match.level)}: why this may fit</span>
              <ChevronDown aria-hidden="true" />
            </summary>
            <ul>
              {match.reasons.slice(0, 3).map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </details>
        )}
      </div>

      <div className="opportunity-row-actions">
        <Link href={`/opportunities/${opportunity.slug}`} className="row-detail-link">
          View details
          <ChevronRight aria-hidden="true" />
        </Link>
        <button
          type="button"
          onClick={() => void toggleSaved(opportunity.id)}
          className="icon-button"
          aria-label={saved ? t("savedLabel") : t("save")}
        >
          <Bookmark
            className="h-5 w-5"
            fill={saved ? "currentColor" : "none"}
            aria-hidden="true"
          />
          <span className="sr-only">{saved ? t("savedLabel") : t("save")}</span>
        </button>
      </div>
    </article>
  );
}
