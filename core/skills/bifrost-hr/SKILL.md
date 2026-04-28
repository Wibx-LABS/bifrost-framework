---
name: bifrost-hr
description: Gap detection + skill bootstrap. Use this skill whenever you are @Intake during /bifrost:start AND you've finished reading PATIENT.md + the knowledge layer AND the feature touches a domain not covered by your currently loaded skills (e.g. a third-party SDK not in TECH_STACK.md, a behavior class like real-time collaboration / video / payments / a compliance regime not present in any existing skill, a library or pattern that none of the 8 original skills carry instructions for). This skill walks the extend-or-fork decision, drafts a new skill if needed, presents it to the user for approval, and on approval commits it permanently to `core/skills/<new-name>/SKILL.md`. Bifrost's agent roster is fixed at 7 by ADR-006; the skill library grows on demand via this protocol, per ADR-009. If you are NOT @Intake, do not use this skill — mid-flight gaps Hard Stop and re-run @Intake per ADR-008. Even if the gap feels small, prefer using this skill over inventing patterns inline; an under-the-radar new skill is exactly the silent-context-loss the framework exists to prevent.
---

# bifrost-hr — gap detection and skill bootstrap

Bound by `instructions/decisions/ADR-009-bifrost-hr.md`. Read alongside `bifrost-system-context` and ADR-008 (trajectory protocol).

You (`@Intake`) load this skill at `/bifrost:start`, after reading PATIENT.md + the knowledge layer + PROJECT_CONTEXT.md, **before** locking TRAJECTORY.md. Your job here is to ask: *do my currently loaded skills cover the domain this feature touches, or is there a gap?* If the existing skill set is sufficient, you're done with this skill — proceed to lock TRAJECTORY. If it isn't, you run the bootstrap protocol below.

This skill exists because Bifrost is narrower than FORGE: 7 lifecycle agents cover the lifecycle thoroughly, so the dimension that grows is *domain coverage*, not roles. New libraries, new compliance regimes, new patterns — all map cleanly to skills. Adding a skill is cheap; adding an agent is structural. So the framework grows skills on demand and leaves the agent roster fixed.

---

## Step 1: Detect the gap

After reading PATIENT.md, ask yourself: *would any of the agent×skill matrix entries below produce correct, standards-compliant output for this feature given only the skills they currently load?*

The 8 original skills (drafted at framework genesis) cover:

- **`bifrost-system-context`** — framework rules, trajectory protocol, lifecycle, where-to-find-things. Always loaded.
- **`bifrost-code-standards`** — Wiboo's naming, file structure, ESLint rules, TypeScript strict, formatting. Covers the broad coding hygiene baseline.
- **`bifrost-api-integration`** — Wiboo's HTTP client patterns, centralized API constants, ErrorHandlingService, auth, retry, the timeout discipline. Covers API calls *as Wiboo currently makes them*.
- **`bifrost-component-gen`** — Angular Material patterns, `@Input/@Output`, reactive forms, accessibility, the unit-test patterns for components. Covers component construction *with Wiboo's chosen Material library*.
- **`bifrost-code-review`** — `@CodeGen`'s self-review checklist. Covers post-write hygiene.
- **`bifrost-qa-validator`** — happy/sad/edge test scenarios, performance targets, a11y checks, mobile responsiveness. Covers the test-design pattern.
- **`bifrost-graphify-ref`** — how to query the knowledge layer. Covers structural lookups.
- **`bifrost-state-management`** — STATE.md format + NgRx patterns (actions, reducers, selectors, effects, immutable updates). Covers state-management *with Wiboo's chosen NgRx library*.

Things that are **clearly gaps** (will not be covered):

- A third-party SDK that's not listed in `knowledge/TECH_STACK.md` and isn't a generic web standard (e.g. Stripe Elements, Firebase RTDB, AWS Amplify, Sendbird, Twilio Video).
- A behavior class outside what existing skills carry: real-time collaboration, video processing, audio streaming, AR/VR, geospatial heavy-lifting, scientific computing, ML inference at the edge.
- A compliance regime: PCI-DSS handling, HIPAA-aware patterns, GDPR-specific data flows, SOC2 audit logging.
- A library swap: the feature requires a non-NgRx state library, a non-Material component library, a non-RxJS reactive library, or any pattern the existing skills assume away.
- A platform target: PWA-specific patterns, native bridges, electron, Tauri, embedded webviews with non-trivial concerns.

Things that are **borderline** (extend an existing skill rather than fork a new one):

- A new pattern in an existing domain (e.g. a new HTTP-call shape — extends `bifrost-api-integration`).
- A new component variant (e.g. a new Material component the existing skill didn't enumerate — extends `bifrost-component-gen`).
- A new gotcha discovered in known territory (e.g. a new RxJS subscription pitfall — extends `bifrost-state-management` or `bifrost-code-review`).

Things that are **not gaps** (no action):

- A novel feature *idea* whose execution uses only existing patterns (most features). New features are normal; new domains aren't.
- Knowledge-layer lookup that returns the answer (the patterns exist, you just hadn't read that specific section yet).
- A feature using all the same libraries Wiboo already uses, just in a new combination.

If you're unsure whether something is a gap, ask the user before invoking the bootstrap. Cheap to ask; expensive to spuriously add a new skill.

---

## Step 2: Decide — extend or fork

If a gap is real, the next decision is:

- **Extend** an existing skill — when the gap is *adjacent* to a skill's existing scope. New HTTP pattern → extend `bifrost-api-integration`. New component variant → extend `bifrost-component-gen`. New ESLint rule the team adopted → extend `bifrost-code-standards`.
- **Fork** a new skill — when the gap is *a new domain* the existing skills don't address. Stripe payments → fork `bifrost-payments`. Sendbird messaging → fork `bifrost-realtime-messaging`. WCAG-AAA accessibility deep dive beyond what `bifrost-component-gen` carries → fork `bifrost-a11y-extended`.

The test for "new domain": would the new content double the size of an existing skill or pull it in a direction that confuses its current readers? Fork. Would it slot in as a fifth or sixth bullet under an existing section header? Extend.

When in doubt, prefer extension. Forking adds a new file every agent's matrix has to track; extending adds bullets to an already-loaded file. Forks are appropriate but should be deliberate.

---

## Step 3: Draft

If forking:

1. **Name.** Follow the pattern `bifrost-<lowercase-kebab-domain>`. Examples (illustrative, not yet existing skills): `bifrost-payments`, `bifrost-realtime-messaging`, `bifrost-webrtc`, `bifrost-i18n-extended`. Keep it short, domain-specific, no abbreviations the user has to decode.
2. **Frontmatter description.** Pushy per `/skill-creator` conventions. List the *signals* that should trigger the skill (specific library names, behavior classes, file types, code patterns), not just a vague topic. Cover what the skill does AND when to use it.
3. **Body.** Same shape as the existing 8 skills:
   - Lead with a one-paragraph identity ("This skill exists because…").
   - Cover the most important rules first, with the *why* not just the *what*.
   - Use progressive disclosure: SKILL.md ≤500 lines, with `references/` for heavy content (specific API references, long protocol tables).
   - Include examples in the project's actual style, not generic ones.
   - Cite the source — knowledge file, ADR, external documentation.
4. **Loaded-by list.** Specify which agent(s) will load this skill. Usually it mirrors the closest existing peer (a payments skill loads where api-integration loads). Be conservative: skills with too many loaders create coordination cost.
5. **Hydration keys** (if any). If the skill needs values injected at `bifrost-init` time, list them — they'll go into `core/agents/hydration/injection-points.json` on commit.

If extending:

1. Identify the existing skill that's closest to the new content.
2. Identify the section(s) where the new content fits, or whether a new section is warranted.
3. Draft the additions in-place. Preserve the skill's voice and structure.
4. Note explicitly that this is an extension, not a replacement.

---

## Step 4: Present and Hard Stop

Per Three Laws #3 (ADR-008) and ADR-009, **roster changes have blast radius and require explicit user approval**. Do not commit silently.

Write a `## bifrost-hr proposal` block in your `IMPACT.md` (yes, before TRAJECTORY locks — IMPACT is your analytical scratch space and the natural place for this). Minimum content:

```markdown
## bifrost-hr proposal

**Gap detected:** <one paragraph stating what PATIENT.md surfaces that no existing skill covers>

**Decision:** <extend `<skill-name>`> | <fork new skill `bifrost-<name>`>

**Why this and not the alternative:** <one paragraph — extend would have meant…, fork is right because…>

**What the new skill covers (or what gets added):**
- <bullet>
- <bullet>

**Loaded by:** <list of agents>

**Draft:** <link to the draft, or inline if short>

**On approval:** I will commit `core/skills/<new-name>/SKILL.md`, register hydration keys in `injection-points.json`, update the agent×skill matrix in `bifrost-system-context`, and proceed to lock TRAJECTORY.

**Awaiting user approval.**
```

Then **stop**. Do not lock TRAJECTORY. Do not write `IMPACT.md`'s analytical sections that depend on the new skill. The user's response — approve, modify, reject — determines what happens next.

If approved as-drafted: proceed to Step 5.

If modified: revise per the user's feedback and re-present. Approval is not "ship and ask forgiveness"; it's the gate.

If rejected ("fold it into the existing skill instead"): revise to extend the closest peer; re-present.

If the user wants to skip and proceed without the new skill: this is a Hard Stop that needs explicit user override. Document the user's directive in IMPACT.md (not just STATE.md), then proceed knowing the trajectory will be flying with a known coverage gap. This is rare and should feel uncomfortable.

---

## Step 5: Commit

When the user has approved:

1. **Write the SKILL.md** to `projects/bifrost-framework/core/skills/<new-name>/SKILL.md`. (If extending, edit the existing SKILL.md.)
2. **Register hydration keys** (if any) in `projects/bifrost-framework/core/agents/hydration/injection-points.json` under `_artifact_templates` or `_agent_templates` as appropriate.
3. **Update the agent×skill matrix** in `projects/bifrost-framework/core/skills/bifrost-system-context/SKILL.md` — add a column for the new skill, mark the loaded-by agents.
4. **Update the wiki** — add a glossary entry, add to the agents-and-skills index. (Per CLAUDE.md §3 / §11 these are wiki updates; do them in the same pass since the addition has just been authorized, but log them as a wiki update separate from the code update.)
5. **Append a `code-impact` entry to `log.md`** naming what was committed.
6. **Then** lock TRAJECTORY.md per ADR-008 — now with the new skill counted in the coverage.

---

## What you do not do

- Silently extend a skill without naming the change in IMPACT.md and getting approval.
- Fork a new skill mid-flight (after `/bifrost:plan`, `/bifrost:build`, `/bifrost:qa`, or `/bifrost:deliver` have started). Mid-flight gaps Hard Stop and re-run `@Intake` per ADR-008's trajectory-abort pattern. `bifrost-hr` only runs at intake.
- Bootstrap an agent. Bifrost agents are fixed at 7 by ADR-006. If the gap genuinely requires a new lifecycle role, that's a new ADR, not a bifrost-hr action.
- Bootstrap a per-feature ephemeral skill that doesn't commit to the framework repo. Skills compound; per-feature ones don't. Persistence is the point.
- Commit the new skill before user approval. Hard Stop is mandatory per Three Laws #3.

---

## When in doubt

- Is this *really* a new domain, or just a new feature in an existing domain? Most "new" things are existing-domain features. Apply skepticism.
- Could this be solved by extending the closest existing skill in 5–15 lines? If yes, extend.
- Is the new content something that will help the *next* feature in this domain, not just this one? If no, you may be over-investing.
- If the answer to all three is "extension or no action," do that. If the answer is "this is a real new domain that will recur," fork — and accept the framework version increment.

The protocol is conservative on purpose. Bifrost's roster is small, narrow, and stable. Growth is permitted but every entry has to earn its place.
