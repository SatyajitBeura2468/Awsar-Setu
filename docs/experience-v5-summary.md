# AwsarSetu Experience V5

## Product direction

V5 turns AwsarSetu from a calm directory into an Opportunity Navigation System. The product uses routes, trust nodes, deadline signals and journey rails to make discovery and follow-through feel connected without claiming government affiliation or eligibility certainty.

## Major changes

- Rebuilt the shell and brand lockup around an editorial civic design system.
- Replaced the decorative compass with a responsive Opportunity Route Map.
- Reworked Home into role, trusted-source, verified-notice and guide rails.
- Rebuilt Explore as a desktop filter rail plus a scannable single-column result list, with a mobile filter sheet.
- Rebuilt opportunity details as a decision workspace with facts, match guidance, next steps, private notes and source preflight.
- Rebuilt Saved as an opportunity journey with status stages, selected-item notes and reminders.
- Rebuilt Account as a progressive profile, sync, alerts and review flow.
- Completed configured authentication flows for sign in, sign up, password recovery, phone OTP verification, Google OAuth, session state and sign out.
- Added reusable dialog focus trapping and focus restoration.
- Fixed mobile overflow, hero spacing and filter anatomy.

## Visual references

- `design/awsarsetu-v5-home-concept.png`
- `design/awsarsetu-v5-explore-concept.png`
- `design/awsarsetu-v5-workspace-concept.png`
- `design/awsarsetu-v5-account-concept.png`
- `design/awsarsetu-v5-design-system.md`

## Product truth

The starter dataset still contains official-directory pathways rather than invented active notices. Verified notices appear only after notice-level official-source review. Supabase, OAuth, VAPID and Resend features remain truthfully configuration-gated.

## Release evidence

- ESLint: passed
- TypeScript: passed
- Vitest: 3/3 passed
- Opportunity content validation: passed
- Playwright production flows: 12/12 passed across desktop Chromium and Pixel 7 mobile profiles
- Next.js production build: passed with 24 generated routes
- Visual fidelity: reviewed at 1440px and 390px; see `qa/v5/fidelity-ledger.md`
