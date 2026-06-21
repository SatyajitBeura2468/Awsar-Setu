# Architecture

## Application

The app uses Next.js App Router with mostly static public browsing routes and focused client components for search, filters, language switching, local saves and auth actions.

## Data

Starter data is in `src/lib/opportunities.ts` for development. Production data should live in Supabase `opportunities` after content review.

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

## Build Safety

Supabase, Resend and Web Push clients are created lazily so `next build` works without production secrets.
