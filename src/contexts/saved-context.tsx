"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ApplicationStatus, SavedOpportunity } from "@/lib/types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const storageKey = "awsarsetu-saved";

interface SavedContextValue {
  savedItems: SavedOpportunity[];
  isSaved: (opportunityId: string) => boolean;
  toggleSaved: (opportunityId: string) => Promise<void>;
  updateSaved: (
    opportunityId: string,
    updates: Partial<
      Pick<SavedOpportunity, "notes" | "reminderDate" | "status">
    >,
  ) => void;
}

const SavedContext = createContext<SavedContextValue | null>(null);

function sanitizeNote(note: string) {
  return note.replace(/[<>]/g, "").slice(0, 1000);
}

function parseSaved(value: string | null): SavedOpportunity[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as SavedOpportunity[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function SavedProvider({ children }: { children: ReactNode }) {
  const [savedItems, setSavedItems] = useState<SavedOpportunity[]>(() => {
    if (typeof window === "undefined") return [];
    return parseSaved(window.localStorage.getItem(storageKey));
  });

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(savedItems));
  }, [savedItems]);

  const toggleSaved = useCallback(async (opportunityId: string) => {
    setSavedItems((items) => {
      const existing = items.find((item) => item.opportunityId === opportunityId);
      if (existing) {
        return items.filter((item) => item.opportunityId !== opportunityId);
      }

      return [
        ...items,
        {
          opportunityId,
          status: "saved",
          notes: "",
          savedAt: new Date().toISOString(),
        },
      ];
    });

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) return;

    const { data } = await supabase
      .from("saved_opportunities")
      .select("id")
      .eq("opportunity_id", opportunityId)
      .maybeSingle();

    if (data?.id) {
      await supabase.from("saved_opportunities").delete().eq("id", data.id);
    } else {
      await supabase.from("saved_opportunities").insert({
        user_id: session.user.id,
        opportunity_id: opportunityId,
        status: "saved",
      });
    }
  }, []);

  const updateSaved = useCallback(
    (
      opportunityId: string,
      updates: Partial<
        Pick<SavedOpportunity, "notes" | "reminderDate" | "status">
      >,
    ) => {
      setSavedItems((items) =>
        items.map((item) =>
          item.opportunityId === opportunityId
            ? {
                ...item,
                ...updates,
                notes:
                  updates.notes !== undefined
                    ? sanitizeNote(updates.notes)
                    : item.notes,
                status:
                  (updates.status as ApplicationStatus | undefined) ??
                  item.status,
              }
            : item,
        ),
      );
    },
    [],
  );

  const value = useMemo<SavedContextValue>(
    () => ({
      savedItems,
      isSaved: (opportunityId) =>
        savedItems.some((item) => item.opportunityId === opportunityId),
      toggleSaved,
      updateSaved,
    }),
    [savedItems, toggleSaved, updateSaved],
  );

  return (
    <SavedContext.Provider value={value}>{children}</SavedContext.Provider>
  );
}

export function useSaved() {
  const context = useContext(SavedContext);
  if (!context) {
    throw new Error("useSaved must be used inside SavedProvider.");
  }
  return context;
}
