# CLI Testing Guide (for Pedro)

This guide explains how to manually test the Bifrost CLI scripts without needing a full framework installation. This is essential for verifying the handoff point between the CLI and the agents.

## 1. Prerequisites
- Node.js 18+
- Git

## 2. Running the Setup Interview
To test the initialization flow and project setup, run:
```bash
./scripts/bifrost-init
```
**What to verify:**
- [ ] Selectors work (typing numbers 1, 2, 3).
- [ ] Colors and spinners are visible.
- [ ] A `.bifrost/` directory is created in the current folder.
- [ ] Templates in `.bifrost/` are hydrated with your interview answers.

## 3. Validating the State
To verify that the state management logic is working correctly:
```bash
./scripts/bifrost-validate state .bifrost/STATE.md
```

## 4. Syncing Knowledge
To test pulling the latest architecture graph:
```bash
./scripts/bifrost-sync-graph
```

## 5. CI/CD Simulation
To run the full validation suite (simulating a GitHub Action):
```bash
./scripts/bifrost-ci
```

## 6. Project Re-hydration
To test updating a project's skills/agents:
```bash
./scripts/bifrost-update-skills
```

---
**Note:** If you get "Permission Denied", run `chmod +x scripts/*` first.
