# ADR-009: Agents fixed at 7; skills grow on demand via `bifrost-hr`

**Status:** accepted

## Context

Bifrost is narrower than FORGE. The seven lifecycle agents (`@Intake`, `@Planner`, `@CodeGen`, `@QA`, `@Reviewer`, `@Conductor`, `@Monitor`) cover the full feature lifecycle; adding more agents would expand the lifecycle surface (each new agent needs a place in it, has to load `bifrost-system-context`, has to define its artifact contract, has to integrate with `@Conductor`'s STATE.md updates and `@Monitor`'s drift checks). The dimension that realistically grows in Bifrost is **domain coverage** — new libraries, new patterns, new compliance regimes — not roles. Domain coverage maps cleanly to the **skill** abstraction: a skill is one markdown file with frontmatter and a body; declared, loaded, used.

## Decision

**Agents are fixed at 7.** Adding a new lifecycle agent requires an ADR superseding [ADR-006](ADR-006-feature-lifecycle.md). High bar; explicit override.

**Skills grow on demand via `bifrost-hr`.** A 9th skill, `bifrost-hr` (at [`core/skills/bifrost-hr/SKILL.md`](../../core/skills/bifrost-hr/SKILL.md)), bootstraps new skills when a domain gap is detected.

### How it works

1. **Loaded by `@Intake` only.** Gap detection happens during `/bifrost:start` — when `@Intake` reads PATIENT.md and the knowledge layer to lock TRAJECTORY.md, it checks whether the feature's domain is covered by the existing skill set. No other agent loads `bifrost-hr`; mid-flight gaps go through trajectory abort, not skill bootstrap.

2. **Gap detection criterion.** A "domain gap" is when PATIENT.md or knowledge-layer lookup surfaces patterns/libraries/concerns that none of the existing skills cover. Examples: a third-party SDK not in `knowledge/TECH_STACK.md`, a behavior class (real-time collaboration, video, payments) not in any skill's body, a compliance regime (HIPAA, PCI) not in `knowledge/GOTCHAS.md`. Borderline cases (a slightly new pattern in an existing domain) extend the closest existing skill rather than fork a new one — `bifrost-hr`'s first decision is "extend or fork."

3. **Bootstrap protocol.** When `@Intake` invokes `bifrost-hr`:
   - Evaluate: extend an existing skill, or fork a new one?
   - If new: draft the skill (frontmatter + body following Bifrost skill conventions).
   - Specify which agent(s) will load the new skill.
   - Specify hydration injection points if any.
   - Present the draft to the user with rationale (what gap, why new vs. extend, what the new skill covers, who loads it).
   - **Hard Stop for user approval.** Per Three Laws #3 ([ADR-008](ADR-008-trajectory-context-protocol.md)): roster changes have blast radius and require explicit user authorization. Until approved, `@Intake` does not lock TRAJECTORY.

4. **Permanent persistence.** Approved skills commit to `core/skills/<new-skill-name>/SKILL.md` as a framework change. Available for every future feature. Hydration keys added to `core/agents/hydration/injection-points.json`. Agent×skill matrix in `bifrost-system-context` updated.

5. **Mid-flight gaps abort, not adapt.** If `@Planner`, `@CodeGen`, `@QA`, or `@Reviewer` discover a gap that `@Intake` missed, they do **not** invoke `bifrost-hr`. They Hard Stop per the trajectory-abort pattern ([ADR-008](ADR-008-trajectory-context-protocol.md)): write `TRAJECTORY_AMENDMENT_PROPOSED` in the current artifact, escalate, user re-runs `@Intake`. `@Intake` on re-run picks up `bifrost-hr` if needed. This keeps the bootstrap discipline at one well-defined point in the lifecycle and avoids dramatic mid-build skill creation.

## What this rules out

- Mid-flight skill creation by `@Planner`, `@CodeGen`, `@QA`, `@Reviewer`.
- Per-feature ephemeral skills (skills that don't commit to the framework repo permanently).
- Autonomous skill creation without user approval.
- Adding new lifecycle agents to handle new domains (use a new skill; if the lifecycle genuinely needs to expand, write an ADR superseding ADR-006).

## Where to read more

- **The bifrost-hr skill (the bootstrap protocol in detail)**: [`core/skills/bifrost-hr/SKILL.md`](../../core/skills/bifrost-hr/SKILL.md)
- **The agent×skill matrix (canonical loaded-by mapping)**: [`core/skills/bifrost-system-context/SKILL.md`](../../core/skills/bifrost-system-context/SKILL.md) §"Skills you load depend on your role"
- **`@Intake`'s gap-detection step**: [`core/agents/templates/Intake_Template.md`](../../core/agents/templates/Intake_Template.md) §Step 3 + §Step 4.5
- **The trajectory-abort pattern (for mid-flight gaps)**: [ADR-008](ADR-008-trajectory-context-protocol.md) §"Mutability rules" — Trajectory abort
