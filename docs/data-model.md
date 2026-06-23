# Data Model

Core opportunity fields:

- title, slug, category, description
- visual-cover reference
- official organisation, official URL and official action label
- national/state scope and applicable states
- deadline, or `null` for directories and rolling sources
- benefit type
- eligibility summary and structured eligibility tags
- education, age-band, gender, income and current-role relevance
- common documents
- what it offers, who can apply, conditions and application steps
- last checked date
- `content_status`
- source domain
- expired flag

## Content Status

AwsarSetu V3 separates content freshness from visual presentation:

- `verified-active`: an individual notice was reviewed from an official source and can appear in active sections such as Closing Soon or Matches.
- `official-directory`: a trusted official pathway where individual notices still need review before AwsarSetu treats them as active records.
- `archived`: retained for history, not shown in active discovery.
- `unavailable`: source is unavailable or unsuitable for public display.
- `development-sample`: UI/development only; never shown as verified, live, matched, closing soon or newly checked production content.

The legacy `verification_status` column remains mapped for migration compatibility, but new application code uses `content_status`.

## User-Owned Data

- `profiles`: optional state, age band, education level, current role, interests and limited optional matching fields.
- `saved_opportunities`: saved status, private notes and reminder date.
- `notification_preferences`: quiet alert settings and category preferences.
- `push_subscriptions`: browser push endpoints after permission and backend storage succeed.
- `notification_events`: notification audit trail.

Guest profiles and saved items are stored locally first. When Supabase Auth is configured and the user signs in, user-owned rows sync behind Row Level Security. Policies restrict rows to `auth.uid()`.
