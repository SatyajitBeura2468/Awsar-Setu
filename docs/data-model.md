# Data Model

Core opportunity fields:

- title, slug, category, description
- visual cover
- official organisation, official URL, official action label
- national/state scope and applicable states
- deadline
- benefit type
- eligibility summary and structured tags
- education, age, gender, income and current-role relevance
- common documents
- what it offers, who can apply, conditions and application steps
- last checked date
- verification status
- source domain
- expired flag

User-owned tables:

- `profiles`
- `saved_opportunities`
- `notification_preferences`
- `push_subscriptions`
- `notification_events`

RLS policies restrict user-owned rows to `auth.uid()`.

Production opportunities are public only when `verification_status` is `officially-reviewed` or `source-linked`.
