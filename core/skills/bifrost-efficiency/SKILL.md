---
name: bifrost-efficiency
description: Guidelines for maximizing developer productivity, minimizing token usage, and ensuring perfect product-to-dev transfer. Use this skill when you are @CodeGen writing code, @Planner breaking down tasks, or any agent performing repeated iterations. Focus on "The Gold"—the value transfer from Product output to Frontend input.
---

# bifrost-efficiency

This skill defines the operational standards for efficiency within the Bifrost framework. As a Developer-First tool, every action must prioritize speed, cost-effectiveness (token usage), and high-fidelity implementation of Product requirements.

---

## 1. Token Discipline (Lowering Costs)

To minimize token usage while maintaining quality:

1.  **Context Precision**: Only read the files absolutely necessary for the current task. Do not `cat` large directories unless searching for a specific pattern.
2.  **Incremental Diffs**: When updating code, use targeted replacement tools (`replace_file_content`) instead of overwriting entire files.
3.  **Avoid Redundant Planning**: If the `PLAN.md` is already granular enough, do not generate additional "mini-plans" in the chat.
4.  **Concise Summaries**: Keep status updates and handoffs structured but brief. Use bullet points instead of prose.
5.  **Reuse Abstractions**: Before generating a new component or utility, query the Architecture Graph. Reusing 10 lines of code saves 1,000 tokens of "reinventing the wheel."

---

## 2. Speed to Implementation (Cutting Dev Time)

To deliver features 5x faster:

1.  **Boilerplate First**: Use `bifrost-component-gen` to scaffold the entire file quartet immediately. Do not write them one-by-one.
2.  **Parallel QA**: Run tests (`yarn test`) as soon as a logical block is finished. Do not wait for the entire feature to be complete.
3.  **Automated Refinement**: If a lint error occurs, fix it immediately using an automated tool (`lint:fix`) rather than manual editing.
4.  **Zero-Ambiguity Handoff**: When moving from `@Intake` to `@Planner`, ensure every "Open Question" is resolved. Ambiguity is the #1 cause of developer rework.

---

## 3. Product-to-Dev Transfer (The Gold)

The bridge from `PATIENT.md` to code is where most value is lost. To prevent this:

1.  **Literal Invariants**: If `PATIENT.md` specifies a "Must-Have," it must be a top-level task in `PLAN.md` with a direct link to a test case in `QA_REPORT.md`.
2.  **Visual Fidelity**: Treat Figma links and screenshots in `PATIENT.md` as "Visual Contracts." If the design says 16px padding, the code must be 16px padding—no "guessing."
3.  **Impact Awareness**: @Intake must explicitly flag which existing features might be "annoyed" or "broken" by the new requirements.

---

## 4. Automation Benchmarks (KPI Targets)

Every agent session should aim for these benchmarks:

- **Setup to Plan**: < 15 Minutes.
- **Plan to Code**: < 2 Hours (for standard features).
- **Code to QA**: < 30 Minutes.
- **Token Budget**: < $X per feature (relative to complexity).

---

## 5. Self-Correction Protocol

If an agent detects a loop (e.g., @CodeGen failing the same test 3 times):
1.  **Hard Stop**: Stop trying to "guess" the fix.
2.  **Analyze**: Read the error message + relevant source file again.
3.  **Escalate**: If the solution isn't clear within 60 seconds of reasoning, ask the developer for a hint. A 10-token question is cheaper than a 10,000-token failed iteration.
