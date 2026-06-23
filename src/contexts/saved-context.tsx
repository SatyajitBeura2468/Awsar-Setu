"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { ApplicationStatus, SavedOpportunity } from "@/lib/types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const storageKey = "awsarsetu-saved";
const savedChangeEvent = "awsarsetu-saved-change";
const emptySavedItems: SavedOpportunity[] = [];
let cachedRawValue: string | null = null;
let cachedSavedItems: SavedOpportunity[] = emptySavedItems;

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

function getSavedSnapshot() {
  if (typeof window === "undefined") return emptySavedItems;
  const rawValue = window.localStorage.getItem(storageKey);
  if (rawValue === cachedRawValue) return cachedSavedItems;
  cachedRawValue = rawValue;
  cachedSavedItems = parseSaved(rawValue);
  return cachedSavedItems;
}

function getServerSavedSnapshot() {
  return emptySavedItems;
}

function subscribeSavedItems(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const handleStorage = (event: StorageEvent) => {
    if (event.key === storageKey) callback();
  };
  const handleLocalChange = () => callback();

  window.addEventListener("storage", handleStorage);
  window.addEventListener(savedChangeEvent, handleLocalChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(savedChangeEvent, handleLocalChange);
  };
}

function writeSavedItems(items: SavedOpportunity[]) {
  if (typeof window === "undefined") return;
  cachedRawValue = JSON.stringify(items);
  cachedSavedItems = items;
  window.localStorage.setItem(storageKey, cachedRawValue);
  window.dispatchEvent(new Event(savedChangeEvent));
}

async function upsertSavedItem(item: SavedOpportunity) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return;

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return;

  await supabase.from("saved_opportunities").upsert(
    {
      user_id: session.user.id,
      opportunity_id: item.opportunityId,
      status: item.status,
      notes: item.notes,
      reminder_date: item.reminderDate ?? null,
    },
    { onConflict: "user_id,opportunity_id" },
  );
}

async function migrateLocalSavedItems() {
  const items = getSavedSnapshot();
  if (!items.length) return;
  await Promise.all(items.map((item) => upsertSavedItem(item)));
}

export function SavedProvider({ children }: { children: ReactNode }) {
  const savedItems = useSyncExternalStore(
    subscribeSavedItems,
    getSavedSnapshot,
    getServerSavedSnapshot,
  );

  const toggleSaved = useCallback(async (opportunityId: string) => {
    const items = getSavedSnapshot();
    const existing = items.find((item) => item.opportunityId === opportunityId);
    const nextItems = existing
      ? items.filter((item) => item.opportunityId !== opportunityId)
      : [
            ...items,
            {
              opportunityId,
              status: "saved" as const,
              notes: "",
              savedAt: new Date().toISOString(),
            },
          ];
    writeSavedItems(nextItems);

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
      const nextItems = getSavedSnapshot().map((item) =>
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
      );
      writeSavedItems(nextItems);
      const updatedItem = nextItems.find(
        (item) => item.opportunityId === opportunityId,
      );
      if (updatedItem) void upsertSavedItem(updatedItem);
    },
    [],
  );

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    void migrateLocalSavedItems();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") void migrateLocalSavedItems();
    });

    return () => subscription.unsubscribe();
  }, []);

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
