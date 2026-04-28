<!--
STATE.md — execution state for one feature. Single source of truth.

Bound by:
  - bifrost-state-management Section A (schema, update cadence, validation)
  - ADR-006 §Decision §1 (lifecycle artifact set, original framing)
  - ADR-008 (Trajectory acknowledged section requirement)
  - ADR-010 (autonomy field absorbed into this frontmatter)

OWNERSHIP
  @Conductor owns this file. Other agents do NOT write here directly; they
  produce their phase artifacts, and @Conductor reflects what happened.

UPDATE CADENCE
  Update after EVERY:
    - phase completion (an agent finishes and writes its artifact)
    - Hard Stop (write to Blockers; set the blocker)
    - approval gate decision (user approved / rejected)
    - new commit on the feature branch
    - trajectory amendment (cross-reference here)
    - skill bootstrap via bifrost-hr (note in Decisions + Artifacts)

  The cost of one extra write is microseconds; the cost of an outdated
  STATE.md is hours of forensics. Update eagerly.

VALIDATION (pre-commit hook + bifrost-validate state in CI)
  Frontmatter completeness; status enum valid; timestamps monotonic;
  Artifacts list resolves; Commits resolve; no duplicate Timeline entries;
  Trajectory acknowledged section present.

HYDRATION
  {{ID}}, {{PROJECT_NAME}}, {{STATUS}}, {{CREATED}}, {{VERSION}} are filled
  by bifrost-init at /bifrost-init time. Everything else is filled or
  updated by @Conductor through the feature's life.
-->

---
id: {{ID}}
feature: {{PROJECT_NAME}}
status: {{STATUS}}
created: {{CREATED}}
updated: {{CREATED}}
autonomy: Task-Gated
framework_version: {{VERSION}}
schema_version: 1
---

# STATE.md — {{PROJECT_NAME}}

<!--
status enum (per bifrost-state-management §A):
  pending   — feature initialized, PATIENT.md being authored
  intake    — @Intake running /bifrost:start
  planning  — @Planner running /bifrost:plan
  coding    — @CodeGen running /bifrost:build
  qa        — @QA running /bifrost:qa
  review    — @Reviewer running /bifrost:deliver
  merged    — Backend merged the PR; feature shipped
  aborted   — feature halted (trajectory abort, scope cancellation, kill-switch)

autonomy enum (per ADR-010 — moved from AUTONOMY.md to this frontmatter):
  Task-Gated  — approval before each task (default)
  Phase-Gated — approval per phase
  Full        — autonomous

A status transition updates BOTH `status:` (frontmatter) AND the Phase section below.
@Conductor must update the `updated:` timestamp on every write.
-->

## Phase

<!-- Current phase + agent + started-at + (if applicable) blocked-on. -->
- **Current:** pending — awaiting PATIENT.md authoring by Product
- **Started at:** {{CREATED}}
- **Blocked on:** —

## Timeline

<!--
Append-only chronological log. Each entry:
  - <ISO-8601> — @Agent — <event> (refs: <artifact or short-sha>)
Never delete entries; never reorder; never edit past entries.
-->
- `{{CREATED}}` — bifrost-init — feature initialized; STATE.md and template artifacts hydrated under .bifrost/

## Artifacts

<!--
List every file under .bifrost/ that exists, with the agent that produced it.
Format: `- <Filename> (<author>, <event-summary>)`
Keep up to date as artifacts are produced.
-->
- PATIENT.md (Product, awaiting authoring)
- *(other artifacts will appear here as agents produce them)*

## Decisions

<!--
Operational decisions made during this feature that aren't in TRAJECTORY.md.
TRAJECTORY captures locked architectural decisions; STATE captures operational
ones — "deferred test X to follow-up PR", "switched task order because of
dependency on @Y feature."

If a decision is large enough to warrant a TRAJECTORY amendment or a new ADR,
do that instead of inflating this section.
-->
*(none yet)*

## Blockers

<!--
Open issues that prevent forward motion. Each:
  - who: <agent or human>
  - blocked-on: <what they need>
  - raised: <ISO-8601>

When resolved, MOVE the entry to Timeline as `(blocker resolved at <ts>)` and
remove it from this section.
-->
*(none)*

## Next Actions

<!--
What @Conductor expects to happen next. 1–3 items, ordered. Updated on every
phase transition.
-->
1. Edit `.bifrost/PATIENT.md` with the feature scope.
2. Run `/bifrost:start` to invoke @Intake.

## Commits

<!--
Git commits made during this feature. Each:
  - <short-sha> — <conventional-commit-subject>
The pre-commit hook validates that every short-sha listed here exists in
`git log --oneline`.
-->
*(none yet)*

---

## Trajectory acknowledged

<!--
Required per ADR-008 §3. @Conductor maintains this section reflecting the
locked invariants from .bifrost/TRAJECTORY.md and any amendments added.
At pending status (before @Intake locks TRAJECTORY), this section reads "n/a — TRAJECTORY not yet locked".
-->
- **Sections respected:** n/a — TRAJECTORY not yet locked
- **Amendments added:** none
- **Conflicts surfaced:** none
