# ADR-007: Wiboo Angular monorepo as v0 single-stack target

**Status:** accepted

## Decision

Bifrost v0 targets a **single tech stack**: the Wiboo Angular 15 + Nx 16 monorepo at WibX Labs. The four apps inside that monorepo (`account`, `business`, `shopping`, `wibxgo`) are addressable destinations during `bifrost-init`'s interview, but they are **not separate stack profiles**. There is no `stacks/{website,dashboard,mobile}/` directory. There is no cross-stack acceptance test.

### What this means in practice

- Every Bifrost-generated feature targets ONE of the four Wiboo apps.
- All apps share NgRx 14, Angular Material 15, RxJS 6.6, TypeScript 4.8, Nx 16 — these versions are **locked** for v0; bumping any of them requires an ADR.
- The knowledge layer (`knowledge/FRONTEND_REPOSITORY_MANUAL.md` + `API_CONTRACTS.md` + `COMPONENT_LIBRARY.md` + `NAMING_CONVENTIONS.md` + `TECH_STACK.md` + `GOTCHAS.md`) is written for this single stack.
- Multi-stack support (separate frontends with different frameworks) is **deferred** to a future ADR if needed.

### Operational acceptance criteria

| Criterion | Target | Source |
|---|---|---|
| **Velocity** — start → deliver | < 4 hours | [`instructions/05-SUCCESS-CRITERIA.md`](../05-SUCCESS-CRITERIA.md) §Operational Success / Feature Velocity |
| **Quality** — Backend rework | < 10% (kill-switch > 20%) | [`docs/planning/operation-bifrost.md`](../../docs/planning/operation-bifrost.md) §Three assumptions |
| **Code quality** | rework < 5% (ideal) | per the three assumptions |
| **Context engineering** | > 90% structural similarity across two runs of the same feature | per the three assumptions |
| **Revision-cycle stability** | `@QA` findings stabilize in < 3 iterations | per the three assumptions |

If any one fails, the pilot is retried after the named remediation. If rework rate exceeds 20% across two consecutive features, the kill-switch triggers and Bifrost stops scaling.

### The pilot feature (selection criteria)

Selected by Product lead at staffing time. Constraint: medium complexity (not trivial, not huge), exercises at least one API endpoint, at least one UI component from `knowledge/COMPONENT_LIBRARY.md`, and at least one NgRx store interaction.

### What is NOT in v0

- A `stacks/` top-level directory in the framework repo.
- Cross-stack pass/fail tests as a v0 release-engineering bar.
- Forking the knowledge layer per stack.
- Treating "the dashboard" and "the website" and "the mobile app" as separate Bifrost configurations when in practice they share a stack.

## Where to read more

- **The Wiboo monorepo (apps, libs, conventions, performance targets, ESLint rules)**: [`knowledge/FRONTEND_REPOSITORY_MANUAL.md`](../../knowledge/FRONTEND_REPOSITORY_MANUAL.md)
- **Tech stack (locked versions)**: [`knowledge/TECH_STACK.md`](../../knowledge/TECH_STACK.md)
- **Operational acceptance metrics + red flags**: [`instructions/05-SUCCESS-CRITERIA.md`](../05-SUCCESS-CRITERIA.md)
- **Strategic context** (kill-switch threshold, three assumptions): [`docs/planning/operation-bifrost.md`](../../docs/planning/operation-bifrost.md)
- **Project identity** (distilled into agent context): [`core/templates/PROJECT_CONTEXT.md`](../../core/templates/PROJECT_CONTEXT.md)
