# QA_REPORT.md — Notification Preferences

Author: @QA
Date: 2026-07-30T15:02:33Z
Status: FAIL

> **Degraded-verification notice (consistent with the run's degraded pre-flight protocol):** the pilot workspace carries only the generated feature tree — no `package.json`, no `node_modules`, no Nx, no Jest config, no Cypress, no commonlib source, no CI. QA_Template Hard Stop condition 2 ("test environment unavailable") technically applies; per the pilot orchestrator's standing directive (author QA_REPORT.md with a verdict) and the same degraded protocol @Intake and @CodeGen operated under, verification proceeded with everything statically verifiable and the verdict is rendered under the unchanged PASS contract: **no §3 MUST can be mapped to a *passing* test reference, so PASS is not supportable.** All five skills were read from `core/skills/` (they are not hydrated at `~/.claude/skills/bifrost-*` — same degraded-init gap @Intake recorded).

## Test execution

- Unit tests: **0 executed** / 32 authored across 6 spec files (adapter 5, api 2, reducer 7, selectors 4, effects 5, component 9). `nx test account` could not run — no toolchain in the pilot workspace.
- E2E tests: **0 executed / 0 authored.** No `apps/account-e2e` project and no `*.cy.ts` exists in this tree.
- Coverage: **not measured** (target ≥ 80% on affected files — unverified).
- Skipped tests: 0 (verified by read — no `xit`/`xdescribe`/`.skip` in any spec).
- `yarn lint` / `tsc --noEmit --strict`: **not run** (same environment gap). Independent static sweeps by @QA (not trusting CODE_REVIEW): 140-col scan clean; forbidden patterns (`console.*`, `debugger`, `NO_ERRORS_SCHEMA`, `CUSTOM_ELEMENTS_SCHEMA`, `formControlName`, `ngModel`, `ngSubmit`, `<form`) — zero hits in source; hardcoded-URL grep (`/api/`, `http(s)://`) — zero hits; dangling-comma-before-closer sweep — zero hits; `any` / non-null assertion / `var` — zero hits; Bifrost header (manual §14 format) present on all 20 new source files; the one code-side `.subscribe()` is `takeUntil(destroy$)`-guarded.

## Scenario coverage

Every unit has happy + sad + edge authored (read in full, not taken from CODE_REVIEW). Execution status pending for all.

- **Adapter** (`notification-preferences.adapter.spec.ts`) — happy: "should map a full payload one-to-one" ✓; sad/edge: partial payload → `false`, empty payload, non-boolean truthy wire values (IMPACT §6 partial/malformed) ✓; `toDto` mirror ✓.
- **API service** (`notification-preferences.api.spec.ts`) — happy: GET verb + factory URL + response, PUT verb + factory URL + full body ✓; sad path is delegated to effects (service is deliberately UX-free) — acceptable split, error path covered at effects level.
- **Reducer** (`notification-preferences.reducer.spec.ts`) — all 6 handlers + frozen-state immutability guard ✓; save-error keeps last server truth ✓.
- **Selectors** (`notification-preferences.selectors.spec.ts`) — 4 projector tests ✓.
- **Effects** (`notification-preferences.effects.spec.ts`) — load success through adapter ✓; load error via `ErrorHandlingService` ✓; save success with snackbar-only-after-200 ✓; save error with no snackbar ✓; exhaustMap spam-click marble race with call-count asserted after flush ✓ (the CODE_REVIEW §6 item-5 fix is genuinely in place).
- **Component** (`notification-preferences.component.spec.ts`) — rendered-binding rule (qa-validator §3) **verified compliant**: real `CommonlibModule` imported, no schemas escape hatch, assertions go through rendered children (`componentInstance.checked` / `.disabled` of real wrappers), gestures via `DebugElement.triggerEventHandler`. 9 tests: init dispatch, render-from-store, skeleton state, stage-without-dispatch, save-full-object, save unreachable before load, disabled while saving, staged-survives-save-failure, error + retry ✓.
- **Gap:** no test exercises **screen re-entry with previously loaded state** — the path where Finding M1 manifests (see Findings).

## Performance

| Metric | Target | Measured | Result |
|---|---|---|---|
| LCP | < 2 s | not measurable in pilot workspace | ✗ unverified |
| Action latency | < 100 ms perceived | not measurable | ✗ unverified |
| List render | < 500 ms | n/a (no lists) | — |
| Search render | < 500 ms | n/a (no search) | — |
| Bundle delta | app < 500KB gz (TECH_STACK) | not measurable (`nx build` unavailable) | ✗ unverified |

Structural checks (static): lazy `loadChildren` module ✓; eager delta = one route registration ✓; `ChangeDetectionStrategy.OnPush` ✓; async pipe throughout ✓; memoized selectors ✓; `exhaustMap` save guard ✓. These make the budgets plausible but are not measurements; gates remain unpassed.

## Accessibility

- Keyboard-only navigation: ✗ **not exercised** (no runnable app); delegated to commonlib wrappers whose keyboard behavior is `[CONFIRMAR-NO-SOURCE]`.
- Screen-reader pass: ✗ not exercised. Static: every control carries a translated `[label]` ✓; error container has `role="alert"` ✓; no icon-only buttons ✓.
- Color contrast: ✗ not measurable (wrapper-owned theming; no rendered output).
- Touch targets ≥ 44×44 px: ✗ not measurable (wrapper-owned).
- prefers-reduced-motion: — n/a (feature adds no animations).
- Color-not-only-signal: ✓ static — error state is `app-status-pill` + translated text; success is a translated snackbar.

## Mobile responsiveness

Tested viewports: **none** (no runnable app). Static review: layout is flex-column with `gap`, no fixed widths, no hardcoded media queries, skeleton at `width: 100%` — no structural overflow risk; forms have no text inputs (input-type rules n/a); no modals. Unverified at 320/375/414/768/1024/1440.

## API contracts

- All endpoints exist in `api.<domain>.<endpoint>()`: ✗ **unverifiable here** — `libs/commonlib/src/lib/constants/api.ts` is not in this workspace and `knowledge/API_CONTRACTS.md` is not seeded. This is the locked TRAJECTORY §2 blocking dependency (owner: Backend/Gabriel at handoff); the call site carries `[CONFIRMAR-NO-SOURCE]`. Discipline followed; existence still unconfirmed.
- Request bodies match contract: ✓ against PATIENT's stated contract — PUT sends exactly `{ email, push, sms }` booleans (spec asserts the body); GET consumes the same shape.
- Adapters wired for all responses: ✓ both directions (`adapt` normalizes undefined → `false`; `toDto` mirrors), templates never receive `undefined`.
- No manual auth headers: ✓ (grep: no `Authorization` / `x-app-id` / `x-promo-code` anywhere; interceptors untouched).
- Timeout discipline: ✓ no override; default 35s stands.
- `SnackBarService.success(key)` signature: `[CONFIRMAR-NO-SOURCE]` seam, marked at the single call site — carried forward as a handoff confirmation, not a new finding.

## Findings

### Critical (block release)

- **C1 — The entire dynamic verification layer never ran.** n/a (environment). 32 unit tests authored but 0 executed; lint and tsc strict not run; coverage, performance, accessibility, and mobile gates all unmeasured — the pilot workspace has no toolchain (no `package.json`, no Nx/Jest/Cypress, no commonlib). Under the PASS contract ("every §3 MUST has a *passing* test reference"), every MUST is unproven. Suggested fix: apply the tree to the real Vizmos repo; run `yarn lint`, `tsc --noEmit --strict`, `nx test account` (with coverage), measure the §6–§8 gates; re-run `/bifrost:qa` there. This is the pre-declared first action in STATE.md and CODE_REVIEW.md deviation 1 — QA confirms it is verdict-blocking, not a footnote.

### Major (block release unless waived)

- **M1 — Re-entry renders skeleton and stale controls simultaneously (and error + controls can coexist).** `containers/personal/notification-preferences/notification-preferences.component.html:25-45`. The slice is registered at root and never reset; on a second visit `ngOnInit` dispatches `loadPreferences` → `isLoading=true` while `preferences` is still non-null from the previous visit → the `app-skeleton-loading` block (`*ngIf="isLoading$ | async"`) AND the channels block (`*ngIf="(preferences$ | async) !== null"`) render at the same time; if that reload fails, the error block AND the channels block render together (`hasLoadError=true`, `preferences` non-null). First-visit flows are clean; the defect is real on any navigate-away-and-back path. Also undermines the intent of §3 SHOULD-2 ("skeleton instead of unbound controls"). No test covers re-entry. Suggested fix (@CodeGen): gate the channels block on `(isLoading$ | async) === false && (hasLoadError$ | async) === false && (preferences$ | async) !== null` (or reset the slice on `loadPreferences`), plus one component test simulating re-entry (preferences pre-loaded + `isLoading` true → skeleton only).
- **M2 — No E2E happy-path test exists.** n/a (structural). `bifrost-qa-validator` §1 expects at least one E2E happy-path per feature (load → flip → save → success); PLAN §Validation delegates E2E authoring to "@QA at /bifrost:qa", but QA_Template forbids @QA writing tests ("Do not write new tests... rework belongs to @CodeGen") — a process contradiction between the artifacts and the agent template, and the net result is the E2E was never authored by anyone. Suggested fix: user assigns E2E authoring to @CodeGen in the rework pass (`apps/account-e2e`, one `notification-preferences.cy.ts` happy path + load-failure retry), and the framework resolves the authorship contradiction for run 3.

### Minor (notes for future)

- **m1** — `notification-preferences.component.html:33`: `app-status-pill` is bound with `[type]` only; both documented usages (COMPONENT_LIBRARY §StatusPillComponent and §Error Handling) also pass `[status]`. Omission of a documented input is not an invented binding, but rendering with `[status]` absent is unconfirmed — mirror the documented example or confirm at source alongside the COMPONENT_CONTRACTS_TODO batch.
- **m2** — `app-button` `(click)` binds the host element; whether host clicks are suppressed while `[disabled]` is wrapper-internal and unconfirmed (`COMPONENT_CONTRACTS_TODO`). Save is already double-guarded (`isSaveDisabled$` + `exhaustMap`), so risk is contained; confirm with the contracts batch.
- **m3** — `CODE_REVIEW.md §4` claims "29 test cases"; the actual count is 32. Bookkeeping drift only, but it is exactly the class of participant-report claim QA re-verifies.
- **m4** — `notification-preferences.reducer.spec.ts:24`: `const error = { message: 'timeout' } as never;` — the `as never` cast compiles but hides the `ErrorPayload` shape; prefer a typed stub.

## Verdict

**FAIL** — return to @CodeGen / user with the findings above.

**Rework focus:** The generated feature is structurally review-ready — the run-1 C1/C2 guard genuinely held (app-checkbox bound strictly to its documented `[label]`/`[checked]`/`(checkedChange)`, no CVA, no native form/submit anywhere), conventions are clean under independent static sweeps, i18n parity is verified 8/8 keys across en/es/pt-br, and the specs are honest rendered-binding tests, not theater. What blocks PASS is that none of it has been proven to run: no test execution, no lint, no tsc, no coverage, no perf/a11y/mobile measurement (Critical C1 — pilot workspace has no toolchain), plus one real UI defect found on the diff walk (M1, re-entry double-render) and the missing E2E happy path (M2). To shift to PASS: apply the tree to the real repo and run `yarn lint` + `tsc --noEmit --strict` + `nx test account` with coverage; have @CodeGen fix the M1 template gating and add the re-entry test; resolve E2E authorship and add the happy-path `.cy.ts`; measure the performance/accessibility/mobile gates on the running app; then re-run `/bifrost:qa` from Step 2. The Backend-owned `[CONFIRMAR-NO-SOURCE]` seams (endpoint + factory entry, `SnackBarService.success`, wrapper internals) stay tracked as TRAJECTORY §2 blocking dependencies for handoff — they are not QA findings.

## Trajectory acknowledged

- **Sections respected:** §1 (scope walk: all 5 in-scope bullets delivered; zero out-of-scope files — no existing slice/route/component/key touched, no commonlib source, no new deps, no auto-save), §2 (stack lock respected — no new imports beyond locked stack; security boundaries — no parallel session logic, no payload logging, URLs via `api` constant only; perf budgets structurally respected, unmeasured; blocking dependencies still open with owners; must-not-break — all 6 shared-file edits are additive `bifrost:add` diffs), §3 (mapped below), §4 (D1 slice ✓, D2 documented-bindings-only + click-not-submit ✓ verified in template and specs, D3 full-PUT staged ✓, D4 lazy module at the locked path ✓, D5 adapter normalization ✓, D6 i18n namespace + reserved backend-error path ✓), §5 (all 7 prior-incident classes checked — none re-introduced; run-1 CVA class specifically re-audited: zero `formControlName`/`ngModel`/`<form>` in the tree).
- **Amendments added:** none.
- **Conflicts surfaced:** none at TRAJECTORY level (no `TRAJECTORY_AMENDMENT_PROPOSED` — every locked invariant remains satisfiable; the failures are verification-layer and code-level). Process contradiction noted for the framework, not the trajectory: PLAN assigns E2E authoring to @QA while QA_Template forbids it (Finding M2).
- **Acceptance criteria coverage:**

| Criterion | Verifying artifact(s) found | Status |
|---|---|---|
| MUST-1 load reflects API (`prefs-load-reflects-api`) | `effects.spec:"should map the DTO through the adapter on load success"`, `component.spec:"should render the values returned by the API on the three checkboxes"` | ✗ authored, NOT executed (C1) |
| MUST-2 save persists + translated success (`prefs-save-persists-and-confirms`) | `effects.spec:"should PUT the full staged object and emit the success snackbar only after 200"`, `api.spec:"should PUT the full preferences body…"`, `component.spec:"should dispatch the full staged object on Save click"` | ✗ authored, NOT executed (C1) |
| MUST-3 error feedback + staged preserved + retry (`prefs-error-feedback-and-retry`) | `effects.spec` load/save error tests, `component.spec:"should preserve staged values when a save fails"`, `…:"should show the error state with a retry…"` | ✗ authored, NOT executed (C1); M1 partially degrades the error-state rendering on re-entry |
| MUST-4 i18n parity en/es/pt-br (`prefs-i18n-three-languages`) | @QA manual parity audit: 8/8 identical keys across the 3 dictionaries; all 8 rendered/effect keys resolve; zero unused keys. CI `bifrost-validate i18n-parity` not run (no CI here) | ✓ statically verified by @QA |
| MUST-5 endpoints via central `api` constant | @QA independent grep (zero hardcoded URLs) + call-site `[CONFIRMAR-NO-SOURCE]`; existence = Backend at handoff per locked §2 | ✓ discipline verified; existence pending by design |
| MUST-6 Vizmos conventions (`prefs-conventions-audit`) | @QA independent sweeps all clean (naming, quartet, four-file slice, storeTag triads, OnPush, subscription discipline, 140-col, Allman, single quotes, headers, no dangling commas) | ✗ partial — statically clean, but ESLint + tsc strict NOT run (C1) |
| SHOULD-1 save disabled + exhaustMap (`prefs-save-race-and-spam-click`) | `effects.spec:"should swallow rapid re-dispatches…"` (marble), `component.spec` disabled tests | ✗ authored, NOT executed (C1) |
| SHOULD-2 skeleton loading state (`prefs-loading-state`) | `component.spec:"should show the skeleton while loading instead of unbound controls"` | ✗ authored, NOT executed (C1); undermined on re-entry by M1 |
| MAY-1 retry affordance (`prefs-load-retry-affordance`) | implemented; `component.spec:"should show the error state with a retry that re-dispatches the load"` | ✗ authored, NOT executed (C1) |
