"use client";

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
import { useProfile } from "@/contexts/profile-context";
import { useSaved } from "@/contexts/saved-context";
import { benefitLabels, categoryLabels } from "@/lib/i18n";
import { matchOpportunity } from "@/lib/matching";
import type { Opportunity } from "@/lib/types";
import {
  SourceExitSheet,
  TrustStatus,
} from "@/components/experience/experience-primitives";

export function OpportunityDetail({ opportunity }: { opportunity: Opportunity }) {
  const { locale, t } = useLanguage();
  const { profile, profileReady } = useProfile();
  const { isSaved, toggleSaved } = useSaved();
  const saved = isSaved(opportunity.id);
  const match = matchOpportunity(profileReady ? profile : null, opportunity);
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
    <div className="detail-layout">
      <article className="detail-document">
        <div className="detail-kicker">
          <TrustStatus status={opportunity.contentStatus} />
          <span>{categoryLabels[opportunity.category][locale]}</span>
          <span>{benefitLabels[opportunity.benefitType][locale]}</span>
        </div>

        <h1>{opportunity.title}</h1>
        <p className="detail-summary">{opportunity.description}</p>

        <dl className="detail-facts">
          <Fact icon={<MapPin />} label="Coverage" value={scope} />
          <Fact
            icon={<CalendarDays />}
            label="Deadline"
            value={
              opportunity.deadline && opportunity.contentStatus === "verified-active"
                ? opportunity.deadline
                : "Check official source"
            }
          />
          <Fact label="Source domain" value={opportunity.sourceDomain} />
          <Fact label="Last checked" value={opportunity.lastChecked} />
        </dl>

        <section className="detail-section">
          <h2>Eligibility summary</h2>
          <p>{opportunity.eligibilitySummary}</p>
          {profileReady && (
            <div className="match-note">
              <strong>{t(match.level)}</strong>
              <p>{t("likelyHint")}</p>
              <ul>
                {match.reasons.slice(0, 3).map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

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
      </article>

      <aside className="source-panel">
        <h2>Official source</h2>
        <p>
          Open the official page in a new tab after a quick source check.
          AwsarSetu does not guarantee eligibility.
        </p>
        <SourceExitSheet opportunity={opportunity} className="button-primary full">
          {opportunity.officialActionLabel || t("continueOfficial")}
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </SourceExitSheet>
        <div className="source-panel-actions">
          <button
            type="button"
            onClick={() => void toggleSaved(opportunity.id)}
            className="button-secondary"
          >
            <Bookmark
              className="h-4 w-4"
              fill={saved ? "currentColor" : "none"}
              aria-hidden="true"
            />
            {saved ? t("savedLabel") : t("save")}
          </button>
          <button type="button" onClick={() => void share()} className="button-secondary">
            <Share2 className="h-4 w-4" aria-hidden="true" />
            {t("share")}
          </button>
        </div>
        <Link href="/privacy" className="text-link">
          Privacy and data use
        </Link>
      </aside>

      <div className="mobile-source-action">
        <SourceExitSheet opportunity={opportunity} className="button-primary full">
          {opportunity.officialActionLabel || t("continueOfficial")}
        </SourceExitSheet>
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
    <div>
      <dt>
        {icon && <span className="[&>svg]:h-4 [&>svg]:w-4">{icon}</span>}
        {label}
      </dt>
      <dd>{value}</dd>
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
    <section className="detail-section">
      <h2>
        {icon && <span className="[&>svg]:h-5 [&>svg]:w-5">{icon}</span>}
        {title}
      </h2>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
