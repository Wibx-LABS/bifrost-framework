<!--
PLAN.md — @Planner's task breakdown.

Bound by:
  - bifrost-system-context (PLAN.md tasks tagged with respected trajectory invariants)
  - ADR-006 §Decision (5–10 concrete tasks, lifecycle artifact)
  - ADR-008 §4 (handoff contract: @Planner reads TRAJECTORY + IMPACT, produces PLAN)
  - bifrost-code-standards (tasks must produce conformant code)

WHEN @PLANNER WRITES THIS
  After /bifrost:plan is invoked, after reading TRAJECTORY.md + IMPACT.md.
  Tasks must respect every locked invariant in TRAJECTORY §1–5; any task
  that would violate one is rejected at planning time, not at QA time.

HYDRATION
  {{PROJECT_NAME}} from interview. {{SCOPE_SUMMARY}} pulled from IMPACT.md §1
  (placeholder; @Planner can replace with their own one-paragraph framing).
-->

# PLAN.md — Task Breakdown

Feature: {{PROJECT_NAME}}
Author: @Planner
Date: <ISO-8601>
Phase: Planning

---

## Summary

{{SCOPE_SUMMARY}}

<!--
@Planner: one paragraph framing the implementation approach. What's the order,
what's the unit of delivery, why this sequence and not another. The TRAJECTORY
acceptance criteria (§3) define done; this paragraph defines the path.
-->

---

## Phases and tasks

<!--
@Planner: 5–10 tasks, organized into phases. Each task is 30–60 minutes of
@CodeGen work. Each task respects specific TRAJECTORY invariants.

REQUIRED PER-TASK SCHEMA:
  - **Task <N>:** <verb-phrase what gets done>
    - **Estimate:** <minutes>
    - **Depends on:** <Task numbers, or "none">
    - **Trajectory respects:** §<N>.<bullet> <one-line restatement of which locked invariant this task respects>
                               §<N>.<bullet> <another, if applicable>
    - **Skill(s) loaded:** <e.g., bifrost-component-gen, bifrost-api-integration>
    - **Output:** <file paths, action verbs — what @CodeGen will produce>
    - **Autonomy:** <inherits from STATE.md autonomy field, OR override here with reason>

Tasks that respect zero trajectory invariants are red flags — either the task
isn't necessary, or TRAJECTORY is missing an invariant that should have been
captured. Either way, escalate before proceeding.
-->

### Phase 1: <name>

- **Task 1:** ...
  - **Estimate:** 30 min
  - **Depends on:** none
  - **Trajectory respects:** §<N>.<bullet> ...
  - **Skill(s) loaded:** ...
  - **Output:** ...
  - **Autonomy:** inherits

- **Task 2:** ...
  - **Estimate:** ...
  - **Depends on:** Task 1
  - **Trajectory respects:** ...
  - **Skill(s) loaded:** ...
  - **Output:** ...
  - **Autonomy:** inherits

### Phase 2: <name>

- **Task 3:** ...
- ... and so on

---

## Approval gates

<!--
@Planner: which task(s) require an approval gate before @CodeGen can proceed?
Default: every task (Task-Gated autonomy). Override here when grouping tasks
under a single approval makes sense (Phase-Gated) or removing approvals (Full).

The autonomy level set in STATE.md frontmatter determines the default; this
section can locally override per-task if a feature mixes levels.
-->

- Default: per `STATE.md` `autonomy:` field (currently: Task-Gated)
- Overrides: *(none, or list per-task)*

---

## Validation plan

<!--
@Planner: what @QA will validate at the end. Each TRAJECTORY §3 acceptance
criterion (MUST/SHOULD/MAY) maps to specific tests here. This is the bridge
to QA_REPORT.md's scenario coverage.
-->

- **Unit tests:** ...
- **E2E scenarios:** ...
- **Performance checks:** ...
- **Accessibility checks:** ...
- **API-contract validation:** ...

---

## Open questions and assumptions

<!--
@Planner: anything that's still ambiguous about the plan, or assumptions that
should be validated before @CodeGen executes. Differs from IMPACT §6 — that
was about the scope; this is about the plan to execute it.

If an assumption proves wrong mid-build, the trajectory-abort pattern (ADR-008)
applies: Hard Stop, escalate, re-run @Intake or revise PLAN.
-->

- ...

---

## Trajectory acknowledged

<!--
Required per ADR-008 §3. List which TRAJECTORY sections this PLAN respects,
plus any amendment @Planner added (rare; if PLAN-time discovery surfaces a
constraint TRAJECTORY missed, an amendment goes via the trajectory-amendment
pattern in TRAJECTORY §6, NOT silently here).
-->

- **Sections respected:** §1 Feature identity, §2 Hard constraints, §3 Acceptance criteria, §4 Architectural decisions, §5 External context
- **Amendments added:** none
- **Conflicts surfaced:** none
- **Per-task tagging coverage:** every task above names at least one §<N>.<bullet> it respects
