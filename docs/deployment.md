# Deployment

## Required Services

- Supabase project
- Next.js host
- Optional Resend account
- Optional SMS provider through Supabase phone auth
- Optional Google OAuth client configured in Supabase
- VAPID key pair for browser push

## Steps

1. Install dependencies with `pnpm install --ignore-scripts`.
2. Create `.env.local` from `.env.example`.
3. Run Supabase migration `supabase/migrations/0001_initial_schema.sql`.
4. Configure auth providers.
5. Add production environment variables to the deployment host.
6. Run `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm content:validate` and `pnpm build`.
7. Deploy.

## Environment Variables

See `.env.example`.

Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.
