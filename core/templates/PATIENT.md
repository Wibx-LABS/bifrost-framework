<!--
PATIENT.md — Product-authored feature scope. The "admission record."

Bound by the **Core Invariants** and **Rocket Flight Protocol** documented in `docs/architecture.md`.

WHAT THIS IS
  This is your input as Product. You write this; @Intake reads it and
  produces TRAJECTORY.md (locked invariants) and IMPACT.md (analysis).

  The richer this file, the cleaner the trajectory @Intake can lock.
  Anything you forget to capture here is harder to recover later — once
  the rocket leaves the pad, course corrections cost real fuel.

HOW TO FILL IT IN
  - Replace each `...` or prompt with your content. Delete prompts that
    don't apply.
  - You don't need to use Bifrost terminology — write naturally.
  - When in doubt, write more, not less. @Intake can compress; it can't
    invent context that isn't here.
  - If you genuinely don't know something, write "open — needs clarification"
    and move on. @Intake will surface it back to you.

HOW @INTAKE READS IT
  Each section below maps to a TRAJECTORY.md section. @Intake's job is to
  transform your prose into TRAJECTORY's structured invariants — not to
  guess what you didn't say.
-->

# PATIENT.md: Feature Scope

Feature: {{PROJECT_NAME}}
Target Application: {{TARGET_APP}}
Author: {{AUTHOR}}
Date: {{DATE}}

---

## 1. What you're building
<!-- → TRAJECTORY §1 (Feature identity) -->

**One-paragraph summary**
<!-- Plain English. What is this feature, in one paragraph someone outside
     the project could understand. No jargon. No "we'll figure out the rest later." -->
...

**What it does (in scope)**
<!-- The list of things this feature does. Be concrete. -->
- ...
- ...
- ...

**What it does NOT do (out of scope)**
<!-- Just as important. If a stakeholder asks "can we also add X?",
     and X is here, the answer is "not in this feature." -->
- ...
- ...

---

## 2. Why you're building it
<!-- Context for @Intake. Not part of TRAJECTORY but informs how @Intake interprets the rest. -->

**The problem this solves**
<!-- What is broken / missing / annoying / blocked today, that this fixes? -->
...

**Who benefits and how**
<!-- Which users / which internal teams / which metrics improve. -->
...

---

## 3. How users (or you) will know it works
<!-- → TRAJECTORY §3 (Acceptance criteria) -->

**Must work (hard requirements)**
<!-- The behaviors that, if missing or broken, mean the feature is not done.
     Be concrete: "User can search by token name and see results in < 500ms."
     Not: "Search should be fast." -->
- ...
- ...

**Should work (strong preferences)**
<!-- Things you really want but the feature can ship without if costly. -->
- ...

**Could work (nice-to-have)**
<!-- Genuinely optional. If they don't make it, no one cries. -->
- ...

---

## 4. Constraints you're aware of
<!-- → TRAJECTORY §2 (Hard constraints) -->

**Must not break**
<!-- Existing flows, screens, contracts, behaviors that this feature
     must preserve. List by name. -->
- ...
- ...

**Tech stack constraints (beyond the defaults)**
<!-- {{TECH_STACK_LOCK}} is the project default. Add anything feature-specific
     here, e.g. "must use existing search service, no new HTTP client". -->
- ...

**Security / compliance**
<!-- Auth requirements, data classification, PII handling, anything legal.
     Default boundaries: {{SECURITY_BOUNDARIES_DEFAULT}}. Add feature-specifics. -->
- ...

**Performance**
<!-- Default budgets: {{PERF_BUDGETS_DEFAULT}}. Add feature-specifics
     (page load, action latency, bundle size delta). -->
- ...

**Blocking dependencies**
<!-- Other features, infra, data migrations, or external APIs that must
     exist before this can ship. List with status if known. -->
- ...

---

## 5. Stakeholders and context
<!-- → TRAJECTORY §5 (External context) -->

**Owner (you)**
- Name: {{AUTHOR}}
- Role: Product

**Backend reviewer**
<!-- Who will review the PR when this is delivered. -->
- Name: ...

**Other people who care**
<!-- Anyone whose buy-in matters before this ships, or who must be informed
     when it does. Format: name + role + why they care. -->
- ...

**Deadlines**
<!-- Each: date + whether it's binding (e.g. "demo to investors") or soft
     (e.g. "would be nice for the sprint review"). -->
- ...

**Related features**
- **In flight (parallel work):** ...
- **Already shipped (this feature builds on):** ...
- **Blocked by this (waiting):** ...

**Prior incidents to avoid re-introducing**
<!-- Past bugs, regressions, or footguns that this feature touches. If you
     don't know, leave blank — @Intake will check knowledge/GOTCHAS.md. -->
- ...

---

## 6. Open questions / things you want @Intake to clarify
<!-- Things you're unsure about. @Intake will either answer (from the
     knowledge layer) or surface back to you for a decision before locking
     the trajectory. The earlier you flag ambiguity, the cleaner the trajectory. -->
- ...
- ...

---

## 7. Anything else
<!-- Sketches, links to Figma, examples from competitors, prior threads,
     anything that would help @Intake understand what you mean. Free-form. -->
...
