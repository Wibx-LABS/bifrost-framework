---
feature_id: notification-preferences-account
project_name: Notification Preferences
target_app: account
unit_of_delivery: single-PR
size: S
locked_at: 2026-07-30T14:04:36Z
locked_by: "@Intake"
schema_version: 1
trajectory_status: locked
---

# TRAJECTORY.md: Locked-at-launch invariants

Feature: Notification Preferences

<!-- Hydration note: bifrost-init did not run to completion (degraded pre-flight,
     Intake_Template.md Step 1). {{TECH_STACK_LOCK}} / {{SECURITY_BOUNDARIES_DEFAULT}} /
     {{PERF_BUDGETS_DEFAULT}} were filled by @Intake directly from knowledge/TECH_STACK.md
     and knowledge/GOTCHAS.md. -->

## 1. Feature identity        <!-- LOCKED on write -->

- **Name:** Notification Preferences
- **Scope statement:**
  A new lazy-loaded screen in the account app where a logged-in user views and edits 3 boolean notification channels (email, push, SMS). The screen loads current values from `GET /api/user/notification-preferences` on open, stages edits locally, persists the full `{ email, push, sms }` object via `PUT /api/user/notification-preferences` on Save, and gives translated success/error feedback. All rendered strings are translated in en, es, and pt-br. Delivered review-ready to Backend as one focused PR.

- **In-scope (binary):**
  - The feature adds one new container component (file quartet) with its own lazy-loaded module under `apps/account/src/app/containers/personal/notification-preferences/`.
  - The feature adds one new NgRx slice `notificationPreferences` (four-file pattern) in `apps/account/src/app/core/stores/`, plus its effects class in `core/effects/`, registered in the account `AppState`.
  - The feature calls exactly two API operations: GET and PUT on `/api/user/notification-preferences`, through the central `api` constant and a typed service wrapper with DTO → model adapter.
  - The feature renders 3 on/off controls (email, push, SMS), a Save action, a loading state, and success/error feedback.
  - The feature adds translation keys to `apps/account/src/assets/i18n/en.json`, `es.json`, and `pt-br.json` in the same commit.

- **Out-of-scope (binary):**
  - No per-category or per-event notification granularity — exactly the 3 channels, nothing more.
  - No changes to any existing NgRx slice, existing route, existing component, or existing translation key.
  - No backend work, no API contract changes, no new endpoints beyond the two named.
  - No auto-save on toggle flip — persistence happens only on explicit Save.
  - No notification sending, scheduling, or in-app notification center work.
  - No changes to other apps (business, shopping, tokengo) or to commonlib/walletlib source.

## 2. Hard constraints        <!-- LOCKED on write -->

- **Tech stack lock:** Angular 15.0.1, TypeScript ~4.8.3, RxJS ~6.6.0, NgRx 14.3.2 (@ngrx/store, effects, entity), Angular Material 15.0.0, @ngx-translate/core 14.0.0, Nx 16, Jest 29, Yarn 3.5.0 Berry (per knowledge/TECH_STACK.md).
  - Feature-specific: NO new dependencies — `package.json` is not modified. State lives in NgRx (no other state library). Forms are reactive-forms style with staged local state; no template-driven forms, no `[(ngModel)]`.

- **Security boundaries:** authenticated route inside the account app's `personal` area; session handling stays with the existing `SessionInterceptor` (405 → auto-logout, timeout handling) — the feature adds no parallel auth/session logic. Data handled is 3 booleans; no new PII is collected, stored, or logged. No `console.log` of API payloads. Endpoint URLs only via the central `api` constant — never hardcoded (knowledge/GOTCHAS.md §HTTP).

- **Performance budgets:** page load < 2s; bundle < 500KB gzipped per app (knowledge/TECH_STACK.md §Performance Targets).
  - Feature-specific: the screen ships as a lazy-loaded module (no eager bundle growth beyond route registration); container uses `ChangeDetectionStrategy.OnPush`.

- **Blocking dependencies:**
  - `GET /api/user/notification-preferences` returning `{ email: boolean, push: boolean, sms: boolean }` — status: assumed-existing per PATIENT directive, unverified in knowledge layer (API_CONTRACTS.md not seeded; manual has no §10; `api.ts` not accessible in this workspace) — owner: Backend (Gabriel), confirms existence + factory entry name at handoff.
  - `PUT /api/user/notification-preferences` accepting `{ email, push, sms }` → 200 — same status and owner.
  - Contract confirmation of the commonlib on/off wrapper per `knowledge/COMPONENT_CONTRACTS_TODO.md`: `app-toggle` (full contract) and `app-checkbox` (CVA yes/no) — status: `[CONFIRMAR-NO-SOURCE]`, ~30 min with the repo clone — owner: Backend (Gabriel) or Pedro with repo access. Must be resolved before `/bifrost:build` completes control selection (see §4 decision 2).

- **Must-not-break:**
  - Existing account app routes and lazy modules — verify: `nx test account` green + app boots with all existing routes reachable.
  - Existing `AppState` slices and reducer map behavior — verify: no existing store file modified except the additive registration in `store.ts`/`CoreModule`; existing specs pass.
  - Existing translation keys in en/es/pt-br files — verify: diff shows only added keys, zero modified or deleted keys.
  - `SessionInterceptor` behavior (405 → logout, timeout, backend-error translation) — verify: no interceptor file touched.
  - Bifrost file-header compliance on every new TS file (manual §14) — verify: @CodeGen self-review checklist + @Reviewer HANDOFF check.

## 3. Acceptance criteria     <!-- LOCKED on write -->

- **MUST:** On screen open, the 3 controls render the values returned by GET `/api/user/notification-preferences` (no hardcoded defaults presented as server truth).
  - **Verified by:** @QA test "prefs-load-reflects-api".
- **MUST:** Clicking Save issues PUT `/api/user/notification-preferences` with the full staged `{ email, push, sms }` and, on 200, shows a translated success message.
  - **Verified by:** @QA test "prefs-save-persists-and-confirms".
- **MUST:** On load or save failure (timeout / 5xx), a translated error message is shown via `ErrorHandlingService`/snackbar, staged values are preserved, and the user can retry.
  - **Verified by:** @QA test "prefs-error-feedback-and-retry".
- **MUST:** Every rendered string (title, 3 channel labels, Save, success/error messages) resolves through ngx-translate in en, es, and pt-br, with key parity across the 3 files.
  - **Verified by:** CI check "bifrost-validate i18n-parity" + @QA test "prefs-i18n-three-languages".
- **MUST:** Both endpoints are called only via the central `api` constant factory entry (existence confirmed manually by Backend at handoff — no api-existence CI check exists).
  - **Verified by:** code-review item "no-hardcoded-urls" (@CodeGen self-review + @Reviewer HANDOFF).
- **MUST:** New code follows Vizmos conventions: kebab-case files, `app-*` selector, file quartet, four-file NgRx slice with `[Notification Preferences Store]` triad actions, OnPush, async-pipe/takeUntil subscription discipline, 4-space indent / single quotes / Allman / ≤140 cols, Bifrost file header on every TS file.
  - **Verified by:** ESLint pass + @CodeGen self-review (bifrost-code-review checklist) + @QA test "prefs-conventions-audit".
- **SHOULD:** Save is disabled while a save is in flight and until the initial load succeeds; save effect uses `exhaustMap`.
  - **Verified by:** @QA test "prefs-save-race-and-spam-click".
- **SHOULD:** Load state shows `app-skeleton-loading` (or `app-spinner`) instead of unbound controls.
  - **Verified by:** @QA test "prefs-loading-state".
- **MAY:** A retry affordance on load failure (beyond snackbar), e.g. reload button in the error state.
  - **Verified by:** @QA test "prefs-load-retry-affordance" (only if implemented).

## 4. Architectural decisions <!-- LOCKED on write -->

- **Decision:** Preferences state lives in a new NgRx slice `notificationPreferences` (four-file pattern + effects), not in local component state.
  - **Rationale:** The account app's established convention is one slice per feature flow even for small flows (`editAccount`, `changePassword`, `accountVerification` — manual §5.1); effects give centralized error handling via `ErrorHandlingService` and testable API orchestration; PATIENT mandates "existing Vizmos conventions (Angular/Nx/NgRx)".
  - **Alternatives ruled out:** local component state + direct service call (breaks the app's slice convention and bypasses the effects/error-handling pattern); adding fields to the `profile` slice (mixes session identity with editable preferences and violates the additive-only must-not-break on existing slices).

- **Decision:** All commonlib form wrappers are bound ONLY through their documented Inputs/Outputs; no `formControlName`/CVA usage on any `app-*` wrapper in this feature unless that wrapper's CVA contract is confirmed in COMPONENT_LIBRARY.md before `/bifrost:build`. Control selection is deterministic: `app-toggle` if its contract is confirmed by then (blocking dependency, §2); otherwise `app-checkbox` with `[label]`/`[checked]`/`(checkedChange)`. Save is wired via `app-button (click)`, never native form submit.
  - **Rationale:** Pilot run-1's two must-fix defects (C1/C2) were caused by silently assuming CVA on `app-checkbox`; `bifrost-graphify-ref` authority order makes unconfirmed contracts blocking, never silently inferred; `app-toggle` exists in manual §6.1.1 but has zero documented contract (COMPONENT_CONTRACTS_TODO.md).
  - **Alternatives ruled out:** `formControlName` directly on wrappers (unconfirmed CVA — the exact run-1 failure); raw Material `mat-slide-toggle` (violates delivery standard 3: no direct Material primitive when an `app-*` wrapper exists); building a new toggle component (commonlib already carries on/off controls — reuse first).

- **Decision:** Save sends the complete `{ email, push, sms }` object (full PUT), staged client-side; no PATCH, no per-toggle auto-save.
  - **Rationale:** Matches the PATIENT-specified contract exactly; one save action gives one clear success/error moment and an easy retry story; avoids request storms from toggle flipping.
  - **Alternatives ruled out:** auto-save per flip (3× request volume, ambiguous feedback, spam-click hazard); PATCH per field (endpoint not specified by PATIENT — would invent an API contract).

- **Decision:** The screen is a lazy-loaded feature module at `containers/personal/notification-preferences/` in the account app.
  - **Rationale:** Manual §12 mandates lazy loading for feature modules; §5.1 puts logged-in user self-service flows under `containers/personal/`; keeps eager bundle delta at route-registration size (perf budget §2).
  - **Alternatives ruled out:** eager module (bundle budget + convention violation); placement under `containers/home/` (that area is pre-auth/landing flows).

- **Decision:** Wire shape isolated behind a DTO + adapter (`NotificationPreferencesDto` → `NotificationPreferences` model) with explicit boolean normalization (missing/undefined field → `false`).
  - **Rationale:** Adapter pattern is the repo convention (manual §2 core/adapters, NAMING_CONVENTIONS §Model/DTO); endpoints are assumed-not-verified (§2), so isolating the wire shape confines any Backend-confirmed mismatch to one file; templates never receive `undefined`.
  - **Alternatives ruled out:** binding raw response into the store (couples store to an unverified wire shape; run-1 class of silent breakage).

- **Decision:** i18n keys live under the `notification-preferences.*` namespace, added to `en.json`, `es.json`, `pt-br.json` in the same commit; success/error feedback strings included. Backend-originated error strings keep flowing through the existing `TranslationConstants`/`ErrorHandlingService` path (`commonlib.backend-translation.*`).
  - **Rationale:** Manual §9 (per-app HTTP-loaded JSON, cache-busted); parity-in-one-commit is what makes `bifrost-validate i18n-parity` and the MUST criterion enforceable; the backend-error namespace is reserved and already handled.
  - **Alternatives ruled out:** hardcoded strings with later translation (guarantees drift; fails the MUST); adding keys to commonlib translation assets (feature strings are app-scoped, not shared).

## 5. External context        <!-- LOCKED on write -->

- **Stakeholders / decision-makers:**
  - **Owner (Product):** Pedro (PATIENT author, approves scope + phase gates)
  - **Reviewer (Backend):** Gabriel (merge gate; confirms endpoints + component contracts; ≤2h review budget per delivery standard 1)
  - **Other approvers:** none

- **Deadlines:**
  - Normal timeline per PATIENT — soft, no binding date.

- **Related features:**
  - **In flight:** none known.
  - **Recently shipped:** pilot run 1 (same feature scope, 2026-07-28) — produced the C1/C2 findings and `COMPONENT_CONTRACTS_TODO.md`; this run supersedes it.
  - **Blocked by this:** `knowledge/API_CONTRACTS.md` seeding could start from this feature's two endpoints (recommendation, not a blocker).

- **Prior incidents this feature must not re-introduce:**
  - **Silent CVA/submit contract inference on commonlib wrappers** — pilot run-1 root cause (C1/C2); see `knowledge/COMPONENT_CONTRACTS_TODO.md` and §4 decision 2.
  - **Direct `.subscribe()` without teardown / skipping async pipe** — knowledge/GOTCHAS.md §Angular & RxJS.
  - **State mutation in reducers; logic in reducers instead of effects** — GOTCHAS §NgRx.
  - **Hardcoded API URLs bypassing the `api` constant** — GOTCHAS §HTTP.
  - **Uncaught HTTP errors bypassing `ErrorHandlingService`** — GOTCHAS §HTTP.
  - **Missing Bifrost file header (fails review), hardcoded colors, hardcoded media queries, template-driven forms, missing OnPush** — GOTCHAS §Common Mistakes.
  - **Assuming store update means backend success** (navigate/confirm only after effect completes) — GOTCHAS §State-vs-DB.

## 6. Amendments log          <!-- APPEND-ONLY -->

<!-- (Empty at /bifrost:start completion. Append entries below this line.) -->

---

## Trajectory acknowledged

- **Authored by:** @Intake
- **Sections locked:** 1, 2, 3, 4, 5
- **Amendments included:** (none — fresh trajectory)
- **Status:** locked
