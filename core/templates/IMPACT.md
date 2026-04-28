<!--
IMPACT.md — @Intake's analytical output. The "scope impact analysis."

Bound by:
  - bifrost-system-context (gap-detection step + Trajectory acknowledged)
  - bifrost-hr §Step 4 (the proposal block lives here, before TRAJECTORY locks)
  - ADR-006 §Decision (lifecycle artifact)
  - ADR-008 §3 (Trajectory acknowledged section required)
  - bifrost-graphify-ref (lookup-before-invention)

DISTINCT FROM TRAJECTORY.md
  TRAJECTORY captures LOCKED INVARIANTS (what must hold; immutable post-write).
  IMPACT captures REVISABLE ANALYSIS (what's affected; how; with what risk).
  Don't put acceptance criteria here — those go in TRAJECTORY §3.
  Don't put hard constraints here — those go in TRAJECTORY §2.
  Do put the *exploration* @Intake did to derive those locked invariants.

WHEN @INTAKE WRITES THIS
  After reading PATIENT.md + the knowledge layer + PROJECT_CONTEXT.md.
  BEFORE TRAJECTORY locks (so amendments and the bifrost-hr proposal — if any —
  can be discussed against the analysis without bumping a locked file).
  Section "1. Scope summary" reflects what TRAJECTORY §1 will lock.

HYDRATION
  {{PROJECT_NAME}} from interview. Everything else is @Intake's authoring.
-->

# IMPACT.md — Scope Impact Analysis

Feature: {{PROJECT_NAME}}
Author: @Intake
Date: <ISO-8601>

---

## 1. Scope summary

<!--
@Intake: one or two paragraphs paraphrasing PATIENT.md §1 in your own words.
What is being built and what bounds it. This is your read of Product's intent;
ambiguity here surfaces in §6 Open questions.
-->

## 2. APIs touched

<!--
@Intake: every backend endpoint this feature will call (consumed) or require
(does-not-yet-exist). Format per row:
  - api.<domain>.<endpoint>() — <verb> <path> — <existing | needs-creation> — <evidence>

The bifrost-graphify-ref skill drives this lookup: check libs/commonlib/src/lib/constants/api.ts
(today) or knowledge/API_CONTRACTS.md (when seeded). For "needs-creation" entries,
add the endpoint to TRAJECTORY §2 as a blocking dependency.
-->
- ...

## 3. Components touched

<!--
@Intake: every UI component this feature creates, modifies, or reuses.
Existing components from libs/commonlib must come from knowledge/COMPONENT_LIBRARY.md.
New components must be flagged here so @Reviewer documents them in HANDOFF.

Format per row:
  - <selector or path> — <new | modified | reused> — <evidence>
-->
- ...

## 4. State management touched

<!--
@Intake: every NgRx slice this feature creates, modifies, or reads.
Reference bifrost-state-management Section B for patterns.

Format per row:
  - <store name> — <new | modified | read-only> — actions: [...] reducers: [...] selectors: [...] effects: [...]
-->
- ...

## 5. Data flow

<!--
@Intake: a short narrative of how data moves through this feature.
- User action → form / interaction → component event handler
- Component → service call → HTTP via api.<domain>.<endpoint>()
- Response → adapter → model → store (if applicable)
- Store → selector → component template → render

This isn't ASCII art for its own sake; it's the trace @CodeGen will walk
when generating the code. If the trace is unclear, the code will be too.
-->
...

## 6. Edge cases

<!--
@Intake: failure modes and unusual paths. Each entry: what could happen,
who handles it, what the right behavior is.

Common categories: empty data, logged-out user, network timeout, server
error (5xx), race conditions, browser back, page refresh, very long input,
unicode/i18n, mobile-only / desktop-only differences.

Each edge case here translates into at least one @QA test scenario.
-->
- ...

## 7. Dependencies

<!--
@Intake: external dependencies this feature requires (other features,
infrastructure, data migrations, third-party services).

Each entry: what + status (exists / in-flight / not-yet-started) + owner.

Anything truly blocking goes in TRAJECTORY §2 (Hard constraints / Blocking
dependencies). Soft dependencies — nice-to-haves, related work, awareness
items — stay here.
-->
- ...

## 8. Risks

<!--
@Intake: what could make this feature fail to ship or fail in production.
Each entry: risk, likelihood (low/medium/high), mitigation.

Mitigations that are "we will do X" become tasks in @Planner's PLAN.md.
Mitigations that are "we accept this risk" need to be visible to Backend
in HANDOFF.md.
-->
- ...

## 9. Recommendations

<!--
@Intake: anything else Product / Backend should consider before approving
this scope. Suggested phasing, related features to align with, naming
choices that might collide elsewhere, etc.

Optional. Often empty.
-->
- ...

---

## bifrost-hr proposal

<!--
RESERVED SLOT — populated by @Intake ONLY when gap detection (per
bifrost-system-context §"Gap detection" + bifrost-hr) finds a domain
the existing skill set doesn't cover.

Format when populated (per bifrost-hr §Step 4):

  ## bifrost-hr proposal

  **Gap detected:** <one paragraph>
  **Decision:** <extend `<skill-name>`> | <fork new skill `bifrost-<name>`>
  **Why this and not the alternative:** <one paragraph>
  **What the new skill covers (or what gets added):**
  - ...
  **Loaded by:** <list of agents>
  **Draft:** <link or inline>
  **On approval:** I will commit core/skills/<new-name>/SKILL.md, register
  hydration keys, update bifrost-system-context's matrix, then lock TRAJECTORY.
  **Awaiting user approval.**

@Intake STOPS after writing this block. Do not lock TRAJECTORY. Resume only
after user approves (and @Intake commits the new skill) or modifies/rejects.

If no gap was detected, leave this block as the placeholder below.
-->

*(no proposal — existing skill set covers this feature's domain)*

---

## Trajectory acknowledged

<!--
Required per ADR-008 §3. @Intake's IMPACT.md is the FIRST artifact authored
in the lifecycle, so this section is forward-looking: it lists what TRAJECTORY
will lock once @Intake commits to it. After TRAJECTORY locks, this section
remains as evidence of @Intake's authoring intent.

If a bifrost-hr proposal is pending, set "Status: paused — bifrost-hr proposal
awaiting user approval".
-->
- **Sections to be locked in TRAJECTORY:** §1 Feature identity, §2 Hard constraints, §3 Acceptance criteria, §4 Architectural decisions, §5 External context
- **Amendments added:** none (TRAJECTORY not yet locked)
- **Conflicts surfaced:** none
- **Status:** active — about to lock TRAJECTORY
