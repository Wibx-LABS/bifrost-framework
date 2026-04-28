---
name: bifrost-api-integration
description: Wiboo's HTTP discipline — how API calls are written, where URLs come from, how errors are handled, how responses become app models, how authentication and session expiry work. Use this skill whenever you are @CodeGen writing or editing any code that makes an HTTP call (anywhere in apps/account, apps/business, apps/shopping, apps/wibxgo, libs/commonlib, libs/wallet); @QA validating that generated code's API calls match the backend contract and handle errors correctly; or @Reviewer verifying HTTP patterns in HANDOFF.md. Triggering signals: any mention of HttpClient, an API endpoint or URL, the `api` constant from commonlib, `api.<domain>.<endpoint>()`, ErrorHandlingService, SessionInterceptor, HTTP 405 / session expired, Bearer / x-app-id / x-promo-code headers, response adapters, "fetch user", "post payload", or any code path that involves the backend. The full endpoint catalogue will live at `knowledge/API_CONTRACTS.md` when that file is seeded by the Backend team; until then, the working source of truth is `libs/commonlib/src/lib/constants/api.ts` (the central URL factory) plus `core/api/*.api.ts` per app. This skill encodes the patterns; the catalogue is separate.
---

# bifrost-api-integration

Wiboo's HTTP layer is opinionated and consistent across all four apps. The opinions are: URLs come from one place, calls live in services not components, errors go through one handler, responses become models via adapters, and money never touches a JS float. Get those five right and most HTTP code in the codebase reviews itself.

This skill is the working summary plus the WHYs. The endpoint *catalogue* (which routes exist, request/response shapes per route, status codes) belongs in `knowledge/API_CONTRACTS.md` — a Backend-owned reference file that, as of writing, does not yet exist (planned per `instructions/03-AGENTS-AND-SKILLS.md`). Until it lands, the source of truth for "what endpoints are available" is the actual code under `libs/commonlib/src/lib/constants/api.ts` (the `api` factory) plus each app's `src/app/core/api/*.api.ts`. A real "is this endpoint live?" question is answered by reading the code, not by guessing. (`bifrost-graphify-ref` covers how to navigate that.)

---

## The five non-negotiables

In priority order, the rules every HTTP code path in Wiboo must respect:

1. **URLs come from `api.<domain>.<endpoint>()` — never hardcoded.** The `api` constant in `commonlib` is the single source of URL truth. Every endpoint is a function organized by domain.
2. **HTTP calls live in services, not components.** The component subscribes to a service-returned `Observable` (preferably via async pipe). Never inject `HttpClient` into a component.
3. **Errors go through `ErrorHandlingService`.** Don't `.catch()` and swallow. Don't surface raw HTTP errors to users. The service shows a snackbar AND dispatches an error action to the store.
4. **Responses become models via adapters, not direct assignment.** The wire format is snake_case; app models are camelCase. The adapter is where the seam lives.
5. **Money uses `SafeMath` (BigNumber).** A JS `number` is a 64-bit float; financial precision is lost on basic arithmetic. Wallet flows, transfers, quotations all use `SafeMath` for arithmetic and `bignumber.js` types for storage.

If a code path violates any of these, it's a defect — not a stylistic preference. Lint catches some; review catches the rest; production catches none, because they ship as silent failures (wrong totals, lost errors, broken sessions).

---

## Rule 1 — The `api` URL factory

**Location:** `libs/commonlib/src/lib/constants/api.ts`. Imported as:

```typescript
import { api } from 'commonlib';
```

**Shape:** an object organized by domain (`searching`, `users`, `wallet`, `shopping`, etc.), each domain a record of endpoint functions. Each function returns the full URL string for that endpoint, with route parameters interpolated.

```typescript
// ✅ Right
this.http.post<SearchResultDto[]>(api.searching.queryPortals(), { query });

this.http.get<UserDto>(api.users.byId(userId));

this.http.delete<void>(api.wallet.transactions.byId(txId));
```

**Don't:**

```typescript
// ❌ Wrong — hardcoded URL
this.http.get('https://api.wbx.com/v1/search/portals/query');

// ❌ Wrong — environment string concatenation
this.http.get(`${environment.apiBaseUrl}/search/portals/query`);

// ❌ Wrong — calling api.* but assembling the URL manually
this.http.get(api.searching.base + '/query');
```

**Why this matters:** the `api` factory absorbs every URL change. When the backend renames `/search/portals` to `/search/v2/portals`, exactly one line changes in `commonlib`. Hardcoded URLs (or environment-string concatenations) require a grep-and-replace across every app.

**When the endpoint you need isn't in the factory:** that's a real gap, not a "I'll just write it inline." Two options: (a) add it to `commonlib` as part of this feature's PR (Backend will review), or (b) flag it in `IMPACT.md` and Hard Stop for confirmation that the endpoint is real before continuing. Don't invent endpoints.

---

## Rule 2 — Wrap HTTP calls in services

**Pattern:** one `*.service.ts` per logical concern, injecting `HttpClient` and exposing methods that return `Observable<T>`. Components consume the service.

```typescript
// libs/commonlib/src/lib/services/search.service.ts (or similar)
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { api } from 'commonlib';
import { SearchResultDto } from '../models/search-result.dto';
import { SearchResult } from '../models/search-result.model';
import { SearchResultAdapter } from '../adapters/search-result.adapter';

@Injectable({ providedIn: 'root' })
export class SearchService
{
    constructor(
        private http: HttpClient,
        private adapter: SearchResultAdapter,
    ) {}

    search(query: string): Observable<SearchResult[]>
    {
        return this.http
            .post<SearchResultDto[]>(api.searching.queryPortals(), { query })
            .pipe(map((dtos) => dtos.map((d) => this.adapter.adapt(d))));
    }
}
```

In a component:

```typescript
// ✅ Right — async pipe
@Component({
    template: `
        <div *ngFor="let r of results$ | async">{{ r.name }}</div>
    `,
})
export class SearchPortalComponent
{
    results$ = this.search.search(this.query);

    constructor(private search: SearchService) {}
}
```

**Don't:**

```typescript
// ❌ Wrong — HttpClient in component
@Component({ /* ... */ })
export class SearchPortalComponent
{
    constructor(private http: HttpClient) {}     // never

    onSubmit()
    {
        this.http
            .post('/api/search', { query: this.query })   // and never this
            .subscribe((r) => this.results = r);          // and definitely never this
    }
}
```

**Why this matters:** the service is the place where HTTP concerns (URL, auth, error handling, response transformation) compose cleanly. Putting them in a component spreads concerns; testing a component with HTTP mocked becomes painful; refactoring an endpoint requires touching every consumer.

---

## Rule 3 — `ErrorHandlingService` is the only error handler

**Location:** `commonlib`, exposed as `ErrorHandlingService`.

**What it does:** receives an HTTP error, shows a user-visible snackbar with a translated message, and dispatches an error action to the store. Centralizing error UX means every error in every app looks consistent.

**Pattern in services:**

```typescript
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ErrorHandlingService } from 'commonlib';

@Injectable({ providedIn: 'root' })
export class TransferService
{
    constructor(
        private http: HttpClient,
        private errors: ErrorHandlingService,
    ) {}

    transfer(amount: BigNumber, to: string): Observable<TransferResult>
    {
        return this.http
            .post<TransferResultDto>(api.wallet.transfer(), { amount: amount.toString(), to })
            .pipe(
                map((dto) => this.adapter.adapt(dto)),
                catchError((err) =>
                {
                    this.errors.handle(err);     // ✅ snackbar + store dispatch
                    return throwError(() => err);
                }),
            );
    }
}
```

**Pattern in NgRx effects** (preferred when an error should also become a typed `*Failure` action):

```typescript
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

transfer$ = createEffect(() =>
    this.actions$.pipe(
        ofType(WalletActions.transfer),
        switchMap(({ amount, to }) =>
            this.transferService.transfer(amount, to).pipe(
                map((result) => WalletActions.transferSuccess({ result })),
                catchError((error) => of(WalletActions.transferFailure({ error: this.errors.toPayload(error) }))),
            ),
        ),
    ),
);
```

**Don't:**

```typescript
// ❌ Wrong — swallows error, no user feedback, no store update
.subscribe({
    next: (r) => this.result = r,
    error: () => { /* silently ignore */ },
});

// ❌ Wrong — bare console.log
.subscribe({
    error: (err) => console.log(err),
});

// ❌ Wrong — UI-only (no store dispatch)
.subscribe({
    error: (err) => alert(err.message),
});
```

**Error payload shape (`ErrorPayload`):** standardized in `commonlib`. When you create a typed `*Failure` action, its payload is an `ErrorPayload`, not a raw `HttpErrorResponse`. Use `errors.toPayload(err)` to coerce.

**Session expiry (HTTP 405):** there's a global `SessionInterceptor` that intercepts 405 and triggers an auto-logout. You don't write 405 handling in your service; the interceptor takes care of it. The error still reaches your `catchError` so you can surface a transient message ("session expired, redirecting…"), but cleanup is automatic.

---

## Rule 4 — Adapters bridge wire ↔ model

**The seam:** Wiboo's backend speaks snake_case; the app speaks camelCase. Adapters live at `core/adapters/*.adapter.ts` and translate.

```typescript
// libs/commonlib/src/lib/models/user.dto.ts — wire format
export interface UserDto
{
    id: string;
    email: string;
    full_name: string;            // ← snake_case from API
    is_email_verified: boolean;
    created_at: string;            // ← ISO timestamp from API
}

// libs/commonlib/src/lib/models/user.model.ts — app format
export interface User
{
    id: string;
    email: string;
    name: string;                  // ← camelCase
    emailVerified: boolean;
    createdAt: DateTime;           // ← luxon DateTime, not string
}

// libs/commonlib/src/lib/adapters/user.adapter.ts
import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';

@Injectable({ providedIn: 'root' })
export class UserAdapter
{
    adapt(dto: UserDto): User
    {
        return {
            id: dto.id,
            email: dto.email,
            name: dto.full_name,
            emailVerified: dto.is_email_verified,
            createdAt: DateTime.fromISO(dto.created_at),
        };
    }
}
```

**Why a separate adapter (instead of `as User` casting):**
- Type-checked translation — if the DTO field renames upstream, the adapter is where you find out.
- Type narrowing — DTO fields are nullable from the wire; the model can be non-nullable after the adapter validates.
- Date / `BigNumber` parsing — the adapter is where ISO strings become `DateTime`, where decimal strings become `BigNumber`.
- Testing — the adapter is a pure function, trivially unit-testable. Components that use `User` never need to know `UserDto` exists.

**Reverse direction (app → wire):** symmetric. Outgoing payloads are typed as DTOs; the adapter (or a `toDto()` method) converts. The component never builds a snake_case object.

---

## Rule 5 — Money uses `SafeMath`

`SafeMath` is `bignumber.js` re-exported from `commonlib`. Use it for any monetary or precision-sensitive arithmetic.

```typescript
// ✅ Right
import { SafeMath } from 'commonlib';

const balance = new SafeMath('1000.55');
const fee     = new SafeMath('0.01');
const total   = balance.plus(fee).toFixed(2);     // '1000.56' — exact

// ❌ Wrong — JS float arithmetic
const total = 1000.55 + 0.01;                     // 1000.56000000000001 — drift

// ❌ Wrong — naive parse
const balance = parseFloat(dto.balance);          // loses precision on long decimals
```

**Where this matters most:** anything in `apps/business`, `apps/shopping`, `libs/wallet`. Token balances, transfers, quotations, currency conversions, fees, totals — all `SafeMath`. The model field type for money is `BigNumber`, not `number`.

**The adapter is where the conversion happens:**

```typescript
// adapter
adapt(dto: TransactionDto): Transaction
{
    return {
        id: dto.id,
        amount: new SafeMath(dto.amount),     // ← string from wire → BigNumber in model
        currency: dto.currency,
    };
}
```

---

## Authentication and headers

Three headers are added by interceptors, not by your service code:

| Header | Purpose | Set by |
|---|---|---|
| `Authorization: Bearer <token>` | User auth | `AuthInterceptor` (or equivalent) |
| `x-app-id: <PlatformApplication>` | Identifies which Wiboo app made the call | `AppIdInterceptor` |
| `x-promo-code: <code>` | Active promo code (if any) | `PromoCodeInterceptor` |

You do **not** set these manually in your service. Don't read tokens from localStorage, don't construct headers, don't pass them via `HttpHeaders` to specific calls. The interceptors handle the entire chain.

If a specific endpoint needs a *different* auth (say, an unauthenticated public endpoint, or one with a different token type), that's a configuration concern handled at the interceptor level — not a per-call workaround. Flag it in `IMPACT.md` rather than working around the interceptor.

---

## Timeouts

The default HTTP timeout in Wiboo is **35 seconds**, set globally via interceptor configuration. You don't add `timeout(35000)` to every call.

If an endpoint legitimately needs a longer or shorter timeout (file upload, long-poll, real-time stream), document it explicitly in the service method's JSDoc and add the operator:

```typescript
/**
 * Uploads a CSV file. Allows up to 90s for backend processing.
 */
uploadCsv(file: Blob): Observable<UploadResult>
{
    return this.http
        .post<UploadResultDto>(api.shopping.bulkUpload(), file)
        .pipe(timeout(90000), map((dto) => this.adapter.adapt(dto)));
}
```

The default of 35s is intentional and matches the user's patience window. Don't override silently.

---

## Common patterns by use case

**Fetch with refresh button:** `BehaviorSubject` for the trigger, `switchMap` to re-fire.

```typescript
private refresh$ = new BehaviorSubject<void>(undefined);

users$ = this.refresh$.pipe(
    switchMap(() => this.userService.list()),
);

onRefresh() { this.refresh$.next(); }
```

**Fetch on filter change:** the filter form's `valueChanges` is the source.

```typescript
results$ = this.filterForm.valueChanges.pipe(
    debounceTime(300),
    switchMap((filters) => this.searchService.search(filters)),
);
```

**Submit form once, navigate on success:** `exhaustMap` so spam-clicks don't double-submit.

```typescript
submit$ = this.actions$.pipe(
    ofType(SubmitActions.submit),
    exhaustMap(({ payload }) =>
        this.service.submit(payload).pipe(
            map((result) => SubmitActions.submitSuccess({ result })),
            catchError((err) => of(SubmitActions.submitFailure({ error: this.errors.toPayload(err) }))),
        ),
    ),
);
```

**Concurrent fetches that must all complete:** `forkJoin`.

```typescript
ngOnInit()
{
    this.data$ = forkJoin({
        user: this.userService.current(),
        balance: this.walletService.balance(),
        rewards: this.rewardsService.active(),
    });
}
```

`switchMap` (cancel previous) is the default; choose `mergeMap` (parallel), `concatMap` (serial), or `exhaustMap` (ignore-while-busy) deliberately, with reasoning visible in code review.

---

## Self-review checklist (`@CodeGen` after writing; `@Reviewer` and `@QA` on diff)

- [ ] Every URL comes from `api.<domain>.<endpoint>()` — no hardcoded strings, no environment concatenation.
- [ ] Every HTTP call lives in a service (an `@Injectable` class), not in a component.
- [ ] No `HttpClient` injection in components.
- [ ] Every HTTP call has `catchError` that routes through `ErrorHandlingService.handle(err)` (or a typed `*Failure` action via effect).
- [ ] No swallowed errors, no `console.log` errors, no UI-only error handling.
- [ ] Every response that has wire-vs-model casing differences passes through an adapter.
- [ ] Money uses `SafeMath` / `BigNumber`. No `number` fields for money.
- [ ] No manual setting of `Authorization`, `x-app-id`, or `x-promo-code` headers.
- [ ] Timeouts: default 35s is fine; any deviation is justified in JSDoc.
- [ ] No `.subscribe()` in components — async pipe or `takeUntil(destroy$)` per `bifrost-state-management` rule.
- [ ] RxJS combinator (`switchMap`/`mergeMap`/`concatMap`/`exhaustMap`) is the right choice for the use case, with the rationale visible.
- [ ] If an endpoint isn't in the `api` factory: it was added in this PR OR flagged in `IMPACT.md` for confirmation that it's real.

---

## Pointers

- **Endpoint catalogue (when seeded):** `knowledge/API_CONTRACTS.md` — Backend-owned. Until then: `libs/commonlib/src/lib/constants/api.ts` is the working source.
- **Existing services as reference:** `libs/commonlib/src/lib/services/`, plus `apps/<app>/src/app/core/api/`.
- **Error model:** `ErrorPayload` in `commonlib`.
- **Money primitives:** `SafeMath` in `commonlib` (re-export of `bignumber.js`).
- **Subscription discipline:** `bifrost-state-management` Section B (the takeUntil/async-pipe rule).
- **Naming:** `bifrost-code-standards` (DTO snake_case, model camelCase, adapter pattern).
- **Common HTTP gotchas:** `knowledge/GOTCHAS.md` §HTTP.
