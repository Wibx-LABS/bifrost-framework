# CODE_REVIEW.md — Notification Preferences

Author: @CodeGen
Date: 2026-07-30T14:55:00Z (real UTC — see §6 item 12 on build-wake clock drift)
PR scope: One lazy-loaded Notification Preferences screen in the account app: DTO/model/adapter data layer, a typed GET/PUT api wrapper on `api.user.notificationPreferences()`, a new `notificationPreferences` NgRx slice (four-file pattern) + effects (load `switchMap`, save `exhaustMap`, errors via `ErrorHandlingService`), a container quartet staging edits in a local FormGroup and saving the full `{ email, push, sms }` on explicit click, additive registration diffs for store/effects/route, and the `notification-preferences.*` i18n namespace added to en/es/pt-br in the same commit. 26 file changes: 20 new files + 6 shared-file additive diffs (`*.bifrost-add`). All 9 PLAN tasks executed in order.

## 1. Aggregated checklist

### 1.1 code-standards
- ✓ Kebab-case filenames with role suffixes (`.model/.dto/.adapter/.api/.actions/.reducer/.selectors/.store/.effects/.component/.module/.spec`).
- ✓ PascalCase classes with matching suffixes; camelCase functions with intent prefixes (`on…`, `get…`, `is…`); `_`-prefixed private members; `$`-suffixed observables; no `I`-prefixed interfaces; `Array<T>` generic style.
- ✓ 4-space indent, single quotes, semicolons, Allman braces, ≤140 chars (one violation found in per-task review and fixed — see §6).
- ✓ **No trailing commas** (`comma-dangle: never` per manual §13 — followed over the skill doc; see §6 conflict note).
- ✓ No `var`, no `any`, no non-null assertions, no `console.log`, no `debugger`, no bare `TODO`.
- ✓ Bifrost file header (manual §14 canonical format) on every `.ts/.html/.scss` file — verified by sweep, 0 missing.
- ✓ Shared existing files (root store, CoreModule, route table, 3 i18n dictionaries) emitted ONLY as `// bifrost:add` additive diffs with insertion anchors — zero full-file bodies of shared files (the run-1 clobber class is structurally impossible in this diff).
- ⚠ `yarn lint` / `tsc --noEmit --strict` NOT RUN — no toolchain in this pilot workspace (see §6, deviation 1).

### 1.2 state-management
- ✓ Four-file slice per manual §7 (`.actions/.reducer/.selectors/.store`), storeTag `[Notification Preferences Store]`, triad actions load/save.
- ✓ Reducer pure, immutable spread updates only, no logic beyond state mapping; immutability guarded by a frozen-state spec.
- ✓ Effects: `catchError` inside the inner pipe (effect survives the session); load `switchMap`, save `exhaustMap` with rationale comments.
- ✓ No bare `.subscribe()` in the component: all template reads via async pipe; the single code-side subscription (form seeding) is `takeUntil(destroy$)`-guarded with `next()` + `complete()` in `ngOnDestroy`.
- ✓ "Store update ≠ backend success": success snackbar fires in the effect after the PUT resolves, never on dispatch (GOTCHAS §State-vs-DB), cited in code.
- ✓ STATE.md updated per Section A signal pattern (degraded: no @Conductor in pilot — see §6, deviation 3).

### 1.3 api-integration
- ✓ Both calls via `api.user.notificationPreferences()` — no hardcoded URL, no environment concatenation anywhere (grep-audited: zero `/api/` literals outside the factory reference).
- ✓ HTTP lives in `NotificationPreferencesApiService` (`core/api/`); no `HttpClient` in any component.
- ✓ Every error path routes through `ErrorHandlingService.handle()` + typed `*Error` action with `toPayload()` coercion.
- ✓ Wire shape isolated behind `NotificationPreferencesDto` + `NotificationPreferencesAdapter` (missing/undefined → explicit `false`, both directions covered).
- ✓ No manual `Authorization`/`x-app-id`/`x-promo-code` headers; no timeout override (default 35s); SessionInterceptor untouched (405 handling not duplicated), cited in code.
- — SafeMath: not applicable (no money in this feature).
- ⚠ Factory entry `api.user.notificationPreferences()` is `[CONFIRMAR-NO-SOURCE]` — TRAJECTORY §2 blocking dependency, owner Backend (Gabriel) at handoff; marked at the call site.

### 1.4 component-gen
- ✓ commonlib reuse only: `app-card`, `app-skeleton-loading`, `app-status-pill`, `app-checkbox`, `app-button`. Zero new components beyond the feature container; zero raw Material primitives; zero third-party UI.
- ✓ Control selection per TRAJECTORY §4.D2 deterministic rule: `app-toggle` contract still unconfirmed at build time (COMPONENT_CONTRACTS_TODO not yet executed) → **`app-checkbox` on documented `[label]`/`[checked]`/`(checkedChange)` only**. No `formControlName`/CVA on any wrapper; no `<form>` element at all, so Save cannot ride a native submit (run-1 C1/C2 guard), cited in the template header.
- ✓ File quartet present; `selector: 'app-notification-preferences'`; `ChangeDetectionStrategy.OnPush`; `templateUrl`/`styleUrls` (no inline).
- ✓ Reactive-forms style: staged local `FormGroup` (nonNullable), driven programmatically; no `[(ngModel)]`.
- ✓ Loading state = `app-skeleton-loading`; error state = `app-status-pill` + retry `app-button`; feedback via SnackBar/ErrorHandling services.
- ✓ i18n: every rendered string through `| translate`; 8-key `notification-preferences.*` namespace with parity across en/es/pt-br in the same commit.
- ✓ Accessibility: every control carries a translated `[label]`; error container has `role="alert"`; wrappers provide keyboard/touch-target behavior; error/success states are text, not color-only.
- ✓ No `*ngFor` (three explicit controls) → trackBy not applicable.

## 2. Security
- ✓ No XSS surface: no `[innerHTML]`, no `eval`/`new Function`, no DOM manipulation.
- ✓ No hardcoded tokens/secrets; no localStorage access; interceptor chain untouched (auth headers + 405 auto-logout stay with SessionInterceptor — TRAJECTORY §2 security boundary, cited in code).
- ✓ No PII: payload is 3 booleans; no payload logging anywhere (no console.* in source).
- ✓ PUT body explicitly built from `form.getRawValue()` of exactly 3 boolean controls — no accidental extra fields.
- ✓ Route added under the authenticated `personal/` area; additive diff instructs replicating the sibling routes' guards `[CONFIRMAR-NO-SOURCE]`.
- — Passwords / money: not applicable.

## 3. Performance
- ✓ OnPush on the one new component; async pipe throughout; memoized selectors.
- ✓ Lazy-loaded module (`loadChildren`); eager bundle delta = one route registration (TRAJECTORY §2 perf budget).
- ✓ `exhaustMap` on save (spam-click guard) + `[disabled]` while saving; `switchMap` on load (stale-load cancellation).
- ✓ Memory hygiene: one code-side subscription, `takeUntil(destroy$)`-cleaned; everything else async pipe.
- — debounce/virtualization/trackBy: not applicable (no search input, no lists).
- ⚠ Page-load < 2s not measured (no runnable app in this workspace) — deferred to @QA on the real repo.

## 4. Testing
- ✓ Structural coverage complete: adapter, api service, reducer, selectors, effects, component — every artifact has a spec next to it (6 spec files, 29 test cases).
- ✓ Happy + sad + edge per unit: adapter (full/partial/empty/malformed wire), api (GET/PUT verb+URL+body), reducer (all 6 handlers + immutability), effects (success, error via ErrorHandlingService, snackbar-only-after-200, exhaustMap marble race), component (render-from-store, stage-no-dispatch, save-full-object, disabled gates, staged-survives-save-error, error+retry, skeleton).
- ✓ Rendered-binding rule (bifrost-code-review §4.3.1, HARD): component spec imports the real `CommonlibModule` — **no `NO_ERRORS_SCHEMA` / `CUSTOM_ELEMENTS_SCHEMA` anywhere**; assertions go through rendered children (`componentInstance.checked` / `.disabled` of real wrappers) and gestures via `DebugElement.triggerEventHandler` — never direct method calls for UI criteria.
- ✓ Patterns: `MockStore` + `overrideSelector`/`refreshState`; `HttpClientTestingModule` + `HttpTestingController` with explicit URL/method/body checks; `TestScheduler` marble test for the exhaustMap race; no `setTimeout`; no skipped tests; no `done` callbacks (4 found on the verification re-walk and fixed — see §6 item 11).
- ✗ **Tests NOT EXECUTED** and coverage % not measured — no Jest/Nx toolchain in the pilot workspace (see §6, deviation 1). Every §3 criterion has a named spec mapped per @Planner's validation plan, but green status is unverified.

## 5. Meta
- ✓ Manual §14 Bifrost header on all 20 new source files (sweep: 0 missing).
- ✓ JSDoc on all public service/adapter/component methods; inline comments explain *why* (combinator choices, normalization, staging).
- ✓ No console.*, no debugger, no ticket-less TODO/FIXME (sweep: 0 hits).
- ✓ Imports organized third-party → app → relative; `commonlib` via path alias only (no relative `libs/…` imports).
- ⚠ Lint/tsc: statically conformant by sweep + inspection; tool runs pending (deviation 1).

## 5.5 Delivery standards
- **PR shape (principle 1):** ✓ single coherent concern; every file named in PLAN `Output:` paths (zero drift — verified file-by-file against Tasks 1–8); 26 file changes. Gross new-line count ~1,465 (≈40% specs, ≈20% mandated headers/comments) — above the ~800 net-lines heuristic in raw count, but within the ≤~30-file bound and pre-cleared by PLAN's PR-shape note; judged reviewable in one sitting. Stated here so Backend sees the number before opening the diff.
- **Documentation (principle 2):** ✓ headers, JSDoc, why-comments, TRAJECTORY citations in code (see Trajectory acknowledged), conventional-commit subjects prepared (no commits made in pilot workspace — no git repo scope for the generated tree).
- **Components (principle 3):** ✓ commonlib-first (5 wrappers reused, 0 forked), quartet, OnPush, reactive style, no inline HTML/CSS system bypass, no third-party UI, no direct Material.

## 6. Failures or deviations

1. **[Major — verification gap] `yarn lint`, `tsc --noEmit --strict`, `nx test account` NOT RUN.** The pilot workspace contains only the generated feature tree — no `package.json`, no node_modules, no Nx, no commonlib source. Template Steps 5/7 gates are therefore unverifiable here. Mitigation: full static sweep (forbidden-pattern greps, 140-col scan, header scan, dangling-comma scan) is clean; specs are written to the repo's Jest 29 setup. **First action on the real repo: run the three commands before `/bifrost:qa`.**
2. **[Deviation — process] Task-Gated autonomy not honored interactively.** STATE.md sets `autonomy: Task-Gated`, but this pilot run is non-interactive and the invoking orchestrator directed a complete `/bifrost:build`. Executed as Full-equivalent under that standing authorization; per-task self-review was still walked per task. Flagged so run-3 either wires real gates or sets `autonomy: Full` explicitly.
3. **[Deviation — process] STATE.md written by @CodeGen directly** (no @Conductor agent in the pilot), same degraded protocol @Intake used at bootstrap. Entries follow Section A schema.
4. **[Fixed in per-task review] reducer.spec.ts had a 169-char line** (over the 140 budget) — decomposed into a named `staged` const.
5. **[Fixed in aggregate review] effects marble spec asserted `putPreferences` call count inside `scheduler.run()`** — i.e., before flush, which would always read 0. Moved the assertion after the run block.
6. **[Seam marked, not fixed] `SnackBarService` success API inferred minimally.** Manual §6.1.2 documents the service's existence, not its signature. Call written as `success(<i18n key>)` in ONE place (`notification-preferences.effects.ts`) and marked `[CONFIRMAR-NO-SOURCE]` per the graphify-ref inference rule / PLAN Open question 5. Backend confirms the method name at handoff.
7. **[Knowledge conflict — resolved toward the manual] Trailing commas.** `bifrost-code-standards` says "trailing commas: yes (multiline)"; manual §13 (mirroring the real `.eslintrc`) says `comma-dangle: never`. Followed the manual (authority order: repo-derived doc over skill summary). Skill file should be corrected.
8. **[Knowledge conflict — resolved toward the manual] File-header format.** CodeGen template §"Add file headers" prescribes `@file/@author/@createdAt/@app`; TRAJECTORY §2 must-not-break binds to manual §14's canonical `Bifrost OPEN SOURCE` header (`@file/@author/@date/@description`). Manual §14 format used on every file. Template should be aligned.
9. **[Branch taken, documented] §2.dep.control unresolved at build time** → deterministic fallback per §4.D2: `app-checkbox` on documented bindings. NOT a deviation (the locked decision prescribes exactly this branch); recorded so the toggle upgrade is a conscious follow-up if `app-toggle`'s contract lands.
10. **[Not done] No commits.** The generated tree lives outside a git repo in this pilot; conventional-commit subjects are listed in STATE.md for the real-repo application.
11. **[Fixed in verification re-walk] `done` callbacks in 4 effects specs** — `notification-preferences.effects.spec.ts` used `(done)` in the load-success, load-error, save-success, and save-error tests, violating bifrost-code-review §4.3 ("no `done` callback usage"). Fixed by converting to synchronous subscribe-and-assert: every mock source is `of()`/`throwError()`, which emit synchronously, so no async plumbing is needed. The §4.3-suggested `firstValueFrom`/`lastValueFrom` alternative does NOT exist on the locked RxJS ~6.6.0 (TRAJECTORY §2 stack lock) — noted in a comment at the first converted test.
12. **[Deviation — process] Second @CodeGen wake (verification re-walk).** The build wake completed all 9 tasks and authored this document but exited without returning its completion signal; a second wake re-read TRAJECTORY → PLAN → IMPACT → STATE → knowledge in order, re-read every emitted file against the skill checklists, re-ran the static sweeps (140-col, forbidden patterns, dangling commas, header presence, hardcoded-URL grep — all clean), found and fixed item 11, and repaired STATE.md bookkeeping (Artifacts list was missing CODE_REVIEW.md + the source tree; Next Actions was stale). The build wake's timeline timestamps (16:00–17:10Z) were estimated ahead of the real clock; verification-wake entries and this document's Date use real UTC.

No TRAJECTORY_AMENDMENT_PROPOSED blocks: no locked §1–5 invariant was impossible to respect.

## Trajectory acknowledged

- **Sections respected:** §1 (all in-scope items delivered; zero out-of-scope files touched — no existing slice/route/component/key modified, no commonlib source, no new deps, no auto-save), §2 (stack lock, security boundaries, perf budgets, must-not-break via additive-only diffs), §3 (MUST-1…6 implemented with named specs; SHOULD-1/2 implemented; MAY-1 implemented), §4 (all 6 decisions), §5 (all 7 prior-incident classes mitigated).
- **§4 decisions cited in code (file:anchor):**
  - D1 (NgRx slice, not local state) — `core/stores/notification-preferences/notification-preferences.store.ts` (comment above `storeTag`).
  - D2 (documented-contract-only binding; no CVA; click-not-submit) — `containers/personal/notification-preferences/notification-preferences.component.html` (header block); `notification-preferences.module.ts` (ReactiveFormsModule-absence note).
  - D3 (full PUT, staged, no auto-save) — `notification-preferences.actions.ts` (savePreferences comment); `notification-preferences.api.ts` (`putPreferences` JSDoc); component `onChannelChange`/`onSave` JSDoc.
  - D4 (lazy module under containers/personal/) — `notification-preferences.module.ts` (comment above @NgModule).
  - D5 (DTO + adapter, undefined→false) — `core/adapters/notification-preferences.adapter.ts` (comment above class); `notification-preferences.dto.ts` (header).
  - D6 (i18n namespace + reserved backend-error path) — the three `assets/i18n/*.json.bifrost-add` headers; effect snackbar key.
- **§2 must-not-break / §5 prior-incidents cited at mitigation sites:** additive-diff headers in all six `*.bifrost-add` files (§2.mnb.state/routes/i18n); `notification-preferences.effects.ts` (§2 security/SessionInterceptor; §5 uncaught-errors; §5 store≠db); `notification-preferences.component.ts` (§5 subscribe-teardown; §3 MUST-3 staging); `notification-preferences.reducer.ts` (§5 mutation/logic-in-reducers).
- **Amendments added:** none.
- **Conflicts surfaced:** two knowledge-layer conflicts (items 7 and 8 above) — documentation fixes, not trajectory conflicts.
