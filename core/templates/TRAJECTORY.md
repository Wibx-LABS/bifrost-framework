<!--
TRAJECTORY.md — locked-at-launch invariant store for one feature.

Bound by ADR-008 (Trajectory-context protocol). See:
  instructions/decisions/ADR-008-trajectory-context-protocol.md

CRITICAL RULES:
  1. Sections 1–5 are LOCKED ON WRITE. Once @Intake finalizes /bifrost:start,
     no agent (including @Conductor, @Monitor, or a re-running @Intake) may
     mutate them in place.
  2. Section 6 is APPEND-ONLY. Later agents add invariants here when they
     discover them; they cannot soften or contradict existing ones.
  3. If a later agent finds a locked invariant wrong: HARD STOP, escalate to
     user, require @Intake re-run with schema_version+1. Old TRAJECTORY is
     preserved as TRAJECTORY.v<n-1>.md for provenance.
  4. Every other agent reads this file FIRST on every wake (before STATE.md,
     before PATIENT.md, before any other artifact). Encoded in the
     bifrost-system-context skill.
  5. Every artifact every agent writes must contain a `## Trajectory
     acknowledged` section listing the section numbers respected and any
     amendment added.

Hydration:
  - {{FEATURE_ID}}, {{PROJECT_NAME}}, {{TARGET_APP}}, {{TECH_STACK_LOCK}},
    {{SECURITY_BOUNDARIES_DEFAULT}}, {{PERF_BUDGETS_DEFAULT}} are filled by
    bifrost-init from the interview answers + knowledge/ files.
  - Everything else is filled by @Intake during /bifrost:start.
-->

---
feature_id: {{FEATURE_ID}}
project_name: {{PROJECT_NAME}}
target_app: {{TARGET_APP}}
unit_of_delivery: TBD
size: TBD
locked_at: TBD
locked_by: "@Intake"
schema_version: 1
trajectory_status: draft
---

# TRAJECTORY.md: Locked-at-launch invariants

Feature: {{PROJECT_NAME}}

<!--
  unit_of_delivery: one of [single-PR, feature-branch-multi-PR]
  size: one of [S, M, L]   (S ≤ 1 day, M = 1–3 days, L > 3 days)
  locked_at: ISO-8601 timestamp set by @Intake at /bifrost:start completion
  trajectory_status: one of [draft, locked, aborted-superseded]
    - draft   : @Intake is still authoring; sections 1–5 mutable
    - locked  : @Intake completed; sections 1–5 immutable
    - aborted-superseded : a later agent Hard-Stopped; this version is
                           replaced by TRAJECTORY.md schema_version+1
                           and this file is renamed TRAJECTORY.v<n>.md
-->

## 1. Feature identity        <!-- LOCKED on write -->

- **Name:** {{PROJECT_NAME}}
- **Scope statement:**
  <!-- @Intake: one paragraph, no hedging. What is being built and what bounds it? -->

- **In-scope (binary):**
  <!-- @Intake: each item a complete sentence stating something this feature DOES. -->
  - ...
  - ...

- **Out-of-scope (binary):**
  <!-- @Intake: each item states something this feature does NOT do, even if asked.
       The list is the contract: anything not here may be in scope; anything here is not. -->
  - ...
  - ...

## 2. Hard constraints        <!-- LOCKED on write -->

- **Tech stack lock:** {{TECH_STACK_LOCK}}
  <!-- @Intake: append feature-specific stack constraints if any (e.g. "must use
       existing NgRx store, no new state libraries"). -->

- **Security boundaries:** {{SECURITY_BOUNDARIES_DEFAULT}}
  <!-- @Intake: append feature-specific (auth model, data classification, PII handling). -->

- **Performance budgets:** {{PERF_BUDGETS_DEFAULT}}
  <!-- @Intake: append feature-specific (LCP, bundle delta, API latency targets). -->

- **Blocking dependencies:**
  <!-- @Intake: other features, infra, data migrations, external APIs that MUST
       exist before this ships. Each item: what + status + owner. -->
  - ...

- **Must-not-break:**
  <!-- @Intake: existing flows, contracts, or user-visible behavior this feature
       must preserve. Each item: name + how to verify it still works. -->
  - ...

## 3. Acceptance criteria     <!-- LOCKED on write -->

<!-- @Intake: each criterion is concrete, testable, in priority order.
     Priority MUST | SHOULD | MAY. Each criterion names what artifact verifies it. -->

- **MUST:** <!-- criterion -->
  - **Verified by:** <!-- e.g. @QA test "search-returns-results", or CI check "bifrost-validate api-calls" -->
- **MUST:** <!-- criterion -->
  - **Verified by:** <!-- ... -->
- **SHOULD:** <!-- criterion -->
  - **Verified by:** <!-- ... -->
- **MAY:** <!-- optional criterion -->
  - **Verified by:** <!-- ... -->

## 4. Architectural decisions <!-- LOCKED on write -->

<!--
@Intake: each decision is a choice that bounds downstream design.
Format per decision: statement + rationale + alternatives ruled out.
Examples:
  - Decision: "Search state lives in NgRx, not local component state."
    Rationale: "Shared with shopping app's results table component."
    Ruled out: "Local @Input/@Output (would force prop drilling across 4 levels)."
  - Decision: "Extends /api/search/query, does not create /api/search/v2."
    Rationale: "Backwards compat with existing consumers (account, business)."
    Ruled out: "New endpoint (would force migration burden on 3 callers)."
-->

- **Decision:** <!-- statement -->
  - **Rationale:** <!-- why this over alternatives -->
  - **Alternatives ruled out:** <!-- what was considered and rejected -->

- **Decision:** <!-- ... -->
  - **Rationale:** <!-- ... -->
  - **Alternatives ruled out:** <!-- ... -->

## 5. External context        <!-- LOCKED on write -->

- **Stakeholders / decision-makers:**
  <!-- @Intake: from PATIENT.md + clarification. Who must approve, who must be informed. -->
  - **Owner (Product):** ...
  - **Reviewer (Backend):** ...
  - **Other approvers:** ...

- **Deadlines:**
  <!-- Each: date + binding | soft. -->
  - ...

- **Related features:**
  - **In flight:** <!-- features being built in parallel that share concerns -->
  - **Recently shipped:** <!-- features whose code/contracts this depends on -->
  - **Blocked by this:** <!-- features waiting for this to ship -->

- **Prior incidents this feature must not re-introduce:**
  <!-- @Intake: from knowledge/GOTCHAS.md or PATIENT.md. Each: brief description + link/reference. -->
  - ...

## 6. Amendments log          <!-- APPEND-ONLY -->

<!--
Later agents add invariants here when they discover them. Each amendment:
  - timestamp (ISO-8601)
  - agent (e.g. @Planner, @CodeGen, @QA)
  - section_ref (which of sections 1–5 this extends — e.g. "§2 Hard constraints")
  - addition (the new invariant; must ADD, never soften)
  - reason (why this is being added now and not earlier — usually "discovered during X")

To MUTATE a locked invariant in sections 1–5: HARD STOP. Escalate to user.
Amendments cannot contradict; only extend.

Format:
  ### YYYY-MM-DDTHH:MM:SSZ — @AgentName — §<n> <Section name>
  - **Addition:** ...
  - **Reason:** ...
-->

<!-- (Empty at /bifrost:start completion. Append entries below this line.) -->

---

## Trajectory acknowledged

<!--
@Intake: at /bifrost:start completion, declare the lock.
Set trajectory_status in frontmatter to "locked" and locked_at to the timestamp.
-->

- **Authored by:** @Intake
- **Sections locked:** 1, 2, 3, 4, 5
- **Amendments included:** (none — fresh trajectory)
- **Status:** locked
