<!--
PLAN.md — @Planner's task breakdown.

Bound by:
  - bifrost-system-context (PLAN.md tasks tagged with respected trajectory invariants)
  - ADR-006 §Decision (5–10 concrete tasks, lifecycle artifact)
  - ADR-008 §4 (handoff contract: @Planner reads TRAJECTORY + IMPACT, produces PLAN)
  - bifrost-code-standards (tasks must produce conformant code)
-->

# PLAN.md — Task Breakdown

Feature: Notification Preferences
Author: @Planner
Date: 2026-07-30T15:10:00Z
Phase: Planning

---

## Summary

A single new screen in the **account** app where a logged-in user manages 3 boolean notification channels (email, push, SMS): load current values via `GET /api/user/notification-preferences` on open, stage edits locally, persist the full `{ email, push, sms }` via `PUT` on explicit Save, with translated success/error feedback in en / es / pt-br.

**Implementation approach:** build bottom-up along the data flow IMPACT §5 described — data layer first (model/DTO/adapter, then the typed API wrapper), state layer second (four-file NgRx slice, then effects, then additive registration), UI layer third (lazy module + quartet shell with route, then store wiring + staged Save flow), i18n + conformance last. This sequence means every task builds only on already-existing files, the shared-file edits (store root, routing, i18n dictionaries) are isolated into three small additive-diff tasks, and the one unresolved contract (`app-toggle` vs `app-checkbox`, TRAJECTORY §2 blocking dependency) is needed only at Task 7 — the latest possible moment. Unit of delivery: one focused PR (~26 file changes, ~20 of them new files), reviewable by Backend in one sitting per delivery standard 1.

### Trajectory tag legend (shorthand used in `Trajectory respects:` below)

| Tag | TRAJECTORY entry |
|---|---|
| §1.in-scope.{container,slice,api,ui,i18n} | §1 in-scope bullets 1–5 in order |
| §1.oos.{no-existing-changes,no-commonlib} | §1 out-of-scope bullets 2 and 6 |
| §2.stack | §2 tech stack lock + no new deps, no `[(ngModel)]` |
| §2.security | §2 security boundaries (SessionInterceptor untouched, no console.log of payloads, `api` constant only) |
| §2.perf | §2 performance budgets (lazy module, OnPush) |
| §2.dep.endpoints / §2.dep.control | §2 blocking dependencies (endpoints assumed-existing; on/off wrapper contract) |
| §2.mnb.{routes,state,i18n,interceptor,headers} | §2 must-not-break bullets in order |
| §3.MUST-1…6 / §3.SHOULD-1,2 / §3.MAY-1 | §3 criteria in document order |
| §4.D1…D6 | §4 decisions in order (slice / control-binding / full-PUT / lazy-module / adapter / i18n-namespace) |
| §5.incidents | §5 prior-incidents list |

---

## Phases and tasks

### Phase 1: Data layer

- **Task 1:** Create the notification-preferences model, DTO, and adapter
  - **Estimate:** 30 min
  - **Depends on:** none
  - **Trajectory respects:** §1.in-scope.api — DTO → model adapter is part of the locked API surface
                             §4.D5 — adapter isolates the wire shape; missing/undefined field normalized to explicit `false`
                             §2.stack — TypeScript strict, no new dependencies
                             §3.MUST-6 — `.model.ts` / `.dto.ts` / `.adapter.ts` role suffixes, camelCase model, Bifrost file header (satisfies-in-part; verified in Task 9)
  - **Skill(s) loaded:** bifrost-code-standards, bifrost-graphify-ref
  - **Output:** Creates `apps/account/src/app/core/services/models/notification-preferences.model.ts` (`NotificationPreferences`), `apps/account/src/app/core/services/models/notification-preferences.dto.ts` (`NotificationPreferencesDto` — wire shape), `apps/account/src/app/core/adapters/notification-preferences.adapter.ts` (`NotificationPreferencesAdapter.adapt()` with explicit boolean normalization), `apps/account/src/app/core/adapters/notification-preferences.adapter.spec.ts` (full payload, partial payload → `false`, empty payload). Paths per manual §2 Directory Conventions (`core/adapters/`, `core/services/models/`).
  - **Autonomy:** inherits

- **Task 2:** Create the typed API service wrapper for GET/PUT notification-preferences
  - **Estimate:** 35 min
  - **Depends on:** Task 1
  - **Trajectory respects:** §3.MUST-5 — both calls only via the central `api` constant factory entry (satisfies)
                             §2.security — no hardcoded endpoint URL, no payload logging
                             §1.in-scope.api — exactly two operations, GET and PUT
                             §2.dep.endpoints — endpoints assumed-existing; factory entry name marked `[CONFIRMAR-NO-SOURCE]` for Backend confirmation at handoff
                             §1.oos.no-commonlib — if the `api.ts` factory entry is missing, its addition is Backend-owned; this feature does not modify commonlib source
  - **Skill(s) loaded:** bifrost-code-standards, bifrost-graphify-ref (@CodeGen additionally loads bifrost-api-integration per the agent×skill matrix)
  - **Output:** Creates `apps/account/src/app/core/api/notification-preferences.api.ts` (`NotificationPreferencesApiService`: `getPreferences(): Observable<NotificationPreferencesDto>`, `putPreferences(dto: NotificationPreferencesDto): Observable<void>`, both via `api.user.notificationPreferences()`) + `notification-preferences.api.spec.ts` (HttpTestingController: URL from factory, verbs, body). **Build-time lookup rule (bifrost-graphify-ref):** if the account app already has a `core/api/` service for the `user` domain, extend it with additive `// bifrost:add` methods instead of creating a parallel service.
  - **Autonomy:** inherits

### Phase 2: State layer

- **Task 3:** Create the `notificationPreferences` NgRx slice (four-file pattern)
  - **Estimate:** 50 min
  - **Depends on:** Task 1
  - **Trajectory respects:** §1.in-scope.slice — new slice in `core/stores/`, four-file pattern (satisfies)
                             §4.D1 — state lives in a dedicated slice, not local component state
                             §3.MUST-6 — triad actions under storeTag `[Notification Preferences Store]` (satisfies-in-part)
                             §5.incidents — immutable reducer updates; no logic in reducers (orchestration goes to Task 4 effects)
                             §2.stack — NgRx 14 only, no other state library
  - **Skill(s) loaded:** bifrost-code-standards, bifrost-graphify-ref (@CodeGen additionally loads bifrost-state-management)
  - **Output:** Creates `apps/account/src/app/core/stores/notification-preferences/notification-preferences.actions.ts` (triads: `loadPreferences`/`…Success`/`…Error`, `savePreferences`/`…Success`/`…Error`), `notification-preferences.reducer.ts` (`notificationPreferencesReducer`, immutable), `notification-preferences.selectors.ts` (`selectNotificationPreferencesState`, `selectPreferences`, `selectIsLoading`, `selectIsSaving`, `selectHasLoadError`), `notification-preferences.store.ts` (`NotificationPreferencesStore` interface + `storeTag`), plus `notification-preferences.reducer.spec.ts` and `notification-preferences.selectors.spec.ts`.
  - **Autonomy:** inherits

- **Task 4:** Create `NotificationPreferencesEffects` — load/save orchestration and feedback
  - **Estimate:** 50 min
  - **Depends on:** Tasks 2, 3
  - **Trajectory respects:** §3.MUST-2 — save PUTs the full staged object; success snackbar with translated key only on 200 (satisfies)
                             §3.MUST-3 — load/save failures route through `ErrorHandlingService`, translated (satisfies-in-part; staged-state preservation is Task 7)
                             §3.SHOULD-1 — save effect uses `exhaustMap` (satisfies-in-part)
                             §4.D3 — full PUT, no PATCH, no auto-save
                             §5.incidents — no uncaught HTTP errors; success feedback only after the effect completes (store update ≠ backend success)
                             §2.security — no parallel session handling; 405 stays with `SessionInterceptor`
  - **Skill(s) loaded:** bifrost-code-standards, bifrost-graphify-ref (@CodeGen additionally loads bifrost-state-management + bifrost-api-integration)
  - **Output:** Creates `apps/account/src/app/core/effects/notification-preferences.effects.ts` (load: `switchMap` → API → adapter → success/error actions; save: `exhaustMap` → PUT → `savePreferencesSuccess` + `SnackBarService` success with key `notification-preferences.feedback.save-success`; both error paths via `ErrorHandlingService`) + `notification-preferences.effects.spec.ts` (load success maps through adapter; load error dispatches error + handler; save success emits snackbar; save error preserves no side effects; rapid re-dispatch swallowed by `exhaustMap`).
  - **Autonomy:** inherits

- **Task 5:** Register the slice and effects in the account app state (additive diffs)
  - **Estimate:** 20 min
  - **Depends on:** Tasks 3, 4
  - **Trajectory respects:** §2.mnb.state — only additive registration in `store.ts` / `CoreModule`; no existing store file otherwise modified (satisfies the verify condition)
                             §1.oos.no-existing-changes — zero changes to existing slices
                             §3.MUST-6 — shared existing files emitted as `// bifrost:add` additive diffs with insertion anchors, never full-file bodies (bifrost-code-standards checklist)
  - **Skill(s) loaded:** bifrost-code-standards, bifrost-graphify-ref (@CodeGen additionally loads bifrost-state-management)
  - **Output:** Modifies `apps/account/src/app/core/stores/store.ts` (adds `notificationPreferences: NotificationPreferencesStore` to `AppState`; adds `notificationPreferencesReducer` to the reducer map) and `apps/account/src/app/core/core.module.ts` (adds `NotificationPreferencesEffects` to `EffectsModule.forRoot([...])`). Additive diffs only.
  - **Autonomy:** inherits

### Phase 3: UI layer

- **Task 6:** Create the lazy feature module + component quartet shell; register the route
  - **Estimate:** 45 min
  - **Depends on:** Task 5
  - **Trajectory respects:** §1.in-scope.container — one new container quartet with its own lazy-loaded module (satisfies)
                             §4.D4 — lazy module at `containers/personal/notification-preferences/`
                             §2.perf — lazy-loaded via `loadChildren`; `ChangeDetectionStrategy.OnPush`; eager delta = route registration only
                             §2.mnb.routes — route added additively; existing routes untouched
                             §3.SHOULD-2 — loading state renders `app-skeleton-loading` (satisfies)
                             §3.MAY-1 — error state carries a retry affordance (satisfies; see Open questions — it nearly falls out of §3.MUST-3's "user can retry" for load failure)
                             §3.MUST-6 — quartet, `app-notification-preferences` selector, Bifrost headers (satisfies-in-part)
  - **Skill(s) loaded:** bifrost-code-standards, bifrost-graphify-ref (@CodeGen additionally loads bifrost-component-gen)
  - **Output:** Creates `apps/account/src/app/containers/personal/notification-preferences/notification-preferences.module.ts`, `notification-preferences-routing.module.ts`, and the quartet `notification-preferences.component.{ts,html,scss,spec.ts}` (`NotificationPreferencesComponent`, OnPush). Template shell: `app-card` wrapper (COMPONENT_LIBRARY §Container), title via translate pipe, `app-skeleton-loading` while loading (COMPONENT_LIBRARY §Display), error state with retry `app-button`. Modifies `apps/account/src/app/app-routing.module.ts` — additive `// bifrost:add` lazy route `personal/notification-preferences` (`loadChildren` per manual §12).
  - **Autonomy:** inherits

- **Task 7:** Wire the container to the store — staged edits, 3 controls, Save flow
  - **Estimate:** 55 min
  - **Depends on:** Tasks 3, 6. **Precondition:** §2.dep.control resolved (COMPONENT_CONTRACTS_TODO executed). Control selection is deterministic per §4.D2 — `app-toggle` if its contract is confirmed in COMPONENT_LIBRARY.md by then; otherwise `app-checkbox` with documented `[label]` / `[checked]` / `(checkedChange)` only.
  - **Trajectory respects:** §3.MUST-1 — controls render the GET values; no hardcoded defaults presented as server truth (satisfies)
                             §3.MUST-3 — staged values preserved on save failure; retry possible (satisfies, with Task 4)
                             §3.SHOULD-1 — Save `[disabled]` while `selectIsSaving` and until initial load succeeds (satisfies, with Task 4)
                             §4.D2 — documented Inputs/Outputs only; NO `formControlName`/CVA on any `app-*` wrapper; Save via `app-button (click)`, never native submit (pilot run-1 C1/C2 guard)
                             §4.D3 — Save dispatches the complete staged `{ email, push, sms }`
                             §5.incidents — `async` pipe / `takeUntil` discipline; no bare `.subscribe()` without teardown
                             §2.stack — staged local state, reactive style; no `[(ngModel)]`
  - **Skill(s) loaded:** bifrost-code-standards, bifrost-graphify-ref (@CodeGen additionally loads bifrost-component-gen + bifrost-state-management)
  - **Output:** Modifies the Task 6 quartet: container dispatches `loadPreferences` on init; reads `selectPreferences` / `selectIsLoading` / `selectIsSaving` / `selectHasLoadError` via async pipe; stages edits from the wrapper's documented output event; renders 3 controls (email / push / SMS) with translated labels; `app-button` Save with `[disabled]` logic and `(click)` → `savePreferences`; retry button re-dispatches `loadPreferences`. Completes `notification-preferences.component.spec.ts` (renders API values; staged edit does not dispatch; Save dispatches full object; disabled while saving/until loaded; error state shows retry).
  - **Autonomy:** inherits

### Phase 4: i18n + conformance

- **Task 8:** Add `notification-preferences.*` translation keys to the three dictionaries
  - **Estimate:** 25 min
  - **Depends on:** Tasks 6, 7
  - **Trajectory respects:** §1.in-scope.i18n — keys added to en/es/pt-br in the same commit (satisfies)
                             §3.MUST-4 — key parity across the 3 files; every rendered string resolves (satisfies)
                             §4.D6 — `notification-preferences.*` namespace; backend-error strings stay on the reserved `commonlib.backend-translation.*` path
                             §2.mnb.i18n — additive only; zero existing keys modified or deleted (satisfies the verify condition)
  - **Skill(s) loaded:** bifrost-code-standards, bifrost-graphify-ref
  - **Output:** Modifies `apps/account/src/assets/i18n/en.json`, `es.json`, `pt-br.json` (paths per manual §9) — adds the namespace block `notification-preferences.{title, channels.email, channels.push, channels.sms, actions.save, actions.retry, feedback.save-success, feedback.load-error}` (final key list taken from the Task 6/7 templates) as additive diffs with insertion anchors.
  - **Autonomy:** inherits

- **Task 9:** Conformance, accessibility, and full-suite verification pass
  - **Estimate:** 40 min
  - **Depends on:** Tasks 1–8
  - **Trajectory respects:** §3.MUST-6 — ESLint zero warnings; bifrost-code-standards self-review checklist walked (satisfies the verification half)
                             §2.mnb.routes/state/i18n/interceptor/headers — diff audit: shared files only additively changed; no interceptor file touched; no commonlib source touched; Bifrost header (manual §14) on every new file; `nx test account` green
                             §3.MUST-5 — grep audit: no hardcoded `/api/` URL outside the `api` constant
                             §2.perf — OnPush present; module lazy; no eager import of the feature module
                             §5.incidents — full prior-incidents checklist sweep
  - **Skill(s) loaded:** bifrost-code-standards, bifrost-graphify-ref (@CodeGen additionally loads bifrost-code-review for the self-review checklist)
  - **Output:** Runs `yarn lint` + `nx test account` (manual §15); a11y basics per bifrost-component-gen (labels associated to controls, keyboard reachability of the 3 controls + Save, focus handling on error state); verifies i18n key parity; collects the evidence @CodeGen's CODE_REVIEW.md needs. No new source files.
  - **Autonomy:** inherits

**Estimate total:** 350 min (~5.8 h of @CodeGen work) across 9 tasks / 4 phases.

---

## Approval gates

- **Default:** per `STATE.md` `autonomy:` field — **Task-Gated** (approval before each of the 9 tasks).
- **Overrides:** none. Phase-Gating Phase 2 (Tasks 3–5 are tightly coupled) was considered and rejected for this run: this is pilot run 2 acting as a gate, and per-task diffs are what makes the run auditable. If Pedro prefers fewer stops, Phase-Gating Phases 1–2 is the safe relaxation (pure data/state layers, fully spec-covered); Phase 3 should stay Task-Gated regardless (UX subjectivity + the §2.dep.control precondition lands there).

---

## Validation plan

Every TRAJECTORY §3 criterion mapped to what verifies it. (No `bifrost-validate api-calls` citation anywhere — that check does not exist; endpoint existence is confirmed manually by Backend.)

- **§3.MUST-1** "controls render GET values on open" — verified by:
  - Unit: `notification-preferences.effects.spec.ts:"load success maps DTO through adapter"`, `notification-preferences.component.spec.ts:"renders values from selectPreferences"`
  - @QA test: `prefs-load-reflects-api`
- **§3.MUST-2** "Save PUTs full staged object; translated success on 200" — verified by:
  - Unit: `notification-preferences.effects.spec.ts:"save success emits snackbar with i18n key"`, `notification-preferences.component.spec.ts:"Save dispatches full staged object"`
  - @QA test: `prefs-save-persists-and-confirms`
- **§3.MUST-3** "translated error, staged values preserved, retry possible" — verified by:
  - Unit: `notification-preferences.effects.spec.ts:"load/save error routes through ErrorHandlingService"`, `notification-preferences.component.spec.ts:"staged values survive save error"`, `…:"error state shows retry"`
  - @QA test: `prefs-error-feedback-and-retry`
- **§3.MUST-4** "every string resolves in en/es/pt-br with key parity" — verified by:
  - CI check: `bifrost-validate i18n-parity`
  - @QA test: `prefs-i18n-three-languages`
- **§3.MUST-5** "endpoints only via the central `api` constant" — verified by:
  - Code-review item `no-hardcoded-urls` (@CodeGen self-review, Task 9 grep audit) + @Reviewer HANDOFF check
  - MANUAL API-contract confirmation: Backend (Gabriel) confirms `GET`/`PUT /api/user/notification-preferences` + the `api.user.notificationPreferences()` factory entry at handoff — endpoints listed in HANDOFF.md
- **§3.MUST-6** "Vizmos conventions" — verified by:
  - ESLint pass (zero warnings) + bifrost-code-standards self-review checklist (Task 9) + @QA test `prefs-conventions-audit`
- **§3.SHOULD-1** "Save disabled in flight / until load; `exhaustMap`" — verified by:
  - Unit: `notification-preferences.effects.spec.ts:"rapid save dispatches are swallowed by exhaustMap"`, `notification-preferences.component.spec.ts:"Save disabled while saving and before load"`
  - @QA test: `prefs-save-race-and-spam-click`
- **§3.SHOULD-2** "loading state shows app-skeleton-loading" — verified by:
  - Unit: `notification-preferences.component.spec.ts:"skeleton rendered while selectIsLoading"`
  - @QA test: `prefs-loading-state`
- **§3.MAY-1** "retry affordance on load failure" — **implemented** (Tasks 6–7) — verified by:
  - @QA test: `prefs-load-retry-affordance`

General categories:

- **Unit tests:** adapter (normalization), API service (URL/verb/body), reducer (immutability + triads), selectors, effects (success/error/exhaustMap), component (render/stage/save/disabled/error) — authored by @CodeGen inside Tasks 1–7, executed via `nx test account` (Jest 29, manual §15).
- **E2E scenarios:** happy (load → flip → save → success), sad (load failure → retry; save failure → staged preserved → retry), edge (spam-click Save; session-lost 405 delegates to SessionInterceptor; partial API payload normalized to `false`) — @QA authors at /bifrost:qa from IMPACT §6.
- **Performance checks:** screen ships in a lazy chunk (no eager bundle growth beyond route registration); page load < 2s per TECH_STACK targets; OnPush verified.
- **Accessibility checks:** per bifrost-qa-validator §7 — labels bound to the 3 controls, full keyboard path (tab to each control + Save, activate via keyboard), visible focus, error/success feedback perceivable without color alone.
- **API-contract validation:** MANUAL — Backend confirms at handoff review: (1) `GET /api/user/notification-preferences` → `{ email, push, sms }` booleans; (2) `PUT` same path accepting the full object → 200; (3) factory entry name in `api.ts`. Listed for HANDOFF.md.

---

## Open questions and assumptions

1. **Route path (decided — tactical, delegated by IMPACT §Open questions):** `personal/notification-preferences`, consistent with manual §5.1 `containers/personal/` naming (`change-password`, `edit-account`, …).
2. **Navigation/sidebar entry (question for Pedro):** the plan makes the screen reachable by route only. Adding a sidebar/menu item means editing existing navigation config, which TRAJECTORY §1 out-of-scope ("no changes to any existing component") arguably prohibits. Recommendation: ship route-only in this PR; the nav entry is a one-line follow-up. If Pedro wants it in this PR, that is a scope clarification to authorize explicitly (TRAJECTORY §6 amendment path).
3. **Assumption — factory entry exists:** `api.user.notificationPreferences()` is assumed present in `libs/commonlib/src/lib/constants/api.ts` (PATIENT directive; TRAJECTORY §2 blocking dep). If Backend finds it missing, the addition is Backend-owned — commonlib source is out-of-scope for this feature (§1.oos). If Backend instead asks Frontend to add it, that requires a TRAJECTORY amendment before build.
4. **Assumption — create-vs-extend the API service:** manual §2 confirms the per-domain `core/api/` pattern; whether the account app already has a `user`-domain service is unverifiable in this workspace. Task 2 carries the build-time lookup rule (extend additively if present, else create).
5. **Assumption — `SnackBarService` success API:** success feedback uses commonlib's `SnackBarService` (manual §6.1.2); exact method signature is read from the commonlib barrel at build time. This is a service (documented usage), not one of the `[CONFIRMAR-NO-SOURCE]` component contracts — but if the signature is not findable at build time, same discipline applies: confirm, don't infer.
6. **Precondition restated (not a question):** §2.dep.control must be resolved before Task 7 executes. The selection rule is deterministic (TRAJECTORY §4.D2), so no re-planning is needed either way — `app-toggle` if confirmed, else `app-checkbox` on documented bindings. STATE.md Next Actions already routes the ~30 min COMPONENT_CONTRACTS_TODO execution to Backend/Pedro before `/bifrost:build`.
7. **Task-count / PR-shape note:** 9 tasks, ~26 file changes, single concern — inside the 5–10 heuristic and the one-focused-PR standard; no split needed.

---

## Trajectory acknowledged

- **Sections respected:** §1 Feature identity, §2 Hard constraints, §3 Acceptance criteria, §4 Architectural decisions, §5 External context
- **Amendments added:** none
- **Conflicts surfaced:** none (the sidebar-entry item is an open question resolvable without touching any locked §1–5 entry — route-only delivery already satisfies every §3 criterion)
- **Per-task tagging coverage:** every task above names at least one specific §<N>.<bullet> it respects (via the tag legend); every §3 MUST has at least one task that **satisfies** it — MUST-1 → T4+T7, MUST-2 → T4+T7, MUST-3 → T4+T6+T7, MUST-4 → T8, MUST-5 → T2 (verified T9), MUST-6 → all tasks (verified T9); SHOULD-1 → T4+T7, SHOULD-2 → T6, MAY-1 → T6+T7 (implemented)
