# Bifrost CLI API Reference

This document provides a detailed technical reference for the data structures and protocols used by the Bifrost CLI and its agents.

## 1. Hydration Schema

The `hydration.json` file is the primary context provided to agents. It contains everything the agent needs to know about the project, the Bifrost knowledge base, and the specific feature being developed.

### Structure

```typescript
interface Hydration {
  project: {
    name: string;          // Human-readable project name
    path: string;          // Absolute path to the project root
    feature: string;       // Feature name from interrogation
    description: string;   // Feature description
    targetApp?: string;    // (Path A only) Target Bifrost application
    timeline: string;      // Expected delivery timeline
    needsApi?: boolean;    // Whether the feature requires API integration
    autonomyLevel: 'task-gated' | 'phase-gated' | 'full';
  };
  context: {
    BifrostKnowledge: {
      apiContracts: ApiContract[];      // Relevant API endpoints
      components: ComponentDef[];       // Available reusable components
      namingConventions: NamingRules;   // Naming standards
      techStack: TechStackInfo;         // Versions and libraries
      gotchas: Gotcha[];                // Common pitfalls and rules
    };
    codebaseAnalysis: {
      existingComponents: string[];     // Found via grep in target path
      existingServices: string[];       // Found via grep in target path
      existingState: string[];          // Found via grep in target path
      targetPath: string;               // Where code should be generated
    };
  };
  instructions: {
    featureScope: string;               // Multi-line scope description
    acceptanceCriteria: string[];       // List of requirements
    constraints: string[];              // Technical limitations
    timeline: string;                   // Duplicate for agent convenience
    destination: string;                // Specific directory for output
  };
  meta: {
    bifrostVersion: string;
    createdAt: string;                  // ISO timestamp
    interrogationPath: 'A' | 'B' | 'C';
  };
}
```

---

## 2. State Schema (STATE.md)

`STATE.md` is the single source of truth for the workflow. It uses YAML front-matter for machine-readable state and Markdown for human-readable logs.

### Status Values

- `initialized`: Project created, ready to start.
- `intake`: @Intake agent is analyzing scope.
- `intake-complete`: @Intake finished, IMPACT.md generated.
- `planning`: @Planner is breaking feature into tasks.
- `planning-complete`: @Planner finished, PLAN.md generated.
- `coding`: @CodeGen is generating files.
- `qa`: @QA is validating the code.
- `qa-failed`: @QA found bugs, requires re-run.
- `review`: @Reviewer is preparing the handoff.
- `pr-created`: GitHub Pull Request has been opened.
- `merged`: Feature is finished and merged.

### Artifacts

Artifacts are recorded in the `artifacts` array:
```yaml
artifacts:
  - agent: "@Intake"
    path: ".bifrost/artifacts/@Intake/IMPACT.md"
    timestamp: "2024-04-27T20:00:00Z"
```

---

## 3. Agent Trigger Protocol

Agents are triggered via a `trigger.json` file placed in the `.bifrost/agents/` directory.

### trigger.json

```json
{
  "agent": "@Intake",
  "hydrationPath": ".bifrost/hydration.json",
  "bifrostPath": ".bifrost/STATE.md",
  "timestamp": "2024-04-27T20:00:00Z",
  "mockMode": false
}
```

The CLI polls `STATE.md` for status changes to detect when an agent has completed its work.

---

## 4. Knowledge Structures

### ApiContract
Represents an endpoint defined in `API_CONTRACTS.md`.
- `domain`: e.g., "Finance", "Auth"
- `method`: GET, POST, etc.
- `path`: The relative URL
- `description`: Human-readable purpose

### ComponentDef
Represents a UI component defined in `COMPONENT_LIBRARY.md`.
- `name`: e.g., "BifrostButtonComponent"
- `selector`: e.g., "Bifrost-button"
- `category`: e.g., "Forms", "Layout"

### NamingRule
Standards parsed from `NAMING_CONVENTIONS.md`.
- `category`: `file`, `class`, `function`, `variable`, etc.
- `rule`: The description of the rule
- `examples`: List of valid strings (prefixed with ✅)
