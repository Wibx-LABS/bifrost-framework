<!--
STATE.md — execution state for one feature. Single source of truth.
-->

---
id: {{id}}
feature: {{project-name}}
status: {{status}}
created: {{created}}
updated: {{created}}
autonomy: Task-Gated
framework_version: {{version}}
token_budget: {{token-budget}}
token_usage: 0
metrics_turns: 0
metrics_redos: 0
metrics_density: 0
schema_version: 1
---

# STATE.md — {{project-name}}

## Phase
- **Current:** pending — awaiting PATIENT.md authoring by Product
- **Started at:** {{created}}
- **Blocked on:** —

## Timeline
- `{{created}}` — bifrost-init — feature initialized; STATE.md and template artifacts hydrated under .bifrost/

## Artifacts
- PATIENT.md (Product, awaiting authoring)

## Decisions
*(none yet)*

## Blockers
*(none)*

## Next Actions
1. Edit `.bifrost/PATIENT.md` with the feature scope.
2. Run `/bifrost:start` to invoke @Intake.

## Commits
*(none yet)*

---

## Trajectory acknowledged
- **Sections respected:** n/a — TRAJECTORY not yet locked
- **Amendments added:** none
- **Conflicts surfaced:** none
