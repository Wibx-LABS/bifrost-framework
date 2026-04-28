<!--
QA_REPORT.md — @QA's test results and pass/fail verdict for /bifrost:qa.

Bound by:
  - bifrost-qa-validator §10 (this exact format)
  - ADR-006 §Decision (lifecycle artifact, pass/fail Hard-Stop gate)
  - ADR-008 §3 (Trajectory acknowledged section required)
  - ADR-008 §4 (handoff contract: each TRAJECTORY §3 acceptance criterion mapped to a passing test or documented failure)
  - ADR-010 (10-artifact set; QA_REPORT is canonical)

PASS/FAIL DISCIPLINE
  PASS only when every Critical and Major finding is resolved AND every
  TRAJECTORY §3 acceptance criterion has a passing test reference.
  Minor findings can ship as notes; Critical/Major cannot.

  A FAIL returns the feature to @CodeGen (or to the user) with the rework
  focus named explicitly. There is no ambiguous middle.

HYDRATION
  {{PROJECT_NAME}} from interview. Everything else @QA fills in.
-->

# QA_REPORT.md — Validation Results

Feature: {{PROJECT_NAME}}
Author: @QA
Date: <ISO-8601>
Status: <!-- PASS | FAIL — fill at the end after walking the full skill -->

---

## 1. Test execution

<!--
@QA: counts and run summary. Numbers come from `nx test --affected` and
`nx e2e <app>-e2e` outputs. Coverage is the affected-files coverage, not
project-wide.
-->

- **Unit tests:** <N>/<N> passing — `yarn test --affected` or `nx test <project>`
- **E2E tests:** <N>/<N> passing — `nx e2e <app>-e2e`
- **Coverage:** <N>% line coverage on affected files (target ≥ 80%)
- **Skipped tests:** <count> (each justified with ticket reference, or 0)

## 2. Scenario coverage

<!--
@QA: for each new component / service / reducer / effect / pipe / guard /
adapter, confirm happy + sad + at-least-one-edge-case coverage. Per
bifrost-qa-validator §2, a spec missing any category is a half-done spec
and counts as a finding.
-->

| Unit under test | Happy path | Sad path | Edge case |
|---|---|---|---|
| `<file>:<class>` | ✓ `<test name>` | ✓ `<test name>` | ✓ `<test name>` (`<edge type>`) |
| ... | ... | ... | ... |

## 3. Performance

<!--
@QA: measure on the test environment. Each row: target (per knowledge/TECH_STACK.md),
the value you measured, and the result (✓ if at-or-better, ✗ if missed).
-->

| Metric | Target | Measured | Result |
|---|---|---|---|
| LCP (page load) | < 2.0 s | <value> | ✓ / ✗ |
| Action latency (perceived) | < 100 ms | <value> | ✓ / ✗ |
| List render | < 500 ms | <value> | ✓ / ✗ |
| Search results | < 500 ms | <value> | ✓ / ✗ |
| Bundle delta | <budget per app> | <value> | ✓ / ✗ |

## 4. Accessibility

<!--
@QA: per bifrost-qa-validator §7. Notes column captures any caveats,
even on passing rows.
-->

| Check | Result | Notes |
|---|---|---|
| Keyboard-only navigation | ✓ / ✗ | ... |
| Screen-reader pass | ✓ / ✗ | ... |
| Color is not the only signal | ✓ / ✗ | ... |
| Contrast ≥ 4.5:1 (body), ≥ 3:1 (large) | ✓ / ✗ | ... |
| Touch targets ≥ 44×44 px | ✓ / ✗ | ... |
| `prefers-reduced-motion` respected | ✓ / ✗ | ... |

## 5. Mobile responsiveness

<!--
@QA: tested viewports per bifrost-qa-validator §8. 320px is the iPhone SE baseline; non-negotiable.
-->

Tested viewports: 320 / 375 / 414 / 768 / 1024 / 1440 px.

| Check | Result | Notes |
|---|---|---|
| Layout integrity (no horizontal overflow) | ✓ / ✗ | per-viewport notes if any |
| Forms usable on mobile keyboard | ✓ / ✗ | ... |
| Modals scroll correctly on small viewports | ✓ / ✗ | ... |
| Tap targets meet 44×44 px on mobile | ✓ / ✗ | ... |

## 6. API contracts

<!--
@QA: per bifrost-qa-validator §9. Validates against the api factory + the
*.api.ts services + (when seeded) knowledge/API_CONTRACTS.md.
-->

| Check | Result | Notes |
|---|---|---|
| All endpoints exist in `api.<domain>.<endpoint>()` | ✓ / ✗ | list any deviations |
| Request bodies match contract shape | ✓ / ✗ | ... |
| Adapters wired for every response | ✓ / ✗ | ... |
| No manual auth headers (interceptors only) | ✓ / ✗ | ... |
| Default 35s timeout respected | ✓ / ✗ | overrides justified? |

## 7. Findings

### Critical (block release)
<!--
@QA: things that MUST be fixed before this feature ships. Each entry:
  - <file:line> — <what's wrong> — <suggested fix or escalation>
Empty if no critical findings.
-->
*(none)*

### Major (block release unless waived)
<!--
@QA: things that should be fixed; can be waived only with explicit user
authorization (recorded in STATE Decisions or as a TRAJECTORY amendment).
-->
*(none)*

### Minor (notes for future)
<!--
@QA: cleanup items, style nits, future-improvement candidates. Don't block.
-->
*(none)*

## 8. Verdict

<!-- @QA: one of these two blocks, fill the relevant one and delete the other. -->

**PASS** — feature is ready for `/bifrost:deliver`.

OR

**FAIL** — return to @CodeGen with the findings above.
**Rework focus:** <one paragraph naming the most consequential failures and what would shift them to PASS>.

---

## Trajectory acknowledged

<!--
Required per ADR-008 §3, with the QA-specific extension that EVERY MUST/SHOULD
acceptance criterion in TRAJECTORY §3 is mapped to a passing test reference here.
-->

- **Sections respected:** §1, §2, §3, §4, §5
- **Amendments added:** <link to TRAJECTORY §6 entry, or "none">
- **Conflicts surfaced:** <link, or "none">
- **Acceptance criteria coverage:**
  - **§3 MUST:** `<criterion>` → ✓ verified by `<test name>`
  - **§3 MUST:** `<criterion>` → ✓ verified by `<test name>`
  - **§3 SHOULD:** `<criterion>` → ✓ verified by `<test name>`
  - **§3 MAY:** `<criterion>` → ✓ verified by `<test name>` (or "deferred — see Findings")
