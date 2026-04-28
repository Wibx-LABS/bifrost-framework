---
name: bifrost-code-standards
description: Wiboo's coding standards — naming, formatting, file structure, lint rules, file headers, TypeScript discipline. Use this skill whenever you are @CodeGen writing or editing any TypeScript / HTML / SCSS file in the Wiboo monorepo (apps/account, apps/business, apps/shopping, apps/wibxgo, libs/commonlib, libs/wallet); @Planner breaking a feature into tasks (the tasks must respect these standards or QA fails); @QA / @Reviewer verifying that generated code is review-ready; or @Monitor checking source-tree changes against the standards. Triggering signals: any mention of file naming, class/function/variable naming, ESLint, Prettier, indentation, line length, braces, file headers, TypeScript strict mode, or "does this code follow Wiboo conventions". This skill emphasizes the rules where Wiboo deviates from common defaults — 4-space indent (not 2), Allman braces (not K&R), 140-char lines (not 80), `_` prefix for private members, `$` suffix for observables, no `I` prefix on interfaces, snake_case in DTOs (because the API uses snake_case while Wiboo's models use camelCase). The deep reference is `knowledge/NAMING_CONVENTIONS.md`; this skill is the working summary plus the WHY, plus the self-review checklist that catches the most common drift.
---

# bifrost-code-standards

This skill carries Wiboo's coding standards in a form an agent can act on. The full reference (every rule, every example) lives at `knowledge/NAMING_CONVENTIONS.md` plus `knowledge/FRONTEND_REPOSITORY_MANUAL.md` §13. This file is the working summary — what to do, what *not* to do, and the WHY for the rules where Wiboo's choice differs from a common default.

Read top to bottom on first load. After that, treat sections as a checklist: when writing a file, scan the relevant section; when reviewing, walk the **review checklist** at the end.

---

## The non-default rules (read these first — they are where defaults will hurt you)

If you start writing code with industry-standard defaults, you will violate these rules and lint will fail. Internalize them up front.

| What | Wiboo | Common default | Why |
|---|---|---|---|
| Indentation | **4 spaces** | 2 spaces | Set by `.editorconfig` and Prettier; the team finds 4 easier to scan with the 140-char line budget. |
| Brace style | **Allman** (brace on its own line) | K&R (brace on the same line) | Same reason — increased vertical scanability. ESLint enforces. |
| Max line length | **140 chars** | 80–100 chars | Long enough to keep typed RxJS pipelines readable without forcing artificial breaks. |
| Private member prefix | **`_` underscore** | (no prefix; `private` keyword only) | The team wanted at-a-glance private/public distinction even at call sites; underscore wins. |
| Observable suffix | **`$`** | (no suffix; convention only) | Enforced in code review. `user$` is an `Observable<User>`; `user` is a snapshot. |
| Interface prefix | **no `I` prefix** | `IUser` (legacy TS style) | Modern TS guidance; relies on context to disambiguate. |
| DTO field casing | **snake_case** | camelCase | The Wiboo backend API returns snake_case. DTOs mirror the wire format; **adapters** translate snake_case → camelCase for `Model` types in the app. |
| Component selector | **`app-` prefix, kebab-case** | (varies; sometimes `wbx-` or app-specific) | Single consistent prefix across all Wiboo apps. ESLint's Angular plugin enforces. |
| Quotes | **single** | (varies) | Prettier-enforced. Double quotes are a defect. |
| Constants in code | **`UPPER_SNAKE_CASE`** | camelCase | Long-standing C-family convention; Wiboo keeps it. |

When in doubt, the lint runs in CI; lint failure blocks the PR. Don't argue with the lint — fix the code.

---

## File naming

**Rule: kebab-case, with role suffix.**

```
search-portal.component.ts
user.service.ts
profile.reducer.ts
search-utils.spec.ts
profile.actions.ts
profile.selectors.ts
profile.effects.ts
profile.state.ts
```

Role suffix is mandatory and conveys what the file IS, not what it does:
- `.component.ts`, `.component.html`, `.component.scss`, `.component.spec.ts`
- `.service.ts`, `.service.spec.ts`
- `.reducer.ts`, `.actions.ts`, `.selectors.ts`, `.effects.ts`, `.state.ts`
- `.directive.ts`, `.pipe.ts`, `.guard.ts`, `.resolver.ts`
- `.model.ts`, `.dto.ts`, `.adapter.ts`
- `.utils.ts`, `.constants.ts`, `.types.ts`

Enforced by ESLint rule `unicorn/filename-case` and the project's component-class-suffix lint rule.

**Don't:** `MyComponent.component.ts` (PascalCase), `my_component.component.ts` (snake_case), `myComponent.ts` (no role suffix).

---

## Class naming

**Rule: PascalCase, with role suffix that matches the file.**

```typescript
export class SearchPortalComponent { /* in search-portal.component.ts */ }
export class UserService           { /* in user.service.ts */ }
export class ProfileReducer        { /* in profile.reducer.ts (rare — see NgRx skill) */ }
export class UserAdapter           { /* in user.adapter.ts */ }
```

Suffix is mandatory; ESLint's `@angular-eslint/component-class-suffix`, `directive-class-suffix`, etc., enforce.

---

## Function and method naming

**Rule: camelCase, starting lowercase, with intent-bearing prefixes for common patterns.**

| Pattern | Prefix | Example |
|---|---|---|
| Event handler | `on<Action>` | `onClick`, `onFormSubmit`, `onUserSelect` |
| Getter / accessor | `get<Property>` | `getUser`, `getActiveTab` |
| Setter | `set<Property>` | `setUser`, `setActiveTab` |
| Transformer | `transform<Input>To<Output>` | `transformUserToDto` |
| Boolean / predicate | `is<Condition>` or `has<Property>` or `can<Action>` | `isValidEmail`, `hasError`, `canActivate` |
| Validator (returns void/throws) | `validate<Property>` | `validateEmail` |

Intent-bearing prefixes are not just style — they're how a reader scans Wiboo code. A method named `userIsValid()` is awkward; `isValidUser()` reads naturally. A method named `tabActive()` is confusing; `getActiveTab()` (returns) and `setActiveTab(n)` (writes) is unambiguous.

---

## Variable and property naming

**Local variables, parameters, properties: camelCase.**

```typescript
const userName = 'João';
this.activeTab = 0;
function getUserData(userId: string) { /* ... */ }
```

**Constants (module-scope, immutable values): UPPER_SNAKE_CASE.**

```typescript
const MAX_RETRIES = 3;
const DEFAULT_TIMEOUT = 5000;
const API_BASE_URL = 'https://api.example.com';
```

**Private class members: prefix with `_`.**

```typescript
export class SearchService {
  private _cache = new Map<string, SearchResult>();
  private _activeQuery: string | null = null;

  search(query: string): Observable<SearchResult> {
    this._activeQuery = query;
    return this.http.post<SearchResult>(api.searching.queryPortals(), { query });
  }
}
```

This is unusual and people raised on Angular templates without a prefix will forget. The lint catches it but reviews catch it sooner.

**Booleans: `is<X>` / `has<X>` / `can<X>` prefix.**

```typescript
const isLoading = true;
const hasError = false;
const canActivate = false;
```

**Arrays: plural noun.**

```typescript
const users: User[] = [];
const items: Item[] = [];
```

**Observables: `$` suffix.**

```typescript
const user$: Observable<User> = this.userService.getUser();
const loading$: Observable<boolean> = this.store.select(selectLoading);
```

The `$` is critical — it's how a reader (and an agent) tells "this is a stream you must subscribe to" from "this is a value you can read directly." Mixing them up is a category error.

---

## Component naming and structure

**File quartet:**

```
search-portal/
├── search-portal.component.ts      # logic — exports SearchPortalComponent
├── search-portal.component.html    # template
├── search-portal.component.scss    # styles
└── search-portal.component.spec.ts # unit tests
```

**Selector pattern:** `app-<component-name>` in kebab-case.

```typescript
@Component({
  selector: 'app-search-portal',                       // ✅ kebab-case, app- prefix
  templateUrl: './search-portal.component.html',
  styleUrls: ['./search-portal.component.scss'],
})
export class SearchPortalComponent { /* ... */ }
```

**Template binding casing:**
- Property binding (`[propName]`) — camelCase. `<input [value]="userName">`.
- Event binding (`(eventName)`) — camelCase. `<button (click)="onSubmit()">`.
- Two-way binding — camelCase. `<input [(ngModel)]="searchQuery">`.
- HTML attributes (non-binding) — kebab-case. `<button data-test-id="submit-button">`.

**CSS classes in templates and stylesheets:** kebab-case.

```html
<div class="search-container search-active">
  <input class="search-input" />
</div>
```

---

## NgRx naming (cross-references `bifrost-state-management`)

The naming for NgRx artifacts is set here; the **patterns** are in `bifrost-state-management`'s Section B. Both are needed.

**Action names:** `'[Store Tag] Verb [Result]'`.

```typescript
const storeTag = '[Profile Store]';

export const loginUser        = createAction(`${storeTag} Login the user`,         props<{ email: string; password: string }>());
export const loginUserSuccess = createAction(`${storeTag} Login the user success`, props<{ user: UserDetails }>());
export const loginUserError   = createAction(`${storeTag} Login the user error`,   props<{ error: ErrorPayload }>());
```

**Reducer file:** `<feature>.reducer.ts`, exporting `<feature>Reducer` (camelCase).

**Selector file:** `<feature>.selectors.ts`. Pattern: `select<Feature><Property>`.

```typescript
export const selectProfileState = (state: AppState) => state.profile;
export const selectCurrentUser  = createSelector(selectProfileState, (s) => s.user);
export const selectIsLoggedIn   = createSelector(selectCurrentUser,  (u) => u !== null);
```

---

## Interface, type, model, DTO, adapter

**Interfaces: no `I` prefix.**

```typescript
// ✅ Bifrost style
interface User {
  id: string;
  email: string;
  name: string;
}

// ❌ Don't
interface IUser { /* ... */ }
```

**Type aliases for unions or branded types:**

```typescript
type StatusType = 'active' | 'inactive' | 'pending';
type UserId     = string & { readonly __brand: 'UserId' };
```

**Enums: PascalCase name; `UPPER_SNAKE_CASE` members.**

```typescript
enum UserRole {
  ADMIN = 'admin',
  USER  = 'user',
  GUEST = 'guest',
}

enum StatusCode {
  SUCCESS     = 200,
  BAD_REQUEST = 400,
}
```

**Model vs. DTO vs. Adapter** — *the* most important Wiboo-specific pattern in this skill, because it's where casing collides with the wire format.

```typescript
// Model — what the app uses internally. camelCase.
export interface User {
  id: string;
  email: string;
  name: string;
}

// DTO — what the API returns. Mirrors the wire format. snake_case is allowed.
export interface UserDto {
  id: string;
  email: string;
  full_name: string;   // ← API uses snake_case
}

// Adapter — translates DTO → Model. Lives next to the model file.
export class UserAdapter {
  adapt(dto: UserDto): User {
    return {
      id: dto.id,
      email: dto.email,
      name: dto.full_name,   // ← snake_case → camelCase here
    };
  }
}
```

DTOs are the only place snake_case lives. Models, components, services — all camelCase. If you find yourself writing `user.full_name` in a component, you're skipping the adapter — fix it.

---

## Formatting (ESLint + Prettier)

| Rule | Value | Why |
|---|---|---|
| Indent | 4 spaces | Wiboo standard. |
| Quotes | single | Prettier-enforced. |
| Semicolons | required | ESLint-enforced. No ASI. |
| Brace style | Allman (brace on its own line) | ESLint-enforced. Unusual; default modern style is K&R. |
| Trailing commas | yes (multiline) | Cleaner diffs. |
| Max line length | 140 chars | Long enough for RxJS pipelines. |
| Arrow function parens | always | `(x) => x` even for single args. |
| `var` | forbidden | `const`/`let` only. |
| `eval` | forbidden | Lint-error. |
| Complexity | max 4 per function | If `cyclomatic > 4`, refactor. |
| `console.log` | forbidden in prod | Use the project's logging service. |

Allman brace example (vs. the default everyone defaults to):

```typescript
// ✅ Allman — Wiboo style
function myFunction()
{
    if (condition)
    {
        doSomething();
    }
}

// ❌ K&R — wrong here, even though it's standard most places
function myFunction() {
    if (condition) {
        doSomething();
    }
}
```

If you write K&R out of habit, the linter (`brace-style: ['error', 'allman']`) will fail your build. Don't fight it; just remember.

---

## TypeScript discipline

- **Strict mode:** the `tsconfig` has `strict: true` (or near-equivalent flags). No implicit `any`. No null/undefined assumptions.
- **Array type style:** prefer `Array<T>` over `T[]` (per the team's ESLint config — uncommon but enforced).
- **No non-null assertions** (`x!.foo`) — use proper null checks. The lint allows it but reviewers reject it.
- **No unused vars** — except parameters prefixed with `_`. (`function fn(_unused: string, used: number)` is fine.)
- **`as` casts:** allowed but justify them. A reviewer will ask "why couldn't TypeScript infer this?"
- **No `any`** — either narrow the type or use `unknown` and narrow at use site.

---

## File headers

Every source file (`.ts`, `.html`, `.scss`) starts with a header comment. Pattern:

```typescript
/**
 * @file       Search portal component — entry screen for query-based search.
 * @author     <name or team>
 * @createdAt  2026-04-28
 * @app        business
 *
 * @description
 *   Hosts the search input, dispatches search actions, and renders results
 *   via the search-results-table component. Subscribes to selectSearchResults$
 *   and passes results down. Wraps reactive form for the query input.
 */
```

The file header is the only place where blocks of prose live in code. Use it. Don't write JSDoc on every method; do write a real `@description` for every file. ESLint enforces the presence of the header (via a custom rule referenced in the project's `.eslintrc`).

---

## Documentation inside files

- **Public methods** of services and reusable components: short JSDoc — what it does, what it returns, what it can throw.
- **Complex logic** (anything that isn't obvious from the code): inline `// ` comments. Explain *why*, not *what*.
- **Magic numbers / magic strings**: extract to named constants. If the constant has a non-obvious origin (e.g., a value from a backend contract), comment the origin.
- **TODO / FIXME**: include a ticket reference. `// TODO(WBX-1234): handle empty result set` is fine; bare `// TODO: fix later` is a defect.

---

## Self-review checklist (for `@CodeGen` on every artifact and `@Reviewer` on every diff)

When `@CodeGen` finishes a task, walk this before producing `CODE_REVIEW.md`. When `@Reviewer` reads code in `/bifrost:deliver`, walk this against the diff.

- [ ] All filenames are kebab-case with the correct role suffix.
- [ ] All classes are PascalCase with the matching role suffix.
- [ ] All functions are camelCase with intent-bearing prefixes (`on…`, `get…`, `set…`, `is…`, `has…`).
- [ ] All variables are camelCase; private members prefixed with `_`; constants `UPPER_SNAKE_CASE`.
- [ ] All observables suffixed with `$`.
- [ ] All component selectors are `app-<kebab>`.
- [ ] No interface starts with `I`.
- [ ] DTOs are the only place snake_case appears; models are camelCase; adapter exists for every DTO that crosses into a model.
- [ ] 4-space indent, single quotes, semicolons, Allman braces, max 140 chars per line.
- [ ] No `var`; no `any`; no non-null assertions; no `console.log`.
- [ ] No function exceeds cyclomatic complexity 4. (If it does, decompose.)
- [ ] Every source file has a file header (`@file`, `@author`, `@createdAt`, `@app`, `@description`).
- [ ] No `TODO`/`FIXME` without a ticket reference.
- [ ] ESLint passes with zero warnings. (`yarn lint:fix` first if needed; if any rule is being suppressed, justify in the file.)
- [ ] TypeScript `strict` passes — no implicit `any`, no null/undefined surprises.

---

## What goes in `bifrost-code-review` instead

`bifrost-code-review` carries the *post-write* self-review checklist that's broader than naming/format — null handling, error handling, test coverage, async-safety. This skill (`bifrost-code-standards`) is the *pre-write* and *during-write* discipline. There is overlap; the rule of thumb: if it's about how the code *is shaped*, it's here; if it's about whether the code *works correctly*, it's in `bifrost-code-review`.

---

## Pointers

- **Full deep reference:** `knowledge/NAMING_CONVENTIONS.md` and `knowledge/FRONTEND_REPOSITORY_MANUAL.md` §13.
- **ESLint config**: `knowledge/TECH_STACK.md` ESLint Rules Summary table.
- **Common gotchas (state-related):** `bifrost-state-management` Section B + `knowledge/GOTCHAS.md`.
- **API integration shape**: `bifrost-api-integration`.
