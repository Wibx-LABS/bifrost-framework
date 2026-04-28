---
name: bifrost-code-review
description: The master self-review skill for @CodeGen and the final-review skill for @Reviewer. Aggregates the per-skill checklists from bifrost-code-standards (naming, formatting), bifrost-api-integration (HTTP), bifrost-component-gen (UI), and bifrost-state-management (NgRx + STATE.md), AND adds the cross-cutting concerns no individual skill owns: security (XSS, sanitization, password handling, never eval), performance (OnPush, trackBy, debounce, lazy loading, bundle size), and testing (coverage, what to test, scenario completeness). Use this skill whenever you are @CodeGen finishing a /bifrost:build run and about to write CODE_REVIEW.md (you walk this checklist, you produce the report); or @Reviewer running /bifrost:deliver and reviewing the full diff before writing HANDOFF.md (you walk this checklist as a verification pass over what @CodeGen claimed). Triggering signals: any mention of CODE_REVIEW.md, "self-review", "before submitting", "before merge", "review checklist", "ready for backend", or any moment where the question is "is this code review-ready?". The skill's whole reason for existing is to make the answer to that question mechanical instead of vibes-based — Pedro's framework exists because Backend dev review changes < 10% is the kill-switch threshold, and that only holds if every artifact has been deliberately walked through this list.
---

# bifrost-code-review

This is the **gate skill** — the one that turns "I think this is done" into "I can show why this is done." `@CodeGen` runs it before `CODE_REVIEW.md`; `@Reviewer` runs it before `HANDOFF.md`. The output is not just a checklist of green ticks — it's the source of evidence the Backend dev reads first.

The skill has two halves:

1. **The aggregated checklist** — references the per-skill checklists already written, so this skill doesn't duplicate. If you've internalized `bifrost-code-standards` etc., this part is a fast scan.
2. **The cross-cutting concerns** — security, performance, testing. These don't fit cleanly into any single domain skill, so they live here.

The checklist isn't a substitute for thought. The substitute for thought is the failure mode: untriaged risk, unhandled error, untested branch, slow render, leaked memory, rendered XSS. Each item below maps to a class of failure that's bitten Wiboo (or any frontend like Wiboo) before. Walking the checklist mechanically catches most of them; the rest require the agent to actually read its own diff.

---

## How to use this skill

`@CodeGen` workflow on `/bifrost:build` completion:

1. Walk **the aggregated checklist** (Section 1) — confirm every prior-skill rule is satisfied.
2. Walk **security**, **performance**, **testing** (Sections 2, 3, 4) — explicitly verify each item.
3. Walk **the meta-checks** (Section 5) — file header, JSDoc, no console.log, etc.
4. Write `CODE_REVIEW.md` per the format in Section 6. Every item answered with: passed / not-applicable / failed (with the fix).
5. If any item failed and isn't fixed, **do not write CODE_REVIEW.md as passing**. Either fix and re-walk, or Hard Stop and surface to the user.

`@Reviewer` workflow on `/bifrost:deliver`:

1. Read `CODE_REVIEW.md` from `@CodeGen`. Note any items marked failed-but-fixed (audit they're really fixed).
2. Walk the same checklist against the diff. `@CodeGen`'s self-review is one perspective; `@Reviewer`'s independent walk is the second.
3. Where they disagree, the disagreement goes in `HANDOFF.md` for Backend's awareness.
4. The Backend-dev review is the third walk; Bifrost's discipline is that by the time it reaches the dev, two prior walks have caught the obvious things.

---

## Section 1 — The aggregated checklist (cross-references)

Walk the per-skill checklists in this order:

### 1.1 — `bifrost-code-standards` checklist

Naming, formatting, file structure, ESLint, TypeScript discipline, file headers. The full list is in `bifrost-code-standards/SKILL.md` §"Self-review checklist." A failure on any of these is a defect.

### 1.2 — `bifrost-state-management` checklist

STATE.md (operational) AND NgRx (code patterns):

- For agents that touch STATE.md (`@Conductor`, indirectly `@CodeGen`): the entry per Section A of `bifrost-state-management`.
- For agents that write NgRx: the review checklist in Section B of `bifrost-state-management` — pure reducers, no mutation, `catchError` inside effect inner pipes, no bare `.subscribe()` in components, `destroy$` properly cleaned up.

### 1.3 — `bifrost-api-integration` checklist

The full list is in `bifrost-api-integration/SKILL.md` §"Self-review checklist." Specifically: `api.<domain>.<endpoint>()` usage, services-not-components for HTTP, `ErrorHandlingService` for errors, adapters for response shape, `SafeMath` for money, no manual auth headers, default 35s timeout.

### 1.4 — `bifrost-component-gen` checklist

The full list is in `bifrost-component-gen/SKILL.md` §"Self-review checklist." Specifically: existing `commonlib` components used, file quartet present, `selector: 'app-<kebab>'`, OnPush change detection, reactive forms, loading + error states via existing components, i18n on every user-visible string, accessibility, `destroy$` cleanup.

If a section above doesn't apply to this PR (e.g., no UI changes → skip 1.4), mark it explicitly as "not applicable" in `CODE_REVIEW.md`. Don't omit it.

---

## Section 2 — Security

### 2.1 — XSS / HTML injection

- [ ] No raw `[innerHTML]` binding without sanitization. Use `SafeHtmlPipe` from `commonlib` or `DomSanitizer.bypassSecurityTrustHtml` ONLY for content from a trusted source (a Bifrost-controlled CMS field, a translation file). User-submitted content goes through the sanitizer.
- [ ] No `eval()`, no `new Function(...)`, no `setTimeout('string code')` — anywhere. Lint catches some; review catches the rest.
- [ ] No DOM manipulation via `document.write`, `document.createElement` + `appendChild` from user data. Use Angular bindings.
- [ ] `[src]` and `[href]` bindings on user-supplied URLs go through `DomSanitizer.bypassSecurityTrustUrl` (or rely on Angular's default sanitization, which is sufficient for most cases).

### 2.2 — Authentication and tokens

- [ ] No hardcoded tokens, API keys, secrets, or credentials anywhere in source. Lint catches obvious cases; review catches the disguised ones.
- [ ] No reading of tokens from `localStorage` directly. Use `LocalStorageService` from `commonlib`, which is type-safe and (where applicable) wraps encryption.
- [ ] No bypassing of `AuthInterceptor`, `SessionInterceptor`, etc. (`bifrost-api-integration`).
- [ ] No surfacing of token / session-id values in logs, error messages, or analytics events.

### 2.3 — Password handling

- [ ] Password fields use `<app-input type="password">` or equivalent. Never plain `type="text"` for passwords (even temporarily).
- [ ] No password values in `console.log`, `console.error`, or any error message that could leak.
- [ ] Password fields have `autocomplete` set appropriately (`new-password` for signup, `current-password` for login). Browser autofill behavior matters.
- [ ] Password reset flows use server-issued one-time tokens, never client-side derivation.

### 2.4 — Data exposure

- [ ] No PII (CPF, full name, email, phone, address) logged to console or sent to analytics in identifiable form. Use hashed identifiers if analytics needs to correlate.
- [ ] Error messages surfaced to users don't leak server paths, stack traces, or implementation details. The `ErrorHandlingService` already handles this — verify it isn't bypassed.
- [ ] HTTP request bodies don't accidentally include unrelated data. (Form submissions sometimes drag along the entire `form.value` when only specific fields were meant — explicitly destructure.)

### 2.5 — Money handling

- [ ] All monetary arithmetic uses `SafeMath` / `BigNumber` (per `bifrost-api-integration` Rule 5). A JS float for money is a security/correctness defect, not a style issue.
- [ ] Currency display uses Angular's `currency` pipe with explicit locale + currency code. Don't hand-format `$X.XX` strings.

---

## Section 3 — Performance

### 3.1 — Change detection

- [ ] All components use `ChangeDetectionStrategy.OnPush`. Default change detection is acceptable only with explicit justification in the file header.
- [ ] Inputs are treated as immutable. No mutation of `@Input` objects (per `bifrost-component-gen`).
- [ ] Async pipe is preferred over manual `subscribe`-and-store-in-property. The async pipe + OnPush composes; the alternative requires manual `markForCheck()` calls.

### 3.2 — Lists

- [ ] Every `*ngFor` has a `trackBy` function. List re-renders without trackBy re-create the entire DOM on data changes.

```html
<!-- ✅ Right -->
<div *ngFor="let item of items; trackBy: trackByItemId">{{ item.name }}</div>
```

```typescript
trackByItemId = (_: number, item: Item) => item.id;
```

For lists > 50 items, consider virtualization (`@angular/cdk/scrolling`'s `cdk-virtual-scroll-viewport`).

### 3.3 — Inputs and events

- [ ] Search inputs / filter inputs that fire HTTP calls have `debounceTime` (typically 300ms) before triggering. Without it, every keystroke is an HTTP call.
- [ ] Submit buttons use `exhaustMap` (or `disabled` until previous succeeds) to prevent double-submit on spam-click.
- [ ] Auto-save / auto-dispatch streams use `distinctUntilChanged` to avoid redundant work on no-change emissions.

### 3.4 — Bundle and lazy loading

- [ ] Routes for non-critical features are lazy-loaded (`loadChildren`). The initial bundle for any app stays under ~500KB gzipped (per `knowledge/TECH_STACK.md` performance targets).
- [ ] Heavy third-party libraries (highcharts, google-maps) are lazy-imported, not in the initial bundle.
- [ ] No accidental `import * as _ from 'lodash'`. Use `import { debounce } from 'lodash-es'` (tree-shakeable per `knowledge/TECH_STACK.md`).
- [ ] No accidental import of an entire icon library. Only import the icons used.

### 3.5 — Memory

- [ ] Every subscription has a cleanup path: async pipe (auto), `takeUntil(destroy$)` + `ngOnDestroy` complete, or `take(1)` / `first()` / a finite stream.
- [ ] Event listeners attached via `addEventListener` are removed in `ngOnDestroy`. (Most Wiboo code uses Angular's `(event)` bindings, which clean up automatically; the failure mode is in third-party JS integrations.)
- [ ] No accumulating `Array.push` in long-lived state without bounds. (Notification queues, log buffers — cap them.)
- [ ] No closure capture of heavy objects in long-lived subscriptions.

### 3.6 — Targets (per `knowledge/TECH_STACK.md`)

- [ ] Page load: < 2 seconds (LCP).
- [ ] User-initiated action → visible response: < 100ms perceived (loading state visible if async).
- [ ] List render: < 500ms.
- [ ] Search results: < 500ms.
- [ ] No memory growth on extended navigation (snapshot before / snapshot after a navigation cycle should not grow unboundedly).

If a target is missed, the failure goes in QA_REPORT and (if material) `IMPACT.md` `Trajectory acknowledged §3` since acceptance criteria typically include perf.

---

## Section 4 — Testing

### 4.1 — Coverage

- [ ] Every `*.component.ts` has a `*.component.spec.ts` next to it.
- [ ] Every `*.service.ts` has a `*.service.spec.ts`.
- [ ] Every reducer / effect / selector has a spec.
- [ ] Every adapter has a spec (adapters are pure; specs are short).
- [ ] Every pipe / directive / guard has a spec.

The numerical coverage target is **>80% line coverage** per `knowledge/TECH_STACK.md`. The structural target — every artifact has a spec — is non-negotiable. A file without a spec is incomplete.

### 4.2 — Scenario completeness (per `bifrost-qa-validator`'s scenario set)

For each spec, the test cases cover:

- [ ] **Happy path** — the user does what they're supposed to do; the system responds as expected.
- [ ] **Sad path** — invalid input (empty, too long, wrong type, malformed); system shows error, doesn't crash, recovers.
- [ ] **Edge case(s)** — at least one of: empty data, unauthenticated user, network timeout, server error, race condition, browser back navigation, page refresh.

A spec that only tests the happy path is half-done.

### 4.3 — Test patterns

- [ ] Mocks the store (`MockStore` from `@ngrx/store/testing`) instead of using a real store in component specs.
- [ ] Mocks HTTP via `HttpClientTestingModule` and `HttpTestingController`. Verifies URL, method, body, headers explicitly.
- [ ] Marble testing (`TestScheduler` from `rxjs/testing`) for non-trivial RxJS pipelines.
- [ ] No `setTimeout` / `setInterval` in tests — use `fakeAsync` + `tick()`.
- [ ] No `done` callback usage — use `async` / `fakeAsync` or `firstValueFrom` / `lastValueFrom` for observables.

### 4.4 — Mutation tests where it matters

- [ ] Custom validators have positive AND negative test cases.
- [ ] Adapters with non-trivial mapping have a spec for each meaningful transformation.
- [ ] State reducers have a spec for each `on(...)` handler — including ones that just spread state with one field changed.

### 4.5 — Tests pass

- [ ] `yarn test` (or the affected-only equivalent) passes.
- [ ] No skipped tests (`xit`, `xdescribe`, `it.skip`) without an open ticket reference in the file header.
- [ ] No `console.log` left in test output. (Lint catches in source; for tests, scan manually.)

---

## Section 5 — Meta-checks (the things people forget)

### 5.1 — File header

- [ ] Every modified or created `.ts` / `.html` / `.scss` file has the Bifrost file header (`@file`, `@author`, `@createdAt`, `@app`, `@description`). Per `bifrost-code-standards`. Per `knowledge/GOTCHAS.md` §"Always include Bifrost file header."

### 5.2 — Documentation

- [ ] Public methods of services and reusable components have JSDoc.
- [ ] Complex logic has inline `// ` comments explaining *why*.
- [ ] No `TODO` / `FIXME` without a ticket reference.

### 5.3 — Logging

- [ ] No `console.log` / `console.warn` / `console.error` in source. Use the project logging service if logging is required. (`debugger` statements likewise — they're a defect.)

### 5.4 — Lint and types

- [ ] `yarn lint` passes with zero warnings (not just zero errors).
- [ ] `tsc --noEmit` (or the equivalent CI step) passes with strict mode enabled.

### 5.5 — Imports

- [ ] No unused imports (lint catches).
- [ ] Imports organized: third-party → app → relative. Lint may auto-organize via `eslint --fix` or Prettier; verify.
- [ ] No deep imports of internal Angular / RxJS internals (`@angular/core/src/...`). Stick to public surface.
- [ ] `commonlib` symbols imported via the `commonlib` path alias, not relative paths to `libs/commonlib/...`.

### 5.6 — Trajectory acknowledgement

- [ ] `CODE_REVIEW.md` ends with the `## Trajectory acknowledged` section per ADR-008 — listing TRAJECTORY sections respected, amendments added (if any), conflicts surfaced (if any).

---

## Section 5.5 — Delivery standards (per `instructions/principles/delivery-standards.md`)

The Frontend department's three non-negotiable delivery standards (encoded as a principle on 2026-04-28) bind every feature. The principles are stated by the receiving team; failing them ships rework. Walk these checks before declaring CODE_REVIEW.md complete:

### 5.5.1 — Simple, well-divided / well-organized PRs (principle 1)

- [ ] **PR scope is focused.** The cumulative diff tells one coherent story; doesn't bundle distinct concerns. If you find yourself describing the diff with "and also" multiple times, the PR is too mixed.
- [ ] **No out-of-scope drift.** Every file in the diff was named in PLAN's `Output:` paths OR is a directly-supporting file (e.g., a translation key added to support a UI string, a barrel export updated). Speculative cleanup, opportunistic refactors, and "while I was here I also fixed..." additions count as drift.
- [ ] **Cumulative diff is reviewable in under 2 hours by Backend.** As a heuristic: ≤ ~30 file changes, ≤ ~800 net lines added. Larger may still be reviewable if tightly coherent (e.g., a single-component refactor that touches many files), but the burden of proof is on you.
- [ ] **PR-shape sanity check** (the aggregate-review step): if the diff feels too large or too mixed, surface as a Major finding in §6 Failures or deviations even if every per-skill check passes individually.

### 5.5.2 — Well-structured and well-documented delivery (principle 2)

- [ ] **File header on every modified or created `.ts` / `.html` / `.scss` file.** Per `bifrost-code-standards` §"File headers": `@file`, `@author`, `@createdAt`, `@app`, `@description`. Missing headers fail this check.
- [ ] **JSDoc on every public service method, public component @Input/@Output, public utility function.** Internal/private methods don't need JSDoc unless complex.
- [ ] **Inline comments explain *why*, not *what*.** Code that simply restates what's obvious from the syntax is noise. Code that explains "why this combinator instead of switchMap" or "why this nullable here" is signal.
- [ ] **TRAJECTORY citations in code where §4 architectural decisions, §2 must-not-break, or §5 prior-incidents bind specific files.** Per `@CodeGen` §"Trajectory citations in code". Quote enough TRAJECTORY text that the reader can locate the source unambiguously, then summarize the binding.
- [ ] **No `TODO` / `FIXME` without a ticket reference.** `// TODO(WBX-1234):` is fine; bare `// TODO:` is a defect.
- [ ] **Conventional-commit message style** on every commit in the feature branch (`feat(<area>): <description>`, `fix(<area>): <description>`, etc.). No `wip`, no empty subjects, no all-caps.

### 5.5.3 — Angular components (principle 3)

- [ ] **`commonlib` `app-*` components reused** wherever a direct fit existed in `knowledge/COMPONENT_LIBRARY.md`. Forking a new component is justified only when no existing component covers the need (and the justification is in CODE_REVIEW.md §1.4 component-gen line).
- [ ] **File quartet present** for every new component: `.component.ts` / `.component.html` / `.component.scss` / `.component.spec.ts`. Missing any one is a defect.
- [ ] **`ChangeDetectionStrategy.OnPush`** on every new component. Default change detection only with explicit justification in the file header.
- [ ] **`selector: 'app-<kebab>'`** convention followed. No `wbx-*`, no `<plain-element>`.
- [ ] **Reactive forms only.** No `[(ngModel)]` for form state. Custom `ControlValueAccessor` extends `commonlib`'s base utilities.
- [ ] **No inline HTML/CSS bypassing the component system.** Behaviors that warrant a component get a component.
- [ ] **No third-party UI libraries** (PrimeNG, ng-bootstrap, etc.) for behaviors `commonlib` covers.
- [ ] **No direct Material primitive usage** when an `app-*` wrapper exists (`<app-button>` not `<button mat-raised-button>`; `<app-input>` not bare `<input>` with `<mat-form-field>` around it).

### Why this section is here

`bifrost-code-review` was originally about cross-skill aggregation (naming + state + API + components + security + perf + testing). The delivery-standards section is its own concern at a peer level — it codifies what the *receiving team* expects, separate from what individual skills enforce. When a skill check passes but a delivery-standard fails (e.g., naming is conformant but components weren't reused, OR API integration is correct but the PR is too mixed), the principle wins. Don't merge code that fails delivery standards even when every per-skill check passes.

---

## Section 6 — `CODE_REVIEW.md` format

When @CodeGen completes the walk, write `CODE_REVIEW.md` with this shape:

```markdown
# CODE_REVIEW.md — <feature-name>

Author: @CodeGen
Date: <ISO-8601>
PR scope: <one paragraph: what was built>

## 1. Aggregated checklist

### code-standards
- ✓ Naming, formatting, headers all conformant. ESLint passes with 0 warnings.

### state-management
- ✓ STATE.md update (delegated to @Conductor).
- ✓ NgRx: 1 new reducer, 2 new effects, 4 new selectors. All pure / catchError / immutable.
- ✓ No bare .subscribe(). All subscriptions use async pipe except `<list specific places>` which use takeUntil(destroy$).

### api-integration
- ✓ All endpoints from api.<domain>.<endpoint>(). Two new entries added to commonlib.
- ✓ ErrorHandlingService routed for all error paths.
- ✓ One new adapter (UserNotificationAdapter), spec'd.

### component-gen
- ✓ Reused commonlib: app-input, app-button, app-skeleton-loading, app-status-pill, app-table.
- ✓ One new component (NotificationItemComponent) — feature-specific, lives in apps/business/src/app/features/notifications/.
- ✓ All OnPush. Reactive forms. i18n on all strings. Accessibility verified.

## 2. Security
- ✓ No XSS surface. All [innerHTML] uses SafeHtmlPipe.
- ✓ No hardcoded tokens. All HTTP via interceptors.
- ✓ No PII in logs.
- ✓ All money handling via SafeMath.

## 3. Performance
- ✓ All components OnPush. trackBy on all *ngFor. debounceTime(300) on search input.
- ✓ Lazy-loaded route. Bundle delta: +12KB gzipped.
- ✓ Page load measured at 1.4s on the test environment.

## 4. Testing
- ✓ 18 specs added. Coverage: 87% line.
- ✓ Happy / sad / edge case scenarios for every component and service.
- ✓ MockStore used. HttpClientTestingModule used. Marble tests for the notification stream effect.
- ✓ All tests pass: `yarn test --affected` → 18/18 green.

## 5. Meta
- ✓ File headers on all 23 files (created or modified).
- ✓ JSDoc on all public service methods and component @Inputs/@Outputs.
- ✓ No console.log, no debugger, no TODO without ticket.
- ✓ Lint clean. tsc strict clean.
- ✓ Imports organized.

## Failures or deviations
(None — all items pass. If any failed, list here with: item, reason failed, fix or escalation.)

## Trajectory acknowledged
- Sections respected: §1, §2, §3, §4, §5
- Amendments added: none
- Conflicts surfaced: none
```

If items failed and were fixed in this same pass, list them under "Failures or deviations" with the fix. Pretending nothing failed is worse than admitting one item needed a second look — Backend trusts the process when it's honest about misses.

---

## Pointers

- **Naming + formatting:** `bifrost-code-standards` §"Self-review checklist."
- **NgRx + STATE.md:** `bifrost-state-management` Section A + §"Common review checklist (for `@Reviewer`)."
- **HTTP discipline:** `bifrost-api-integration` §"Self-review checklist."
- **UI components:** `bifrost-component-gen` §"Self-review checklist."
- **Test scenarios:** `bifrost-qa-validator`.
- **Common pitfalls:** `knowledge/GOTCHAS.md`.
- **Performance targets:** `knowledge/TECH_STACK.md` §"Performance Targets."
- **Trajectory acknowledgement format:** ADR-008.
