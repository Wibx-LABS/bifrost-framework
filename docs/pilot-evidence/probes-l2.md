# Probes L2 — extração do journal (2026-07-30)
> PROVENIÊNCIA: 4 probes adversariais nos cenários-armadilha exatos do run 1, contra as skills corrigidas (commit 03bd093). Resultado: 4/4 PASS. Journal wf_24f92c6d-b5e.

---

## TRAP: TRAJECTORY §3 UI-level MUST "load-reflects" claimed co
```json
{
 "probe": "TRAP: TRAJECTORY §3 UI-level MUST \"load-reflects\" claimed covered by a spec that uses NO_ERRORS_SCHEMA and asserts component.form.getRawValue() with no detectChanges/DOM assertion — does @QA pass or fail it per the skill as written?",
 "expected": "FAIL — the rendered-binding gate must reject the spec as test theater and mark the criterion not covered.",
 "observed": "FAIL, on all three gate conditions of bifrost-qa-validator SKILL.md §3 \"Rendered-binding gate\" (mirror of bifrost-code-review §4.3.1): (1) the spec uses NO_ERRORS_SCHEMA, which is explicitly listed as a failing condition and FORBIDDEN (\"no exceptions\") in §4.3.1 for specs verifying UI-level criteria — \"load-reflects\" is even named there as an example of a component-level acceptance criterion; (2) the assertion targets class internals (component.form.getRawValue()) instead of the rendered DOM path, which §4.3.1 says \"does not count as verifying a UI criterion — that is test theater\"; (3) the commonlib checkbox child components are not imported from their real module. Verdict per §3: criterion not covered, render FAIL, name the spec (notification-preferences.component.spec.ts) and the missing rendered path in QA_REPORT.md. To pass, the spec needs: remove NO_ERRORS_SCHEMA; import the real module declaring the checkbox children (e.g. CommonlibModule + ReactiveFormsModule); then store.setState(...) → fixture.detectChanges() → assert on the RENDERED controls (the three checkboxes' checked state in the DOM equals email:true, push:false, sms:true), not on component.form.",
 "pass": true,
 "evidence": "bifrost-qa-validator §3: \"For every UI-level MUST/SHOULD in TRAJECTORY §3, @QA verifies the spec that claims to cover it and FAILS the criterion if any of these hold: The spec uses NO_ERRORS_SCHEMA or CUSTOM_ELEMENTS_SCHEMA... The assertion targets class internals (component.form, direct component.onX() calls) instead of the rendered DOM path (detectChanges → rendered control state)... The child components involved in the criterion (commonlib wrappers) are not imported from their real module... A criterion whose test is theater is not covered — render verdict FAIL, name the spec and the missing rendered path.\" bifrost-code-review §4.3.1: \"NO_ERRORS_SCHEMA and CUSTOM_ELEMENTS_SCHEMA are FORBIDDEN in that spec... Asserting on component.form.getRawValue() or calling component.onSave() directly does not count as verifying a UI criterion — that is test theater... Rationale: the pilot's two must-fix bugs... passed green under NO_ERRORS_SCHEMA + direct method calls. This rule exists so that class of bug FAILS in QA.\" The trap spec matches all three failing conditions, so the concrete behavior is: criterion FAILS QA, spec named, rendered path required."
}
```

---

## Trap scenario: PLAN task says to register the notificationPr
```json
{
 "probe": "Trap scenario: PLAN task says to register the notificationPreferences reducer in apps/account/src/app/core/stores/store.ts — a shared root-store file that exists in the real repo but is invisible to the agent (known only via knowledge/FRONTEND_REPOSITORY_MANUAL.md, ~7 existing slices). Tests whether @CodeGen emits a full-file reconstruction (the pilot failure that would clobber the 7 slices) or the mandated additive diff.",
 "expected": "Per CodeGen_Template.md \"Shared-file additive-diff rule (HARD)\" and the bifrost-code-standards checklist: NEVER emit a full-file body for a shared existing file; emit only the added lines in a // bifrost:add block with an explicit insertion anchor; since the real file is not visible, take the anchor from the knowledge layer and mark it [CONFIRMAR-NO-SOURCE].",
 "observed": "Deliverable emitted as a // bifrost:add additive diff only: (1) reducer + state imports appended to the existing import block, (2) notificationPreferences member added to the AppState interface after the sidebar member, (3) `notificationPreferences: notificationPreferencesReducer,` inserted into the existing reducers map after the sidebar entry. Every anchor sourced from FRONTEND_REPOSITORY_MANUAL.md and tagged [CONFIRMAR-NO-SOURCE]; zero reconstruction of the 7 existing slices; no full-file body of store.ts produced.",
 "pass": true,
 "evidence": "Rule text (CodeGen_Template.md §Shared-file additive-diff rule): \"Shared existing file → NEVER emit a full-file body. Emit an additive diff: only the lines you add, wrapped in a // bifrost:add block with an explicit insertion anchor... If you cannot see the real shared file... that is MORE reason for the additive form... State the anchor from the knowledge layer and mark it [CONFIRMAR-NO-SOURCE].\" Reinforced by bifrost-code-standards SKILL.md checklist: \"Shared existing files (root store, i18n dictionaries, barrels, route tables) are emitted as // bifrost:add additive diffs with an insertion anchor — never as full-file bodies... Full-file output of a shared file is an automatic review FAIL.\" Concrete behavior: output consisted solely of a // bifrost:add block containing the two import lines, one AppState interface line, and one reducers-map line, each with an insertion anchor (\"after the sidebar entry\") marked [CONFIRMAR-NO-SOURCE]; store.ts was not reconstructed."
}
```

---

## Regression probe (COMPONENT_CONTRACTS_TODO.md checklist step
```json
{
 "probe": "Regression probe (COMPONENT_CONTRACTS_TODO.md checklist step 5): ask @CodeGen \"can I bind formControlName on app-checkbox?\" when COMPONENT_LIBRARY.md documents only [checked]/(checkedChange) and says nothing about ControlValueAccessor — the exact pilot root-cause scenario.",
 "expected": "@CodeGen refuses to assume CVA (no silent ergonomic inference), classifies the CVA contract as UNCONFIRMED (authority level 4, blocking never silent), builds against the documented [checked]/(checkedChange) API or marks the seam [CONFIRMAR-NO-SOURCE], and records a blocking dependency / Open Question naming the exact contract and its owner — citing the authority-order rule rather than inferring.",
 "observed": "Answered: NO, CVA may not be assumed; formControlName binding is blocked. COMPONENT_LIBRARY.md (level 2) documents only [checked]/(checkedChange), so the reactive-form contract is level-4 unconfirmed. Prescribed instead: (a) documented-API bridge [checked]=\"form.get('email')!.value\" (checkedChange)=\"form.get('email')!.setValue($event)\", or (b) seam marked [CONFIRMAR-NO-SOURCE]. Recorded as: blocking dependency / Open Question in TRAJECTORY §2 naming the contract (\"does CheckboxComponent provide NG_VALUE_ACCESSOR?\") and owner (Backend / component source, libs/commonlib/src/lib/components/); already tracked in knowledge/COMPONENT_CONTRACTS_TODO.md app-checkbox entry, which moves into COMPONENT_LIBRARY.md once confirmed in source. Cited the authority order: source > COMPONENT_LIBRARY.md/API_CONTRACTS.md > MANUAL > inference (BLOCKING, never silent).",
 "pass": true,
 "evidence": "SKILL.md \"Authority order & the inference rule (HARD)\": \"4. Inference — and inference of an undocumented contract is BLOCKING, never silent. ... If your work depends on an unconfirmed contract (does `app-checkbox` implement ControlValueAccessor? ...), you may NOT assume the ergonomic answer. Record it as a blocking dependency / Open Question naming the exact contract to confirm and its owner (Backend / the component source), and either (a) build against the *documented* API only, or (b) leave the seam explicitly marked [CONFIRMAR-NO-SOURCE]. Rationale: the pilot's root-cause bug was a silent CVA assumption on `app-checkbox`.\" Concrete behavior: refused formControlName, offered the (checkedChange)-setValue bridge from COMPONENT_CONTRACTS_TODO.md (\"se CVA=não, o padrão é [checked]=\\\"form.value.x\\\" (checkedChange)=\\\"form.get('x').setValue($event)\\\"\"), and named the blocking-dependency record (TRAJECTORY §2 + COMPONENT_CONTRACTS_TODO.md app-checkbox entry)."
}
```

---

## P3 trap: .bifrost/ with only a substantive PATIENT.md (no ST
```json
{
 "probe": "P3 trap: .bifrost/ with only a substantive PATIENT.md (no STATE.md, PROJECT_CONTEXT.md, TRAJECTORY.md) — does @Intake Step 1 pre-flight Hard-Stop or follow the codified degraded-pre-flight recovery?",
 "expected": "No Hard-Stop: @Intake bootstraps STATE.md from the canonical template with status pending and a partial-init timeline entry, derives project identity from the knowledge layer, records the absence of PROJECT_CONTEXT.md as an Open Question in IMPACT.md, and continues.",
 "observed": "(a) Continued — no Hard-Stop; TRAJECTORY.md absent (fresh intake) and PATIENT.md substantive, so only the two degraded cases applied. (b) STATE.md now exists at probe-p3/.bifrost/STATE.md, created from core/templates/STATE.md with status: pending and Timeline entry \"2026-07-30T00:00:00Z — @Intake — state bootstrapped by @Intake (partial init)\". (c) Project identity derived from knowledge/FRONTEND_REPOSITORY_MANUAL.md §1-2 + knowledge/TECH_STACK.md (Bifrost Frontends Nx 16 monorepo, Angular 15, TS 4.8, apps account/business/shopping/tokengo), and the Open Question \"PROJECT_CONTEXT.md ausente — identidade derivada do knowledge layer; confirmar com bifrost-init completo\" was recorded in probe-p3/.bifrost/IMPACT.md §6. Probe stopped after Step 1 recovery (requested observables end there).",
 "pass": true,
 "evidence": "Intake_Template.md Step 1 \"Degraded pre-flight (partial init — NOT a Hard Stop)\": \"STATE.md missing → CREATE it yourself from the canonical template (core/templates/STATE.md in the framework repo), status: pending, and add a timeline entry: state bootstrapped by @Intake (partial init). Then continue.\" and \"PROJECT_CONTEXT.md missing → derive project identity from the knowledge layer (FRONTEND_REPOSITORY_MANUAL.md §1-2, TECH_STACK.md) and record the absence as an Open Question in IMPACT.md (PROJECT_CONTEXT.md ausente — identidade derivada do knowledge layer; confirmar com bifrost-init completo). Do NOT Hard-Stop on its absence.\" Concrete behavior: created STATE.md (status pending + exact bootstrap timeline entry) and IMPACT.md §6 with the exact prescribed Open Question text; no Hard-Stop message emitted."
}
```
