# Build interactive portfolio demos — Claude implementation brief

## Your task

Implement polished, responsive, interactive demos for **every project currently in this portfolio**. Do the implementation and verification, not just a proposal. Visitors should experience the workflows Priyansh built, understand their value, and be able to explore meaningful outcomes. Every visible control must work.

**All new demos run entirely in the browser using React state and synthetic fixtures. There is no demo backend, live AI, API key, paid integration, real message delivery, real trade, or real checkout.** Existing portfolio contact functionality is separate and must remain intact.

Use source-project UI components and interaction patterns where suitable. Adapt them into self-contained portfolio components rather than copying whole applications. Where a project only has backend or workflow code, create an honest interactive visualization of that implementation. Do not present invented UI as a screenshot of the shipped product.

The owner wants excellent usability, responsive layouts, proper coding practices, and complete working interactions. Prefer a small, complete product journey for each project over a broad dashboard full of inactive controls. All 11 projects need a distinct demo; do not finish after implementing only the featured projects.

## Repository and context

- Portfolio root: `C:\Users\BT 47\Desktop\New folder\profit-builders\portfolio`
- Primary source collection: `C:\Users\BT 47\Desktop\New folder`
- Backup source collection: `C:\Users\BT 47\Desktop\New folder\BACKUP`
- This handoff was prepared after a successful fast-forward pull of `main` to `1ae4c06` on 2026-09-22. Inspect current files and Git status; the repository may evolve.
- Stack at handoff: Next.js 16.2.4, React 19.2.6, TypeScript, CSS modules/global design tokens, lucide-react. Production uses static export plus the existing contact Worker packaging.
- Read applicable `AGENTS.md`, `docs/PROJECT-PORTFOLIO-GUIDE.md`, and relevant `docs/project-evidence/<slug>.md`. The older guide's description of the content model is outdated: optional case-study fields now exist. Current code is authoritative.
- This document authorizes demo implementation in the portfolio. Source applications are read-only. Leave work local for review unless the owner explicitly requests a commit, push, or deployment in your session.
- The owner plans to purchase a domain later. Preserve the existing preview/noindex configuration, canonical logic, sitemap, metadata, structured data, social images, and hosting identity.
- Do not reintroduce BrewMind, Profit Builders Alerts, or Investor Report Generator. Preserve the names **AI Workforce Engine** and **Trading Strategy & Execution Engine** and all existing slugs.

Inspect these integration points before editing:

| File | Purpose |
| --- | --- |
| `lib/content.ts` | Current project inventory, technical details, contribution boundaries |
| `app/projects/[slug]/page.tsx` | Static routes, metadata, schema, shared case-study layout |
| `app/projects/[slug]/project.module.css` | Detail-page layout |
| `components/project-showcase.tsx` | Homepage project cards |
| `components/expertise-projects.tsx` | Searchable homepage project index |
| `components/project-visual.tsx`, `lib/project-art.ts` | Existing covers and provenance labels |
| `app/globals.css`, `components/header.tsx` | Design system, themes, navigation |
| `components/effects.tsx` and motion controls | Existing animation/accessibility behavior |
| `next.config.ts`, `scripts/dev.mjs`, `scripts/package-worker.mjs` | Static build and development lifecycle |
| `lib/site.ts`, `scripts/check-seo.mjs` | Indexing configuration and SEO checks |

## Source discovery and reuse

These paths are starting points, not permission to copy sensitive content. Resolve and inspect them. If more than one copy exists, compare the relevant implementation and record which one was selected; do not assume a backup is newest.

| Slug / name | Starting source locations relative to the primary source collection |
| --- | --- |
| `growstack` / Growstack AI | `BACKUP/Growstack/Growstack-Backend-PythonService`; inspect sibling frontend folders only if present |
| `urecruits` / uRecruits | `uR`; confirmed contribution is `BE/apps/agents-api` and `BE/libs/agents`; locate related frontend screens |
| `zyberon` / Zyberon AI | `BACKUP/zyberon-ai`; read `zyberon-ai-platform.md` and `app/dashboard` |
| `voice-agent` / AI Voice Agent | `BACKUP/AI-Outbound`; backend references under `AI-Outbound-BE`; discover frontend if available |
| `mychatpdf` / MyChatPDF | `mychatpdf` and `BACKUP/mychatpdf`; inspect frontend and backend processing/chat flows |
| `workforce-engine` / AI Workforce Engine | `BACKUP/bitontree-force-engine`; start at `core/router.py` and README |
| `top-cars-n8n` / Top Cars Sales Agent | `n8n_tobi/n8n_json/1. Top Cars Main Agent.json` and linked subworkflows; alternate copy under `BACKUP/n8n_tobi` |
| `hotel-social-n8n` / Hotel Social Media Agent | `n8n_tobi/backups/Hotel_Social_Media_EtBfnzIS7iH8yRQP_backup_2026-07-31.json`; inspect tests and alternate copy if needed |
| `epulse-discovery` / EPulse Event Discovery | `BACKUP/E-Pulse/epulse-hermes-agent`; also inspect `epulse-fe` for compatible discovery UI |
| `trading-engine` / Trading Strategy & Execution Engine | `40-minute-auto-trader`; inspect React UI and `python-engine/README.md` |
| `sketchapaw` / SketchAPaw | `SketchAPawFE`; inspect actual custom builder routes/components, `app/lib/sketchapaw/workflow.server.ts`, and preview validation |

Inspect routes, component dependencies, styles, state, and data contracts before reuse. Copy only necessary presentation code and appropriate assets, then replace server hooks, auth, routers, analytics, and service dependencies with typed local adapters. Adapt React Router/Hydrogen components to the portfolio's Next.js environment; never import server-only Shopify utilities into the browser.

Do not execute source scripts, install source dependencies, start source services, read `.env`, or connect to production. Do not publish credentials, customer data, internal URLs, private repository links, raw logs, or proprietary prompts. Use invented names and `example.com` addresses. Record source-relative component references and significant adaptations in `docs/demo-implementation-notes.md`, outside `public/`.

If a source is unavailable, use the existing evidence and case study to build a clearly labeled representative simulation. Record the limitation without blocking unrelated demos or claiming source fidelity. Preserve authorship boundaries: Growstack's confirmed contribution is its Python backend, uRecruits is its multi-agent service, and Zyberon is owner-confirmed as built from scratch. Broader product features are not automatically personal contributions.

## Visitor experience and placement

1. Add a clear **Try interactive demo** entry near the top of each project page. It leads to an inline, accessible demo section with a short purpose statement. Optionally add a secondary homepage entry without nesting a button inside an existing card link.
2. Keep the server-rendered case study and covers. Load the interactive module when the visitor opens it; do not eagerly ship every demo to the homepage or every project page.
3. Show a concise, persistent label: **Interactive demo · sample data · runs in your browser**. Project-specific wording must make simulated AI, calls, exports, scheduling, orders, and trading clear.
4. Start with useful prefilled sample data and an obvious first action. Provide **Try another scenario** and **Reset demo**. A visitor should reach a meaningful outcome quickly without onboarding, login, or required personal data.
5. Give each demo a distinct visual identity and workflow drawn from the source, while retaining the portfolio's typography, spacing, themes, and navigation. Do not implement eleven reskins of the same chatbot.
6. Include an optional **How this works** view connecting visible steps to the real architecture and benefit. Keep technical detail out of the primary task flow unless it helps the visitor make a decision.
7. Avoid autoplay and long artificial waits. Short simulated progress must be cancellable. Clearly label fixture timings, counts, and scores as illustrative, not production results.

## Per-project implementation contracts

The following are demo requirements, not assertions that every proposed control exists in the source. Verify source behavior and adapt the simulation accordingly. Each demo needs at least one happy path, one meaningful alternate/edge path, and a working reset.

### 1. Growstack AI — query to usable business data

- Reuse an analytics/filter UI if available; otherwise build a clearly labeled interface demonstrating the Python service.
- Offer business-search examples and editable industry/location/company-size filters over a small synthetic dataset. Text examples should map deterministically to filters. Explain supported input and handle unsupported requests usefully.
- Show the sequence: interpret request → filter plan → query preview → matching rows. Display a safe, read-only SQL representation; never execute arbitrary SQL.
- Changing filters updates the rows/count, sorting and pagination work, and an empty result offers an obvious recovery action.
- Export the actual filtered demo rows as a client-generated CSV; log a simulated export event in local state. Escape CSV cells that could be interpreted as spreadsheet formulas.
- Benefit to demonstrate: converting a business question into inspectable filters and an exportable result.

### 2. uRecruits — supervisor and specialist agents

- Reuse the agent conversation/task UI where available. Keep the demo focused on Priyansh's multi-agent service.
- Provide tasks covering job, workflow, assessment, interview scheduling, and read-only assistant specialists. Show supervisor routing, the active specialist, and a concise event trail.
- At least one mutating task proposes a pending action and requires the visitor to confirm or cancel before local records change. Editing the proposed details must affect the final record.
- Simulate incremental replies locally with stop/retry controls and cancellation-safe timers. Do not claim real SSE, live candidate evaluation, or real interviews.
- Make unsupported free text recover with helpful sample tasks rather than an unrelated canned answer.
- Benefit: coordinating specialist recruitment tasks with visible handoffs and reviewable actions.

### 3. Zyberon AI — connected commerce workspace

- Reuse relevant dashboard components. Build a complete core journey: select a synthetic Shopify product → choose campaign goal/audience → edit generated sample copy → preview → submit a simulated campaign request → see its status/activity.
- Demonstrate a usage-limit or rejected-request scenario and a retry/recovery path. No Meta, Shopify, Stripe, or n8n calls.
- Provide a small representative second workflow, such as a product-informed support reply or social draft, to demonstrate shared store context.
- Do not reproduce nine module navigation links unless all lead to useful implemented views. An informational module overview is acceptable; a fake operational control is not.
- Benefit: using shared product context across marketing and support with review before action.

### 4. AI Voice Agent — campaign and call lifecycle

- Use synthetic leads and campaign settings. Run a simulated call with a readable transcript, lifecycle indicator, and qualification outcome.
- Include connected, no-answer/callback, and opt-out scenarios. Stop must interrupt the simulation, and retry/callback must visibly update local lead state.
- Let the visitor choose an available fixture appointment and confirm a simulated booking; expose conflicts as a recoverable case.
- Audio is optional. Do not require microphone permission, dial numbers, or depend on speech synthesis for the core experience. Only show playback controls when an actual local audio asset is available.
- Benefit: turning outreach outcomes into structured follow-up actions.

### 5. MyChatPDF — document questions with citations

- Reuse document library, preview, and chat components. Bundle small synthetic example documents with matching text, page references, and answer fixtures.
- Let visitors choose a document, view it, ask supported questions, and click citations to open/highlight the correct source passage. Explain when the sample document does not contain an answer.
- Simulate ingestion states with retry/reset and make switching documents clear conversation/context appropriately.
- If an upload control is included, it must validate and genuinely use supported local content. Do not pretend to parse arbitrary PDFs or answer about a user's upload with canned sample-document facts. A complete sample-document-only experience is acceptable and preferable to misleading uploads.
- Benefit: checking an answer against its document evidence.

### 6. AI Workforce Engine — task routing and handoffs

- Build an interactive agent-team view based on the actual router and agent definitions. Visitors choose a task, inspect agent responsibilities, and run a deterministic multi-step scenario.
- Show routing, scoped context, tool-result fixtures, handoff, and final outcome. Allow stepping through events and inspecting the context each specialist receives.
- Include an unsupported task or failed-tool scenario with a bounded retry/handoff path. Never create infinite agent loops.
- Benefit: understanding why a task is delegated and how specialists cooperate.

### 7. Top Cars Sales Agent — n8n sales workflow

- Pair a synthetic customer conversation with the shared n8n explorer described below.
- Allow scenario selection for availability, wrap/PPF, coating/tint, warranty, objections, and escalation, selecting a representative subset based on verified subworkflows.
- Changing the request must change the branch, node trace, and response fixture. Inspect a subworkflow and return to the parent without losing execution context.
- Show how vehicle context and conversation history influence the sample reply; human escalation creates a visible local handoff record.
- Benefit: routing a sales enquiry to the right contextual assistance or a human.

### 8. Hotel Social Media Agent — n8n moderation and approval

- Pair a sample social inbox with the shared n8n explorer. Offer enquiry, positive comment, and escalation/moderation examples based on source branches.
- Show normalization → rule decision → sample draft → approval → simulated action. The visitor can edit, approve, or reject the draft.
- Approval alone updates the local published/replied state. Rejection must not publish. Double-clicking approval must not create duplicate activity entries.
- Include a failed-action scenario with a visible retry. No Slack, CRM, or Meta calls; show those systems as labeled simulated steps.
- Benefit: keeping social response automation reviewable before an external action.

### 9. EPulse Event Discovery — discovery to reviewed shortlist

- Reuse relevant event discovery/listing UI if compatible. Filter synthetic events by city, dates, category, and budget.
- Simulate extraction, validation, duplicate removal, and review. Show source labels and illustrative confidence; let visitors inspect a duplicate pair and accept/reject candidates.
- Working sort/filter, saved shortlist, and downloadable CSV should reflect current state. Dates must remain coherent; avoid relying on expired hardcoded future dates.
- No live scraping, outreach, booking, or claims that fixture events are real upcoming events.
- Benefit: converting noisy event candidates into a traceable, reviewed shortlist.

### 10. Trading Strategy & Execution Engine — deterministic paper replay

- Reuse chart, strategy controls, and execution-status UI where practical. Use a fixed synthetic candle series, never market feeds or broker credentials.
- Let visitors select a supported strategy scenario and run/pause/step/reset a replay. Keep chart cursor, signals, gate state, and local order ledger synchronized.
- Demonstrate a passing execution gate, a blocked trade, and a reconciliation mismatch/recovery. Strategy changes must affect behavior or select a clearly identified distinct fixture.
- Prominent **Simulated paper replay · synthetic data · no real orders** label. Any P&L is illustrative fixture arithmetic, not a return claim; omitting P&L is acceptable.
- Benefit: showing execution controls, traceability, and reconciliation rather than implying profitability.

### 11. SketchAPaw — pet portrait builder

- Adapt the original guided builder: sample pet → style → background → personalization → preview → format → simulated order summary.
- Use a curated set of safe bundled pet photos and corresponding pre-rendered artwork variants. Style/background controls must visibly affect the preview, with the caption **Pre-rendered demo preview**, not a claim of live generation.
- If local photo upload is offered, show the selected image honestly with real validation and local-only preview. Do not imply it was transformed into unrelated bundled artwork. Never persist visitor photos or transmit them.
- Back/next navigation retains valid choices, text personalization visibly updates, format changes the summary, and the final action produces a simulated confirmation without payment.
- Benefit: experiencing the guided customization and preview-to-order flow.

## n8n: interactive workflow explorer without n8n hosting

Build one reusable explorer used by the two n8n projects. Do not embed a live n8n editor, require an n8n account, or use a screenshot as the only workflow experience.

- Create a curated graph model from the inspected export: stable local IDs, safe labels, node kind, position, edges, descriptions, and synthetic input/output fixtures. Preserve important branch and subworkflow relationships; simplify irrelevant setup with explicit collapsed groups.
- **Never ship raw workflow exports.** They may contain credentials references, webhook URLs, pinned data, customer records, expressions, or proprietary prompts. Transform with an allowlist and inspect the resulting files. Connection labels alone do not prove how a node behaves; inspect relevant source configuration safely.
- Desktop: workflow canvas, readable nodes/edges, pan/zoom/fit, selected-node inspector, execution controls, and a useful legend. Use accessible DOM nodes with SVG edges for a small graph; use a maintained graph library only if its value justifies the dependency.
- Mobile: default to an ordered execution/branch list with expandable node details. Keep the graph optional. Do not force visitors to pinch a miniature desktop canvas.
- Controls: scenario selector, run, pause/resume, next step, reset, node selection, and subworkflow/back where applicable. Explain disabled controls. All controls must affect real local state.
- States: idle, running, waiting for approval, succeeded, failed, skipped, cancelled. Show active edges and an event timeline. The inspector exposes a plain-language purpose and sanitized sample input/output; JSON is optional secondary detail.
- Use one deterministic execution controller for canvas, log, inspector, and application panel. Never animate a fixed happy path while the selected scenario or approval state says otherwise.
- Support branching, a failure with bounded retry, and human approval. Pause must stop progress. Reset/scenario change must cancel all old timers and clear previous run state. Step mode must remain usable with reduced motion.
- Provide keyboard-accessible node selection and an equivalent list view. Never use color alone to indicate status.
- Optional download: a sanitized **demo execution report** generated from current state. Do not label a simplified graph as an importable production n8n workflow.

## Implementation practices

Use the simplest maintainable architecture that supports the real workflows. Suggested organization (adapt to existing conventions):

```text
components/demos/
  demo-launcher.tsx       # Small client entry and per-project lazy loading
  demo-shell.tsx          # Shared frame, disclosure, reset, status, error handling
  shared/                # Only genuinely shared controls and graph explorer
  growstack/ ...          # One focused module per project slug
lib/demos/
  types.ts               # Typed scenario/action/event contracts
  fixtures/              # Synthetic data, separate from presentation
public/demos/            # Optimized safe assets only
docs/demo-implementation-notes.md
```

- Keep the page, metadata, and case-study content server-rendered. Place `'use client'` at the interactive boundary. Configure client-only dynamic loading inside a client wrapper, compatible with current Next.js static export.
- Use explicit per-project dynamic imports; do not import every large demo into a barrel loaded globally. Render an accessible loading state and recoverable module error state.
- Prefer React state/reducers and discriminated unions for lifecycle transitions. Derived counts, totals, filters, and selected records should have a single source of truth. Avoid a giant component or loosely related booleans allowing impossible states.
- Keep fixture engines pure where possible. Abstract a shared simulator only where behavior is actually shared; don't force unrelated apps into one generic schema.
- Use strict TypeScript, descriptive names, semantic components, scoped styles, and existing tokens. No unexplained `any`, blanket lint/type suppression, duplicated app shells, or wholesale source dependency installs.
- Demo code must make no service requests: no API routes, server actions, fetches to providers, sockets, analytics added for demos, or secret-bearing browser config. Static same-origin assets and ordinary portfolio navigation are allowed. Browser state does not implement real authorization, tenant security, or payment entitlements; describe those as simulated.
- Default to in-memory state. Local persistence is optional only for harmless preferences, with clear reset behavior and safe parsing/versioning. Do not persist typed personal data or uploads.
- Cancel timers and in-flight simulated runs on stop, reset, scenario change, close, and unmount. Prevent duplicate submissions and stale updates after navigation. Use stable fixture IDs and deterministic timelines.
- Guard browser APIs for hydration/SSR. Create/revoke Blob URLs correctly. Downloads must contain current demo data with correct filenames/types. Clipboard actions need success/failure feedback and a fallback.
- Bound uploads, messages, and fixture data. Validate inline and preserve user input on recoverable errors. Free text must receive a relevant deterministic response or an honest unsupported-input path.
- Existing production contact integration, build packaging, SEO, project images, theme controls, and motion settings must continue working.

## Responsive design and accessibility

- Test at 360px, 390px, 768px, 1024px, and 1440px. No page-level horizontal overflow. Allow labeled horizontal scroll within genuinely wide tables/charts, and offer stacked summaries where useful.
- On small screens, place the primary task before technical inspectors. Convert side panels into tabs, drawers, or stacked sections; preserve context and state during layout changes.
- Use real labels, keyboard operability, visible focus, logical focus order, comfortable touch targets (aim for 44px), sufficient contrast, and readable text in both themes.
- Dialogs/drawers need focus management, Escape dismissal, an accessible name, and focus restoration. Avoid nested dialogs when an inline panel suffices.
- Use `aria-live` sparingly for meaningful status updates, not every streamed character. Associate validation errors with fields. Status must have text/icon cues in addition to color.
- Respect both OS reduced motion and existing portfolio motion controls. Charts/graphs need textual summaries or equivalent lists. Controls remain usable without animation.
- Avoid layout shifts by reserving demo/asset space. Do not play audio automatically. Preserve native page scrolling and browser back behavior.

## What “all buttons work” means

Maintain a control inventory for each demo in implementation notes. For each visible action, identify its input, state change, observable outcome, invalid/disabled behavior, and reset effect.

- No empty `onClick`, fake `href="#"`, endless spinner, toast-only pretend submission, decorative drag handle, or inactive search/filter/tab.
- Create/update/delete actions must change the displayed local data. Cancel must cancel. Undo must restore the relevant data. Reset must restore a coherent initial fixture and cancel previous work.
- Search and filters affect actual results; tabs expose distinct content; copy copies the shown value; export downloads the shown dataset; pagination uses real fixture pages.
- UI elements that are informational should look informational rather than like disabled product features. Omit unnecessary unavailable functionality.
- Integration actions should say **Simulate…** or be clearly within the labeled demo. Never report that a real message, call, payment, booking, or order was sent.

## Execution plan and verification

1. Inspect current portfolio and all source entry points. Record a short per-project component reuse map, core journey, alternate scenario, and missing evidence. Resolve ordinary implementation decisions independently.
2. Build the shared launcher/shell and one complete demo to validate loading, themes, responsiveness, lifecycle cleanup, and integration. Then implement the remaining project-specific demos and reusable n8n explorer.
3. Add focused tests for meaningful behavior: approval gates, routing/branches, reset/cancellation, result filtering/export, citation navigation, and replay transitions. Use the existing test stack if present; introduce a small conventional test setup only if needed. Avoid tests that merely mirror markup or assert fixture literals.
4. Use browser interaction checks for **all 11 demos**, not screenshots alone. Exercise primary workflow, alternate path, keyboard access, reset, repeated runs, and navigation away during execution. Inspect console/hydration errors and verify demo actions make no backend/provider requests.
5. Verify every demo at narrow mobile and desktop sizes in both themes. Spot-check intermediate widths, reduced motion, long content, empty results, repeated clicks, and loading/error states. Capture useful screenshots for review where available.
6. Run current repository checks: `npm run typecheck`, `npm run build`, and `node scripts/check-seo.mjs`, preserving the existing environment. Reconcile the demo registry against `lib/content.ts` so every current project has a working demo and no removed project returns.
7. Confirm case studies remain in exported HTML, existing URLs and metadata are preserved, assets exist, and lazy loading does not load all demos on the homepage. Compare production bundle output before/after; explain any material dependency cost.
8. Inspect the final diff for secrets, source paths in public output, unnecessary files, copied server code, placeholder controls, generated build artifacts, and unrelated changes.

Use `npm run dev` for review; it also starts the existing local contact service. Do not start source application servers. Track processes you start and stop them when review is finished unless the owner asks to keep the portfolio preview running.

## Definition of done and final response

All 11 project routes have discoverable, distinct, responsive demos; source reuse/adaptation is documented; both n8n workflows can be explored and simulated; all rendered controls work; fixture behavior is honest; there are no demo service dependencies; existing portfolio behavior and SEO pass their checks.

Finish with a concise matrix of project → implemented journey → alternate scenario → checks actually performed, then list key changed files and any concrete limitations. Do not claim browser testing, source fidelity, accessibility conformance, or performance scores that were not verified. If a check is unavailable, explain exactly what remains unverified. Do not call partial scaffolding complete or leave “coming soon” panels as the final result.

The quality target is that a visitor can immediately try a meaningful task, see a credible outcome, recover from a problem, and understand Priyansh's contribution—on a phone as comfortably as on a desktop.
