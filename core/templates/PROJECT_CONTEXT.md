<!--
PROJECT_CONTEXT.md — per-project system prompt. Written ONCE at bifrost-init.

Bound by:
  - bifrost-system-context (file layout — every agent reads this on wake)
  - instructions/02-INITIALIZATION.md (created by bifrost-init)
  - **Core Invariants** (Lifecycle, Stack Lock, Artifact Set) in `docs/architecture.md`.

DISTINCT FROM TRAJECTORY.md
  TRAJECTORY is per-feature locked invariants. PROJECT_CONTEXT is per-PROJECT
  identity (which monorepo this is, which apps live here, what patterns are
  shared). PROJECT_CONTEXT changes when the PROJECT changes (rare); TRAJECTORY
  is fresh for every feature.

DISTINCT FROM bifrost-system-context (the SKILL)
  The skill carries framework-level rules (Three Laws, trajectory protocol,
  Hard Stop discipline) — applies to every Bifrost session everywhere.
  PROJECT_CONTEXT carries project-specific identity — applies only here.

WHEN @AGENTS READ THIS
  Every wake, after TRAJECTORY.md and STATE.md (per bifrost-system-context's
  read order). Loaded from `.bifrost/PROJECT_CONTEXT.md` for the active feature
  AND from the project root for project-level identity (interpreted as default
  if the feature folder doesn't override).

HYDRATION
  Filled by bifrost-init using the interview answers + knowledge/ defaults.
  After init, edits are rare and require care (changing this affects every
  in-flight feature).
-->

# PROJECT_CONTEXT.md — Wiboo Frontend Monorepo

You are operating inside the **Wiboo (WiBOO Frontends)** Angular monorepo at WibX Labs. This document tells you what the project IS — its identity, structure, and stack-level constraints. The Bifrost framework rules (lifecycle, trajectory, Three Laws) come from your `bifrost-system-context` skill; this file is the project-specific layer underneath.

---

## What this monorepo is

A single **Nx 16 + Angular 15** monorepo containing four user-facing apps and two shared libraries. All apps share the same tech stack (NgRx 14, Material 15, RxJS 6.6, TypeScript 4.8) and the same coding conventions (per `bifrost-code-standards`).

```
Wiboo monorepo (root)
├── apps/
│   ├── account/        # User profile, auth, security, MFA
│   ├── business/       # Merchant platform: dashboard, campaigns, rewards
│   ├── shopping/       # E-commerce, geosearch
│   └── wibxgo/         # Token Go gamification (AR-style token collection)
├── libs/
│   ├── commonlib/      # Shared components, services, models, adapters, constants, utils
│   └── wallet/         # Financial operations (transfers, statements, quotations)
└── (Nx + Angular workspace files)
```

When you write code here, you are writing inside ONE of those apps or libs. The path tells you which.

---

## Stack lock (per `docs/architecture.md` / `knowledge/TECH_STACK.md`)

These versions are **locked** for v0. Bumping any of them requires an ADR.

| Tech | Version | Why |
|---|---|---|
| Angular | 15.0.1 | SPA framework |
| TypeScript | 4.8.3 | Language (Angular 15 requires 4.8 or 4.9) |
| RxJS | 6.6.0 | Reactive |
| @ngrx/store + effects + entity | 14.3.2 | Global state |
| @angular/material + cdk | 15.0.0 | UI components |
| Nx | 16.2.1 | Monorepo build / cache |
| Jest | 29 | Unit tests |
| Cypress | 12 | E2E tests |
| Yarn | 3.5.0 (Berry) | Package manager (PnP disabled, node_modules mode) |

**Brazilian locale.** Primary language is `pt-br`. Secondary `en`, `es`. Wire format from APIs is snake_case; app models are camelCase (adapters bridge — per `bifrost-code-standards`). Money handling uses **SafeMath** (BigNumber re-export from `commonlib`) — never JS floats — per `bifrost-api-integration` Rule 5.

---

## Where things live

| Concern | Location |
|---|---|
| Shared components | `libs/commonlib/src/lib/components/` (catalogued in `knowledge/COMPONENT_LIBRARY.md`) |
| Shared services | `libs/commonlib/src/lib/services/` |
| Shared models | `libs/commonlib/src/lib/models/` (`*.model.ts` for app, `*.dto.ts` for wire) |
| Shared adapters | `libs/commonlib/src/lib/adapters/` |
| Shared utils | `libs/commonlib/src/lib/utils/` (incl. `SafeMath` for money) |
| Shared constants | `libs/commonlib/src/lib/constants/` (incl. `api.ts` URL factory) |
| Per-app HTTP services | `apps/<app>/src/app/core/api/<domain>.api.ts` |
| Per-app stores | `apps/<app>/src/app/core/stores/<feature>/` |
| Per-app feature folders | `apps/<app>/src/app/features/<feature>/` |
| Per-app i18n | `apps/<app>/src/assets/i18n/{en,es,pt-br}.json` |
| Wallet operations | `libs/wallet/` (path alias `walletlib`) |
| Knowledge layer (this file's neighbors) | `projects/bifrost-framework/knowledge/` |

---

## Per-app extras

Each app uses the core stack plus app-specific dependencies:

- **`account`** — `@ngx-translate` for i18n in onboarding/MFA flows.
- **`business`** — `@ngu/carousel` (touch carousel), `highcharts` (analytics dashboards).
- **`shopping`** — `@angular/google-maps` (geosearch).
- **`wibxgo`** — `@angular/google-maps` + `qrcode-generator` (AR + token QR codes).
- **`commonlib`** — all core dependencies, no app-specific extras.
- **`wallet`** — all core dependencies; SafeMath-heavy.

When you're modifying an app, prefer adding to its existing extras over pulling in new packages. New dependencies require an ADR.

---

## Cross-cutting patterns (the things every feature here does)

These show up in every Wiboo feature; the relevant skills carry the patterns in detail.

- **HTTP discipline** (see `bifrost-api-integration`): URLs from `api.<domain>.<endpoint>()`; service-wrapped calls; ErrorHandlingService for errors; adapters for response → model; SafeMath for money; auth via interceptors.
- **State** (see `bifrost-state-management`): NgRx 14 (actions, reducers, selectors, effects); pure reducers, immutable updates, no bare `.subscribe()` in components — async pipe or `takeUntil(destroy$)`.
- **Components** (see `bifrost-component-gen`): use `app-*` from `commonlib` first; reactive forms only (no template-driven); ChangeDetectionStrategy.OnPush; loading + error states via existing components; i18n on every user-visible string.
- **Naming + format** (see `bifrost-code-standards`): kebab-case files w/ role suffix; PascalCase classes; camelCase functions w/ intent prefixes; 4-space indent + Allman braces + 140-char lines; `_`-private + `$`-observable conventions; no `I`-prefix on interfaces; snake_case in DTOs only.
- **Testing** (see `bifrost-qa-validator`): every artifact has a `.spec.ts`; happy + sad + edge case mandatory; MockStore + HttpClientTestingModule; performance / a11y / mobile gates per knowledge/TECH_STACK.md and bifrost-qa-validator §6–§8.

---

## Knowledge layer

The single source of truth for Wiboo specifics:

```
projects/bifrost-framework/knowledge/
├── FRONTEND_REPOSITORY_MANUAL.md   # the deep ~60KB reference
├── API_CONTRACTS.md                # endpoint catalogue (Backend-owned; not yet seeded)
├── COMPONENT_LIBRARY.md            # 50+ commonlib components
├── NAMING_CONVENTIONS.md           # naming + ESLint rules
├── TECH_STACK.md                   # versions, performance targets
└── GOTCHAS.md                      # known issues, security rules
```

When a question is "what does Wiboo do?" or "what's the existing pattern?", consult here first (via `bifrost-graphify-ref`). When a question is "what does THIS feature require?", consult `.bifrost/TRAJECTORY.md`.

---

## Performance + acceptance baselines

From `knowledge/TECH_STACK.md` Performance Targets:

- Page load (LCP): < 2 s
- User action → visible response: < 100 ms perceived
- List render: < 500 ms
- Search results: < 500 ms
- Bundle size: < 500 KB gzipped per app
- Lighthouse: > 90 (a11y, best practices)

From `docs/architecture.md` (Operational Acceptance Criteria):

- Pilot feature start → deliver: < 4 hours
- Backend dev review changes: < 10% of generated code
- Three assumptions hold: code quality, context engineering, revision-cycle stability

These are **gates, not aspirations.** A feature missing them is not done.

---

## Delivery standards (Frontend department, non-negotiable)

The Frontend department — the receiving team for every Bifrost-generated feature — has stated three non-negotiable delivery standards. These bind every feature; they are not Bifrost-internal aspirations but the spec for what gets accepted at the Backend-merge gate. Failing them ships rework, drives toward the kill-switch threshold, and erodes the trust that lets Bifrost-generated code merge fast.

The full principle page is at `instructions/principles/delivery-standards.md`. Summary:

1. **Simple, well-divided / well-organized PRs.** One Bifrost feature → one focused PR, ≤ 2-hour Backend review. Features too large get split into multiple Bifrost features (each with its own TRAJECTORY). No mega-PRs, no out-of-scope drift, no speculative cleanup.

2. **Well-structured and well-documented delivery.** HANDOFF.md rich and structured (per `core/templates/HANDOFF.md`). Code has file headers, JSDoc on public APIs, inline comments explaining *why*, TRAJECTORY citations where §4 decisions bind specific files. PR description carries the 30-second framing. Conventional-commit message style throughout.

3. **Angular components.** Reuse from `libs/commonlib/src/lib/components/` (the `app-*` library) first. New components follow the file quartet (`.component.ts`/`.html`/`.scss`/`.spec.ts`), `ChangeDetectionStrategy.OnPush`, `app-<kebab>` selector, reactive forms only. No inline HTML/CSS bypassing the component system. No direct Material primitive usage when an `app-*` wrapper exists. No third-party UI libraries when `commonlib` covers it.

Per the principle page, every agent inherits these standards through the lifecycle. `@Planner` sizes tasks with PR scope in mind; `@CodeGen` decomposes into Angular components and adds file headers; `@QA` verifies the structured-delivery elements; `@Reviewer` makes HANDOFF.md absorbable in 5–10 minutes. When a skill or template appears to conflict with these principles, the principles win.

---

## What's NOT this project (for clarity)

- **Not the Bifrost framework repo** — that's at `Token-LABS/bifrost-framework`, cloned at `projects/bifrost-framework/` for reference. This project (Wiboo) is what Bifrost generates code FOR.
- **Not multiple frontends** — Wiboo is one Angular monorepo; the four apps are nested apps, not separate stacks (per ADR-007).
- **Not a backend repo** — backend lives separately. Bifrost agents call its endpoints via `api.<domain>.<endpoint>()`; they don't modify backend code.

---

## How agents use this file

`PROJECT_CONTEXT.md` is read by every agent on wake (after TRAJECTORY and STATE). It's a *background* document — not actively cited in artifacts, but baked into the agent's understanding. If an agent's output contradicts something here, that's a defect in the agent's adherence.

The file changes rarely — typically only when:
- A version in the stack lock bumps (requires ADR).
- A new app is added to the monorepo (rare; would also require ADR).
- A cross-cutting pattern shifts (the relevant skill changes; this file mirrors).

If you're tempted to edit this file, ask first whether the change should be here or in a skill / TRAJECTORY / ADR.
