"use client";

import Link from "next/link";
import {
  Archive,
  ClipboardCheck,
  FilePenLine,
  Inbox,
  Trash2,
} from "lucide-react";
import { useSaved } from "@/contexts/saved-context";
import { opportunities } from "@/lib/opportunities";
import type { ApplicationStatus } from "@/lib/types";
import { OpportunityCard } from "@/components/opportunities/opportunity-card";

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
    <div className="space-y-8">
      <section className="surface-glass relative overflow-hidden rounded-[2rem] p-6 md:p-8">
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-mint/70 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-36 w-36 rounded-full bg-coral/15 blur-3xl" />
        <p className="text-sm font-black uppercase tracking-[0.16em] text-teal">
          Saved and tracking
        </p>
        <h1 className="relative mt-3 text-3xl font-black tracking-tight text-ink md:text-5xl">
          Keep your next steps simple.
        </h1>
        <p className="relative mt-4 max-w-3xl text-base leading-7 text-slate">
          Save the opportunities worth returning to, add personal notes, and
          move each one through a simple four-step tracker.
        </p>
      </section>

      {!savedOpportunities.length ? (
        <div className="surface-glass rounded-[1.5rem] border-dashed p-8 text-center">
          <p className="text-2xl font-black text-ink">No saved opportunities yet</p>
          <p className="mt-3 text-slate">
            Explore scholarships, vacancies, schemes and training paths, then
            save the ones you want to revisit.
          </p>
          <Link
            href="/explore"
            className="mt-5 inline-flex rounded-2xl bg-gradient-to-r from-ink to-peacock px-5 py-3 text-sm font-black text-white shadow-glow"
          >
            Explore opportunities
          </Link>
        </div>
      ) : (
        <>
          <SavedJourney savedItems={savedItems} />
          <div className="grid gap-5 lg:grid-cols-2">
            {savedOpportunities.map(({ opportunity, saved }) => {
              if (!opportunity) return null;
              return (
                <div
                  key={opportunity.id}
                  className="surface-glass rounded-[1.5rem] p-4"
                >
                  <OpportunityCard opportunity={opportunity} compact />
                  <div className="mt-4 grid gap-4 rounded-[1.15rem] border border-white/80 bg-white/70 p-4 shadow-soft">
                    <div className="flex flex-wrap gap-2">
                      {statuses.map((status) => {
                        const Icon = status.icon;
                        const active = saved.status === status.id;
                        return (
                          <button
                            key={status.id}
                            type="button"
                            onClick={() =>
                              updateSaved(opportunity.id, {
                                status: status.id,
                              })
                            }
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-black ${
                              active
                                ? "bg-gradient-to-r from-ink to-peacock text-white shadow-glow"
                                : "bg-white/86 text-slate shadow-soft hover:text-ink"
                            }`}
                          >
                            <Icon className="h-4 w-4" aria-hidden="true" />
                            {status.label}
                          </button>
                        );
                      })}
                    </div>
                    <label className="grid gap-2 text-sm font-bold text-slate">
                      Private notes
                      <textarea
                        value={saved.notes}
                        onChange={(event) =>
                          updateSaved(opportunity.id, {
                            notes: event.target.value,
                          })
                        }
                        className="min-h-24 rounded-2xl border border-white/80 bg-white/86 px-4 py-3 text-ink shadow-soft outline-none focus:border-teal"
                        placeholder="Add documents to collect, questions to check, or application status."
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-bold text-slate">
                      Reminder date
                      <input
                        type="date"
                        value={saved.reminderDate ?? ""}
                        onChange={(event) =>
                          updateSaved(opportunity.id, {
                            reminderDate: event.target.value,
                          })
                        }
                        className="rounded-2xl border border-white/80 bg-white/86 px-4 py-3 text-ink shadow-soft outline-none focus:border-teal"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => void toggleSaved(opportunity.id)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/80 bg-white/86 px-4 py-3 text-sm font-black text-slate shadow-soft hover:text-coral"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      Remove from saved
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function SavedJourney({ savedItems }: { savedItems: Array<{ status: ApplicationStatus }> }) {
  const counts = statuses.map((status) => ({
    ...status,
    count: savedItems.filter((item) => item.status === status.id).length,
  }));

  return (
    <section className="journey-board" aria-label="Saved opportunity progress">
      <div>
        <p>Journey board</p>
        <h2>Your saved paths at a glance</h2>
      </div>
      <div className="journey-rail">
        {counts.map((status, index) => {
          const Icon = status.icon;
          return (
            <div key={status.id} className="journey-node">
              {index < counts.length - 1 && <span aria-hidden="true" />}
              <b>
                <Icon className="h-4 w-4" aria-hidden="true" />
              </b>
              <strong>{status.count}</strong>
              <em>{status.label}</em>
            </div>
          );
        })}
      </div>
    </section>
  );
}
