"use client";

import { MapPin, Search, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useProfile } from "@/contexts/profile-context";
import { indianStates, type IndianState } from "@/lib/types";
import { useDialogFocus } from "@/hooks/use-dialog-focus";

export function StateSelector() {
  const { profile, setProfileState } = useProfile();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const close = useCallback(() => setOpen(false), []);
  const dialogRef = useDialogFocus<HTMLDivElement>(open, close);

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
    <div className="state-selector">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="state-button"
      >
        <MapPin className="h-4 w-4" aria-hidden="true" />
        {profile.state ?? "India"}
      </button>

      {open && (
        <div
          className="state-sheet-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="state-selector-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div className="state-sheet" ref={dialogRef}>
            <button
              type="button"
              onClick={close}
              className="state-sheet-close"
              aria-label="Close state selector"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
            <h2 id="state-selector-title">
              Choose your state or Union Territory
            </h2>
            <p>
              This is stored on this device for guests and can sync after sign
              in. India-wide opportunities still appear.
            </p>
            <label className="state-sheet-search">
              <Search className="h-5 w-5" aria-hidden="true" />
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
