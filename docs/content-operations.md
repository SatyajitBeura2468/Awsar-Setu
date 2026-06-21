# Content Operations

AwsarSetu V1 has no public admin dashboard and no user-submitted opportunity posting.

## Approved Workflow

1. Find an official source.
2. Record the source domain, official URL and last checked date.
3. Extract only facts present in the official source.
4. Validate the record with `pnpm content:validate`.
5. Import through protected database access or `pnpm content:import <file>` in a trusted environment with `SUPABASE_SERVICE_ROLE_KEY`.
6. Mark records as `source-linked` or `officially-reviewed` only after review.

## Never Add

- Unofficial application links
- Affiliate links
- Advertisement redirects
- Unverified deadlines
- Invented eligibility or benefit details
- Guaranteed eligibility language

## Development Data

`development-sample` records demonstrate UI shape only. They must not be presented as production-verified content.
