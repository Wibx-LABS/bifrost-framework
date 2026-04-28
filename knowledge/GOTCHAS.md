---
domain: technical
type: reference
status: active
topic: bifrost/knowledge
---

# Bifrost Gotchas & Known Issues

Common pitfalls, edge cases, and lessons learned when working with the Bifrost codebase.

**Source:** Bifrost Frontend Repository Manual + team experience  
**Last Updated:** 2026-04-27  
**Maintained by:** Engineering team

---

## Angular & RxJS Gotchas

### ❌ Don't subscribe directly to observables in components

**Problem:** Unsubscribed observables cause memory leaks.

**Wrong:**

```typescript
export class MyComponent {
  constructor(private userService: UserService) {
    this.userService.getUser().subscribe((user) => {
      this.user = user;
      // ❌ Never unsubscribed → memory leak
    });
  }
}
```

**Right:**

```typescript
export class MyComponent implements OnInit, OnDestroy {
  user$ = this.userService.getUser(); // ✅ Observable, not subscribed

  // In template: {{ user$ | async }}

  // OR: Subscribe with explicit unsubscribe
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => (this.user = user));
  }

  ngOnDestroy() {
    this.destroy$.next(); // ✅ Clean up on component destroy
  }
}
```

**Rule:** Use `async` pipe in templates OR unsubscribe manually.

---

### ❌ Don't forget to unsubscribe on component destroy

**Problem:** Subscriptions persist after component is destroyed.

**Right:**

```typescript
ngOnDestroy() {
  this.subscription.unsubscribe();  // ✅ Always clean up
}

// OR: Use takeUntil pattern
private destroy$ = new Subject<void>();

ngOnInit() {
  this.data$.pipe(
    takeUntil(this.destroy$)
  ).subscribe(...);
}

ngOnDestroy() {
  this.destroy$.next();
}
```

---

### ⚠️ State changes are immediate; database changes are async

**Problem:** Component renders based on store (immediate), but DB hasn't updated yet.

**Example:**

```typescript
// Click handler
onDeleteUser() {
  // 1. Dispatch action
  this.store.dispatch(deleteUser({ id: userId }));

  // ❌ WRONG: Component re-renders immediately, but DB request is still pending
  // User might see deleted state, then error appears, state reverts

  // ✅ RIGHT: Wait for effect to complete
  this.store.select(selectDeleteUserStatus).pipe(
    filter(status => status === 'complete'),
    take(1)
  ).subscribe(() => {
    // Now safe to navigate away
    this.router.navigate(['/users']);
  });
}
```

**Rule:** Don't assume store updates mean the backend succeeded. Wait for effects.

---

## State Management (NgRx) Gotchas

### ❌ Don't mutate state directly

**Problem:** Breaks change detection and state history.

**Wrong:**

```typescript
export const userReducer = createReducer(
  initialState,
  on(updateUser, (state, action) => {
    state.user.name = action.name; // ❌ MUTATION
    return state;
  }),
);
```

**Right:**

```typescript
export const userReducer = createReducer(
  initialState,
  on(updateUser, (state, action) => {
    return {
      ...state, // ✅ Spread operator creates new object
      user: {
        ...state.user,
        name: action.name,
      },
    };
  }),
);
```

**Rule:** Always create new state objects. Never mutate.

---

### ❌ Don't put complex logic in reducers

**Problem:** Reducers must be pure functions.

**Wrong:**

```typescript
on(loadUser, (state, action) => {
  const user = fetchUserFromServer(action.id); // ❌ Side effect in reducer
  return { ...state, user };
});
```

**Right:**

```typescript
// Reducer (pure)
on(loadUserSuccess, (state, action) => {
  return { ...state, user: action.user }; // ✅ Just update state
});

// Effect (handles side effects)
loadUser$ = this.actions$.pipe(
  ofType(loadUser),
  switchMap((action) =>
    this.userService.getUser(action.id).pipe(
      map((user) => loadUserSuccess({ user })), // ✅ Dispatch success
      catchError((error) => of(loadUserError({ error }))), // ✅ Or error
    ),
  ),
);
```

**Rule:** Reducers are pure. Side effects go in Effects.

---

## Material Design Gotchas

### ⚠️ CDK portal hosts need special setup

**Problem:** If you use programmatic dialogs/popovers, they need a DOM portal host.

**Solution:**

```typescript
// In AppModule
providers: [
  DomPortalHostService  // ✅ Register portal host service
]

// Use it
constructor(private portalHost: DomPortalHostService) {}

createDialog() {
  this.portalHost.attach(dialogComponent);  // ✅ Portal handles DOM
}
```

---

### ⚠️ Material Dialog overlays need z-index management

**Problem:** Multiple dialogs stack incorrectly.

**Solution:** Let Material handle it with `.cdk-overlay-dark-backdrop`

```scss
// In global styles
.cdk-overlay-dark-backdrop {
  backdrop-filter: blur(3px); // ✅ Dark overlay with blur
  z-index: auto; // ✅ Let Material manage z-index
}
```

---

## Styling Gotchas

### ❌ Don't hardcode colors

**Problem:** Color system becomes inconsistent.

**Wrong:**

```scss
.button {
  background-color: #301457; // ❌ Hardcoded purple
}
```

**Right:**

```scss
.button {
  background-color: $primary-purple; // ✅ Use color map
  // OR
  @include theme-color($purple-color, "primary");
}
```

**Available colors:** `$green-color`, `$purple-color`, `$blue-color`, `$pink-color`, `$yellow-color`, `$gray-color`, `$white-color`

---

### ⚠️ Responsive design: Use breakpoint mixins

**Problem:** Hardcoded media queries are inconsistent.

**Right:**

```scss
.container {
  width: 100%;

  @include md {
    width: 80%; // Tablet and above
  }

  @include lg {
    width: 1200px; // Desktop and above
  }
}
```

**Available mixins:** `@include xs`, `@include sm`, `@include md`, `@include lg`, `@include xl`, `@include lt-sm`, `@include gt-md`, etc.

---

## HTTP & API Gotchas

### ✅ Always use the centralized API constant

**Problem:** Hardcoded URLs are brittle and inconsistent.

**Wrong:**

```typescript
this.http.get("https://api.example.com/api/search/query"); // ❌ Hardcoded
```

**Right:**

```typescript
import { api } from "commonlib";

this.http.get(api.searching.queryPortals()); // ✅ Centralized constant
```

---

### ❌ Never use .subscribe() directly in components

**Problem:** Memory leaks, hard to test.

**Wrong:**

```typescript
constructor(private http: HttpClient) {
  this.http.get(url).subscribe(data => {
    console.log(data);  // ❌ Subscribes immediately, not unsubscribed
  });
}
```

**Right:**

```typescript
data$ = this.http.get(url); // ✅ Observable returned, not subscribed

// In template: {{ data$ | async }}
```

---

### ⚠️ HTTP errors must be caught by ErrorHandlingService

**Problem:** Unhandled errors cause silent failures.

**Right:**

```typescript
deleteItem$ = this.actions$.pipe(
  ofType(deleteItem),
  switchMap((action) =>
    this.itemService.delete(action.id).pipe(
      map((success) => deleteItemSuccess()),
      catchError((error) => {
        this.errorHandling.handle(error); // ✅ Show snackbar + dispatch error action
        return of(deleteItemError({ error }));
      }),
    ),
  ),
);
```

---

## Form Handling Gotchas

### ✅ Use Reactive Forms, not Template-Driven Forms

**Problem:** Template-driven forms are hard to test and scale.

**Right:**

```typescript
// Reactive Forms
form = this.fb.group({
  email: ['', [Validators.required, Validators.email]],
  password: ['', Validators.required]
});

// In template
<form [formGroup]="form" (ngSubmit)="onSubmit()">
  <input formControlName="email" />
  <div *ngIf="form.get('email')?.invalid">Invalid email</div>
</form>
```

---

### ⚠️ Form validation happens at control level, not form level

**Problem:** Errors bubble up incorrectly.

**Right:**

```typescript
const emailControl = form.get("email");
if (emailControl?.hasError("required")) {
  // Show "Required" error
}
if (emailControl?.hasError("email")) {
  // Show "Invalid email" error
}
```

---

## Brazilian Locale Gotchas

### ✅ Set locale ID at app startup

**Problem:** Pipes use wrong format (US instead of BR).

**Right:**

```typescript
import { registerLocaleData } from "@angular/common";
import localePt from "@angular/common/locales/pt";

registerLocaleData(localePt, "pt"); // ✅ Register locale

// In AppModule
providers: [{ provide: LOCALE_ID, useValue: "pt" }];
```

---

### ✅ Use ngx-mask for CPF/CNPJ/phone formatting

**Problem:** Manual formatting is error-prone.

**Right:**

```typescript
// In template
<input
  mask="000.000.000-00"
  placeholder="CPF"
  [(ngModel)]="cpf" />

<!-- Outputs: 123.456.789-00 -->
```

---

### ⚠️ Currency formatting needs SafeMath (BigNumber)

**Problem:** JavaScript floats are unsafe for money.

**Right:**

```typescript
import { SafeMath } from "commonlib"; // This is bignumber.js

const price = new SafeMath(99.99);
const total = price.times(quantity); // ✅ Safe arithmetic

console.log(total.toFixed(2)); // "999.90"
```

---

## Testing Gotchas

### ✅ Mock the store in component tests

**Problem:** Real store slows tests + makes them fragile.

**Right:**

```typescript
const mockStore = {
  select: jasmine.createSpy("select").and.returnValue(of(mockData)),
  dispatch: jasmine.createSpy("dispatch"),
};

TestBed.configureTestingModule({
  providers: [{ provide: Store, useValue: mockStore }],
});
```

---

### ⚠️ Test observables with marble testing (for complex flows)

**Problem:** Async timing is hard to test.

**Right:**

```typescript
it("should handle async data", fakeAsync(() => {
  const result$ = this.service.getData();

  result$.subscribe((data) => {
    expect(data).toEqual(expected);
  });

  tick(); // ✅ Advance time
}));
```

---

## Performance Gotchas

### ⚠️ Change detection runs on every event

**Problem:** Slow components trigger full app change detection.

**Mitigation:** Use `OnPush` strategy for leaf components:

```typescript
@Component({
  selector: "app-my-component",
  changeDetection: ChangeDetectionStrategy.OnPush, // ✅ Only on @Input changes
})
export class MyComponent {
  @Input() data: any;
}
```

---

### ✅ Use trackBy in \*ngFor for large lists

**Problem:** List re-renders entire DOM on data changes.

**Right:**

```typescript
<div *ngFor="let item of items; trackBy: trackByFn">
  {{ item.name }}
</div>

trackByFn(index: number, item: Item) {
  return item.id;  // ✅ Track by ID, not index
}
```

---

---

### ✅ Sanitize HTML before rendering

**Problem:** XSS vulnerabilities.

**Right:**

```typescript
// Use SafeHtmlPipe in template
<div [innerHTML]="htmlContent | safeHtml"></div>

// OR: Use DomSanitizer in component
constructor(private sanitizer: DomSanitizer) {}

getSafeHtml(html: string) {
  return this.sanitizer.bypassSecurityTrustHtml(html);  // ✅ Only for trusted HTML
}
```

---

## Git & Versioning Gotchas

### ✅ Always include Bifrost file header

**Problem:** Files without header fail code review.

**Every TypeScript file must start with:**

```typescript
/**
 * Bifrost OPEN SOURCE
 * ------------------
 * Copyright (C) 2026 Open Source Community - MIT License.
 *
 * This file, project or its parts can not be copied and/or distributed without
 * contributions to Open Source Community.
 *
 * @file my-component.component.ts
 * @author Your Name <your@email>
 * @date Monday, April 27th 2026 10:00:00 am
 * @description Brief description of what this file does
 */
```

---

### ⚠️ Nx cache can cause stale builds

**Problem:** Build caching can pick up old artifacts.

**Solution:** Clear cache if builds seem wrong:

```bash
rm -rf node_modules/.cache
nx run-many --targets=build --all
```

---

## Common Mistakes

| Mistake                                      | Impact                | Fix                                      |
| -------------------------------------------- | --------------------- | ---------------------------------------- |
| Subscribing in component without unsubscribe | Memory leaks          | Use `async` pipe or `takeUntil`          |
| Mutating state in reducers                   | State corruption      | Always return new objects                |
| Hardcoding API URLs                          | Fragile, inconsistent | Use `api` constant from commonlib        |
| Not catching HTTP errors                     | Silent failures       | Use `ErrorHandlingService`               |
| Not using SafeMath for money                 | Calculation errors    | Use `bignumber.js` (aliased as SafeMath) |
| Missing file headers                         | Code review fails     | Add Bifrost header to every file           |
| Hardcoding colors                            | Style inconsistency   | Use `$primary-purple`, etc.              |
| Hardcoding media queries                     | Responsive breaks     | Use `@include md`, etc.                  |
| Using template-driven forms                  | Hard to test          | Use Reactive Forms                       |
| No change detection strategy                 | Slow rendering        | Use `ChangeDetectionStrategy.OnPush`     |

---

## See Also

- **TECH_STACK.md** — Version compatibility notes
- **NAMING_CONVENTIONS.md** — Code style rules
- **API_CONTRACTS.md** — How to use APIs safely
- **Frontend_repository_manual.md** — Original source
