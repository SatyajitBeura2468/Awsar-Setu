# Architecture

## Application

The app uses Next.js App Router with mostly static public browsing routes and focused client components for search, filters, language switching, local saves, profile preferences, route motion and auth actions.

V3 introduces the Opportunity Atlas experience layer:

- `MotionProvider` and `ReducedMotionProvider`
- `RouteTransition`
- `AtlasBackground`
- `InteractiveSurface`, `MagneticAction` and `RevealSequence`
- `TrustStatus`, `ProfilePulse`, `OpportunitySignal` and `SourceExitSheet`

Motion is meaningful but non-blocking. Reduced-motion users receive static layouts, opacity/color transitions and the same content/actions.

## Data

Starter data is in `src/lib/opportunities.ts` for development. Production data should live in Supabase `opportunities` after content review.

Opportunity records use `content_status` to distinguish verified active notices from official directories, archived content, unavailable sources and development samples. Active sections must not display development samples or directory records as if they were individual verified opportunities.

Guest profile preferences and saved items are local-first. Authenticated users sync saved tracking, notes, reminders, notification preferences and profile fields to Supabase under RLS.

## Authentication

Supabase Auth supports:

- Email and password
- Phone OTP, feature-flagged through `NEXT_PUBLIC_ENABLE_PHONE_OTP`
- Optional Google OAuth configured in Supabase

## Notifications

Browser push uses:

- `public/sw.js`
- VAPID environment variables
- `push_subscriptions` table
- `/api/notifications/subscribe`

Email alerts use the `src/lib/server/email.ts` abstraction and Resend credentials.

The UI only reports notifications as ready after permission, service-worker readiness, subscription creation and backend persistence succeed. Missing VAPID or Supabase configuration is shown as an unavailable state.

## Build Safety

Supabase, Resend and Web Push clients are created lazily so `next build` works without production secrets.
