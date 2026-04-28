<!--
HANDOFF.md — @Reviewer's Backend delivery summary. Leads with Trajectory restatement.

Bound by:
  - ADR-006 §Decision §4 ("HANDOFF.md leads with a Trajectory section restating the locked invariants")
  - ADR-008 §3 + §4 (Trajectory acknowledged + handoff contract)
  - ADR-010 (canonical 10-artifact set; HANDOFF is the user-facing terminus)
  - bifrost-code-review §6 (HANDOFF must be substantive, not stub)
  - bifrost-state-management §A (final STATE.md update accompanies HANDOFF)

WHEN @REVIEWER WRITES THIS
  At /bifrost:deliver, after reading TRAJECTORY.md + every prior artifact +
  the source diff + git log. Leads the document with the trajectory-restatement
  section so the Backend reviewer sees the locked invariants first; the
  delivery details follow.

WHAT @REVIEWER OPTIMIZES FOR
  Backend's review-and-merge time < 2 hours. Backend's rework rate < 10%
  (kill-switch threshold > 20%; per `docs/planning/operation-bifrost.md`).
  HANDOFF.md is the document Backend reads first; if it doesn't make the
  case for merge clearly, review is slower and the trade Bifrost exists for
  doesn't hold.

HYDRATION
  {{PROJECT_NAME}} from interview. Everything else @Reviewer fills in.
-->

# HANDOFF.md — Backend Delivery

Feature: {{PROJECT_NAME}}
Author: @Reviewer
Date: <ISO-8601>
PR: <link>
Branch: bifrost/<feature-slug>

---

## 1. Trajectory restatement

<!--
@Reviewer: this section LEADS the document. Restate the locked TRAJECTORY
invariants verbatim or in tight summary, and for each MUST/SHOULD criterion
say how the delivered code satisfies it. This is what Backend reads first.
-->

### Identity (TRAJECTORY §1)
- **Feature:** ...
- **In-scope:** ...
- **Out-of-scope:** ...

### Hard constraints (TRAJECTORY §2)
- **Tech stack lock:** ... — respected: ...
- **Security boundaries:** ... — respected: ...
- **Performance budgets:** ... — measured: ... (✓ within budget)
- **Must-not-break:** ... — verified: ...

### Acceptance criteria (TRAJECTORY §3) — how the delivery satisfies each

- **MUST:** `<criterion>` — satisfied by `<approach>`, verified by `<test/check name>`.
- **MUST:** `<criterion>` — ...
- **SHOULD:** `<criterion>` — ...
- **MAY:** `<criterion>` — ... or "deferred to follow-up; see Known Limitations"

### Architectural decisions (TRAJECTORY §4)
- **Decision:** ... — implemented as: ...
- **Decision:** ... — ...

### Amendments added during build
- *(none, or list with timestamp + agent + section)*

---

## 2. What we built

<!--
@Reviewer: one paragraph for the human reader. What does this feature do
when a user uses it? What screens / endpoints / flows are new or changed?
-->

...

---

## 3. Files changed

<!--
@Reviewer: organized by area. New files marked (new); modified files marked (modified).
-->

### Backend / shared
- `libs/commonlib/src/lib/services/<name>.service.ts` — (new | modified)
- `libs/commonlib/src/lib/constants/api.ts` — (modified — added `api.<domain>.<endpoint>()`)
- ...

### Frontend
- `apps/<app>/src/app/features/<feature>/...` — (new — feature folder)
- `apps/<app>/src/app/core/api/<name>.api.ts` — (new | modified)
- ...

### Tests
- `<file>.spec.ts` — (new | modified)
- `apps/<app>-e2e/src/<flow>.cy.ts` — (new | modified)
- ...

### Translations
- `apps/<app>/src/assets/i18n/{en,es,pt-br}.json` — (modified — added <N> keys)

---

## 4. API validation

<!--
@Reviewer: every endpoint touched, with how it was validated.
-->

- `api.<domain>.<endpoint>()` — exists in `commonlib/src/lib/constants/api.ts`; called via `<service>.<method>()`; spec'd in `<service>.spec.ts`.
- ... (one per endpoint touched)

**API_CONTRACTS.md alignment:** *(if seeded)* every endpoint matches the contract; *(if not yet seeded)* every endpoint matches the existing `*.api.ts` typing.

---

## 5. Test results

<!--
@Reviewer: pulled from QA_REPORT.md. Don't restate the full report; summarize.
-->

- **Unit:** <N>/<N> passing. Coverage: <N>% on affected files.
- **E2E:** <N>/<N> passing.
- **Performance:** all targets met (LCP <value>s, action <value>ms, list <value>ms, search <value>ms, bundle delta <value>KB).
- **Accessibility:** keyboard / screen-reader / contrast / touch / motion all pass.
- **Mobile:** layout integrity verified at 320 / 375 / 414 / 768 / 1024 / 1440 px.

Full QA report: `.bifrost/QA_REPORT.md` (verdict: PASS).

---

## 6. Known limitations

<!--
@Reviewer: anything Backend should be aware of that's not a defect but is
worth flagging — deferred TRAJECTORY MAY items, follow-up tickets, technical
debt deliberately taken on, third-party limits.
-->

- *(none, or list)*

---

## 7. Backend review checklist

<!--
@Reviewer: the explicit list of things Backend can verify quickly. Reduces
Backend's time-to-merge by surfacing where to look.
-->

- [ ] Skim file changes (the diff is organized by area; no surprises in unexpected files).
- [ ] API calls match `api.<domain>.<endpoint>()` (verified by @Reviewer; spot-check 1–2).
- [ ] Code style matches Wiboo conventions (verified by lint + @Reviewer; spot-check 1 component).
- [ ] Test coverage feels right for the surface area (see §5).
- [ ] No hardcoded URLs, secrets, or `.subscribe()` in components (verified — see CODE_REVIEW.md).
- [ ] Trajectory invariants (§1–5) make sense as the lock for this feature.
- [ ] Merge if all good, OR comment on PR for any deviation.

---

## Trajectory acknowledged

<!--
Required per ADR-008 §3. The HANDOFF is the terminus of the trajectory; this
section closes it.
-->

- **Sections respected:** §1, §2, §3, §4, §5
- **Amendments added during build:** <list, or "none">
- **Conflicts surfaced:** <list, or "none">
- **Acceptance criteria coverage:** every MUST/SHOULD criterion above is verified by a test or check (§5 + §1 cross-reference)
- **Trajectory status at delivery:** locked, schema_version 1, no abort

---

## STATE.md transition (after this HANDOFF)

<!--
@Reviewer: signals @Conductor to set STATE.md status to `review`. After PR
opens, @Conductor sets it. After Backend merges, @Conductor sets to `merged`.
This artifact is the bridge.
-->

Setting `status: review` upon writing this artifact. `status: merged` on PR merge confirmation.
