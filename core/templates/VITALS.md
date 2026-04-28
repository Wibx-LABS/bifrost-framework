<!--
VITALS.md — @Monitor's drift report. Written when drift is detected; absent otherwise.

Bound by:
  - bifrost-system-context (lifecycle map; @Monitor's role + output)
  - ADR-006 §Decision §1 (always-on agent; emits VITALS on drift)
  - ADR-008 §5 (TRAJECTORY drift = source-tree change violating sections 2–3 invariants)
  - ADR-010 (canonical 10-artifact set; VITALS is the @Monitor output)

WHAT @MONITOR CHECKS (per wake)
  - STATE.md syntax + cross-reference integrity (artifacts list resolves; commits resolve; timestamps monotonic)
  - PLAN.md tasks ↔ source tree (every task marked complete has corresponding code)
  - Source tree ↔ TRAJECTORY hard constraints (no source change violates §2–3)
  - Git history ↔ STATE.md commits section (no untracked commits)

WHEN VITALS.md EXISTS
  Only when drift was detected. A clean wake produces no file. The presence
  of VITALS.md in .bifrost/ is itself a signal: @Conductor reads it and updates
  STATE.md Blockers accordingly.

HYDRATION
  {{PROJECT_NAME}} from interview. Everything else @Monitor fills in.
-->

# VITALS.md — Drift Report

Feature: {{PROJECT_NAME}}
Author: @Monitor
Date: <ISO-8601 wake timestamp>
Status: <!-- HEALTHY (clean wake; this file should not exist if so) | DRIFT_DETECTED -->

---

## 1. STATE.md validation

<!-- @Monitor: check the structural integrity of STATE.md. -->

- **Syntax:** ✓ / ✗ <YAML frontmatter valid; required fields present>
- **Status enum:** ✓ / ✗ <`status:` is one of the allowed values>
- **Timestamps:** ✓ / ✗ <Timeline timestamps monotonic; no backwards travel>
- **Artifacts list resolves:** ✓ / ✗ <every file referenced exists in .bifrost/>
- **Commits resolve:** ✓ / ✗ <every short-sha exists in `git log`>
- **Trajectory acknowledged section:** ✓ / ✗ <present and aligned with TRAJECTORY's locked state>

## 2. PLAN ↔ source tree alignment

<!--
@Monitor: every task marked complete in PLAN.md or in STATE.md Timeline must
have corresponding code. Conversely, every source change in this feature's
branch must be traceable to a task.
-->

- **Tasks marked complete with no corresponding code:** <list, or "none">
- **Source changes with no corresponding task:** <list, or "none">

## 3. TRAJECTORY drift (the load-bearing check)

<!--
@Monitor: per ADR-008 §5, every wake checks the source tree against TRAJECTORY
sections 2 (Hard constraints) and 3 (Acceptance criteria). Any source-tree
change that violates a locked invariant is drift.

Common categories:
  - Added a dependency that violates §2 (Tech stack lock).
  - Added code that bypasses §2 (Security boundary, e.g., reads token outside
    LocalStorageService, or makes HTTP without going through ErrorHandlingService).
  - Performance regression — bundle size delta exceeds budget, or a flagged
    perf-sensitive path got slower.
  - Removed or weakened a behavior listed in §2 (Must-not-break).
  - Code path that no longer satisfies a §3 MUST acceptance criterion.
-->

- **Constraint violations (§2):** <list with file:line + which §2 invariant is violated, or "none">
- **Acceptance criteria gaps (§3):** <list with which MUST/SHOULD criterion is not currently satisfied, or "none">
- **Out-of-scope additions (§1):** <list with file:line of code that does something §1 excludes, or "none">

## 4. Git validation

<!-- @Monitor: branch hygiene. -->

- **Commit message style:** ✓ / ✗ <conventional-commit subject style; no `wip` or empty messages>
- **No uncommitted changes:** ✓ / ✗ <`git status` clean if @CodeGen says it finished>
- **Branch is up-to-date with main:** ✓ / ✗ <or rebase needed>

## 5. Issues

<!--
@Monitor: synthesized list of every issue surfaced above. Each entry: severity
(critical / major / minor) + the section it came from + recommended action.

Critical = trajectory abort candidate. Escalate to user via Hard Stop.
Major = block the next phase transition until resolved.
Minor = noted; @Conductor adds to STATE Decisions or PLAN; doesn't block.
-->

### Critical
- *(none, or list with full description and recommended action)*

### Major
- *(none, or list)*

### Minor
- *(none, or list)*

---

## 6. Recommended action for @Conductor

<!--
@Monitor: what @Conductor should do based on this report.
Examples:
  - "Add Critical issue from §3 to STATE.md Blockers; halt current agent and Hard Stop."
  - "Add Major issue from §1 to STATE.md Blockers; @CodeGen must address before /bifrost:qa."
  - "Add Minor issue from §4 to STATE.md Decisions; no halt."
-->

...

---

## Trajectory acknowledged

<!--
Required per ADR-008 §3. @Monitor's acknowledgement is special: it's a read-and-
verify pass, not an authoring pass. The check itself IS the acknowledgement.
-->

- **Sections checked:** §1 Feature identity (out-of-scope additions), §2 Hard constraints (violations), §3 Acceptance criteria (gaps)
- **Amendments observed:** <list TRAJECTORY §6 amendments since last wake, or "none">
- **Conflicts surfaced this wake:** <list, or "none">
- **Drift severity:** <Critical | Major | Minor | None>
