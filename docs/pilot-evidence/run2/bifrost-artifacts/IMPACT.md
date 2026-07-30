# IMPACT.md — Scope Impact Analysis

Feature: Notification Preferences
Author: @Intake
Date: 2026-07-30T14:04:36Z

---

## 1. Scope summary

A single new screen in the **account** app where a logged-in user manages 3 boolean notification channels (email, push, SMS). On open the screen loads current preferences from `GET /api/user/notification-preferences`; the user flips any of 3 on/off controls; on save the full object is persisted via `PUT /api/user/notification-preferences`, with success/error feedback. Every rendered string is translated in en / es / pt-br via the app's existing ngx-translate setup.

This is a small, single-app, single-domain feature: one lazy-loaded container, one NgRx slice following the account app's per-feature slice convention (`profile`, `editAccount`, `changePassword`, … — manual §5.1), two endpoints in one domain. Deliverable is review-ready code for Backend (Gabriel) — review, not rewrite.

Nomenclature note: PATIENT calls the monorepo "Vizmos"; the knowledge layer documents the same repo under its sanitized name "Bifrost Frontends" (`bifrost.frontends`). Treated as the same universe; conventions are taken from the knowledge layer.

## 2. APIs touched

- `api.user.notificationPreferences()` (factory entry name to be confirmed/created) — **GET** `/api/user/notification-preferences` → `{ email: boolean, push: boolean, sms: boolean }` — **assumed-existing per PATIENT directive** — evidence: PATIENT §API ("assume these exist per the knowledge layer"). NOT independently verifiable: `knowledge/API_CONTRACTS.md` is not seeded, `FRONTEND_REPOSITORY_MANUAL.md` has no §10 (API constants section is referenced but absent), and `libs/commonlib/src/lib/constants/api.ts` is not accessible in this workspace.
- Same factory entry — **PUT** `/api/user/notification-preferences` body `{ email, push, sms }` → 200 — **assumed-existing per PATIENT directive** — same evidence status.

Both endpoints go to TRAJECTORY §2 as a blocking dependency: Backend confirms existence + the exact `api.<domain>.<endpoint>()` factory entry at handoff (per Intake protocol, endpoint existence is confirmed manually by Backend — there is no "api-calls" CI check). Per `bifrost-graphify-ref` the URL is never hardcoded; the call goes through the central `api` constant (GOTCHAS §HTTP).

## 3. Components touched

- `notification-preferences` container (`NotificationPreferencesComponent`, selector `app-notification-preferences`) — **new** — file quartet under `apps/account/src/app/containers/personal/notification-preferences/`, lazy-loaded module per manual §12; OnPush; evidence: manual §2 directory conventions + §5.1 container structure.
- On/off control: `app-toggle` (`ToggleComponent`) **preferred / contract UNCONFIRMED** — exists in manual §6.1.1 FormComponents but is absent from COMPONENT_LIBRARY.md; every input/output is `[CONFIRMAR-NO-SOURCE]` per `knowledge/COMPONENT_CONTRACTS_TODO.md`. Fallback: `app-checkbox` (`CheckboxComponent`) — **reused** — documented contract `[label]`, `[checked]`, `(checkedChange)` (COMPONENT_LIBRARY.md §Form). Selection is resolved by the blocking dependency in TRAJECTORY §2; binding discipline is locked in TRAJECTORY §4 (documented Inputs/Outputs only — no CVA assumption; pilot run-1 root cause).
- `app-button` — **reused** — documented as `(click)`-driven; submit contract `[CONFIRMAR-NO-SOURCE]` → save wired via `(click)`, no reliance on native form submit (COMPONENT_CONTRACTS_TODO).
- `app-card` — **reused** — screen container (COMPONENT_LIBRARY.md §Container).
- `app-skeleton-loading` (or `app-spinner`) — **reused** — load state (COMPONENT_LIBRARY.md §Display).
- `SnackBarService` / `ErrorHandlingService` (commonlib services, not components) — **reused** — success and error feedback (manual §6.1.2).

## 4. State management touched

- `notificationPreferences` — **new** slice in `apps/account/src/app/core/stores/notification-preferences/` — four-file pattern (`.actions.ts`, `.reducer.ts`, `.selectors.ts`, `.store.ts`, manual §7), registered in the account `AppState` + reducer map.
  - actions (triad pattern, storeTag `[Notification Preferences Store]`): `loadPreferences` / `loadPreferencesSuccess` / `loadPreferencesError`; `savePreferences` / `savePreferencesSuccess` / `savePreferencesError`
  - reducer: `notificationPreferencesReducer` — immutable updates only (GOTCHAS §NgRx)
  - selectors: `selectNotificationPreferencesState`, `selectPreferences`, `selectIsLoading`, `selectIsSaving`
  - effects: `NotificationPreferencesEffects` in `core/effects/` — load via `switchMap`, save via `exhaustMap` (spam-click guard), errors through `ErrorHandlingService` (manual §7 Effects Pattern)
- `profile` — **read-only** — session/auth context only; no changes. `SessionInterceptor` already handles 405 → logout (manual §5.1).

## 5. Data flow

Route `…/personal/notification-preferences` activates lazy module → container dispatches `loadPreferences` on init → effect calls the API service wrapping `api.user.notificationPreferences()` (GET) → success action carries `{ email, push, sms }` → reducer stores it → component reads via `selectPreferences` with `async` pipe (no direct `.subscribe`, GOTCHAS §RxJS) → three on/off controls render bound to the staged form state. User flips controls → staged value updates via the wrapper's documented output event. User clicks Save → component dispatches `savePreferences` with the full staged `{ email, push, sms }` → effect PUTs → success: `savePreferencesSuccess` + success snackbar (i18n key); error: `ErrorHandlingService.handle` + `savePreferencesError` → controls remain on staged values so the user can retry.

## 6. Edge cases

- **Load fails (timeout / 5xx):** error snackbar (translated), retry affordance; controls not rendered in a lying default state — show error state instead. (@QA scenario)
- **Save fails (timeout / 5xx):** error snackbar; staged toggles preserved; Save re-enabled for retry. (@QA scenario)
- **Logged-out / session lost (HTTP 405):** `SessionInterceptor` auto-logout — feature must not duplicate this handling. (@QA scenario)
- **Spam-click Save:** `exhaustMap` in save effect; Save button disabled while `selectIsSaving`. (@QA scenario)
- **Refresh mid-save:** no client persistence of staged state; on reload, screen reloads server truth. Accepted behavior. (@QA scenario)
- **Race load vs save:** Save disabled until initial load succeeds. (@QA scenario)
- **Partial/malformed API response** (missing field): adapter normalizes to explicit booleans; missing field → treated as `false` and surfaced in the adapter, never `undefined` reaching the template. (@QA scenario)
- **i18n:** every rendered string (labels, 3 channel names, Save, success/error messages) resolves in en, es, pt-br; missing-key check across the 3 files. (@QA scenario + CI `bifrost-validate i18n-parity`)

## 7. Dependencies

- **Endpoints** `GET`/`PUT /api/user/notification-preferences` + `api.ts` factory entry — status: assumed-existing (PATIENT directive), unverified in knowledge layer — owner: Backend (Gabriel). **Blocking → TRAJECTORY §2.**
- **Commonlib on/off wrapper contract** (`app-toggle` everything; `app-checkbox` CVA; `app-button` submit) — status: `[CONFIRMAR-NO-SOURCE]` per `knowledge/COMPONENT_CONTRACTS_TODO.md` (~30 min task on first repo access) — owner: Backend/Gabriel or Pedro with the clone. **Blocking → TRAJECTORY §2** (resolution selects toggle vs checkbox; does not block planning, blocks build-time control selection).
- **PROJECT_CONTEXT.md absent** — soft — identity derived from knowledge layer; see §Open questions below.

## 8. Risks

- **Silent contract assumption on `app-*` wrappers** — likelihood: medium (it was pilot run-1's root cause, C1/C2) — mitigation: TRAJECTORY §4 locks documented-contract-only binding; no `formControlName` on wrappers unless CVA lands in COMPONENT_LIBRARY.md first.
- **Endpoint shape mismatch** (real API differs from PATIENT's assumed shape) — likelihood: low-medium — mitigation: DTO + adapter isolate the wire shape (manual §Adapter pattern); Backend confirms at handoff; blocking dependency keeps it visible.
- **i18n drift** (key added to one file, not all three) — likelihood: medium — mitigation: keys authored in the same commit for the 3 files; `bifrost-validate i18n-parity` + @QA per-language pass.
- **Convention drift on file headers / ESLint** (missing Bifrost header fails review, GOTCHAS §Git) — likelihood: low — mitigation: `bifrost-code-standards` + @CodeGen self-review checklist.

## 9. Recommendations

- Execute `COMPONENT_CONTRACTS_TODO.md` (30 min with the Vizmos clone) before `/bifrost:build`; it de-risks this feature and every future form feature.
- When Backend confirms the endpoints, seed them as the first entries of `knowledge/API_CONTRACTS.md` — this feature is a clean, small starter.

### Open questions (non-blocking, recorded per degraded pre-flight)

- `PROJECT_CONTEXT.md` ausente — identidade derivada do knowledge layer (`FRONTEND_REPOSITORY_MANUAL.md` §1–2, `TECH_STACK.md`); confirmar com `bifrost-init` completo.
- Exact route path + sidebar entry for the screen inside `containers/personal/` — @Planner decides within the locked structure (tactical, no downstream blast radius).

---

## bifrost-hr proposal

*(no proposal — existing skill set covers this feature's domain: HTTP CRUD → bifrost-api-integration; form/toggle UI → bifrost-component-gen; NgRx slice → bifrost-state-management; ngx-translate i18n is an established app capability documented in the knowledge layer, manual §9; no third-party SDK, no new behavior class, no compliance regime, no library swap)*

---

## Trajectory acknowledged

- **Sections locked in TRAJECTORY:** §1 Feature identity, §2 Hard constraints, §3 Acceptance criteria, §4 Architectural decisions, §5 External context
- **Amendments added:** none (TRAJECTORY locked at schema_version 1, this run)
- **Conflicts surfaced:** none
- **Status:** locked
