"use client";

import type { ReactNode } from "react";
import { LanguageProvider } from "@/contexts/language-context";
import { ProfileProvider } from "@/contexts/profile-context";
import { SavedProvider } from "@/contexts/saved-context";
import {
  AtlasBackground,
  MotionProvider,
  ReducedMotionProvider,
} from "@/components/experience/experience-primitives";
import { ServiceWorkerRegister } from "./service-worker-register";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <ProfileProvider>
        <SavedProvider>
          <ReducedMotionProvider>
            <MotionProvider>
              <AtlasBackground />
              {children}
              <ServiceWorkerRegister />
            </MotionProvider>
          </ReducedMotionProvider>
        </SavedProvider>
      </ProfileProvider>
    </LanguageProvider>
  );
}
