# AwsarSetu Experience V3 Summary

## What Changed

- Rebuilt the public experience around an "Opportunity Atlas" system: animated atlas hero, calmer route transitions, interactive surfaces, trust signals, profile pulse, source-exit preflight and richer opportunity capsules.
- Replaced hard-coded personalisation with a local-first profile store for state, age band, education, role and interests.
- Added a real state-selection modal. State changes now affect context, filters and matching language.
- Reworked Explore into a command-deck interface with working URL-backed search, sorting, category, state, age-band, role, education, benefit, deadline, content-status and confidence filters.
- Added a V3 content-status model: `verified-active`, `official-directory`, `archived`, `unavailable` and `development-sample`.
- Kept development samples out of active/matched/closing-soon surfaces and made official-directory records visibly distinct from verified active notices.
- Added source-exit sheets so official links open only after a clear "leaving AwsarSetu" trust step.
- Hardened guest saved-item persistence, tracker updates, notes, reminders and best-effort Supabase sync for signed-in users.
- Upgraded Account into an Opportunity Compass with truthful auth/configuration states, profile completeness and notification preferences.
- Added a Saved journey board with the four tracker statuses: Saved, Preparing, Applied and Archived.
- Updated Supabase migration, import validation, content operations, data model and architecture docs for the V3 trust model.

## Fully Functional

- Guest browsing across Home, Explore, Vacancies, Saved, Account and detail pages.
- Local profile persistence and state changes.
- Local saved items, private notes, tracker status and reminder dates.
- Conservative matching labels: Likely Match, Possible Match and Check Criteria.
- Explore URL parameters and one-click reset/selective lens chips.
- Official-directory trust labels, source domains, last-checked dates and source-exit preflight.
- Notification preference UI with truthful disabled states when VAPID/Supabase are missing.
- Reduced-motion handling for the atlas and motion primitives.
- Mobile bottom navigation and responsive tablet/desktop layouts.

## Intentionally Unavailable Without Credentials

- Supabase account sync, authenticated profile sync and cross-device saved items.
- Email/password, phone OTP and Google OAuth sign-in in real environments.
- Browser push subscription storage and delivery.
- Email alert delivery.
- SMS OTP delivery.
- Production opportunity imports through protected Supabase service-role access.

## Required Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_ENABLE_PHONE_OTP`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`
- `VAPID_SUBJECT`
- `NEXT_PUBLIC_APP_URL`

Google OAuth client details and SMS provider credentials are configured in Supabase Auth provider settings, not committed to the repository.

## Data And Migration Changes

- Added `supabase/migrations/0002_experience_v3.sql`.
- Added `opportunities.content_status` with public read gating for trustworthy statuses.
- Added `profiles.age_band`.
- Added notification category preference fields.
- Updated opportunity import and validation scripts to require `contentStatus` and reject `development-sample` production imports.

## Verification

- `node_modules\.bin\eslint.cmd` passed.
- `node_modules\.bin\tsc.cmd --noEmit` passed.
- `node_modules\.bin\vitest.cmd run` passed: 1 file, 3 tests.
- `node scripts\validate-opportunities.mjs` passed: 1 sample record.
- `node_modules\.bin\next.cmd build` passed.
- Playwright browser suite passed through an explicitly managed local server with `PLAYWRIGHT_SKIP_WEBSERVER=1`: 10 tests passed across desktop Chromium and mobile.

The built-in Playwright `webServer` hook can pass tests but hang during teardown in this Windows shell, so the config now supports externally managed server runs with `PLAYWRIGHT_SKIP_WEBSERVER=1`.

## Screenshots Inspected

- `../qa-v3/viewport-home-1440.png`
- `../qa-v3/viewport-explore-active-1440.png`
- `../qa-v3/viewport-detail-1440.png`
- `../qa-v3/viewport-saved-1440.png`
- `../qa-v3/viewport-account-1440.png`
- `../qa-v3/viewport-home-1024.png`
- `../qa-v3/viewport-home-mobile-390.png`
- `../qa-v3/viewport-mobile-nav-390.png`
- `../qa-v3/viewport-home-reduced-motion-1440.png`

## Remaining Production Tasks

- Connect a real Supabase project and apply migrations.
- Configure Supabase Auth providers, including Google OAuth and phone OTP SMS provider if phone sign-in is enabled.
- Generate and configure production VAPID keys.
- Configure Resend sender domain and production email credentials.
- Populate verified active opportunities from official sources. The current starter app uses official-directory pathways and a development sample file for workflow validation.
- Configure the production deployment domain in `NEXT_PUBLIC_APP_URL`.
