---
name: bifrost-efficiency
description: Guidelines for maximizing developer productivity, minimizing token usage, and ensuring perfect product-to-dev transfer. Use this skill when you are @CodeGen writing code, @Planner breaking down tasks, or any agent performing repeated iterations. Focus on "The Gold"—the value transfer from Product output to Frontend input.
---

# bifrost-efficiency — Context, Prompt & Harness Engineering

This skill defines the operational standards for efficiency within the Bifrost framework. To minimize "re-dos" and token waste, we employ a three-pillar engineering strategy.

---

## 1. Context Engineering (Precision Injection)

Context is the "world" the agent sees. Poor context leads to "re-dos" and hallucinations.

- **Targeted Hydration Only**: Never load the entire knowledge base. Use the domain-filtered `{{api-contracts}}` and `{{component-library}}` injected by the harness.
- **Lookup-Before-Invention**: Before creating a new file or symbol, query the existing source via `bifrost-graphify-ref`. If a 10-line utility exists, reusing it saves 1,000 tokens of "reinventing the wheel."
- **Context Trimming**: If a knowledge file is >20KB, read only the relevant sections. Do not `cat` files just to "see what's in them." Use `grep` or `list_dir` first.

---

## 2. Prompt Engineering (Directive Discipline)

Prompts must be binary and evidence-based, not conversational.

- **Negative Constraints**: Explicitly name what NOT to do (e.g., "Do not use third-party UI libs," "Do not edit files outside PLAN.md §Output").
- **Evidence-Based Actions**: Every proposal (in IMPACT.md or PLAN.md) must cite a specific line in the Knowledge Layer or the existing Source Tree. "Vibes-based" planning is a failure mode.
- **Protocol Citations**: When writing code, cite the TRAJECTORY §4 decision that binds the line. This prevents mid-flight re-litigation of architectural choices.

---

## 3. Harness Engineering (Structural Guardrails)

The harness is the Bifrost CLI and state management system. It protects the session from drift.

- **Law of the State**: If it isn't in `STATE.md`, it doesn't exist. The harness validates that every agent signal is recorded.
- **Loop Detection**: If you fail the same CI check or Test twice, **Hard Stop**. Do not attempt a third automated fix. Escalate to the user. A 10-token question is cheaper than a 100,000-token hallucination loop.
- **Token Budget Awareness**: Monitor your own session's token footprint. If a single phase (e.g., @Planner) is exceeding historical averages, simplify the scope or split the feature.

---

## 4. Product-to-Dev Transfer (The Gold)

"The Gold" is the high-fidelity transfer of requirements into code without "telephoning" the intent.

- **Must → Task → Test**: Every "Must-Have" in `PATIENT.md` must map to exactly one Task in `PLAN.md` and exactly one Test in `QA_REPORT.md`. This 1:1:1 mapping ensures zero context loss.
- **Zero-Ambiguity Handoff**: At the intake gate, if a requirement is "vague," do not proceed. Rework at the intake phase costs minutes; rework at the build phase costs hours.

---

## 5. Automation Benchmarks (KPI Targets)

Every agent session should aim for these benchmarks to maintain framework health:

- **Intake Phase**: < 15 Minutes.
- **Planning Phase**: < 20 Minutes.
- **Build (Scaffold)**: < 10 Minutes.
- **Success Rate**: > 80% first-pass pass rate for standard domain features.

## 6. The "Thin Agent" Law (Instruction Hygiene)

To prevent "Context Suffocation" and minimize token usage:

1.  **Monitor Context Density**: Aim for an `averageContextDensity` < 0.6 in your STATE.md metrics. If > 80% of your window is documentation/instructions, you are at high risk of forgetting the feature invariants.
2.  **Lazy Skill Loading**: Do not load complex skills unless you are explicitly touching those files. Start "Thin" and request the skill block when needed.
3.  **Redo Analysis**: If `metrics_redos` > 2 for a single task, **Hard Stop**. Do not keep trying the same fix. Analyze if the instruction noise is causing the failure.
4.  **Distillation**: Prefer a 10-line summary of a knowledge file over reading the whole 100-line file. High-fidelity distillation is a core efficiency skill.

---

## When in doubt

- **Ask the user.** A 10-token question is the ultimate token-saving device.
- **Read the Trajectory.** It is your "Long-Term Memory" for this feature.
- **Trust the Harness.** If `STATE.md` says a task is blocked, it is blocked.
