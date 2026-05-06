# Superpowers Usage in Bifrost

Bifrost is designed to work seamlessly with or without the Superpowers plugin. When the plugin is installed, it enhances the framework's UX by providing guided scaffolding for planning and execution.

## Supported Commands

If you have the Superpowers plugin installed, you can leverage the following commands within Bifrost workflows:

### 1. `/brainstorming [feature]`
**Agent:** @Planner / @Intake
**Phase:** Planning
**Purpose:** Scaffolds the Brainstorming Protocol (Phase 1-2). 
The plugin will guide you through clarifying requirements, exploring trade-offs, and locking in acceptance criteria before moving to task breakdown. This ensures rigorous upfront planning before writing code.

### 2. `/execute-plan [feature]`
**Agent:** @CodeGen / @Reviewer
**Phase:** Execution / Code Review
**Purpose:** Scaffolds the Execution Batching Protocol and enforces TDD Discipline.
The plugin will help break down the implementation into logical code review checkpoints (batches). It also reinforces the Red-Green-Refactor cycle, reminding the Reviewer to verify that tests fail before the implementation passes.

---

## Fallback (Without Plugin)

If the Superpowers plugin is unavailable, the Bifrost framework maintains the exact same discipline manually:

- **Planning:** The @Planner agent strictly follows the 5-phase `BRAINSTORMING PROTOCOL` checklist defined in its template, outputting a highly structured `PLAN.md`.
- **Execution:** The @CodeGen agent manually adheres to the `EXECUTION BATCHING PROTOCOL` rule (e.g., 1-3 files, ≤500 LOC per batch).
- **Review:** The @Reviewer agent manually enforces the `TDD DISCIPLINE` gates (rejecting batches that skip the red phase).

The core framework remains fully independent while supporting UX enhancements when the plugin is present.
