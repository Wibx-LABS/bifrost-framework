---
name: bifrost-state-management
description: Two-part skill on state — (A) the framework's STATE.md protocol (the "if it isn't in STATE.md, it didn't happen" mechanic, owned by @Conductor, validated by the pre-commit hook); (B) Wiboo's NgRx 14 code patterns for in-app state (actions, reducers, selectors, effects, immutable updates, the takeUntil/async-pipe subscription discipline, the "wait for the effect, not the dispatch" rule). Use this skill whenever you are @Conductor (you own STATE.md and update it after every step), @Monitor (you check that STATE.md and the source tree haven't drifted), @Reviewer (you verify state-of-record completeness in HANDOFF.md and verify the code's NgRx patterns are correct), or @CodeGen writing/editing any NgRx code (actions, reducers, selectors, effects in apps/account, business, shopping, wibxgo, or libs/commonlib, libs/wallet). Triggering signals: any mention of STATE.md, pre-commit hook, NgRx, store, reducer, selector, effect, dispatch, action, the takeUntil pattern, RxJS subscription, async pipe, or memory leaks in the Wiboo monorepo.
---

# bifrost-state-management

This skill carries two related but distinct concerns. **Section A** is the operational protocol for `STATE.md` — the framework's own progress artifact, governed by the State-is-Truth law. **Section B** is the Wiboo monorepo's NgRx pattern set — how application state is structured in code. They share the noun "state" and they reinforce each other (NgRx state changes are STATE.md-worthy events) but their audiences and mechanics differ. Read the section that applies to you first; the cross-cutting note at the end ties them together.

---

## Section A — `STATE.md`: the framework's source of truth

Bound by Three Laws #1 (`bifrost-system-context`): **the State is Truth.** If something happened — a task completed, an artifact written, a decision made, a blocker raised — and it isn't in `.bifrost/STATE.md`, it didn't happen. STATE.md is the only authoritative record of execution. Every other artifact (IMPACT, PLAN, CODE_REVIEW, QA_REPORT, HANDOFF) is a snapshot of one phase's output; STATE.md is the running log.

`@Conductor` owns STATE.md. `@Monitor` reads it. `@Reviewer` reads it. The pre-commit git hook validates it. Other agents do not write to STATE.md directly; they signal `@Conductor` (by writing their phase artifacts), and `@Conductor` reflects the change.

### Schema

```yaml
---
id: <uuid>
feature: <feature-name>
status: pending | intake | planning | coding | qa | review | merged | aborted
created: <ISO-8601 timestamp>
updated: <ISO-8601 timestamp, refreshed every write>
autonomy: Task-Gated | Phase-Gated | Full
framework_version: <semver>
schema_version: 1
---

# Bifrost State

## Phase
Current phase + agent + started-at + (if applicable) blocked-on.

## Timeline
Append-only chronological log. Each entry: `- <ISO-8601> — @Agent — <event>`.
Entries reference artifacts and commits by relative path or short SHA.

## Artifacts
List of files in `.bifrost/` that exist + the agent that produced each.
Format: `- PATIENT.md (Product), TRAJECTORY.md (@Intake, locked YYYY-MM-DDTHH:MM:SSZ), IMPACT.md (@Intake), …`

## Decisions
Decisions made during this feature that aren't in TRAJECTORY.md (TRAJECTORY captures
locked architectural decisions; STATE captures operational ones — "deferred test X to
follow-up PR", "switched task order because of dependency").

## Blockers
Open issues that prevent forward motion. Each: who's blocked, what they need, when raised.
When resolved, move the entry to Timeline with `(resolved at <ts>)` and remove from Blockers.

## Next Actions
What @Conductor expects to happen next. Usually 1–3 items, ordered.

## Commits
Git commits made during this feature. Each: `- <short-sha> — <conventional-commit-subject>`.

## Trajectory acknowledged
- Sections respected: §1, §2, §3, §4, §5
- Amendments added: <link or "none">
- Conflicts surfaced: <link or "none">
```

### Status enum (frontmatter `status:`)

- `pending` — feature initialized but `@Intake` hasn't run yet (PATIENT.md is being authored).
- `intake` — `@Intake` is running `/bifrost:start`.
- `planning` — `@Planner` is running `/bifrost:plan`.
- `coding` — `@CodeGen` is running `/bifrost:build`.
- `qa` — `@QA` is running `/bifrost:qa`.
- `review` — `@Reviewer` is running `/bifrost:deliver`; PR is open or about to be.
- `merged` — Backend merged the PR; feature is shipped.
- `aborted` — feature was halted (trajectory abort, scope cancellation, kill-switch).

A status transition is one of the most consequential things `@Conductor` does. Always update both `status:` (frontmatter) and the **Phase** section together. Mismatch is a defect the pre-commit hook catches.

### Update cadence

`@Conductor` updates STATE.md after **every** of these events:

- An agent completes a phase (writes its artifact and exits).
- An agent enters a Hard Stop (write to **Blockers**, set the blocker).
- A user approves an approval gate.
- A new commit lands in the feature branch.
- A trajectory amendment is appended to TRAJECTORY.md (cross-reference here).
- A skill is bootstrapped via `bifrost-hr` (note in **Decisions** + **Artifacts**).

The cost of one extra STATE.md write is microseconds; the cost of an outdated STATE.md is hours of forensics. Update eagerly.

### Validation (pre-commit hook + CI)

Before any commit on a Bifrost feature branch, the pre-commit hook validates:

1. **Frontmatter completeness** — every required field present with valid type.
2. **Status enum** — `status:` is one of the allowed values.
3. **Timestamps monotonic** — no backwards time travel in the Timeline.
4. **Artifacts list resolves** — every artifact referenced exists at the named path.
5. **Commits resolve** — every short SHA in the Commits section exists in `git log`.
6. **No duplicate Timeline entries** — same `(timestamp, agent, event)` triple appears once.
7. **Trajectory acknowledged** — the trailing section exists and references TRAJECTORY by section number.

The CI step `bifrost-validate state` re-runs all of the above on every PR. A commit (or a PR) that breaks any of these is a defect to fix, not a checkpoint to push.

### Common failure modes

- **Conductor forgets to update on Hard Stop.** A blocker exists in reality (an agent is waiting for user input) but STATE.md still shows the prior status. Fix: when an agent emits `TRAJECTORY_AMENDMENT_PROPOSED` or any Hard Stop block, immediately update STATE.md. The `bifrost-system-context` skill makes this an explicit step; treat the hook output as authoritative.
- **Drift between STATE.md and the source tree.** An agent claims a file was written but the file doesn't exist; or files were created outside the plan and STATE doesn't know. `@Monitor` catches this; do not normalize by mutating STATE.md to match a wrong reality. Fix the source tree or fix the work record, depending on which is wrong.
- **Status set to `merged` before the PR actually merges.** Don't predict; record. `merged` only after the merge SHA is on `main`. Use `review` until then.
- **Decisions inflation.** STATE's Decisions section is for operational decisions, not architectural ones. Architectural decisions belong in TRAJECTORY.md (locked at intake) or in an ADR (framework-level changes). If you're tempted to write a long rationale in STATE Decisions, stop and ask whether it should be a TRAJECTORY amendment or an ADR.

---

## Section B — NgRx 14 patterns in the Wiboo monorepo

Wiboo's apps (`account`, `business`, `shopping`, `wibxgo`) and shared libs (`commonlib`, `wallet`) use NgRx 14.3.2 + RxJS 6.6.0. State management discipline is enforced through code review, ESLint, and (where applicable) the `bifrost-validate code-standards` CI step. `@CodeGen` writes against these patterns; `@Reviewer` verifies them.

The patterns below are the *Wiboo conventions*, derived from `knowledge/TECH_STACK.md` and `knowledge/GOTCHAS.md`. They overlap with NgRx best practice but are not generic — they reflect Wiboo's specific style (file structure, naming, RxJS pipeline shape).

### Versions

| Package | Version |
|---|---|
| `@ngrx/store` | 14.3.2 |
| `@ngrx/effects` | 14.3.2 |
| `@ngrx/entity` | 14.3.2 |
| `@ngrx/router-store` | ^18.0.1 |
| `@ngrx/store-devtools` | 14.3.2 |
| `@ngrx/schematics` | 14.3.2 |
| `rxjs` | 6.6.0 |

When in doubt about API surface, the version is the answer to "which docs to read." NgRx 14 ≠ NgRx 17.

### File layout (per feature/store)

```
core/stores/<feature>/
├── <feature>.actions.ts       # createAction definitions
├── <feature>.reducer.ts       # createReducer
├── <feature>.selectors.ts     # createSelector
├── <feature>.effects.ts       # @Injectable, side-effect handlers
├── <feature>.state.ts         # State interface + initialState
└── <feature>.store.ts         # Optional: facade wrapping the above
```

### Actions — pattern

```typescript
import { createAction, props } from '@ngrx/store';

export const loadUser    = createAction('[User] Load',         props<{ id: string }>());
export const loadSuccess = createAction('[User] Load Success', props<{ user: User }>());
export const loadFailure = createAction('[User] Load Failure', props<{ error: string }>());
```

Naming: `'[Feature] Verb'` for the source-of-truth action; `'[Feature] Verb Success'` and `'[Feature] Verb Failure'` for the result actions. Past-tense for events, present-tense for commands.

### Reducers — pattern

Reducers must be pure functions. **Never mutate state.** Use the spread operator to create new objects.

```typescript
import { createReducer, on } from '@ngrx/store';
import * as UserActions from './user.actions';
import { initialUserState, UserState } from './user.state';

export const userReducer = createReducer(
  initialUserState,

  on(UserActions.loadUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UserActions.loadSuccess, (state, { user }) => ({
    ...state,
    loading: false,
    user,
  })),

  on(UserActions.loadFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);
```

Common mistake (caught at review):

```typescript
// ❌ WRONG — mutation
on(updateUser, (state, action) => {
  state.user.name = action.name;   // mutates existing object
  return state;
});

// ✅ RIGHT — new objects all the way down
on(updateUser, (state, action) => ({
  ...state,
  user: { ...state.user, name: action.name },
}));
```

**No side effects in reducers.** No HTTP calls, no `console.log`, no DOM access, no `Date.now()` outside of pure mapping. Side effects go in Effects.

### Selectors — pattern

```typescript
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.state';

export const selectUserState   = createFeatureSelector<UserState>('user');
export const selectUser        = createSelector(selectUserState, (s) => s.user);
export const selectUserLoading = createSelector(selectUserState, (s) => s.loading);
export const selectUserError   = createSelector(selectUserState, (s) => s.error);
```

Compose selectors rather than reaching into nested state in components. `createSelector` memoizes — a component subscribed to `selectUser$` only re-renders when `user` actually changes, not when any other slice of `UserState` does.

### Effects — pattern

```typescript
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as UserActions from './user.actions';
import { UserService } from '../services/user.service';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private userService: UserService,
  ) {}

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUser),
      switchMap(({ id }) =>
        this.userService.getUser(id).pipe(
          map((user) => UserActions.loadSuccess({ user })),
          catchError((error) => of(UserActions.loadFailure({ error: error.message }))),
        ),
      ),
    ),
  );
}
```

`switchMap` is the default for fetch-style effects — cancels prior in-flight requests on a new dispatch. Use `mergeMap` only when concurrent requests are intended (uncommon). Use `concatMap` for serialized side effects (rare). `exhaustMap` for "ignore new dispatches while one is in flight" (e.g., login button mash protection).

Always `catchError` inside the inner pipe — bubbling errors to the outer `actions$` stream kills the effect for the rest of the session.

### Subscription discipline (the failure mode that bites most)

The single most common state-management bug in the Wiboo codebase is **unsubscribed observables causing memory leaks**. Two acceptable patterns; everything else is a defect.

**Pattern 1 — async pipe in template (preferred when possible).**

```typescript
@Component({
  selector: 'app-user-card',
  template: `
    <div *ngIf="user$ | async as user">
      <h2>{{ user.name }}</h2>
    </div>
  `,
})
export class UserCardComponent {
  user$ = this.store.select(selectUser);

  constructor(private store: Store) {}
}
```

The template subscribes; Angular auto-unsubscribes on component destroy. No `OnDestroy` needed for this stream. This is the right pattern for any observable that's only consumed by the template.

**Pattern 2 — `takeUntil(destroy$)` when you need to subscribe in code.**

```typescript
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({ /* … */ })
export class UserCardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  user: User | null = null;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store
      .select(selectUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.user = user;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

The `takeUntil(destroy$)` operator unsubscribes when `destroy$` emits, which happens in `ngOnDestroy`. Always emit AND complete `destroy$` to release any references.

**Anti-pattern — direct `.subscribe()` without unsubscribe.**

```typescript
// ❌ WRONG — leaks until app teardown
ngOnInit(): void {
  this.store.select(selectUser).subscribe((user) => {
    this.user = user;
  });
}
```

This subscription has no cleanup. Every time the component is created and destroyed, the subscription persists in the store's emitter list, holding a reference to the (now-destroyed) component. Hundreds of route navigations later, you have hundreds of zombie subscriptions firing on every state change.

The lint rule that catches this: `rxjs/no-unsafe-subject-next` and `rxjs-angular/prefer-takeuntil`. The review rule (caught by `@Reviewer`): "no `.subscribe()` in components without `takeUntil` or unless the observable is finite (`take(1)`, `first()`, etc.)."

### State changes are immediate; database changes are async

After a `dispatch`, the store updates synchronously. The effect that calls the API runs asynchronously. Naive code assumes the dispatch means the work is done; it doesn't.

```typescript
// ❌ WRONG — navigates before the delete actually completes
onDeleteUser(): void {
  this.store.dispatch(deleteUser({ id: this.userId }));
  this.router.navigate(['/users']);   // user might see deleted state, then error on revert
}

// ✅ RIGHT — wait for the effect's success action
onDeleteUser(): void {
  this.store.dispatch(deleteUser({ id: this.userId }));
  this.store
    .select(selectDeleteUserStatus)
    .pipe(filter((s) => s === 'complete'), take(1))
    .subscribe(() => this.router.navigate(['/users']));
}
```

Use a status selector or the `Actions` stream + `ofType(deleteUserSuccess)` pattern. The store reflects intent; effects reflect resolution.

### Common review checklist (for `@Reviewer`)

- [ ] Reducers are pure (no `console.log`, no `Date.now()`, no service injection).
- [ ] No state mutation (every reducer return is a new object via spread).
- [ ] Effects always have `catchError` inside the inner pipe (not the outer `actions$`).
- [ ] No bare `.subscribe()` in components — async pipe OR `takeUntil(destroy$)` with `ngOnDestroy`.
- [ ] `destroy$` is `next()` AND `complete()` in `ngOnDestroy`.
- [ ] Selectors are composed via `createSelector` (memoized), not via `map` over an upstream selector.
- [ ] Action names follow `'[Feature] Verb'` / `'[Feature] Verb Success'` / `'[Feature] Verb Failure'` convention.
- [ ] No assumption that `dispatch` means "done" — navigation/follow-up waits for the success action or status selector.

---

## Cross-cutting: STATE.md and NgRx state are different things

STATE.md tracks the **framework's progress** through this feature's lifecycle (`@Intake` ran, `@Planner` ran, etc.). NgRx state is the **application's runtime data** at the moment a user uses the feature in a browser. They have nothing in common except the word "state."

Two places they touch:

1. **A new NgRx slice is a STATE.md-worthy event.** When `@CodeGen` adds a new store (e.g., `core/stores/notifications/`), `@Conductor` records it in STATE's **Artifacts** and **Timeline**. The new slice is a deliverable and Backend will see it in HANDOFF; STATE.md is the breadcrumb trail.
2. **State-management gotchas surface in QA_REPORT.md.** When `@QA` runs, common findings (bare subscribes, mutated state, missing `catchError`) come from the rules in Section B. `@Conductor` mirrors any non-trivial finding into STATE's **Blockers** until resolved.

Outside those two intersections, treat STATE.md and NgRx as two separate domains in the same skill file. A `@Conductor` reading this skill cares only about Section A. A `@CodeGen` reading this skill cares only about Section B. `@Reviewer` cares about both.
