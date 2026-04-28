# Bifrost CLI Testing Guide

This guide covers the testing strategy for the Bifrost CLI, including unit, integration, and manual testing.

## 🧪 Automated Testing

### Unit Tests
Unit tests focus on individual modules like state management, hydration building, and knowledge loading.
Location: `tests/unit/`

```bash
# Run all unit tests
npm test tests/unit
```

### Integration Tests
Integration tests verify the workflow between multiple modules, specifically the STATE.md lifecycle and the git workflow.
Location: `tests/integration/`

```bash
# Run integration tests
npm test tests/integration
```

---

## 🛠️ Manual Testing Checklist

Before submitting a PR, perform the following manual tests:

### 1. Project Initialization (`bifrost init`)
- [ ] Run `bifrost init` in a fresh directory.
- [ ] Test Path A (Existing Bifrost), Path B (Standalone), and Path C (One-off).
- [ ] Verify `.bifrost/` directory is created with all expected files:
  - `STATE.md`
  - `hydration.json`
  - `PATIENT.md`
  - `HEALTH.md`
- [ ] Verify `STATE.md` has the correct initial status (`initialized`).

### 2. Starting Workflow (`bifrost start`)
- [ ] Run `bifrost start` after initialization.
- [ ] Verify `@Intake` agent starts (in mock mode, it should complete quickly).
- [ ] Verify `STATE.md` updates to `intake-complete`.
- [ ] Verify `IMPACT.md` is generated.

### 3. Status Check (`bifrost status`)
- [ ] Run `bifrost status` at different phases.
- [ ] Verify the ASCII table displays correctly and matches the state.

### 4. Artifact Review (`bifrost review`)
- [ ] Run `bifrost review`.
- [ ] Verify artifacts are displayed with correct formatting.
- [ ] Test "Accept", "Request changes" (blockers), and "Skip".
- [ ] Verify blockers are correctly added to `STATE.md`.

### 5. Delivery (`bifrost deliver`)
- [ ] Run `bifrost deliver` on a completed feature.
- [ ] Verify a new git branch is created.
- [ ] Verify the `.bifrost` directory is committed.
- [ ] Verify the GitHub PR is created (requires `gh` CLI).

---

## 🎭 Mock Mode

For development and testing without real agents, the CLI defaults to **Mock Mode**.
You can explicitly enable it with the `--mock` flag or by setting `BIFROST_MOCK=true`.

In Mock Mode:
- Agents complete instantly.
- Fake artifacts are generated in `.bifrost/artifacts/`.
- No real LLM calls are made.

---

## 🔧 Debugging Tests

Use the following command to debug tests with detailed output:
```bash
DEBUG=bifrost:* npm test
```
