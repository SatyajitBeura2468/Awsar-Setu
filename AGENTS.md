# Repository Rules

## Product Guardrails

- Keep the experience browse-first. Do not force sign-in for Home, Explore, Vacancies, detail pages, guides or official-source links.
- Never claim government affiliation, partnership, endorsement or authority.
- Never show "guaranteed eligible". Use "Likely Match", "Possible Match" or "Check Criteria".
- Do not collect Aadhaar, bank details, caste certificate details, disability records, detailed medical data or exact date of birth.
- Use only official-source links for opportunity CTAs.
- Do not add a public admin dashboard or user-submitted opportunity posting.

## Development Commands

```bash
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm content:validate
pnpm build
pnpm test:e2e
```

## Data Rules

- Starter records marked `development-sample` are not production content.
- Production records require official-source review, source domain validation and a `last_checked` date.
- Content imports must use `content/samples/opportunities.sample.json` shape and pass `pnpm content:validate`.

## Security Rules

- Never commit secrets or service-role keys.
- Supabase service-role keys belong only in protected server-side scripts or deployment secrets.
- RLS must remain enabled for user-owned tables.
- External URLs must be validated and displayed as official-source actions, not raw ugly URLs.
