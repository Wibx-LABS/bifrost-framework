# Delivery Standards (Frontend Department)

**Status:** non-negotiable

## What this is

These are the receiving team's stated standards for how Bifrost-generated work must be delivered. They were communicated by the Frontend department and apply to every feature Bifrost ships, without exception. They are not Bifrost-internal aspirations; they are the spec for what gets accepted at the Backend-merge gate, which directly drives the rework-rate metric the framework's kill-switch tracks (see [`docs/planning/operation-bifrost.md`](../../docs/planning/operation-bifrost.md): rework rate < 10% target, > 20% kills the program).

The three principles, in the receiving team's own words:

> 1. **PRs simples e bem divididos / organizados.**
> 2. **Entrega bem estruturada e bem documentada.**
> 3. **Componentes Angular.**

Each elaborated below.

---

## 1. Simple, well-divided, well-organized PRs

### Statement

Every Bifrost feature produces exactly one focused pull request. The PR is scoped narrowly enough that the Backend reviewer can read the diff cold, understand the change in 30 minutes, and approve in under 2 hours total. Features too large for that — too many files, too many concerns mixed, too many architectural decisions in one delivery — must be split into multiple Bifrost features, each with its own TRAJECTORY, its own lifecycle run, and its own PR.

### Why it matters

Backend's review-and-merge time is the dominant variable in the framework's velocity premise. A 200-file PR takes a full day to review properly; a 20-file PR takes an hour. Multiple smaller PRs deliver faster cumulatively than one large PR even though the agent work scales linearly, because human approval throughput is the bottleneck. Beyond throughput, narrow PRs are easier to revert if something breaks in production, easier to bisect against in regression hunts, and easier to write a clean conventional-commit history for.

### What this rules out

- **Mega-PRs** that bundle multiple distinct concerns ("Add notifications + refactor auth + update theme tokens" in one delivery).
- **Out-of-scope drift** during a Bifrost feature — extending the original scope mid-flight to "also fix this related thing." Even small additions count; if the addition is genuinely necessary it goes in TRAJECTORY §6 as an amendment AND must fit the same focused-PR profile, OR it splits into a separate feature.
- **Large refactor PRs** disguised as features. A refactor is its own Bifrost feature with its own TRAJECTORY scoped to that refactor.
- **Speculative cleanup** in a feature PR. "While I was in this file I also fixed unrelated lint warnings" is unwelcome — the diff loses focus.

### Operational implications

- `@Planner` Step 3 considers PR scope when sizing tasks. A task list that would produce a too-large PR is flagged: split the feature, or escalate.
- `@Intake` Step 4.5 (PR-scope feasibility check) catches oversized features at intake — splitting at intake costs minutes; later splitting is disruptive.
- `@CodeGen` per-task subroutine respects task boundaries; doesn't bundle cross-cutting changes.
- `@Reviewer` HANDOFF.md §3 Files changed is "organized by area, not exhaustive." If it feels overwhelming when scanned, the PR is too big.
- TRAJECTORY §1 in-scope / out-of-scope binary lists are the contract. Tight binary lists keep PRs tight.

---

## 2. Well-structured and well-documented delivery

### Statement

Every Bifrost delivery — the PR itself, HANDOFF.md, the code, the commit history — is structured for the Backend reviewer to absorb without doing archaeology. HANDOFF.md leads with the Trajectory restatement so reviewers see the locked invariants first. Files are organized by area in §3. API validation is named explicitly per endpoint in §4. Test results carry specific numbers, not vague summaries. Code carries file headers (`@file` / `@author` / `@createdAt` / `@app` / `@description`), JSDoc on public APIs, inline comments explaining *why*, and TRAJECTORY citations where §4 architectural decisions bind specific files. Commit messages follow conventional-commit style. The PR description points at HANDOFF.md and gives the 30-second framing.

### Why it matters

Documentation is the difference between Backend trusting the lifecycle and Backend re-verifying everything. If HANDOFF.md is vague, Backend re-runs the QA checks; if file headers are missing, Backend has to figure out which app a file belongs to; if architectural decisions aren't traceable to TRAJECTORY, Backend has to reconstruct rationale by reading every commit. Each failure consumes Backend time and erodes the trust that lets Bifrost-generated code merge fast.

### What this rules out

- **HANDOFF.md as a stub.** Every section the template carries gets populated with substantive content.
- **PR descriptions like "fixes the bug"** or single-line summaries. The PR description is structured (Trajectory at delivery / Files changed brief / link to HANDOFF) so Backend can decide whether to invest review time without opening every file.
- **Code without file headers.** Every modified or created `.ts` / `.html` / `.scss` file must carry the Bifrost file header.
- **Untraceable architectural decisions.** When a piece of code is bound by a TRAJECTORY §4 decision, the relevant file or function comments cite it.
- **Vague test claims.** "All tests pass" is not enough; specific counts (`<N>/<N>`) and the explicit TRAJECTORY §3 → test mapping in QA_REPORT and HANDOFF are required.
- **Commit messages with no subject discipline.** `feat(<area>): <description>`, `fix(<area>): <description>`, etc. No `wip` commits in the final history.

### Operational implications

- `@Reviewer` HANDOFF.md authoring is held to "Backend can absorb in 5–10 minutes."
- `@CodeGen` file-header discipline is non-skippable; missing file headers fail CODE_REVIEW.md §5 Meta-checks.
- `@QA` reports specific numbers in QA_REPORT.md — vague summaries are a Major finding.
- `@Reviewer` PR description follows the structured format.

---

## 3. Angular components

### Statement

Bifrost output prefers Angular component decomposition. Reusable behaviors are encapsulated in components from `libs/commonlib/src/lib/components/` (the `app-*` library catalogued in `knowledge/COMPONENT_LIBRARY.md`); new feature-specific behaviors are decomposed into proper Angular components with the file quartet (`.component.ts` / `.component.html` / `.component.scss` / `.component.spec.ts`), `ChangeDetectionStrategy.OnPush`, the `app-<kebab>` selector pattern, and reactive forms (no template-driven). Bifrost does not produce inline HTML/CSS that bypasses the component system. Bifrost does not pull in non-Angular UI libraries. Bifrost does not author Material primitives directly when the `commonlib` `app-*` wrapper exists.

### Why it matters

The Wiboo monorepo's UI consistency depends on `commonlib` being the single source of components. Each time a feature bypasses `commonlib` and uses Material primitives directly (or worse, a third-party library), the apps drift visually and behaviorally. Eight subtly different button styles, six date pickers, inconsistent loading states — all show up in production over time, all are expensive to retrofit, and all show up to Backend reviewers as "wait, why is this not using the existing component?"

### What this rules out

- **Inline HTML/CSS** in components when an `app-*` wrapper from `commonlib` does what's needed.
- **Direct Material primitive usage** (`<button mat-raised-button>`, `<mat-form-field>`, etc.) when `<app-button>`, `<app-input>`, or equivalent exists.
- **Third-party UI libraries** (PrimeNG, ng-bootstrap, ngx-*, etc.) for behaviors `commonlib` covers.
- **Stateful logic in templates** — `[(ngModel)]` for form state is forbidden; reactive forms only.
- **Bypassing the file quartet** — components have all four files; single-file components or missing specs are defects.
- **Non-OnPush components** without explicit justification in the file header.
- **Components without `app-` selector prefix** or without kebab-case naming.

### Operational implications

- `@CodeGen` per-task subroutine, when the task involves UI, follows `bifrost-component-gen` §"The first rule: use the library" before authoring new components.
- `@CodeGen` Step 7 per-task quick self-review checks "Reused commonlib components wherever possible" + "OnPush change detection" + file quartet present + reactive forms only.
- `@Reviewer` §"Backend review checklist" includes "spot-check 1 component used `commonlib`."
- `@QA` performance checks include OnPush adherence (because OnPush is part of perf budget compliance).

---

## How agents respect these principles

| Principle | Owning agents | Where enforced |
|---|---|---|
| **Simple, well-divided PRs** | `@Intake`, `@Planner`, `@CodeGen`, `@Reviewer` | Intake Step 4.5 PR-scope feasibility; Planner Step 3 task sizing; CodeGen per-task `Output:` discipline + aggregate PR-shape check; Reviewer HANDOFF §3 organized-by-area |
| **Well-structured / documented delivery** | `@CodeGen`, `@QA`, `@Reviewer` | CodeGen file headers + JSDoc + TRAJECTORY citations; QA specific numbers; Reviewer HANDOFF rich format |
| **Angular components** | `@CodeGen`, `@Reviewer` | CodeGen via `bifrost-component-gen` skill; Reviewer Backend-review-checklist spot-checks |

Every agent's pre-exit checklist implicitly walks these principles — if the output respects them, the checklist passes; if it doesn't, the agent should Hard Stop and surface rather than ship a violation.

The principle page itself is not a list of new mechanics; it's the framing of what existed across multiple skills and templates as a single non-negotiable contract with the receiving team. **When the principle and a specific skill or template appear to conflict, the principle wins** — skills and templates are operationalizations of principles, not the other way around.

---

## Where to read more

- **Operational acceptance criteria** (rework rate target, kill-switch threshold): [`instructions/05-SUCCESS-CRITERIA.md`](../05-SUCCESS-CRITERIA.md), [`docs/planning/operation-bifrost.md`](../../docs/planning/operation-bifrost.md)
- **`@Planner`'s PR-scope discipline**: [`core/agents/templates/Planner_Template.md`](../../core/agents/templates/Planner_Template.md) §Step 3
- **`@Intake`'s PR-scope feasibility check**: [`core/agents/templates/Intake_Template.md`](../../core/agents/templates/Intake_Template.md) §Step 4.5
- **`@CodeGen`'s per-task and aggregate checks**: [`core/agents/templates/CodeGen_Template.md`](../../core/agents/templates/CodeGen_Template.md)
- **The component library principle 3 binds**: [`knowledge/COMPONENT_LIBRARY.md`](../../knowledge/COMPONENT_LIBRARY.md), [`core/skills/bifrost-component-gen/SKILL.md`](../../core/skills/bifrost-component-gen/SKILL.md)
- **The code review checklist for delivery standards**: [`core/skills/bifrost-code-review/SKILL.md`](../../core/skills/bifrost-code-review/SKILL.md) §Section 5.5
