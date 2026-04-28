<!--
CODE_REVIEW.md — @CodeGen's self-review report after /bifrost:build.

Bound by:
  - bifrost-code-review §6 (THIS EXACT FORMAT)
  - bifrost-code-standards (§1.1 reference)
  - bifrost-state-management Section B (§1.2 reference)
  - bifrost-api-integration (§1.3 reference)
  - bifrost-component-gen (§1.4 reference)
  - ADR-008 §3 (Trajectory acknowledged section required)
  - ADR-010 (10-artifact set; CODE_REVIEW is canonical)

WHEN @CODEGEN WRITES THIS
  After /bifrost:build completes. @CodeGen walks the bifrost-code-review skill
  end-to-end, walks the per-skill checklists from each peer skill, walks
  Security / Performance / Testing / Meta sections, and writes this report.

PASS/FAIL DISCIPLINE
  Items pass / not-applicable / failed. A failed item that's been fixed in the
  same pass goes in "Failures or deviations" with the fix. Pretending nothing
  failed is worse than admitting one item needed a second look — Backend trusts
  the process when it's honest about misses.

HYDRATION
  {{PROJECT_NAME}} from interview. Everything else @CodeGen fills in.
-->

# CODE_REVIEW.md — Self-Review

Feature: {{PROJECT_NAME}}
Author: @CodeGen
Date: <ISO-8601>
PR scope: <one paragraph: what was built — components added, services modified, API endpoints touched>

---

## 1. Aggregated checklist (cross-references the per-skill checklists)

### 1.1 — `bifrost-code-standards`

<!--
@CodeGen: walk bifrost-code-standards/SKILL.md §"Self-review checklist" and
report. Items: kebab-case files w/ role suffix, PascalCase classes w/ matching
suffix, camelCase functions w/ intent prefixes, _-private prefix, $-observable
suffix, UPPER_SNAKE constants, no I-prefix interfaces, snake_case-only-in-DTOs,
4-space indent + Allman braces + 140-char lines + single quotes, no `var`/`any`/
non-null-assertions/console.log, complexity ≤ 4, file headers on every file,
ESLint clean, tsc strict clean.
-->

- ✓ <one-line summary, e.g.: "All naming, formatting, headers conformant. ESLint passes with 0 warnings, tsc --strict clean.">

### 1.2 — `bifrost-state-management`

<!--
@CodeGen: walk Section A (STATE.md updates if any) + Section B (NgRx code patterns).
Report on: pure reducers / no mutation / catchError inside effect inner pipes /
no bare .subscribe() / destroy$ properly cleaned up / async pipe preferred /
selector composition.
-->

- ✓ STATE.md update: <delegated to @Conductor | not applicable>
- ✓ NgRx changes: <e.g., "1 new reducer, 2 new effects, 4 new selectors. All pure / catchError-wrapped / immutable. No bare .subscribe() in components.">

### 1.3 — `bifrost-api-integration`

<!--
@CodeGen: walk bifrost-api-integration §"Self-review checklist". Five non-negotiables:
URLs from api factory, services-not-components, ErrorHandlingService, adapters,
SafeMath. Plus: interceptor-only auth, default 35s timeout, async pipe rule.
-->

- ✓ <e.g., "All endpoints from api.<domain>.<endpoint>(). 2 new entries added to libs/commonlib/src/lib/constants/api.ts. ErrorHandlingService routed for all error paths. 1 new adapter (...) spec'd. SafeMath used wherever money appears.">

### 1.4 — `bifrost-component-gen`

<!--
@CodeGen: walk bifrost-component-gen §"Self-review checklist". commonlib reuse,
file quartet, OnPush, reactive forms, loading + error states via existing
components, i18n on every user-visible string, accessibility complete.
-->

- ✓ <e.g., "Reused from commonlib: app-input, app-button, app-skeleton-loading, app-status-pill, app-table. 1 new feature-specific component (NotificationItemComponent) at apps/business/src/app/features/notifications/. All OnPush. Reactive forms only. i18n keys added to all 3 language files. Accessibility verified.">

---

## 2. Security

<!-- bifrost-code-review §2. Walk every subsection (XSS / auth / passwords / data exposure / money). -->

- ✓ **XSS / HTML injection:** No raw `[innerHTML]` without `SafeHtmlPipe`. No `eval`, no `new Function`, no `setTimeout('string')`. `[src]`/`[href]` on user-supplied values sanitized.
- ✓ **Authentication / tokens:** No hardcoded tokens or secrets. Tokens read via LocalStorageService only. AuthInterceptor not bypassed. No token values in logs.
- ✓ **Password handling:** Password fields use `<app-input type="password">`. No password values in logs/errors. `autocomplete` attribute set correctly.
- ✓ **Data exposure:** No PII (CPF, full name, email, phone, address) in console or analytics. Error messages don't leak server paths or stack traces.
- ✓ **Money:** All monetary arithmetic via SafeMath. Currency display via Angular's `currency` pipe with explicit locale.

---

## 3. Performance

<!-- bifrost-code-review §3. -->

- ✓ **Change detection:** All components OnPush. Inputs treated as immutable. Async pipe preferred over manual subscribe-and-store.
- ✓ **Lists:** Every `*ngFor` has a `trackBy` function.
- ✓ **Inputs / events:** Search inputs `debounceTime(300ms)`. Submit buttons `exhaustMap` (or disabled while in flight). Auto-save uses `distinctUntilChanged`.
- ✓ **Bundle / lazy loading:** Lazy-loaded routes. Tree-shakeable imports (`lodash-es` not `lodash`). Heavy libs (highcharts, google-maps) lazy-imported. **Bundle delta:** +<N>KB gzipped.
- ✓ **Memory:** Every subscription has cleanup. Event listeners removed in ngOnDestroy. No unbounded `Array.push`.
- ✓ **Targets:** measured page load <value>s, action latency <value>ms, list render <value>ms, search <value>ms — all within budget per `knowledge/TECH_STACK.md`.

---

## 4. Testing

<!-- bifrost-code-review §4. -->

- ✓ **Coverage:** Every `.component.ts` / `.service.ts` / reducer / effect / selector / adapter / pipe / guard has a `.spec.ts`. <N>% line coverage on affected files (target ≥ 80%).
- ✓ **Scenario completeness:** Every spec covers happy + sad + at-least-one-edge-case.
- ✓ **Test patterns:** MockStore from `@ngrx/store/testing`. HTTP via `HttpClientTestingModule` + `HttpTestingController`. Marble tests for non-trivial RxJS pipelines. `fakeAsync` + `tick()` not `setTimeout`.
- ✓ **All tests pass:** `yarn test --affected` → <N>/<N> green. No skipped tests (or each justified with ticket).

---

## 5. Meta-checks

<!-- bifrost-code-review §5. -->

- ✓ **File header:** every modified or created file has `@file`, `@author`, `@createdAt`, `@app`, `@description`.
- ✓ **JSDoc:** every public service method + reusable-component @Input/@Output documented.
- ✓ **No console.log / console.warn / console.error / debugger** in source.
- ✓ **`yarn lint` 0 warnings; `tsc --strict` 0 errors.**
- ✓ **Imports organized:** third-party → app → relative. No deep imports.
- ✓ **`commonlib` symbols imported via the `commonlib` path alias**, not relative paths.
- ✓ **No TODO/FIXME without a ticket reference.**

---

## 6. Failures or deviations

<!--
@CodeGen: anything that didn't pass on the first walk, with the fix or
escalation. Empty section is fine if everything passed cleanly.

Format:
  - **Item:** <which checklist item failed>
    **Reason:** <what was wrong>
    **Fix:** <how it was resolved this pass>, OR
    **Escalation:** <Hard Stop reason; what user needs to authorize>
-->

*(none — all items passed cleanly)*

---

## 7. PR-ready

- **Branch:** `bifrost/<feature-slug>`
- **Commits:** <N> commits since branch creation; messages follow conventional-commit subject style.
- **PR title:** `feat(<area>): <short description>`
- **PR description:** points at HANDOFF.md (will be authored by @Reviewer at `/bifrost:deliver`).

---

## Trajectory acknowledged

<!--
Required per ADR-008 §3. The most consequential acknowledgement of the build
phase, because the code is what the trajectory ultimately constrained.
-->

- **Sections respected:** §1 Feature identity, §2 Hard constraints, §3 Acceptance criteria, §4 Architectural decisions, §5 External context
- **Amendments added during build:** <list, or "none">
- **Conflicts surfaced:** <list with TRAJECTORY_AMENDMENT_PROPOSED block links if any, or "none">
- **Architectural decisions (§4) cited verbatim in code:** <list of file:line where TRAJECTORY decision quoted in comments, or "n/a">
