"use client";

import Link from "next/link";
import { Archive, ClipboardCheck, FilePenLine, Inbox, Trash2 } from "lucide-react";
import { useSaved } from "@/contexts/saved-context";
import { opportunities } from "@/lib/opportunities";
import type { ApplicationStatus, SavedOpportunity } from "@/lib/types";

const statuses: Array<{ id: ApplicationStatus; label: string; icon: typeof Inbox }> =
  [
    { id: "saved", label: "Saved", icon: Inbox },
    { id: "preparing", label: "Preparing", icon: FilePenLine },
    { id: "applied", label: "Applied", icon: ClipboardCheck },
    { id: "archived", label: "Archived", icon: Archive },
  ];

export function SavedPage() {
  const { savedItems, updateSaved, toggleSaved } = useSaved();
  const savedOpportunities = savedItems
    .map((saved) => ({
      saved,
      opportunity: opportunities.find(
        (opportunity) => opportunity.id === saved.opportunityId,
      ),
    }))
    .filter((item) => item.opportunity);

  return (
    <div className="settings-page">
      <header className="page-heading">
        <h1>Saved opportunities</h1>
        <p>
          Keep a short list of opportunities worth returning to, with notes,
          reminders and a simple application status.
        </p>
      </header>

      {!savedOpportunities.length ? (
        <div className="quiet-info-row">
          <strong>No saved opportunities yet</strong>
          <p>
            Explore scholarships, vacancies, schemes and training paths, then
            save the ones you want to revisit.
          </p>
          <Link href="/explore">Explore opportunities</Link>
        </div>
      ) : (
        <div className="saved-list">
          {savedOpportunities.map(({ opportunity, saved }) => {
            if (!opportunity) return null;
            return (
              <SavedRow
                key={opportunity.id}
                saved={saved}
                title={opportunity.title}
                slug={opportunity.slug}
                source={opportunity.sourceDomain}
                onUpdate={(updates) => updateSaved(opportunity.id, updates)}
                onRemove={() => void toggleSaved(opportunity.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function SavedRow({
  saved,
  title,
  slug,
  source,
  onUpdate,
  onRemove,
}: {
  saved: SavedOpportunity;
  title: string;
  slug: string;
  source: string;
  onUpdate: (
    updates: Partial<Pick<SavedOpportunity, "notes" | "reminderDate" | "status">>,
  ) => void;
  onRemove: () => void;
}) {
  return (
    <article className="saved-row">
      <div className="saved-row-main">
        <Link href={`/opportunities/${slug}`} className="row-title">
          {title}
        </Link>
        <p>{source}</p>
        <div className="status-segmented" aria-label={`Application status for ${title}`}>
          {statuses.map((status) => {
            const Icon = status.icon;
            const active = saved.status === status.id;
            return (
              <button
                key={status.id}
                type="button"
                onClick={() => onUpdate({ status: status.id })}
                className={active ? "is-active" : ""}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {status.label}
              </button>
            );
          })}
        </div>
      </div>

      <details className="saved-details">
        <summary>Notes and reminder</summary>
        <label>
          Private note
          <textarea
            value={saved.notes}
            onChange={(event) => onUpdate({ notes: event.target.value })}
            placeholder="Documents to collect, questions to check, or next step."
          />
        </label>
        <label>
          Reminder date
          <input
            type="date"
            value={saved.reminderDate ?? ""}
            onChange={(event) => onUpdate({ reminderDate: event.target.value })}
          />
        </label>
        {saved.notes && <p className="note-preview">Current note: {saved.notes}</p>}
        <button type="button" onClick={onRemove} className="danger-button">
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Remove from saved
        </button>
      </details>
    </article>
  );
}
