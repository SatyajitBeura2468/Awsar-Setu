"use client";

import Link from "next/link";
import { Archive, ClipboardCheck, FilePenLine, Inbox, Trash2 } from "lucide-react";
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
    <div className="space-y-7">
      <section className="rounded-[2rem] border border-border bg-white p-6 shadow-soft md:p-8">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-teal">
          Saved and tracking
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-ink md:text-5xl">
          Keep your next steps simple.
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate">
          Guests can save locally on this device. Signed-in users can sync
          saved opportunities, notes, status and reminders securely across
          devices after Supabase is configured.
        </p>
      </section>

      {!savedOpportunities.length ? (
        <div className="rounded-[1.5rem] border border-dashed border-border bg-white p-8 text-center shadow-soft">
          <p className="text-2xl font-black text-ink">No saved opportunities yet</p>
          <p className="mt-3 text-slate">
            Browse Explore or Vacancies and save opportunities you want to
            revisit.
          </p>
          <Link
            href="/explore"
            className="mt-5 inline-flex rounded-2xl bg-ink px-5 py-3 text-sm font-black text-white"
          >
            Explore opportunities
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {savedOpportunities.map(({ opportunity, saved }) => {
            if (!opportunity) return null;
            return (
              <div
                key={opportunity.id}
                className="rounded-[1.5rem] border border-border bg-white p-4 shadow-soft"
              >
                <OpportunityCard opportunity={opportunity} compact />
                <div className="mt-4 grid gap-4 rounded-[1.15rem] bg-canvas p-4">
                  <div className="flex flex-wrap gap-2">
                    {statuses.map((status) => {
                      const Icon = status.icon;
                      const active = saved.status === status.id;
                      return (
                        <button
                          key={status.id}
                          type="button"
                          onClick={() =>
                            updateSaved(opportunity.id, { status: status.id })
                          }
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-black ${
                            active
                              ? "bg-ink text-white"
                              : "bg-white text-slate hover:text-ink"
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
                      className="min-h-24 rounded-2xl border border-border bg-white px-4 py-3 text-ink outline-none focus:border-teal"
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
                      className="rounded-2xl border border-border bg-white px-4 py-3 text-ink outline-none focus:border-teal"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => void toggleSaved(opportunity.id)}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-white px-4 py-3 text-sm font-black text-slate hover:text-coral"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    Remove from saved
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
