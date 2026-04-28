# ADR-008: Trajectory-context protocol — TRAJECTORY.md as locked-at-launch invariant store

**Status:** accepted

## The framing

Every Bifrost feature is a rocket flight. *Ignition* is the user's raw idea (PATIENT.md authored by Product); *landing* is the merged PR (Backend's responsibility). The *trajectory* — everything from `/bifrost:start` to `/bifrost:deliver` — is the framework's responsibility. **Context lost during the trajectory cannot be recovered later**: a constraint forgotten at intake propagates through plan, build, QA, and review; by the time it surfaces (if it ever does), the rocket has flown off-course and remediation is rework.

This ADR specifies the **trajectory-context protocol** that prevents context loss across the lifecycle.

## Decision

Bifrost adopts a trajectory-context protocol centered on a per-feature artifact, **`TRAJECTORY.md`** (template at [`core/templates/TRAJECTORY.md`](../../core/templates/TRAJECTORY.md)). The protocol has five parts.

### 1. The artifact: `TRAJECTORY.md`

Lives at `.bifrost/TRAJECTORY.md` (one per feature). Authored by `@Intake` at the conclusion of `/bifrost:start`, immediately before the approval gate to `/bifrost:plan`. Six sections:

| § | Section | Mutability |
|---|---|---|
| 1 | **Feature identity** — name, scope statement, in-scope binary list, out-of-scope binary list | LOCKED on write |
| 2 | **Hard constraints** — tech stack lock, security boundaries, perf budgets, blocking dependencies, must-not-break list | LOCKED on write |
| 3 | **Acceptance criteria** — concrete testable, MUST/SHOULD/MAY, each naming verifying artifact | LOCKED on write |
| 4 | **Architectural decisions** — statement + rationale + alternatives ruled out | LOCKED on write |
| 5 | **External context** — stakeholders, deadlines, related features, prior incidents | LOCKED on write |
| 6 | **Amendments log** — append-only entries from later agents | APPEND-ONLY |

Frontmatter includes `feature_id`, `target_app`, `unit_of_delivery`, `size`, `locked_at`, `locked_by`, `schema_version`, `trajectory_status`.

### 2. Mutability rules

**Locked on write.** When `@Intake` writes sections 1–5, those sections become **immutable** for the remainder of the feature. No agent — including `@Conductor`, `@Monitor`, or a re-running `@Intake` — may mutate them in place.

**Append-only via amendments.** Sections 1–5 can be **extended** by any later agent through the §6 amendments log: a new entry adds a constraint, decision, stakeholder, or acceptance criterion. The new entry references the section it relates to and is treated as additive context. **Amendments add; they never soften or contradict an existing invariant.**

**Trajectory abort.** If a later agent discovers that a *locked* §1–5 invariant is wrong, incomplete in a way that makes a later step impossible, or in conflict with newly-discovered reality, the agent **must Hard Stop** (per Three Laws #3). It writes a `TRAJECTORY_AMENDMENT_PROPOSED` block in its current artifact stating the conflict, and escalates to the user. Only a human can authorize re-running `@Intake` to issue a new TRAJECTORY (`schema_version: 2`, with the prior preserved as `TRAJECTORY.v1.md` for provenance).

### 3. Read protocol

**Mandatory first read.** Every agent's first action — before STATE.md, before PATIENT.md, before any other artifact — is to load `.bifrost/TRAJECTORY.md` (if it exists). Encoded in [`core/skills/bifrost-system-context/SKILL.md`](../../core/skills/bifrost-system-context/SKILL.md) so it applies to every agent.

**Pre-launch exception.** `@Intake` does not pre-read `TRAJECTORY.md` because it is the agent that creates it. `@Intake`'s read order is: PATIENT.md + the knowledge layer + PROJECT_CONTEXT.md.

**Acknowledgement requirement.** Every artifact produced by every agent (PLAN.md, source code's CODE_REVIEW.md, QA_REPORT.md, HANDOFF.md, etc.) **must contain a `## Trajectory acknowledged` section** listing, by section number, the locked invariants the artifact respected and explicitly naming any amendment the agent added. This makes "did the agent reason about the trajectory?" auditable rather than assumed.

### 4. Handoff contracts

The contract between consecutive agents is: **the next agent reads TRAJECTORY.md plus the immediately-prior artifact, and must produce output consistent with both.** Concretely:

- `@Intake → @Planner` — `@Planner` reads TRAJECTORY + IMPACT. PLAN.md tasks must be tagged with the trajectory invariants each task respects (`Trajectory respects: §<N>.<bullet>`). Tasks that violate a hard constraint are rejected at planning, not at QA.
- `@Planner → @CodeGen` — `@CodeGen` reads TRAJECTORY + PLAN. Generated code includes `Trajectory acknowledged` in CODE_REVIEW.md. §4 architectural decisions are quoted verbatim in code comments where they bind specific files.
- `@CodeGen → @QA` — `@QA` reads TRAJECTORY + source. §3 Acceptance criteria become `@QA` test cases by name. QA_REPORT.md confirms each criterion was tested, with the test reference.
- `@QA → @Reviewer` — `@Reviewer` reads TRAJECTORY + all prior artifacts. HANDOFF.md leads with a Trajectory section restating the locked invariants and how the delivered code satisfies each.
- **Always-on agents.** `@Conductor` reads TRAJECTORY on every wake; STATE.md updates reference trajectory invariants when a phase completion bears on one. `@Monitor` reads TRAJECTORY on every wake and emits a VITALS.md warning for any source-tree change that violates a §1–5 invariant.

### 5. Verification mechanism

- **Pre-commit hook.** Validates TRAJECTORY.md schema (frontmatter + 6 required sections + section-1-to-5 lock invariant + amendment-format compliance). A commit that mutates a locked section fails the hook.
- **`@Monitor` drift check.** Every wake, `@Monitor` cross-references the current source tree and STATE.md against TRAJECTORY §2 (hard constraints) and §3 (acceptance criteria). Drift produces VITALS.md warnings.
- **GitHub Actions.** `bifrost-validate trajectory` checks every PR for: TRAJECTORY.md presence; schema validity; every prior artifact's `Trajectory acknowledged` section names the locked invariants; no acceptance criterion is unverified by a test reference. Failures block merge.

## Why this matters

**Locked-on-write matches the rocket-trajectory metaphor literally.** A rocket's trajectory is computed and committed at launch; mid-flight you do attitude-control corrections, not trajectory rewrites. Letting any later agent silently mutate a §1–5 invariant would mean the trajectory is whatever the most recent agent thought it was — exactly the failure mode this protocol prevents.

**Append-only amendments preserve provenance without rigidity.** Real features discover real things during build. The protocol must permit "@Planner found a dependency @Intake missed; we add it" without permitting "@Planner found a constraint inconvenient; we drop it." Amendments-as-additions split that hair.

**Mandatory read + acknowledgement section make discipline auditable.** The skill encoding ensures the LLM literally cannot skip the read. The `Trajectory acknowledged` section in every artifact means a human reviewer can inspect any artifact and see, mechanically, whether the agent reasoned about the trajectory.

## Where to read more

- **The TRAJECTORY.md template** (the schema in detail): [`core/templates/TRAJECTORY.md`](../../core/templates/TRAJECTORY.md)
- **The trajectory-protocol encoding for agents**: [`core/skills/bifrost-system-context/SKILL.md`](../../core/skills/bifrost-system-context/SKILL.md) §"Your first action: read TRAJECTORY.md" + §"Acknowledge the trajectory in every artifact"
- **`@Intake`'s authoring discipline**: [`core/agents/templates/Intake_Template.md`](../../core/agents/templates/Intake_Template.md)
- **Mid-flight gap discovery (when a locked invariant turns out wrong)**: [`core/agents/templates/CodeGen_Template.md`](../../core/agents/templates/CodeGen_Template.md) §"Mid-flight gap discovery", [`core/agents/templates/QA_Template.md`](../../core/agents/templates/QA_Template.md) §"Mid-flight trajectory abort path"
