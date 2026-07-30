# HANDOFF.md — Backend Delivery

Feature: Notification Preferences
Author: @Reviewer
Date: 2026-07-30T15:08:10Z
PR: **NOT OPENED — delivery blocked (see notice below)**
Branch: none (pilot workspace; generated tree not yet applied to the Vizmos repo — no feature branch exists)

---

## ⛔ DELIVERY BLOCKED — Hard Stop (Reviewer_Template Step 1 / Hard Stop condition 2)

**QA_REPORT.md verdict is FAIL.** Per the @Reviewer pre-flight gate ("QA_REPORT.md exists AND verdict is PASS — this is the gate"), the feature is **not ready for delivery**. No PR has been opened; STATE.md has **not** been advanced to `review` (it stays `coding` per the QA FAIL path).

**Redirect:** address the rework focus in QA_REPORT.md and re-run `/bifrost:build`, then `/bifrost:qa`; re-run `/bifrost:deliver` only after a PASS verdict. Concretely (from QA_REPORT §Verdict):

1. **C1 (Critical):** apply the tree to the real Vizmos repo; run `yarn lint`, `tsc --noEmit --strict`, `nx test account` (with coverage); measure the perf/a11y/mobile gates. Nothing dynamic could run in the pilot workspace (no toolchain).
2. **M1 (Major, @CodeGen):** fix the re-entry double-render (skeleton/error block and stale channels render simultaneously on a second visit — `notification-preferences.component.html:25-45`; gate the channels block on not-loading AND not-error, or reset the slice on load) + add one re-entry component test. Anchor spot-checked by @Reviewer on the diff walk: confirmed — the channels block gates only on `(preferences$ | async) !== null`.
3. **M2 (Major, owner unassigned):** author the missing E2E happy path (`apps/account-e2e`, load → flip → save → success + load-failure retry). Note the process contradiction QA surfaced: PLAN assigns E2E to @QA, QA_Template forbids @QA writing tests — user assigns the owner.

This document is authored under the pilot orchestrator's standing directive (same degraded protocol @Intake/@CodeGen/@QA operated under) as **handoff preparation**: everything below is the synthesis Backend will need at delivery, compiled now so the re-run of `/bifrost:deliver` after rework is a refresh, not a rewrite. Read it as "what was built and what remains", not as a merge request.

---

## 1. Trajectory restatement

### Identity (TRAJECTORY §1)

- **Feature:** Notification Preferences — a new lazy-loaded screen in the **account** app where a logged-in user views and edits 3 boolean notification channels (email, push, SMS): loads current values from `GET /api/user/notification-preferences` on open, stages edits locally, persists the full `{ email, push, sms }` via `PUT` on explicit Save, with translated success/error feedback in en / es / pt-br. One focused PR.
- **In-scope (binary, all 5 delivered):** one new container quartet with lazy module under `containers/personal/notification-preferences/`; one new NgRx slice `notificationPreferences` (four-file pattern) + effects, registered in `AppState`; exactly two API operations (GET/PUT) via the central `api` constant with DTO → model adapter; 3 on/off controls + Save + loading state + success/error feedback; translation keys added to en/es/pt-br in the same commit.
- **Out-of-scope (binary, all respected — verified by @QA scope walk):** no per-category granularity; no changes to any existing slice/route/component/translation key; no backend work or new endpoints; no auto-save on toggle flip; no notification sending/scheduling/center; no changes to other apps or commonlib/walletlib source.

### Hard constraints (TRAJECTORY §2)

- **Tech stack lock:** Angular 15.0.1 / TS ~4.8.3 / RxJS ~6.6.0 / NgRx 14.3.2 / Material 15 / ngx-translate 14 / Nx 16 / Jest 29; no new dependencies — respected: no imports beyond the locked stack, `package.json` untouched (QA §Trajectory acknowledged). RxJS 6.6-correct test style used (no `firstValueFrom` — CODE_REVIEW §6.11).
- **Security boundaries:** SessionInterceptor untouched, no parallel auth/session logic, no payload logging, URLs only via the `api` constant — respected: QA independent greps (zero `console.*`, zero hardcoded URLs, zero manual auth headers).
- **Performance budgets:** page load < 2s, bundle < 500KB gz, lazy module + OnPush — **structurally respected, NOT measured** (lazy `loadChildren` ✓, OnPush ✓, eager delta = one route registration ✓; measurement blocked by C1 — no runnable app).
- **Blocking dependencies (all still OPEN, Backend-owned at handoff):**
  - `GET`/`PUT /api/user/notification-preferences` + the `api.user.notificationPreferences()` factory entry — status: **deferred to Backend confirmation** (assumed-existing per PATIENT; `api.ts` not in this workspace; call site marked `[CONFIRMAR-NO-SOURCE]`).
  - Commonlib on/off wrapper contracts (`app-toggle` full contract; `app-checkbox` CVA; `app-button` submit) — status: **deferred**; `knowledge/COMPONENT_CONTRACTS_TODO.md` (~30 min with repo clone) not yet executed; build used the §4.D2 deterministic fallback.
- **Must-not-break:** existing routes/slices/translation keys/SessionInterceptor — verified: all 6 shared-file edits are additive `*.bifrost-add` diffs with insertion anchors, zero full-file bodies of shared files (QA scope walk); Bifrost header (manual §14) present on all 20 new source files (QA sweep, 0 missing). `nx test account` green — **NOT verified** (C1).

### Acceptance criteria (TRAJECTORY §3) — status per QA_REPORT coverage table

Honest summary: **0 of 6 MUSTs have a passing test reference** — specs are authored and mapped, but none executed (C1). MUST-4 and MUST-5 are statically verified by @QA.

- **MUST-1** "controls render the values returned by GET" — implemented (store → async pipe → `[checked]`); authored in `effects.spec:"should map the DTO through the adapter on load success"` + `component.spec:"should render the values returned by the API on the three checkboxes"` — **✗ not executed (C1)**.
- **MUST-2** "Save issues PUT with full staged object + translated success on 200" — implemented (`exhaustMap` effect, snackbar only after 200); authored in `effects.spec`, `api.spec`, `component.spec` — **✗ not executed (C1)**.
- **MUST-3** "translated error via ErrorHandlingService, staged values preserved, retry" — implemented; authored in effects error tests + `component.spec:"should preserve staged values when a save fails"` — **✗ not executed (C1)**; also partially degraded on re-entry by **M1**.
- **MUST-4** "every rendered string translated, key parity en/es/pt-br" — **✓ statically verified by @QA** (8/8 identical keys across the 3 dictionaries; all rendered/effect keys resolve; CI `bifrost-validate i18n-parity` not run — no CI here).
- **MUST-5** "endpoints only via central `api` constant" — **✓ discipline verified** (QA independent grep: zero hardcoded URLs); **existence pending by design** — Backend confirms the factory entry at handoff (locked §2 dependency).
- **MUST-6** "Vizmos conventions" — statically clean under QA's independent sweeps (naming, quartet, four-file slice, storeTag triads, OnPush, subscription discipline, formatting, headers) — **✗ partial: ESLint + tsc strict not run (C1)**.
- **SHOULD-1** "Save disabled in flight/until load; `exhaustMap`" — implemented; marble race test authored — **✗ not executed (C1)**.
- **SHOULD-2** "skeleton instead of unbound controls" — implemented — **✗ not executed (C1); undermined on re-entry by M1**.
- **MAY-1** "retry affordance on load failure" — implemented (error state + retry button); test authored — **✗ not executed (C1)**.

### Architectural decisions (TRAJECTORY §4) — all 6 implemented as locked

- **D1** NgRx slice, not local state — implemented: `core/stores/notification-preferences/` four-file slice + `core/effects/`, cited above `storeTag`.
- **D2** documented-contract-only binding; no CVA; click-not-submit — implemented: `app-checkbox` bound strictly via `[label]`/`[checked]`/`(checkedChange)`; **zero `formControlName`/`ngModel`/`<form>` in the tree** (QA re-audit of the run-1 C1/C2 class: clean); Save via `app-button (click)`.
- **D3** full PUT of staged `{ email, push, sms }`, no PATCH, no auto-save — implemented: spec asserts the exact body.
- **D4** lazy module at `containers/personal/notification-preferences/` — implemented: `loadChildren` route, additive diff.
- **D5** DTO + adapter with undefined → `false` normalization both directions — implemented: `core/adapters/notification-preferences.adapter.ts`.
- **D6** `notification-preferences.*` i18n namespace, parity in one commit; backend-error strings stay on the reserved path — implemented: 8 keys × 3 dictionaries.

### Amendments added during build

(none — TRAJECTORY §6 empty; schema_version 1, locked, no abort.)

---

## 2. What we built

A "Notification Preferences" screen in the account app, reachable at the lazy route `personal/notification-preferences`. On open it shows a skeleton while fetching the user's current email/push/SMS settings; the three checkboxes then render server truth and stage edits locally. Nothing persists until the user clicks Save, which PUTs the full three-field object and confirms with a translated snackbar; failures (load or save) surface a translated error with a retry, and staged edits survive a failed save. Everything is rendered through commonlib wrappers, state lives in a new NgRx slice, and all strings resolve in en, es, and pt-br. Backend's own surface is untouched — the feature consumes two already-assumed endpoints and nothing else.

---

## 3. Files changed

26 file changes: 20 new files + 6 additive diffs (`*.bifrost-add` — insertion-anchor diffs into shared files, never full-file bodies). All paths under `apps/account/src/app/` unless noted. Gross ~1,465 new lines (≈40% specs, ≈20% mandated headers/comments) — above the ~800 net-line heuristic but within the ≤~30-file bound; pre-cleared in PLAN's PR-shape note.

### Data layer
- `core/services/models/notification-preferences.model.ts` — (new)
- `core/services/models/notification-preferences.dto.ts` — (new — wire shape)
- `core/adapters/notification-preferences.adapter.ts` — (new — undefined → `false` both directions)
- `core/api/notification-preferences.api.ts` — (new — typed GET/PUT wrapper on `api.user.notificationPreferences()`)

### State layer
- `core/stores/notification-preferences/notification-preferences.{actions,reducer,selectors,store}.ts` — (new — four-file slice, storeTag `[Notification Preferences Store]`)
- `core/effects/notification-preferences.effects.ts` — (new — load `switchMap`, save `exhaustMap`, errors via `ErrorHandlingService`, snackbar only after 200)
- `core/stores/store.ts.bifrost-add` + `core/core.module.ts.bifrost-add` — (additive — slice + effects registration)

### UI layer
- `containers/personal/notification-preferences/notification-preferences.{module,‑routing.module}.ts` — (new — lazy module)
- `containers/personal/notification-preferences/notification-preferences.component.{ts,html,scss}` — (new — quartet, OnPush, commonlib wrappers only: `app-card`/`app-skeleton-loading`/`app-status-pill`/`app-checkbox`/`app-button`)
- `app-routing.module.ts.bifrost-add` — (additive — one lazy route)

### Tests (authored, NOT executed — C1)
- 6 spec files, 32 tests: `notification-preferences.{adapter,api,reducer,selectors,effects,component}.spec.ts` — component spec imports the real `CommonlibModule` (no schema escape hatches; rendered-binding assertions).
- **No E2E** — see M2.

### Translations
- `assets/i18n/{en,es,pt-br}.json.bifrost-add` — (additive — 8 keys each, parity verified 8/8)

---

## 4. API validation

- `api.user.notificationPreferences()` — **existence UNCONFIRMED**: `libs/commonlib/src/lib/constants/api.ts` is not in this workspace and `knowledge/API_CONTRACTS.md` is not seeded; entry name marked `[CONFIRMAR-NO-SOURCE]` at the single call site. Called via `NotificationPreferencesApiService.getPreferences()` (GET) and `.putPreferences()` (PUT); spec'd in `notification-preferences.api.spec.ts` (verb + factory URL + exact body). **Backend action:** confirm the endpoints exist and the exact factory entry name — GET `/api/user/notification-preferences` → `{ email, push, sms }` booleans; PUT same path, same body → 200. If the entry is missing from `api.ts`, its addition is Backend-owned (this feature does not modify commonlib).
- No other endpoint is touched. No manual auth headers; no timeout override (default 35s); SessionInterceptor untouched (QA §API contracts).
- `SnackBarService.success(<i18n key>)` — signature inferred minimally (manual documents the service, not the method); marked `[CONFIRMAR-NO-SOURCE]` at its one call site in the effects. Backend confirms the method name.

**API_CONTRACTS.md alignment:** not yet seeded; endpoints match PATIENT's stated contract only. Recommendation (IMPACT §9): seed API_CONTRACTS.md starting from these two endpoints once confirmed.

---

## 5. Test results

Pulled from QA_REPORT.md — **verdict: FAIL**. Reported honestly, not softened:

- **Unit:** **0/32 executed** (authored across 6 spec files: adapter 5, api 2, reducer 7, selectors 4, effects 5, component 9). Coverage: not measured (target ≥ 80%).
- **E2E:** **0/0 — none exist** (M2).
- **Lint / tsc strict:** not run. QA's independent static sweeps all clean (forbidden patterns, hardcoded URLs, 140-col, headers, `any`/non-null/`var`, dangling commas — zero hits).
- **Performance:** LCP / action latency / bundle delta — **unmeasured** (structural checks pass: lazy, OnPush, async pipe, memoized selectors, `exhaustMap`).
- **Accessibility:** keyboard/screen-reader/contrast/touch — **not exercised**; static checks pass (translated `[label]` on every control, `role="alert"` on error container, no color-only signals).
- **Mobile:** **0 viewports tested**; static layout review shows no structural overflow risk.

Full QA report: `.bifrost/QA_REPORT.md` (verdict: **FAIL** — findings C1, M1, M2, minors m1–m4).

---

## 6. Known limitations

Blocking (why this handoff is a Hard Stop, not a delivery):

- **C1 (Critical):** entire dynamic verification layer never ran — no toolchain in the pilot workspace. First action on the real repo: `yarn lint` + `tsc --noEmit --strict` + `nx test account` with coverage, then measure perf/a11y/mobile; re-run `/bifrost:qa`.
- **M1 (Major):** re-entry double-render — skeleton (or error block) and stale channels render simultaneously on a second visit; slice registered at root and never reset. Fix + re-entry test owed by @CodeGen.
- **M2 (Major):** no E2E happy path; authorship contradiction (PLAN → @QA vs QA_Template forbidding it) needs a user call for run 3.

Non-blocking, carried to Backend at handoff:

- Endpoint existence + `api.user.notificationPreferences()` factory entry name — `[CONFIRMAR-NO-SOURCE]` (TRAJECTORY §2 dependency, owner Gabriel).
- `SnackBarService.success` signature — `[CONFIRMAR-NO-SOURCE]`, one call site.
- Commonlib wrapper internals (`app-toggle` full contract, `app-checkbox` CVA, `app-button` disabled-click suppression / submit) — pending the `COMPONENT_CONTRACTS_TODO.md` batch (~30 min with the clone). If `app-toggle`'s contract lands, upgrading checkbox → toggle is a conscious follow-up (CODE_REVIEW §6.9).
- **m1:** `app-status-pill` bound with `[type]` only; documented usages also pass `[status]` — mirror the example or confirm at source.
- **m2:** `app-button` host-click-while-disabled behavior unconfirmed; risk contained by the double guard (`isSaveDisabled$` + `exhaustMap`).
- **m3:** CODE_REVIEW §4 says "29 test cases"; actual count 32 (bookkeeping drift only).
- **m4:** `reducer.spec.ts:24` uses `as never` for the error stub; prefer a typed `ErrorPayload` stub.
- Knowledge-layer fixes owed to the framework (CODE_REVIEW §6.7–6.8): `bifrost-code-standards` trailing-comma guidance contradicts manual §13 (`comma-dangle: never` — manual wins); CodeGen template's file-header field list contradicts manual §14 (manual format used).

---

## 7. Backend review checklist (for the eventual delivery, after rework)

- [ ] **First:** confirm `GET`/`PUT /api/user/notification-preferences` exist and the `api.user.notificationPreferences()` factory entry name (§4) — everything else assumes this.
- [ ] Confirm `SnackBarService.success(key)` signature (one call site: `core/effects/notification-preferences.effects.ts`).
- [ ] Execute `knowledge/COMPONENT_CONTRACTS_TODO.md` (~30 min) — unblocks m1/m2 here and every future form feature.
- [ ] Verify the M1 fix landed: channels block gated on not-loading AND not-error (or slice reset on load), plus the re-entry test.
- [ ] Verify C1 closed: lint + tsc strict + `nx test account` green with ≥ 80% coverage on affected files; E2E happy path present (M2).
- [ ] Skim the diff with §3 as the guide — 6 shared-file edits must all be additive (`bifrost:add` anchors), nothing else touches existing code.
- [ ] Spot-check 1 component for conventions (quartet, OnPush, header, no `.subscribe()` without takeUntil) — QA's sweeps say clean.
- [ ] Trajectory invariants (§1 above) make sense as the lock; merge only after a PASS verdict from a re-run `/bifrost:qa`.

---

## PR summary (PREPARED — not opened; no branch exists in the pilot workspace)

To be used at the real delivery, after rework + QA PASS, from the real repo:

```bash
git push origin bifrost/notification-preferences-account
gh pr create \
  --title "feat(account): notification preferences screen (email/push/SMS)" \
  --body "See \`.bifrost/HANDOFF.md\` for full context.

## Trajectory at delivery
New lazy-loaded screen in the account app: view/edit 3 boolean notification channels; GET on open, staged edits, full PUT on explicit Save; translated feedback in en/es/pt-br. Locked stack (Angular 15/NgRx 14), no new deps, additive-only edits to shared files. QA verdict: <must be PASS at delivery — .bifrost/QA_REPORT.md>.

## Files changed
20 new files (data layer, notificationPreferences NgRx slice + effects, lazy container quartet, 6 spec files) + 6 additive diffs (store/module/route registration, en/es/pt-br i18n — 8 keys each).

Backend confirmations needed at review: api.user.notificationPreferences() factory entry, SnackBarService.success signature, component-contracts batch (see HANDOFF §4/§6).

Full handoff: [.bifrost/HANDOFF.md](.bifrost/HANDOFF.md)" \
  --base main \
  --head bifrost/notification-preferences-account \
  --reviewer <Gabriel>
```

---

## Trajectory acknowledged

- **Sections respected:** §1 (identity restated; scope walk clean per QA), §2 (constraints restated with evidence; 3 dependencies still open with owners), §3 (all 9 criteria restated with per-criterion status — 0/6 MUSTs executed), §4 (all 6 decisions implemented as locked), §5 (stakeholders honored — Gabriel named as Backend confirmer; all 7 prior-incident classes verified not re-introduced by QA).
- **Amendments added during build:** none (TRAJECTORY §6 empty).
- **Conflicts surfaced:** none at TRAJECTORY level (no `TRAJECTORY_AMENDMENT_PROPOSED`; every locked invariant remains satisfiable). Delivery blocked at the QA verdict gate, not by a trajectory conflict. Framework-level process contradiction (E2E authorship, M2) carried forward for run 3.
- **Acceptance criteria coverage:** full table in QA_REPORT.md §Trajectory acknowledged, restated in §1 above — every MUST/SHOULD/MAY mapped to named specs; none executed (C1); MUST-4/MUST-5 statically verified.
- **Trajectory status at delivery attempt:** locked, schema_version 1, no abort.

---

## STATE.md transition (after this HANDOFF)

**NOT setting `status: review`.** Hard Stop at the QA-verdict gate: status remains `coding`; @Reviewer blocker recorded in STATE.md. `status: review` only after rework → QA PASS → `/bifrost:deliver` re-run opens the PR; `status: merged` on merge confirmation.
