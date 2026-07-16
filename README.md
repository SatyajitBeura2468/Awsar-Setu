# AwsarSetu

AwsarSetu is an independent, citizen-first opportunity navigation system for India.

Core promise: **Find opportunities made for your next step.**

It helps people browse scholarships, jobs, vacancies, schemes, training and support without forcing sign-in. Accounts are optional for syncing saves, application tracking, profile-based matches and quiet notifications.

The V5 experience uses a source-first route map, editorial discovery lists, decision-oriented opportunity pages, a saved-application journey and progressive profile controls. Every public browsing flow remains usable without an account.

AwsarSetu is not a government website, official authority, partner or endorsement channel.

## Stack

- Next.js App Router with TypeScript
- Tailwind CSS
- Supabase Auth, PostgreSQL and Row Level Security
- Resend email abstraction
- Web Push with VAPID and a service worker
- Vitest and Playwright
- Local bundled Noto Sans and Noto Sans Devanagari fonts

## Local Setup

```bash
pnpm install --ignore-scripts
cp .env.example .env.local
pnpm dev
```

Open `http://localhost:3000`.

## Quality Commands

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm content:validate
pnpm build
pnpm test:e2e
```

## Deployment

1. Create a Supabase project and run `supabase/migrations/0001_initial_schema.sql`.
2. Add production environment variables from `.env.example`.
3. Configure Supabase Auth providers for email/password, phone OTP and optional Google OAuth.
4. Add Resend credentials if email alerts are enabled.
5. Add VAPID keys for browser notifications.
6. Deploy to Vercel, Netlify or another Next.js-capable host.

Detailed setup lives in `docs/deployment.md` and `docs/auth-setup.md`.
