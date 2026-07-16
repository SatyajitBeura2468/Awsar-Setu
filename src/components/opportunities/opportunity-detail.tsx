"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Bookmark,
  CalendarDays,
  Check,
  ChevronRight,
  ExternalLink,
  Files,
  ListChecks,
  MapPin,
  Share2,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
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

const journeySteps = [
  "Review this opportunity",
  "Check criteria on the source",
  "Prepare documents",
  "Apply on the official portal",
  "Track and follow up",
];

export function OpportunityDetail({ opportunity }: { opportunity: Opportunity }) {
  const { locale, t } = useLanguage();
  const { profile, profileReady } = useProfile();
  const { savedItems, isSaved, toggleSaved, updateSaved } = useSaved();
  const [shareMessage, setShareMessage] = useState("");
  const saved = isSaved(opportunity.id);
  const savedItem = savedItems.find((item) => item.opportunityId === opportunity.id);
  const match = matchOpportunity(profileReady ? profile : null, opportunity);
  const scope =
    opportunity.scope.kind === "national"
      ? "India-wide"
      : opportunity.scope.states.join(", ");

  const share = async () => {
    const url = `${window.location.origin}/opportunities/${opportunity.slug}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: opportunity.title, url });
        setShareMessage("Share sheet opened.");
      } else {
        await navigator.clipboard.writeText(url);
        setShareMessage("Link copied.");
      }
    } catch {
      setShareMessage("Sharing was cancelled.");
    }
  };

  return (
    <div className="v5-detail-page">
      <Link href="/explore" className="detail-back-link">
        <ArrowLeft aria-hidden="true" />Back to results
      </Link>

      <header className="v5-detail-header">
        <div>
          <div className="detail-kicker">
            <TrustStatus status={opportunity.contentStatus} />
            <span>{categoryLabels[opportunity.category][locale]}</span>
          </div>
          <h1>{opportunity.title}</h1>
          <p>{opportunity.description}</p>
        </div>
        <span className="detail-benefit">{benefitLabels[opportunity.benefitType][locale]}</span>
      </header>

      <dl className="v5-detail-facts">
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
        <Fact icon={<ExternalLink />} label="Source" value={opportunity.sourceDomain} />
        <Fact icon={<ShieldCheck />} label="Last checked" value={opportunity.lastChecked} />
      </dl>

      <div className="v5-detail-layout">
        <nav className="detail-section-nav" aria-label="On this page">
          <a href="#why-fit">Why this may fit</a>
          <a href="#what-check">What to check</a>
          <a href="#what-offers">What it offers</a>
          <a href="#who-apply">Who can apply</a>
          <a href="#documents">Documents</a>
          <a href="#how-apply">How to apply</a>
        </nav>

        <article className="detail-document v5-detail-document">
          <section className="detail-section" id="why-fit">
            <h2>Why this may fit</h2>
            {profileReady ? (
              <div className="match-note">
                <strong>{t(match.level)}</strong>
                <p>{t("likelyHint")}</p>
                <ul>
                  {match.reasons.slice(0, 3).map((reason) => <li key={reason}>{reason}</li>)}
                </ul>
              </div>
            ) : (
              <p>
                Add a few optional profile signals for a cautious match explanation.
                You can still review every requirement without a profile.
              </p>
            )}
          </section>

          <section className="detail-section" id="what-check">
            <h2>What to check</h2>
            <p>{opportunity.eligibilitySummary}</p>
            <DetailList items={opportunity.importantConditions} />
          </section>

          <DetailBlock id="what-offers" title="What it offers" items={opportunity.whatItOffers} />
          <DetailBlock id="who-apply" title="Who can apply" items={opportunity.whoCanApply} />
          <DetailBlock id="documents" title="Documents commonly needed" items={opportunity.documents} icon={<Files />} />
          <DetailBlock id="how-apply" title="How to apply" items={opportunity.howToApply} icon={<ListChecks />} numbered />
        </article>

        <aside className="source-panel v5-source-panel">
          <div className="journey-progress">
            <h2>Your next steps</h2>
            <ol>
              {journeySteps.map((step, index) => (
                <li key={step} className={index === 0 ? "is-current" : ""}>
                  <span>{index === 0 ? <Check aria-hidden="true" /> : index + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="source-actions">
            <SourceExitSheet opportunity={opportunity} className="button-primary full">
              {opportunity.officialActionLabel || t("continueOfficial")}
              <ExternalLink aria-hidden="true" />
            </SourceExitSheet>
            <button
              type="button"
              onClick={() => void toggleSaved(opportunity.id)}
              className="button-secondary"
            >
              <Bookmark fill={saved ? "currentColor" : "none"} aria-hidden="true" />
              {saved ? t("savedLabel") : t("save")}
            </button>
            <button type="button" onClick={() => void share()} className="button-secondary">
              <Share2 aria-hidden="true" />{t("share")}
            </button>
            {shareMessage && <p role="status" className="action-status">{shareMessage}</p>}
          </div>

          {savedItem && (
            <div className="detail-private-note">
              <label>
                Private note
                <textarea
                  value={savedItem.notes}
                  onChange={(event) => updateSaved(opportunity.id, { notes: event.target.value })}
                  placeholder="Documents to collect or a next step."
                />
              </label>
              <Link href="/saved">Open journey <ChevronRight aria-hidden="true" /></Link>
            </div>
          )}

          <Link href="/privacy" className="text-link">Privacy and data use</Link>
        </aside>
      </div>

      <div className="mobile-source-action">
        <SourceExitSheet opportunity={opportunity} className="button-primary full">
          {opportunity.officialActionLabel || t("continueOfficial")}
        </SourceExitSheet>
      </div>
    </div>
  );
}

function Fact({ label, value, icon }: { label: string; value: string; icon: React.ReactElement }) {
  return (
    <div>
      <dt><span>{icon}</span>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function DetailList({ items, numbered = false }: { items: string[]; numbered?: boolean }) {
  const Tag = numbered ? "ol" : "ul";
  return (
    <Tag className={numbered ? "numbered-detail-list" : undefined}>
      {items.map((item) => <li key={item}>{item}</li>)}
    </Tag>
  );
}

function DetailBlock({ id, title, items, icon, numbered = false }: {
  id: string;
  title: string;
  items: string[];
  icon?: React.ReactElement;
  numbered?: boolean;
}) {
  return (
    <section className="detail-section" id={id}>
      <h2>{icon && <span>{icon}</span>}{title}</h2>
      <DetailList items={items} numbered={numbered} />
    </section>
  );
}
