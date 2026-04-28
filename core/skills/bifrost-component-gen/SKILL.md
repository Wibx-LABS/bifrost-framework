---
name: bifrost-component-gen
description: How UI components are built in the Wiboo monorepo — Angular Material under the hood, but consumed via the `app-*` wrapper components in `commonlib`; reactive forms only (no template-driven); ChangeDetectionStrategy.OnPush by default; loading states (spinner / skeleton) and error states (status-pill) handled with the existing components, not bespoke. Use this skill whenever you are @CodeGen creating or modifying any component (`.component.ts`, `.component.html`, `.component.scss`, `.component.spec.ts`) in apps/account, apps/business, apps/shopping, apps/wibxgo, libs/commonlib, libs/wallet; or @Reviewer verifying that generated UI uses the existing `commonlib` components rather than rolling its own. Triggering signals: any mention of @Component, a component selector, @Input / @Output, FormGroup / FormControl / Validators, *ngIf / *ngFor, app-input / app-button / app-table / app-card / app-dialog / app-sidebar / app-spinner / app-skeleton-loading / app-status-pill (or any `app-*` selector), Material (`mat-*`), accessibility / aria-label / keyboard nav, OnPush change detection, or "build a new component / page / screen / form / modal / dialog" inside Wiboo. The first rule of component work in Wiboo: USE THE EXISTING `commonlib` COMPONENTS. The library is the answer 90% of the time. Build new components only when no existing one fits, and document the gap.
---

# bifrost-component-gen

Wiboo has a populated `commonlib` component library. Most "I need a button / input / card / table / dialog" answers are already there. The skill's job is to make sure `@CodeGen` reaches for the existing component first, configures it correctly, and only writes a brand-new component when there is genuinely no fit. The full catalogue lives at `knowledge/COMPONENT_LIBRARY.md` (~50+ components organized by purpose: form, container, display, specialized, layout); this skill is the working summary plus the *patterns* that govern how any component — existing or new — is shaped.

**This skill operationalizes `instructions/principles/delivery-standards.md` principle 3 (Angular components).** That principle was stated by the Frontend department on 2026-04-28 as a non-negotiable delivery standard: reuse `commonlib` first, decompose into proper Angular components, file quartet + OnPush + reactive forms only, no inline HTML/CSS bypassing the component system, no third-party UI libraries when `commonlib` covers it. The rules in this skill exist because the Frontend department asks for them, not because they're internal Bifrost preferences. Failing them ships components Backend will reject at review.

---

## The first rule: use the library

Before writing a single line of HTML or a single new `@Component`, check `knowledge/COMPONENT_LIBRARY.md`. The library covers:

- **Form**: `app-input`, `app-select`, `app-checkbox`, `app-radio-group`, `app-button`, `app-textarea`, `app-simple-upload`.
- **Container**: `app-card`, `app-dialog`, `app-sidebar`, `app-admin-menu`.
- **Display**: `app-status-pill`, `app-progress-bar`, `app-skeleton-loading`, `app-spinner`, `app-carousel`, `app-table`.
- **Specialized**: `app-qrcode-viewer`, `app-map`, `app-rate-icon`, `app-star-rating`, `app-product-image-viewer`.
- **Layout**: `app-tab-group`, `app-accordion`.

If a component in the catalogue does what you need, use it as-is. If it's *almost* right, the answer is usually to extend the existing component (a new prop, a new variant) — not fork a new one. If nothing fits, you have a real gap; see "Building a new component" below.

**Don't:**

- Reach for `<button mat-raised-button>` directly when `<app-button [type]="'primary'">` exists. The wrapper exists *for a reason* — consistent styling, accessibility defaults, theme tokens, behavior shared across apps.
- Build a "small reusable thing" inline in a feature folder when `commonlib` has it. If it's reusable, it goes in `commonlib`. If it's truly feature-specific, it stays in the feature folder.
- Pull in a third-party component library (PrimeNG, ng-bootstrap, etc.) for something `commonlib` covers.

**Why this matters:** the component library is what makes Wiboo apps look like one product instead of four. Bypassing it once doesn't matter; bypassing it ten times produces a frontend with eight subtly different button styles, six date pickers, and inconsistent loading states. The cost of "I'll just use Material directly here" is paid by every future feature.

---

## Component file structure

Every component is a quartet:

```
search-portal/
├── search-portal.component.ts      # logic — exports SearchPortalComponent
├── search-portal.component.html    # template
├── search-portal.component.scss    # styles
└── search-portal.component.spec.ts # unit tests
```

All four files use kebab-case, the `.component` role suffix, and live in a folder named after the component. Spec is mandatory, not optional.

---

## The `@Component` decorator — the Wiboo defaults

```typescript
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-search-portal',
    templateUrl: './search-portal.component.html',
    styleUrls: ['./search-portal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPortalComponent
{
    // ...
}
```

**Required:**
- `selector: 'app-<kebab-name>'` — the `app-` prefix is non-negotiable (`bifrost-code-standards`).
- `templateUrl` and `styleUrls` — never inline `template:` or `styles:` (they hide from search and dilute the file quartet).
- `changeDetection: ChangeDetectionStrategy.OnPush` — the default for the codebase. Default change detection is acceptable only with explicit justification in the file header.

**Why OnPush:** Default change detection re-runs every binding on every async event, every microtask, every observable emission anywhere in the tree. With OnPush, Angular only re-checks a component when:
- An `@Input()` reference changes (immutability matters).
- An event the component emits or subscribes to fires.
- An `async` pipe receives a new emission.
- You explicitly call `markForCheck()` or `detectChanges()`.

OnPush + immutability + async pipe is the performance baseline. It's also the discipline that keeps NgRx selectors meaningful — a memoized selector returns the same reference for unchanged data, so the OnPush component doesn't re-render. Deviating from OnPush undoes that whole chain.

---

## Inputs and outputs

```typescript
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({ /* ... */ })
export class UserCardComponent
{
    @Input() user!: User;                              // required
    @Input() showEmail = true;                          // optional with default
    @Input() actions: UserCardAction[] = [];

    @Output() userClick = new EventEmitter<User>();
    @Output() actionSelect = new EventEmitter<UserCardAction>();

    onClick(): void
    {
        this.userClick.emit(this.user);
    }
}
```

**Naming** (per `bifrost-code-standards`):
- Inputs: camelCase noun or noun-phrase. Required inputs marked with `!`; optional with a sensible default.
- Outputs: camelCase, present-tense verb (`userClick`, not `userClicked`; `valueChange`, not `valueChanged`). The "ed" suffix is for past-tense events; in Angular's idiomatic style, outputs are present-tense.
- Output handlers in the parent: `on<Output>` (`(userClick)="onUserClick($event)"`).

**Don't:**
- `@Input` of a deeply mutable object you mutate in the component. With OnPush, mutations don't trigger re-render. Treat inputs as read-only.
- `@Output` of an arbitrary value when a typed event would do. `(userClick)="onUserClick($event)"` should give the parent a `User`, not a `MouseEvent`.
- Two-way binding on complex types. `[(value)]` is fine for primitives; for objects, prefer separate `@Input` + `@Output`.

---

## Forms — reactive only

Wiboo uses Angular Reactive Forms (`@angular/forms` `ReactiveFormsModule`). **Template-driven forms (`[(ngModel)]` for form state) are forbidden** — they're hard to test, don't compose with NgRx, and lack typed validators.

```typescript
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({ /* ... */ })
export class LoginComponent
{
    form: FormGroup = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
    });

    constructor(private fb: FormBuilder) {}

    onSubmit(): void
    {
        if (this.form.invalid) { return; }
        const { email, password } = this.form.value;
        this.store.dispatch(AuthActions.login({ email, password }));
    }
}
```

Template:

```html
<form [formGroup]="form" (ngSubmit)="onSubmit()">
    <app-input
        formControlName="email"
        [label]="'login.email' | translate"
        [error]="form.get('email')?.errors | errorTranslation">
    </app-input>

    <app-input
        formControlName="password"
        type="password"
        [label]="'login.password' | translate"
        [error]="form.get('password')?.errors | errorTranslation">
    </app-input>

    <app-button
        [label]="'login.submit' | translate"
        [type]="'primary'"
        [disabled]="form.invalid || (loading$ | async)">
    </app-button>
</form>
```

**Validators:**
- Use `Validators.required`, `Validators.email`, `Validators.minLength(n)`, `Validators.pattern(re)` for built-ins.
- Custom validators live in `commonlib` `form-validators.util.ts` (CPF, CNPJ, phone, etc.). Use them.
- Brazilian-format inputs (CPF, CNPJ, phone, CEP) get `ngx-mask` masks. Use the documented mask strings — see `knowledge/TECH_STACK.md`.

**Error display:** the standard `ErrorTranslationMapper` + the `errorTranslation` pipe converts `ValidationErrors` into translated user-facing strings. Don't write custom "Email is invalid" strings; the i18n system has them.

**Don't:**
- `<input [(ngModel)]="email">` for form state — that's template-driven.
- Custom `class.error` styling for invalid inputs — use the wrapper component's `[error]` prop.
- Manually constructing FormGroup with `new FormGroup({ ... })` instead of `FormBuilder.group()`.

---

## Loading and error states

These are uniform across the app — **don't roll your own**.

**Loading:**

```html
<!-- Show skeleton while initial data loads -->
<app-skeleton-loading *ngIf="loading$ | async" [lines]="3"></app-skeleton-loading>

<!-- Show spinner for in-flight actions -->
<app-spinner *ngIf="submitting$ | async" [size]="'medium'" [color]="'primary'"></app-spinner>

<!-- Render once data resolves -->
<app-table *ngIf="data$ | async as data" [columns]="cols" [data]="data"></app-table>
```

Use `app-skeleton-loading` for "data fetch in progress, no data yet to show" — preserves layout, signals progress.
Use `app-spinner` for "user-initiated action in flight" — submit button disabled, spinner overlaid.

**Error:**

```html
<app-status-pill *ngIf="error$ | async as error" [type]="'error'">
    {{ error.message }}
</app-status-pill>
```

For form-field-level errors, the `app-input` / `app-select` etc. accept an `[error]` prop. For page-level errors, `app-status-pill` with `[type]="'error'"`. For toast notifications, `ErrorHandlingService` (per `bifrost-api-integration`) handles them globally.

**Don't:**
- Custom CSS spinner / loading animation. There is one.
- Inline `<div *ngIf="error" class="error">`. There is `<app-status-pill>`.
- Showing raw error objects to users. `ErrorHandlingService` translates.

---

## Accessibility

Every interactive element must be keyboard-navigable and screen-reader-friendly.

- **Labels:** every form input has a visible `<label>` (or accessible-equivalent label via `aria-label`). The `app-input` wrapper provides this — don't remove it.
- **Buttons:** every `<app-button>` carries either a visible label or an `aria-label`. Icon-only buttons MUST have `aria-label`.
- **Focus management:** dialogs (`app-dialog`) trap focus on open and return focus to the trigger on close. The wrapper handles this; don't reach into the DOM to manage focus manually.
- **Color contrast:** at least 4.5:1 (WCAG AA). The theme tokens in `knowledge/FRONTEND_REPOSITORY_MANUAL.md` §8 are checked; deviating from them risks failing contrast.
- **Color is not the only signal:** error states use both red AND text/icon. Status pills use both color AND label. A user with color-blindness can still navigate.
- **Touch targets:** 44×44 pixels minimum. The library's button components meet this; custom inline buttons often don't.
- **Keyboard navigation:** every page is navigable with Tab / Shift-Tab / Enter / Esc alone. If you find yourself adding a `(click)` to a `<div>`, use a `<button>` instead.

The `bifrost-qa-validator` skill carries the test-time accessibility checks. Build the component to meet them; don't expect QA to retrofit accessibility.

---

## i18n

Every user-visible string is translated. Wiboo uses `@ngx-translate/core` with HTTP-loaded JSON files.

```html
<!-- ✅ Right -->
<h1>{{ 'profile.title' | translate }}</h1>
<app-button [label]="'profile.save' | translate"></app-button>

<!-- ❌ Wrong -->
<h1>Profile</h1>
<app-button [label]="'Save'"></app-button>
```

Translation keys are dot-notated by feature (`profile.title`, `wallet.transactions.empty`). Add new keys to the JSON files in `apps/<app>/src/assets/i18n/{en,es,pt-br}.json` — and add them in **all three** languages, not just the one you're working in. Missing translations show the raw key in production.

Numbers, currencies, dates: use Angular's pipes (`number`, `currency`, `date`) with locale awareness. Wiboo's primary locale is `pt-br`; English and Spanish are also supported.

---

## Building a new component (when nothing in `commonlib` fits)

If, after checking `knowledge/COMPONENT_LIBRARY.md`, no existing component covers the need, the question is **where the new component lives**:

- **Feature-specific component** (used in only one feature/screen): lives at `apps/<app>/src/app/features/<feature>/components/<name>/`.
- **Reusable component** (used in 2+ places, even if only in one app today): lives at `libs/commonlib/src/lib/components/<name>/`. Add the export to `commonlib`'s public surface.

**The decision rule:** if you can imagine the next feature using this component, it goes in `commonlib`. Don't optimize for "let's see if it's needed twice" — that's how the library never grows. Bias toward reusable.

**When adding to `commonlib`:**
- Name follows `app-<kebab>` convention.
- File quartet (`.component.ts/.html/.scss/.spec.ts`).
- `ChangeDetectionStrategy.OnPush`.
- `@Input()` for read-only data, `@Output()` for events.
- Reactive forms only.
- Accessibility-complete (label, aria, keyboard, contrast, focus).
- Spec covers happy + sad + edge cases (per `bifrost-qa-validator`).
- Adds an entry to `knowledge/COMPONENT_LIBRARY.md` documenting the new component (props, events, usage example) — Backend reviews this as part of PR.

**When adding feature-specific:** same rules minus the `commonlib` export and the `COMPONENT_LIBRARY.md` entry.

---

## ngOnInit / ngOnDestroy

```typescript
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({ /* ... */ })
export class UserProfileComponent implements OnInit, OnDestroy
{
    private destroy$ = new Subject<void>();

    user$ = this.store.select(selectUser);

    constructor(private store: Store) {}

    ngOnInit(): void
    {
        this.store
            .select(selectActiveTab)
            .pipe(takeUntil(this.destroy$))
            .subscribe((tab) => this.activeTab = tab);
    }

    ngOnDestroy(): void
    {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
```

`ngOnInit` is for setup that depends on inputs being available; `ngOnDestroy` is for cleanup. The `destroy$` + `takeUntil` pattern is the way to subscribe in code (covered in `bifrost-state-management` Section B). Async pipe in template is preferred when you can use it.

---

## Testing components

Every `.component.ts` has a `.component.spec.ts` next to it. Minimum coverage:

- **Render**: component creates without errors.
- **Inputs**: setting `@Input` properties produces the expected DOM.
- **Outputs**: triggering the relevant interaction emits the expected event.
- **Forms** (if applicable): valid input → form valid; invalid input → `[error]` shown.
- **Loading state**: when `loading$` emits true, skeleton/spinner shows.
- **Error state**: when `error$` emits, status-pill shows.
- **Accessibility**: `aria-label` exists on icon-only interactive elements.

The full test scenario set lives in `bifrost-qa-validator`. This skill says "write the spec next to the component"; that one says "what to test."

---

## Self-review checklist

When `@CodeGen` finishes a component (and `@Reviewer` on diff):

- [ ] Existing `commonlib` components used wherever they fit; new components only when no fit existed.
- [ ] File quartet present: `.component.ts`, `.component.html`, `.component.scss`, `.component.spec.ts`.
- [ ] `selector: 'app-<kebab>'` and `ChangeDetectionStrategy.OnPush`.
- [ ] `templateUrl` and `styleUrls` (never inline).
- [ ] `@Input()` for read-only data; `@Output()` events use present-tense names.
- [ ] No template-driven form (`[(ngModel)]` for form state). Reactive forms only.
- [ ] Loading state uses `app-skeleton-loading` or `app-spinner`. Error state uses `app-status-pill` or `[error]` on form fields.
- [ ] All user-visible strings go through `| translate`.
- [ ] Every interactive element has a label or `aria-label`. Keyboard-navigable.
- [ ] OnPush change detection compatible: inputs treated as immutable, async pipe in template, no manual mutation of state objects.
- [ ] `destroy$` + `takeUntil` if subscribing in code; async pipe preferred where possible.
- [ ] Spec file exists with at minimum render + inputs + outputs + form-validity + loading + error coverage.
- [ ] Component file has a complete file header (per `bifrost-code-standards`).
- [ ] If new and reusable: added to `commonlib`, exported, documented in `COMPONENT_LIBRARY.md`.

---

## Pointers

- **Component catalogue:** `knowledge/COMPONENT_LIBRARY.md` (full list of `app-*` components with props, events, examples).
- **Module architecture:** `knowledge/FRONTEND_REPOSITORY_MANUAL.md` §12.
- **Styling tokens (colors, spacing, breakpoints):** `knowledge/FRONTEND_REPOSITORY_MANUAL.md` §8.
- **Form patterns + validators:** `commonlib` `form-validators.util.ts`; `knowledge/FRONTEND_REPOSITORY_MANUAL.md` §6.1.7.
- **i18n:** `knowledge/FRONTEND_REPOSITORY_MANUAL.md` §9; translation files at `apps/<app>/src/assets/i18n/`.
- **Naming:** `bifrost-code-standards`.
- **Subscription discipline / OnPush:** `bifrost-state-management` Section B.
- **HTTP / data fetching inside components:** `bifrost-api-integration` (HTTP lives in services, components consume).
- **Test scenarios:** `bifrost-qa-validator`.
