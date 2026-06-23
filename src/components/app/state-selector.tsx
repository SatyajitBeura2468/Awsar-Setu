"use client";

import { MapPin, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useProfile } from "@/contexts/profile-context";
import { indianStates, type IndianState } from "@/lib/types";

export function StateSelector() {
  const { profile, setProfileState } = useProfile();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filteredStates = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return indianStates;
    return indianStates.filter((state) =>
      state.toLowerCase().includes(normalized),
    );
  }, [query]);

  const chooseState = (state: IndianState) => {
    setProfileState(state);
    setOpen(false);
    setQuery("");
  };

  return (
    <div className="relative flex items-center gap-3">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm font-black text-ink shadow-soft transition hover:-translate-y-0.5 hover:border-teal"
      >
        <MapPin className="h-4 w-4 text-coral" aria-hidden="true" />
        {profile.state ?? "India"}
      </button>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/60 px-4 py-2 text-sm font-bold text-slate shadow-soft transition hover:-translate-y-0.5 hover:border-teal"
      >
        Change state
      </button>

      {open && (
        <div
          className="state-sheet-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="state-selector-title"
        >
          <div className="state-sheet">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="state-sheet-close"
              aria-label="Close state selector"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-teal">
              Current context
            </p>
            <h2 id="state-selector-title">
              Choose the state or Union Territory to focus discovery.
            </h2>
            <p>
              This is stored on this device for guests and can sync after sign
              in. India-wide opportunities still appear.
            </p>
            <label className="state-sheet-search">
              <Search className="h-5 w-5 text-teal" aria-hidden="true" />
              <span className="sr-only">Search states</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                autoFocus
                placeholder="Search Odisha, Kerala, Delhi..."
              />
            </label>
            <div className="state-sheet-grid">
              {filteredStates.map((state) => (
                <button
                  key={state}
                  type="button"
                  onClick={() => chooseState(state)}
                  className={state === profile.state ? "is-selected" : ""}
                >
                  {state}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
