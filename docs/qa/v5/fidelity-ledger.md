# AwsarSetu V5 fidelity ledger

This ledger compares the generated design direction in `docs/design/` with the production build captured in `docs/qa/v5/`.

| Area | Concept target | Production result | Status |
| --- | --- | --- | --- |
| Home hierarchy | Editorial serif hero, route-map visual, search, two primary actions, role paths | Preserved with a stronger real brand lockup, animated SVG route map, working search and working CTAs | Matched |
| Home system | Cool civic canvas, midnight typography, blue routes, teal trust, saffron next-step accents | Token system carries consistently through navigation, map, trust copy, controls and focus states | Matched |
| Explore structure | One filter rail plus one scannable opportunity list | Desktop filter rail, mobile filter sheet, search, working sort modes, personal/all toggle, save and detail actions | Matched |
| Explore information | Compact metadata, source trust, match expansion | Real directory metadata and cautious match guidance; no invented eligibility or fake live counts | Matched with truth correction |
| Opportunity detail | Large title, fact rail, section navigation, source-first action and progress rail | Preserved with working anchors, save/share feedback, private notes and official-source preflight | Matched |
| Saved workspace | Journey stages, selected record workspace, notes, reminders and checklist | Implemented with persisted local or synced state, editable stage, notes and reminder date | Matched |
| Account | Opportunity-compass story, progressive profile, sync and alerts | Four-step responsive flow, optional signals, config-gated auth, quiet alerts and privacy explanation | Matched |
| Mobile | Stacked editorial layouts, bottom navigation, touch-sized actions | 390px layouts validated with no horizontal overflow; filters and source actions remain reachable | Matched |
| Accessibility | Clear hierarchy and calm motion | Semantic landmarks, skip link, focus visibility, dialog focus trapping, labels and reduced-motion fallbacks | Matched |

## Intentional deviations

- The real AwsarSetu logo mark replaces inconsistent generated marks so identity remains coherent across routes.
- Generated fake totals and dated sample notices were not implemented. Explore reports the six records actually shipped, and the home page explains when verified notice-level data is unavailable.
- The route-map is a lightweight, implementation-owned SVG abstraction rather than a geographic claim or heavy map dependency.
- “V5” remains an internal release label instead of being added to the public wordmark.
- Account authentication providers appear only when Supabase is configured; otherwise the product honestly presents private guest mode.

## QA notes

- Interaction and visual review began in the selected Chrome session.
- Chrome extensions injected attributes and overlays into that session, so final artifact screenshots were recaptured in clean Playwright Chromium with GPU compositing disabled.
- Desktop and mobile product flows are covered by the Playwright suite; screenshots are reference evidence, not substitutes for interaction testing.
