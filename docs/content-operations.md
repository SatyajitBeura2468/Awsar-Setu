# Content Operations

AwsarSetu has no public admin dashboard and no user-submitted opportunity posting. Content is maintained through reviewed data files, protected database access or trusted import scripts.

## Approved Workflow

1. Find an official source.
2. Record the source domain, official URL and last checked date.
3. Extract only facts present in the official source.
4. Classify the record with the V3 `contentStatus` model.
5. Validate the record with `pnpm content:validate`.
6. Import through protected database access or `pnpm content:import <file>` in a trusted environment with `SUPABASE_SERVICE_ROLE_KEY`.

## Content Status Rules

- Use `verified-active` only for an individual notice reviewed from an official source.
- Use `official-directory` for a trusted official portal or directory where users can check current notices.
- Use `archived` when a notice is no longer active but remains useful as history.
- Use `unavailable` when the source cannot currently be used safely.
- Keep `development-sample` out of production imports. The import script rejects it.

Only `verified-active` records should appear in Closing Soon, New, Live or personalised-match surfaces that imply active opportunity data. Official directories can appear as source pathways, but the UI must not invent deadlines, benefits or eligibility certainty for them.

## Never Add

- Unofficial application links
- Affiliate links
- Advertisement redirects
- Unverified deadlines
- Invented eligibility or benefit details
- Guaranteed eligibility language
- Claims of government affiliation, endorsement or partnership

## Development Data

`development-sample` records demonstrate UI shape only. They must not be presented as production-verified content or mixed into active discovery sections.
