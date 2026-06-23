# AwsarSetu Experience V3 Plan

## Audit Findings

- Personalisation is still prototype-backed: Home, Explore, Vacancies and Detail use a hard-coded Odisha, age 19 student profile.
- Sample records are shown in active product sections such as Matches, Closing Soon, New and Vacancies, which can imply verified live content.
- The header state control is visual only; Explore state and age controls are not tied to a shared profile model.
- Saved items persist locally, but profile preferences and notification preferences do not yet share a reliable guest-first store.
- Notification UI can claim readiness before a real push subscription is created and stored.
- Opportunity exits go directly to external sources without a preflight trust step.
- The current V2 visuals are more polished, but the experience still feels like sections of cards instead of a connected Opportunity Atlas.

## V3 Implementation Slices

1. Shared profile and preference layer
   - Add a guest-first profile store for state, age band, education, role, interests, optional gender and optional income.
   - Make the header state control open a real state selector and update Home, Explore, Vacancies and matching immediately.
   - Persist profile and notification preferences locally; sync paths remain truthful when Supabase is unavailable.

2. Content status and trust model
   - Replace legacy verification labels with `verified-active`, `official-directory`, `archived`, `unavailable` and `development-sample`.
   - Keep development samples out of active sections by default.
   - Add reusable trust/status UI and transparency explanations for source domain, freshness, deadlines and official-link behaviour.

3. Functional discovery engine
   - Rework Home, Explore and Vacancies to use real profile state, age bands, filters, URL params and conservative matching.
   - Add useful empty states and broaden-search recovery paths instead of blank or misleading results.
   - Make "For You" open a progressive profile sheet when profile information is insufficient.

4. Opportunity Atlas experience system
   - Add reusable primitives: reduced-motion support, atlas background, route transition, interactive surface, magnetic action, reveal sequence, trust status, profile pulse, opportunity signal and source exit sheet.
   - Replace the static hero with an interactive, lightweight SVG/CSS atlas that responds to profile state and search focus.
   - Upgrade cards, detail pages, Saved and Account into connected journey surfaces without heavy 3D or scroll hijacking.

5. Notifications, saved tracking and external exits
   - Make notification preferences truthful about missing VAPID/Supabase configuration.
   - Store subscription attempts only after permission and backend persistence succeed.
   - Add source-exit preflight before official portals and preserve direct accessibility.

6. Validation and documentation
   - Update Supabase migrations and types where profile/content status fields changed.
   - Improve unit/e2e coverage for profile persistence, filters, status visibility, no fake active samples and notification configuration states.
   - Run lint, typecheck, unit tests, content validation, production build and Playwright e2e.
   - Capture and inspect screenshots at 1440, 1024, 390 and reduced-motion states.
   - Write `docs/experience-v3-summary.md` with outcomes, setup needs, screenshots and remaining production tasks.
