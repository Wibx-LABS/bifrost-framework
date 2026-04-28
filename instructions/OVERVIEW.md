---
type: guide
status: active
topic: bifrost
---

# BIFROST Instructions — Master Guide

Welcome. This folder consolidates Bifrost framework documentation into a coherent implementation roadmap. **All source material is preserved** in `/docs/` — these guides reference and cross-link it.

---

## Quick Navigation

| Document | Purpose | Read When |
|----------|---------|-----------|
| **[01-ARCHITECTURE.md](01-ARCHITECTURE.md)** | System design, components, how pieces fit together | You're new to Bifrost, need to understand the big picture |
| **[02-INITIALIZATION.md](02-INITIALIZATION.md)** | Step-by-step `bifrost init` process, CLI flow, setup | You're setting up a feature project, need to know what happens |
| **[03-AGENTS-AND-SKILLS.md](03-AGENTS-AND-SKILLS.md)** | Reference: all 7 agents + all 8 skills, what each does | You need to understand a specific agent or skill |
| **[04-IMPLEMENTATION-PLAN.md](04-IMPLEMENTATION-PLAN.md)** | Phase-by-phase build roadmap (10 phases), checklist | You're planning framework development work |
| **[05-SUCCESS-CRITERIA.md](05-SUCCESS-CRITERIA.md)** | Metrics, targets, how we measure success | You're tracking progress, need to know what "done" looks like |
| **[06-STRATEGY.md](06-STRATEGY.md)** | Business case, ROI, why this matters, stakeholder pitch | You're explaining Bifrost to CTO/leadership |

---

## The Bifrost Idea (60 seconds)

**Problem:** Product team can't generate frontend code independently. Backend dev codes everything → bottleneck.

**Solution:** Product generates code using Claude Code + Antigravity, guided by Bifrost framework (agent templates + skill protocols + knowledge graphs).

**Result:** Backend dev shifts from "coder" to "reviewer". Feature velocity 3-4x faster.

**Path forward:**
1. Build core framework (6-8 weeks)
2. Pilot with 1 real feature (2 weeks)
3. Measure + iterate (2 weeks)
4. Roll out to all Product (ongoing)

---

## How to Use This Folder

### Scenario: "I need to build the Bifrost framework"
→ Start: [04-IMPLEMENTATION-PLAN.md](04-IMPLEMENTATION-PLAN.md) (phase breakdown + checklist)  
→ Then: [01-ARCHITECTURE.md](01-ARCHITECTURE.md) (what you're building)  
→ Then: [03-AGENTS-AND-SKILLS.md](03-AGENTS-AND-SKILLS.md) (detailed specs)  
→ Ref: Original files for deep dives

### Scenario: "I'm using Bifrost to build a feature"
→ Start: [02-INITIALIZATION.md](02-INITIALIZATION.md) (set up your project)  
→ Then: [01-ARCHITECTURE.md](01-ARCHITECTURE.md) (understand the workflow)  
→ Then: [03-AGENTS-AND-SKILLS.md](03-AGENTS-AND-SKILLS.md) (understand each agent)  
→ Ongoing: [05-SUCCESS-CRITERIA.md](05-SUCCESS-CRITERIA.md) (track progress)

### Scenario: "I need to explain Bifrost to leadership"
→ Read: [06-STRATEGY.md](06-STRATEGY.md) (business case + ROI)  
→ Then: [01-ARCHITECTURE.md](01-ARCHITECTURE.md) (high-level system design)  
→ Then: [05-SUCCESS-CRITERIA.md](05-SUCCESS-CRITERIA.md) (how we measure success)  
→ Backup: Original Operation Bifrost.md for detailed pitch

### Scenario: "I need details on a specific component"
→ Use: [REFERENCE.md](REFERENCE.md) (index to original documents)  
→ Jump to: Original file that covers that topic

---

## Document Relationships

```
ARCHITECTURE (01)
├─ describes the 7 AGENTS + 8 SKILLS
│  └─ detailed in (03)
├─ describes the workflow
│  └─ operational details in (02)
└─ used to build the system
   └─ phase plan in (04)

SUCCESS CRITERIA (05)
├─ measures built system via (04)
├─ validates ARCHITECTURE works via (01)
└─ used in STRATEGY to justify cost via (06)

STRATEGY (06)
├─ justifies building via (04)
├─ explains why via (01)
└─ proves value via (05)
```

---

## Original Source Documents

All 6 original files remain in `/docs/`:

1. **Technical Roadmap & Visual Architecture.md** — Most detailed phase breakdown + agent matrix
2. **Framework Specification.md** — Full repo structure + hydration system details
3. **Operation Bifrost.md** — Strategic pitch + business case + assumptions validation
4. **Bifrost CLI Plan.md** — Technical details of CLI tool architecture
5. **bifrost CLI layout.md** — UI/UX mockups of CLI screens
6. **Frontend_repository_manual.md** — Bifrost monorepo reference (separate domain)

See **[REFERENCE.md](REFERENCE.md)** for detailed index of what's in each.

---

## Key Decisions (No Changes Without Your Approval)

These instruction documents **consolidate** the originals but **don't change**:
- ✅ System architecture (diagrams, flows, agent roles)
- ✅ Agent/skill definitions
- ✅ Implementation phases and timeline
- ✅ Success metrics
- ✅ Business case and ROI

All original files stay. These guides are **reference layers** that point back to them.

---

## Next Steps

1. **Review this guide** — Make sure the structure matches your thinking
2. **Skim each instruction document** — Verify consolidation makes sense
3. **Approve or request changes** — Tell me what to adjust
4. **Then: Create the implementation plan** — Next layer of detail

Let me know when you're ready to move forward.
