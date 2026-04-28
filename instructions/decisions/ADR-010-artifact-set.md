# ADR-010: Artifact set refinement — HEALTH deprecated, AUTONOMY folds into STATE frontmatter

**Status:** accepted

## Decision

The canonical per-feature artifact set is **10 artifacts**, refined from earlier framing. Two changes:

1. **`HEALTH.md` is deprecated.** Acceptance criteria live exclusively in TRAJECTORY.md §3 (per [ADR-008](ADR-008-trajectory-context-protocol.md)). Test-level pass criteria — concrete coverage targets, performance budgets, accessibility thresholds — live in `bifrost-qa-validator`'s skill body and in `QA_REPORT.md`. No standalone HEALTH.md file.

2. **`AUTONOMY.md` folds into `STATE.md` frontmatter** as the `autonomy:` field:
   ```yaml
   ---
   id: <uuid>
   feature: <name>
   status: <enum>
   created: <iso>
   updated: <iso>
   autonomy: Task-Gated | Phase-Gated | Full
   framework_version: <semver>
   schema_version: 1
   ---
   ```

## The refined per-feature artifact set

| Artifact | Author | Purpose |
|---|---|---|
| `PATIENT.md` | Product (human) | Feature scope input |
| `TRAJECTORY.md` | `@Intake` | Locked invariants (per [ADR-008](ADR-008-trajectory-context-protocol.md)) |
| `IMPACT.md` | `@Intake` | Scope analysis + bifrost-hr proposal slot |
| `PLAN.md` | `@Planner` | Task breakdown w/ trajectory tagging |
| `STATE.md` | `@Conductor` | Execution state (incl. autonomy frontmatter) |
| `CODE_REVIEW.md` | `@CodeGen` | Self-review report |
| `QA_REPORT.md` | `@QA` | Test results + pass/fail verdict |
| `HANDOFF.md` | `@Reviewer` | Backend delivery summary |
| `VITALS.md` | `@Monitor` | Drift report (when drift detected) |
| `PROJECT_CONTEXT.md` | `bifrost-init` (one-time) | Per-project system prompt |

10 artifacts. Templates at [`core/templates/`](../../core/templates/).

## Rationale

**`HEALTH.md` had no remaining job after ADR-008.** Acceptance criteria — *what must hold for this feature to ship* — moved into TRAJECTORY §3 with explicit MUST/SHOULD/MAY priorities, each naming its verifying artifact. HEALTH.md's other candidate scope ("test-level pass criteria") is a *protocol* concern, not a feature-specific artifact concern. It belongs in `bifrost-qa-validator`'s body (where the rules are) and in `QA_REPORT.md` (where they're applied per-feature).

**`AUTONOMY.md`'s overhead exceeded its content.** A whole file for one value (the autonomy level) was anti-economical: extra hydration target, extra entry in STATE.md's Artifacts list, extra step every agent reads on wake. Folding into STATE.md frontmatter keeps the value first-class, visible alongside `status:` and `framework_version:`, and matches its mutability profile (the autonomy level can change mid-feature; STATE is the right home for mutable values; TRAJECTORY would be the wrong home).

## What this rules out

- Adding HEALTH.md or AUTONOMY.md back without an ADR superseding this one.
- A separate per-feature autonomy file under any other name.
- Putting acceptance criteria anywhere except TRAJECTORY §3.

## Where to read more

- **STATE.md schema (with the autonomy field)**: [`core/templates/STATE.md`](../../core/templates/STATE.md)
- **STATE.md operational protocol**: [`core/skills/bifrost-state-management/SKILL.md`](../../core/skills/bifrost-state-management/SKILL.md) §A
- **Acceptance criteria home (TRAJECTORY.md §3)**: [ADR-008](ADR-008-trajectory-context-protocol.md) §1 + [`core/templates/TRAJECTORY.md`](../../core/templates/TRAJECTORY.md)
- **Test-level pass criteria home**: [`core/skills/bifrost-qa-validator/SKILL.md`](../../core/skills/bifrost-qa-validator/SKILL.md)
