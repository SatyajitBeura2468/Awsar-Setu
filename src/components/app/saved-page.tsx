"use client";

import Link from "next/link";
import {
  Archive,
  ArrowRight,
  Bookmark,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  FilePenLine,
  Inbox,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useSaved } from "@/contexts/saved-context";
import { opportunities } from "@/lib/opportunities";
import type { ApplicationStatus, SavedOpportunity } from "@/lib/types";

const statuses: Array<{ id: ApplicationStatus; label: string; icon: typeof Inbox }> = [
  { id: "saved", label: "Saved", icon: Bookmark },
  { id: "preparing", label: "Preparing", icon: FilePenLine },
  { id: "applied", label: "Applied", icon: ClipboardCheck },
  { id: "archived", label: "Archived", icon: Archive },
];

export function SavedPage() {
  const { savedItems, updateSaved, toggleSaved } = useSaved();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const savedOpportunities = savedItems
    .map((saved) => ({
      saved,
      opportunity: opportunities.find((item) => item.id === saved.opportunityId),
    }))
    .filter((item) => item.opportunity);
  const activeId = savedOpportunities.some((item) => item.opportunity?.id === selectedId)
    ? selectedId
    : savedOpportunities[0]?.opportunity?.id ?? null;
  const selected = savedOpportunities.find((item) => item.opportunity?.id === activeId);

  return (
    <div className="v5-saved-page">
      <header className="v5-page-intro saved-intro">
        <div>
          <h1>Your opportunity journey</h1>
          <p>Keep every next step in one calm place.</p>
        </div>
        <Link href="/explore" className="v5-arrow-link">
          Find opportunities<ArrowRight aria-hidden="true" />
        </Link>
      </header>

      <div className="journey-stage-rail" aria-label="Saved opportunity stages">
        {statuses.map((status, index) => {
          const Icon = status.icon;
          const count = savedItems.filter((item) => item.status === status.id).length;
          return (
            <div key={status.id} className={count ? "has-items" : ""}>
              <span><Icon aria-hidden="true" /></span>
              <strong>{status.label}</strong>
              <small>{count}</small>
              {index < statuses.length - 1 && <i aria-hidden="true" />}
            </div>
          );
        })}
      </div>

      {!savedOpportunities.length ? (
        <section className="saved-empty-state">
          <span><Bookmark aria-hidden="true" /></span>
          <div>
            <h2>Your journey starts with one save</h2>
            <p>
              Browse trusted pathways, save anything worth returning to, then
              track notes, reminders and application progress here.
            </p>
            <Link href="/explore" className="button-primary">
              Explore opportunities<ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </section>
      ) : (
        <div className="saved-workspace">
          <aside className="saved-route-list" aria-label="Your saved opportunities">
            <h2>Your saved opportunities</h2>
            <div>
              {savedOpportunities.map(({ opportunity, saved }) => {
                if (!opportunity) return null;
                return (
                  <button
                    key={opportunity.id}
                    type="button"
                    onClick={() => setSelectedId(opportunity.id)}
                    className={activeId === opportunity.id ? "is-active" : ""}
                  >
                    <span className="saved-route-node" aria-hidden="true" />
                    <span>
                      <strong>{opportunity.title}</strong>
                      <small>{statuses.find((status) => status.id === saved.status)?.label}</small>
                    </span>
                    <ArrowRight aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          </aside>

          {selected?.opportunity && (
            <SavedWorkspace
              saved={selected.saved}
              title={selected.opportunity.title}
              slug={selected.opportunity.slug}
              source={selected.opportunity.sourceDomain}
              onUpdate={(updates) => updateSaved(selected.opportunity!.id, updates)}
              onRemove={() => void toggleSaved(selected.opportunity!.id)}
            />
          )}
        </div>
      )}
    </div>
  );
}

function SavedWorkspace({
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
  onUpdate: (updates: Partial<Pick<SavedOpportunity, "notes" | "reminderDate" | "status">>) => void;
  onRemove: () => void;
}) {
  return (
    <article className="saved-focus-panel">
      <header>
        <div>
          <span className="saved-trust"><CheckCircle2 aria-hidden="true" />Official source</span>
          <h2>{title}</h2>
          <span className="saved-source-domain">{source}</span>
        </div>
        <label className="saved-status-select">
          Status
          <select value={saved.status} onChange={(event) => onUpdate({ status: event.target.value as ApplicationStatus })}>
            {statuses.map((status) => <option key={status.id} value={status.id}>{status.label}</option>)}
          </select>
        </label>
      </header>

      <section className="saved-editor">
        <div>
          <h3>Notes and reminder</h3>
          <label>
            Private note
            <textarea
              value={saved.notes}
              onChange={(event) => onUpdate({ notes: event.target.value })}
              placeholder="Documents to collect, questions to check, or next step."
            />
          </label>
        </div>
        <label className="reminder-field">
          <span><CalendarDays aria-hidden="true" />Reminder date</span>
          <input
            type="date"
            value={saved.reminderDate ?? ""}
            onChange={(event) => onUpdate({ reminderDate: event.target.value })}
          />
          <small>{saved.reminderDate ? "Saved on this device and synced when signed in." : "Optional"}</small>
        </label>
      </section>

      <section className="saved-next-step">
        <div>
          <h3>Continue your next step</h3>
          <p>Review the full opportunity before opening the official source.</p>
        </div>
        <div>
          <Link href={`/opportunities/${slug}`} className="button-secondary">Review opportunity</Link>
          <Link href={`/opportunities/${slug}`} className="button-primary">
            Review and open source<ExternalLink aria-hidden="true" />
          </Link>
        </div>
      </section>

      <button type="button" onClick={onRemove} className="danger-button saved-remove">
        <Trash2 aria-hidden="true" />Remove from saved
      </button>
    </article>
  );
}
