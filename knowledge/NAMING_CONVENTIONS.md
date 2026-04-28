---
domain: technical
type: reference
status: active
topic: bifrost/knowledge
---

# Bifrost Naming Conventions

Standardized naming rules for code, files, components, and functions across the Bifrost ecosystem.

**Source:** Bifrost Frontend Repository Manual (Section 13. Coding Standards) + .eslintrc.json  
**Last Updated:** 2026-04-27  
**Maintained by:** Architecture team

---

## File Naming

### Rule: kebab-case

All files use lowercase with hyphens.

**Examples:**

- ✅ `my-component.component.ts`
- ✅ `search-service.service.ts`
- ✅ `user-profile.reducer.ts`
- ❌ `MyComponent.component.ts` (wrong: PascalCase)
- ❌ `my_component.component.ts` (wrong: snake_case)

**Enforcement:** ESLint rule `unicorn/filename-case`

---

## Class Naming

### Rule: PascalCase

All classes use PascalCase.

**Examples:**

- ✅ `export class SearchPortalComponent {}`
- ✅ `export class UserService {}`
- ✅ `export class SearchState {}`
- ❌ `export class searchPortalComponent {}` (wrong: camelCase)
- ❌ `export class SEARCH_PORTAL_COMPONENT {}` (wrong: UPPER_SNAKE_CASE)

---

## Function & Method Naming

### Rule: camelCase

All functions and methods use camelCase, starting lowercase.

**Examples:**

- ✅ `getUser()` — fetch user
- ✅ `onSubmitForm()` — event handler
- ✅ `transformApiResponse()` — transformation
- ❌ `GetUser()` (wrong: PascalCase)
- ❌ `get_user()` (wrong: snake_case)

### Naming Patterns

**Event handlers:** `on<Action>`

- ✅ `onClick()`
- ✅ `onFormSubmit()`
- ✅ `onUserSelect()`

**Getters/Accessors:** `get<Property>`

- ✅ `getUser()`
- ✅ `getUserBalance()`
- ✅ `getActiveTab()`

**Setters:** `set<Property>`

- ✅ `setUser()`
- ✅ `setActiveTab()`

**Transformers:** `transform<Input>To<Output>`

- ✅ `transformApiResponseToModel()`
- ✅ `transformUserToDto()`

**Validators:** `validate<Property>` or `is<Condition>`

- ✅ `validateEmail()`
- ✅ `isValidEmail()`
- ✅ `canActivateRoute()`

---

## Variable & Property Naming

### Rule: camelCase

Local variables, object properties, and function parameters use camelCase.

**Examples:**

- ✅ `const userName = 'John';`
- ✅ `this.activeTab = 0;`
- ✅ `function getUserData(userId) {}`
- ❌ `const user_name = 'John';` (wrong: snake_case)
- ❌ `this.UserName = 'John';` (wrong: PascalCase)

### Private Members: Prefix with `_`

Private class members are prefixed with underscore.

**Examples:**

- ✅ `private _userName: string;`
- ✅ `private _cache: Map<string, any>;`
- ❌ `private userName: string;` (wrong: no prefix)

### Constants: UPPER_SNAKE_CASE

Constants are all uppercase with underscores.

**Examples:**

- ✅ `const MAX_RETRIES = 3;`
- ✅ `const DEFAULT_TIMEOUT = 5000;`
- ✅ `const API_BASE_URL = 'https://api.example.com';`
- ❌ `const maxRetries = 3;` (wrong: camelCase)

---

## Component Naming

### File Structure

```
search-portal.component.ts       (logic)
search-portal.component.html     (template)
search-portal.component.scss     (styles)
search-portal.component.spec.ts  (tests)
```

### Class Name

```typescript
@Component({
  selector: "app-search-portal",
  templateUrl: "./search-portal.component.html",
  styleUrls: ["./search-portal.component.scss"],
})
export class SearchPortalComponent {
  // ✅ Class name: PascalCase
  // ✅ Selector: app- prefix, kebab-case
}
```

### Selector Pattern

All component selectors follow: `app-<component-name>` (kebab-case)

**Examples:**

- ✅ `selector: 'app-search-portal'`
- ✅ `selector: 'app-user-profile'`
- ❌ `selector: 'SearchPortal'` (wrong: no app- prefix)
- ❌ `selector: 'app-SearchPortal'` (wrong: PascalCase)

### Template Bindings

**Property binding:** camelCase

```html
<input [value]="userName" /> <app-button [disabled]="isLoading"></app-button>
```

**Event binding:** camelCase

```html
<button (click)="onSubmit()"></button> <input (keydown)="onKeyDown($event)" />
```

**Two-way binding:** camelCase

```html
<input [(ngModel)]="searchQuery" />
```

---

## Service Naming

### File & Class Name

Services are suffixed with `.service.ts`

```typescript
// File: user.service.ts
@Injectable({ providedIn: "root" })
export class UserService {
  constructor() {}

  getUser(id: string) {
    // ✅ Method: camelCase
  }
}
```

### Injection

Services are injected with private, lowercase names:

```typescript
export class MyComponent {
  constructor(private userService: UserService) {
    // ✅ Parameter name: camelCase
    // ✅ Type: PascalCase (class name)
  }

  getUser() {
    this.userService.getUser("123"); // ✅ Access: camelCase
  }
}
```

---

## Store/State Naming (NgRx)

### Action Naming

Actions follow the pattern: `[Store Name] Action Description`

```typescript
// ✅ Correct
export const storeTag = "[Profile Store]";

export const loginUser = createAction(
  `${storeTag} Login the user`,
  props<{ email: string; password: string }>(),
);

export const loginUserSuccess = createAction(
  `${storeTag} Login the user success`,
  props<{ user: UserDetails }>(),
);

export const loginUserError = createAction(
  `${storeTag} Login the user error`,
  props<{ error: ErrorPayload }>(),
);
```

### Reducer Naming

Reducers are suffixed with `.reducer.ts` and named `<storeName>Reducer`

```typescript
// File: profile.reducer.ts
export const profileReducer = createReducer(
  initialState,
  on(ProfileActions.loginUser, (state, action) => ({
    ...state,
    loading: true,
  })),
);
```

### Selector Naming

Selectors follow patterns:

```typescript
// File: profile.selectors.ts

// Root selector
export const selectProfileState = (state: AppState) => state.profile;

// Feature selectors
export const selectCurrentUser = createSelector(
  selectProfileState,
  (state: ProfileState) => state.user,
);

export const selectIsLoggedIn = createSelector(
  selectCurrentUser,
  (user) => user !== null,
);
```

**Pattern:** `select<Feature><Property>`

---

## Interface & Type Naming

### Interfaces: `I<Name>` OR just `<Name>`

Bifrost uses **no prefix** (just the name):

```typescript
// ✅ Preferred (no I prefix)
interface User {
  id: string;
  email: string;
  name: string;
}

interface ApiResponse<T> {
  data: T;
  status: number;
}

// ❌ Avoid (old style)
interface IUser {
  id: string;
}
```

### Type Aliases

Use `type` for union types, simple aliases:

```typescript
type StatusType = "active" | "inactive" | "pending";
type UserId = string & { readonly __brand: "UserId" }; // Branded type
```

### Enum Naming: PascalCase

```typescript
enum UserRole {
  ADMIN = "admin",
  USER = "user",
  GUEST = "guest",
}

enum StatusCode {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
}
```

---

## Model/DTO Naming

### Model: Represents domain object

```typescript
export interface User {
  id: string;
  email: string;
  name: string;
}
```

### DTO (Data Transfer Object): Represents API response

```typescript
export interface UserDto {
  id: string;
  email: string;
  full_name: string; // ← API uses snake_case
}
```

### Adapter: Transforms DTO → Model

```typescript
export class UserAdapter {
  adapt(dto: UserDto): User {
    return {
      id: dto.id,
      email: dto.email,
      name: dto.full_name, // ← Transform snake_case to camelCase
    };
  }
}
```

---

## Formatting Rules (ESLint)

### Indentation: 4 spaces

```typescript
// ✅ Correct
function myFunction() {
  if (condition) {
    doSomething();
  }
}

// ❌ Wrong (2 spaces)
function myFunction() {
  if (condition) {
    doSomething();
  }
}
```

### Quotes: Single Quotes Only

```typescript
// ✅ Correct
const message = "Hello world";
const data = { key: "value" };

// ❌ Wrong (double quotes)
const message = "Hello world";
```

### Semicolons: Always Required

```typescript
// ✅ Correct
const x = 5;
const fn = () => {};

// ❌ Wrong (missing semicolons)
const x = 5;
const fn = () => {};
```

### Brace Style: Allman (braces on own line)

```typescript
// ✅ Correct
function myFunction() {
  if (condition) {
    doSomething();
  }
}

// ❌ Wrong (K&R style)
function myFunction() {
  if (condition) {
    doSomething();
  }
}
```

### Max Line Length: 140 characters

```typescript
// ✅ Correct (under 140 chars)
const result = transformUserData(userData, criteria, options, filters);

// ❌ Wrong (over 140 chars)
const veryLongVariableNameThatExceedsTheMaxLineLengthLimitOfOnehundredAndFortyCharactersAndShouldBeRefactored =
  someData;
```

---

## Special Naming Patterns

### Boolean Variables: Use `is` or `has` prefix

```typescript
// ✅ Correct
const isLoading = true;
const hasError = false;
const isVisible = true;
const canActivate = false;

// ❌ Wrong (no prefix)
const loading = true;
const error = false;
```

### Array Variables: Use plural

```typescript
// ✅ Correct
const users: User[] = [];
const items: Item[] = [];
const results: Result[] = [];

// ❌ Wrong (singular)
const user: User[] = [];
const item: Item[] = [];
```

### Observable Variables: Suffix with `$`

```typescript
// ✅ Correct (RxJS pattern)
const user$: Observable<User> = this.userService.getUser();
const loading$: Observable<boolean> = this.store.select(selectLoading);

// Use: this.user$ | async in templates
<div>{{ user$ | async }}</div>
```

---

## HTML Template Naming

### Attribute Names: kebab-case

```html
<!-- ✅ Correct -->
<app-button
  [buttonText]="'Click me'"
  [isDisabled]="false"
  (buttonClick)="onSubmit()"
>
</app-button>

<!-- ❌ Wrong (camelCase) -->
<app-button [buttonText]="'Click me'" (buttonClick)="onSubmit()"> </app-button>
```

### CSS Classes: kebab-case

```html
<!-- ✅ Correct -->
<div class="search-container search-active">
  <input class="search-input" />
</div>

<!-- ❌ Wrong (camelCase or PascalCase) -->
<div class="searchContainer searchActive">
  <input class="searchInput" />
</div>
```

---

## See Also

- **TECH_STACK.md** — ESLint + Prettier configuration
- **GOTCHAS.md** — Common naming mistakes
- **Frontend_repository_manual.md** (Section 13) — Original source
