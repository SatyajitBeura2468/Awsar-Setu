"use client";

import type { ReactNode } from "react";
import { LanguageProvider } from "@/contexts/language-context";
import { SavedProvider } from "@/contexts/saved-context";
import { ExperienceLayer } from "./experience-layer";
import { ServiceWorkerRegister } from "./service-worker-register";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <SavedProvider>
        <ExperienceLayer />
        {children}
        <ServiceWorkerRegister />
      </SavedProvider>
    </LanguageProvider>
  );
}
