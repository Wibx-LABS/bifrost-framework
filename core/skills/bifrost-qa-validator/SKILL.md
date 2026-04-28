---
name: bifrost-qa-validator
description: How @QA validates a Wiboo feature — what to test, how to structure tests, what counts as "covered," what counts as a pass-or-fail gate. Carries Jest 29 unit-test patterns, Cypress 12 e2e-test patterns, the MockStore / HttpClientTestingModule / marble-test toolkit, the happy/sad/edge-case scenario template every spec must satisfy, the performance targets that gate acceptance (page load < 2s, action < 100ms, list/search render < 500ms), the accessibility checks (keyboard navigation, screen-reader, color-not-only-signal, contrast 4.5:1, touch target 44px), the mobile-responsiveness checks (320px width minimum), and the API-contract validation that confirms generated code calls real endpoints with correct shapes. Use this skill whenever you are @QA running /bifrost:qa (you walk this skill against the source and produce QA_REPORT.md with pass/fail); CI running the bifrost-validate qa-report check; or @CodeGen writing or modifying any *.spec.ts / *.cy.ts file (the test design must match what @QA will validate against). Triggering signals: any mention of *.spec.ts, *.cy.ts, Jest, Cypress, MockStore, HttpClientTestingModule, marble testing, fakeAsync / tick, "test coverage", QA_REPORT, "happy path / sad path / edge case", "accessibility", "mobile responsive", "performance budget", or any moment where the question is "does this work, and how do we prove it?".
---

# bifrost-qa-validator

`@QA` is the agent that turns generated code into a tested deliverable. This skill carries the toolkit and the discipline. The toolkit is what's installed and configured (Jest 29 + Cypress 12 + the testing utilities); the discipline is the scenario template every spec must satisfy and the pass/fail gates `@QA` enforces before allowing the lifecycle to advance.

`@QA` is a **Hard Stop gate** per the lifecycle (per ADR-006, ADR-008). A QA pass ships the feature toward delivery; a QA fail returns it to the Product operator (or `@CodeGen` re-run) with a written description of what failed and why. There is no ambiguous middle.

The gating discipline is what makes Backend-dev review changes < 10% achievable. If `@QA` is sloppy, defects ship; if `@QA` is strict, defects are caught before HANDOFF.md.

---

## Section 1 — The toolkit

### Unit tests — Jest 29

Wiboo uses Jest 29 with `jest-preset-angular`. Configuration lives at the repo root (`jest.preset.cjs`, `jest.base.ts`) plus per-app/lib `jest.config.ts`. Setup files are at `<project>/src/test-setup.ts`.

**Test file location:** next to the source — `user.service.ts` and `user.service.spec.ts` sit in the same folder. Never in a parallel `__tests__` directory.

**Naming:** `<filename>.spec.ts`.

**Run:**

```bash
# One project
nx test account
nx test commonlib

# Affected by current diff (CI PR mode)
nx affected --targets=test

# Whole monorepo
yarn test
```

**Standard imports:**

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TestScheduler } from 'rxjs/testing';
import { fakeAsync, tick, flush } from '@angular/core/testing';
```

### E2E — Cypress 12

E2E tests live in `apps/<app>-e2e/`. Run with `nx e2e <app>-e2e`. Cypress is configured via `@nx/cypress`.

**Test file naming:** `<name>.cy.ts`.

**E2E covers user-facing flows that span multiple components / pages / a real HTTP round-trip.** Don't duplicate unit-test coverage in E2E — E2E is for the integration layer (route guards, store-effects-API, full forms with submission). Each feature should have at least one E2E happy-path test.

### Stubs and mocks

- **Mock data lives at** `libs/commonlib/src/lib/mocks/stubs/`. Imported as `import { ... } from 'commonlib'`. Reuse existing stubs before authoring new ones.
- **Mock store:** `provideMockStore({ initialState })` from `@ngrx/store/testing`. Don't construct a real `Store` for tests.
- **Mock HTTP:** `HttpClientTestingModule` + `HttpTestingController`. Verifies URL, method, body, headers explicitly.
- **Time:** `fakeAsync` + `tick(ms)` for promise / setTimeout. `TestScheduler` (marble tests) for non-trivial RxJS pipelines.

---

## Section 2 — The scenario template

Every spec file covers at minimum **happy path + sad path + edge case(s)**. The proportions vary by what's being tested, but the categories are mandatory.

### Happy path

The user does what the feature is designed for, with valid inputs, in the expected order. The system responds correctly. No errors.

### Sad path

The user does something wrong — invalid input, missing data, malformed value. The system shows an error, does not crash, and the user can recover and retry.

### Edge cases

Pick the at-least-one most-likely-to-bite for the unit under test. Common ones:

- **Empty data:** what happens when the list is empty / the response is `[]`?
- **Logged-out user:** what happens on a 401 / 405 (`SessionInterceptor` triggers logout)?
- **Network timeout:** what happens after 35s with no response?
- **Server error (5xx):** does the user see a friendly message? Does the store dispatch the failure action?
- **Race condition:** what if a fast user dispatches `search('a')` then `search('ab')` rapidly? `switchMap` should cancel the first.
- **Browser back button:** does state restore correctly?
- **Page refresh:** does state persist (via store hydration) or reset cleanly?
- **Spam click:** does the submit button debounce / `exhaustMap`?
- **Very long input / very long list:** does virtualization or truncation work?
- **Unicode / special characters:** does the input handle Brazilian Portuguese characters, emojis, RTL text?

A spec that tests only the happy path is a half-done spec. The QA pass/fail gate fails specs that don't include sad and at-least-one edge case unless the unit-under-test genuinely has none (rare).

---

## Section 3 — Component tests

```typescript
describe('LoginComponent', () =>
{
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let store: MockStore;

    beforeEach(async () =>
    {
        await TestBed.configureTestingModule({
            imports: [
                ReactiveFormsModule,
                HttpClientTestingModule,
                TranslateModule.forRoot(),
            ],
            declarations: [LoginComponent],
            providers: [provideMockStore({ initialState: { auth: { loading: false, user: null } } })],
        }).compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        store = TestBed.inject(MockStore);
        fixture.detectChanges();
    });

    it('creates', () => expect(component).toBeTruthy());
    // ... happy / sad / edge case tests follow
});
```

**Cover at minimum:**
- The component creates without errors.
- `@Input` properties produce the expected DOM.
- `@Output` events fire on the correct interactions.
- Forms: valid input → form valid; invalid input → `[error]` shown.
- Loading state: `loading$` truthy → skeleton/spinner shown; falsy → content shown.
- Error state: `error$` emits → status-pill or `[error]` shown.
- Accessibility: icon-only buttons have `aria-label`; form fields have visible labels.

---

## Section 4 — Service tests

```typescript
describe('SearchService', () =>
{
    let service: SearchService;
    let httpMock: HttpTestingController;

    beforeEach(() =>
    {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [SearchService],
        });

        service = TestBed.inject(SearchService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => httpMock.verify());     // verify no outstanding requests

    it('POSTs the query to the search endpoint', () =>
    {
        service.search('token').subscribe((results) =>
        {
            expect(results.length).toBe(1);
            expect(results[0].name).toBe('token-X');
        });

        const req = httpMock.expectOne(api.searching.queryPortals());
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({ query: 'token' });

        req.flush([{ id: '1', name: 'token-X' }]);
    });
});
```

**Cover at minimum:** URL + method + body + headers verified explicitly. Response transformation (adapter) tested. Error path produces the documented behavior (empty array, dispatched action, etc.).

---

## Section 5 — Reducer / selector / effect tests

**Reducer:**

```typescript
it('handles loadUser by setting loading=true', () =>
{
    const action = UserActions.loadUser({ id: '1' });
    const state = userReducer(initialUserState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
});
```

**Selector** (composed):

```typescript
it('selectIsLoggedIn returns true when user is set', () =>
{
    expect(selectIsLoggedIn.projector({ user: mockUser })).toBe(true);
});
```

**Effect** (with marble testing for non-trivial flows):

```typescript
it('dispatches loadSuccess on successful fetch', () =>
{
    scheduler.run(({ hot, cold, expectObservable }) =>
    {
        userService.getUser.and.returnValue(cold('-a|', { a: mockUser }));

        actions$ = hot('-a',  { a: UserActions.loadUser({ id: '1' }) });
        const expected =     '--b';

        const effects = TestBed.inject(UserEffects);
        expectObservable(effects.loadUser$).toBe(expected, { b: UserActions.loadSuccess({ user: mockUser }) });
    });
});
```

---

## Section 6 — Performance validation

The performance targets in `knowledge/TECH_STACK.md` are gates, not aspirations. `@QA` measures and fails if missed.

| Metric | Target | How to measure |
|---|---|---|
| Page load (LCP) | < 2 seconds | Lighthouse on the test environment, or Playwright/Cypress with performance API. |
| User action → response visible | < 100 ms perceived | Either the action completes in < 100ms OR a loading state appears in < 100ms. |
| List render | < 500 ms | Time from `data$` emission to `LCP` of the list. Visualize with Angular Devtools profiler. |
| Search results | < 500 ms | Time from search input "settled" (post-debounce) to results visible. |
| Bundle delta | App bundle stays under target (per `knowledge/TECH_STACK.md`) | `nx build <app>` and check the gzipped size. |

Performance findings go in `QA_REPORT.md` — pass with measured value, or fail with the measured value AND the suggested remediation.

---

## Section 7 — Accessibility validation

A11y checks `@QA` performs on every feature with UI:

- **Keyboard-only navigation:** every interactive element reachable via Tab; activatable via Enter / Space; dismissible via Escape (modals). No keyboard trap.
- **Screen-reader pass:** every form input has a label (visible or `aria-label`); every icon-only button has `aria-label`; status changes (`aria-live` regions) are announced.
- **Color is not the only signal:** error states use both red AND text/icon. Required fields use both color AND text marker.
- **Contrast:** body text ≥ 4.5:1 against background. Large text ≥ 3:1.
- **Touch targets:** buttons / links ≥ 44×44 px.
- **Motion:** `prefers-reduced-motion` respected for non-essential animations.

A failing a11y check is a `QA_REPORT.md` failure unless explicitly waived in TRAJECTORY.md (rare; should be flagged at intake, not at QA).

---

## Section 8 — Mobile responsiveness

Wiboo apps run on mobile. Every screen MUST work at 320px width (the iPhone SE baseline).

`@QA` checks:

- **Layout doesn't break:** no horizontal overflow at 320px / 375px / 414px / 768px / 1024px / 1440px widths.
- **Tap targets:** ≥ 44×44 px (covered in a11y too).
- **Forms usable on mobile keyboard:** input types correct (`type="email"`, `type="tel"`, `type="number"`); virtual keyboard doesn't obscure submit button.
- **Modals / dialogs:** scrollable on small viewports; close button accessible without scrolling.

Verify in Chrome DevTools mobile emulation OR a real device. The `@nx/cypress` setup supports viewport tests (`cy.viewport(320, 568)` etc.).

---

## Section 9 — API-contract validation

Independently of the unit-test mocks, `@QA` validates that the *real* endpoints called exist and accept/return the documented shape. This is where `bifrost-validate api-calls` (the CI step) joins the loop.

Checks:

- Every endpoint called by the new code exists in `api.<domain>.<endpoint>()` (per `bifrost-api-integration` Rule 1).
- The request body shape matches the API contract (when `knowledge/API_CONTRACTS.md` is seeded, validate against it; until then, validate against the `*.api.ts` definition that wraps `api.*`).
- The response is consumed via an adapter (per `bifrost-api-integration` Rule 4) — DTO type names match wire format.
- Auth headers are added by interceptors, not by the service code.
- Default 35s timeout respected (no override without justification).

A discrepancy here is a `QA_REPORT.md` fail — Backend will discover it on review otherwise, and that's the rework rate kill-switch.

---

## Section 10 — `QA_REPORT.md` format

When `@QA` finishes, write `QA_REPORT.md`:

```markdown
# QA_REPORT.md — <feature-name>

Author: @QA
Date: <ISO-8601>
Status: PASS | FAIL

## Test execution

- Unit tests: <N>/<N> passing. (yarn test --affected)
- E2E tests: <N>/<N> passing. (nx e2e <app>-e2e)
- Coverage: <N>% line coverage on affected files.
- Skipped tests: <count> (each justified with ticket reference, or 0).

## Scenario coverage

For each new component / service / reducer / effect:
- Happy path: ✓ (test name)
- Sad path: ✓ (test name)
- Edge case: ✓ (test name)

If any unit lacks a category, list with rationale or as a finding.

## Performance

| Metric | Target | Measured | Result |
|---|---|---|---|
| LCP | < 2 s | <value> | ✓ / ✗ |
| Action latency | < 100 ms perceived | <value> | ✓ / ✗ |
| List render | < 500 ms | <value> | ✓ / ✗ |
| Search render | < 500 ms | <value> | ✓ / ✗ |
| Bundle delta | <budget> | <value> | ✓ / ✗ |

## Accessibility

- Keyboard-only navigation: ✓ / ✗ (with notes)
- Screen-reader pass: ✓ / ✗
- Color contrast: ✓ / ✗
- Touch targets ≥ 44×44 px: ✓ / ✗
- prefers-reduced-motion respected: ✓ / ✗

## Mobile responsiveness

Tested viewports: 320 / 375 / 768 / 1024 / 1440 px.
- Layout integrity: ✓ / ✗ (notes per viewport if any)
- Forms usable on mobile keyboard: ✓ / ✗
- Modals scroll correctly: ✓ / ✗

## API contracts

- All endpoints exist in api.<domain>.<endpoint>(): ✓ / ✗
- Request bodies match contract: ✓ / ✗
- Adapters wired for all responses: ✓ / ✗
- No manual auth headers: ✓ / ✗
- Timeout discipline: ✓ / ✗

## Findings

### Critical (block release)
- (none) OR list with: file:line, what's wrong, suggested fix.

### Major (block release unless waived)
- (none) OR list.

### Minor (notes for future)
- (none) OR list.

## Verdict

PASS — feature is ready for /bifrost:deliver.

OR

FAIL — return to @CodeGen with the findings above. Rework focus: <one-paragraph summary of the most consequential failures>.

## Trajectory acknowledged
- Sections respected: §1, §2, §3, §4, §5
- Amendments added: <link or "none">
- Conflicts surfaced: <link or "none">
- Acceptance criteria coverage: each MUST/SHOULD criterion in TRAJECTORY §3 is mapped to a passing test (or a documented failure).
```

PASS verdict only when **every** Critical and Major finding is resolved AND every TRAJECTORY §3 acceptance criterion has a passing test reference. Minor findings can ship as notes; Critical/Major cannot.

---

## Pointers

- **Test scenarios source:** `knowledge/GOTCHAS.md` §Testing.
- **Performance targets:** `knowledge/TECH_STACK.md` §"Performance Targets."
- **Test setup files:** per-app `src/test-setup.ts`.
- **Mocks / stubs:** `libs/commonlib/src/lib/mocks/stubs/`.
- **Component test pattern:** `bifrost-component-gen` §Testing components.
- **Service test pattern:** `bifrost-api-integration` (the URL/method/body verification).
- **NgRx test patterns:** `bifrost-state-management` Section B + the marble-test snippet here.
- **Self-review (different scope):** `bifrost-code-review` — that skill is the master `@CodeGen` self-review checklist; this skill is the `@QA` validation checklist. They overlap on what good code looks like; they differ on where in the lifecycle they're invoked and what artifact they produce.
