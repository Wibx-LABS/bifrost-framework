import * as path from 'path';
import * as fs from 'fs-extra';
import * as os from 'os';
import {
    initializeState,
    readState,
    updateStatus,
    addTimeline,
    addArtifact,
    addBlocker,
    removeBlocker,
    addDecision,
    setNextSteps,
    validateState,
    isReady,
    isComplete,
    hasBlockers,
} from '../../src/core/state/manager';
import { AgentName, BifrostStatus } from '../../src/types';

let tmpDir: string;
let statePath: string;

beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'bifrost-test-'));
    statePath = path.join(tmpDir, '.bifrost', 'STATE.md');
});

afterEach(async () => {
    await fs.remove(tmpDir);
});

describe('initializeState', () => {
    it('creates STATE.md with correct initial values', async () => {
        const state = await initializeState(statePath, 'feat-abc', 'My Feature');

        expect(state.id).toBe('feat-abc');
        expect(state.feature).toBe('My Feature');
        expect(state.status).toBe(BifrostStatus.INITIALIZED);
        expect(state.timeline).toHaveLength(1);
        expect(state.timeline[0].message).toBe('Feature initialized');
        expect(state.artifacts).toHaveLength(0);
        expect(state.blockers).toHaveLength(0);
        expect(await fs.pathExists(statePath)).toBe(true);
    });

    it('creates .bifrost/ directory if it does not exist', async () => {
        await initializeState(statePath, 'feat-xyz', 'Test Feature');
        expect(await fs.pathExists(path.dirname(statePath))).toBe(true);
    });
});

describe('readState', () => {
    it('throws if STATE.md does not exist', async () => {
        await expect(readState(statePath)).rejects.toThrow('No STATE.md found');
    });

    it('reads back the initialized state correctly', async () => {
        await initializeState(statePath, 'feat-123', 'Test');
        const state = await readState(statePath);

        expect(state.id).toBe('feat-123');
        expect(state.feature).toBe('Test');
        expect(state.status).toBe(BifrostStatus.INITIALIZED);
    });
});

describe('updateStatus', () => {
    it('updates status in STATE.md', async () => {
        await initializeState(statePath, 'feat-1', 'Feature');
        await updateStatus(statePath, BifrostStatus.INTAKE);
        const state = await readState(statePath);
        expect(state.status).toBe(BifrostStatus.INTAKE);
    });
});

describe('addTimeline', () => {
    it('appends a timeline entry', async () => {
        await initializeState(statePath, 'feat-1', 'Feature');
        await addTimeline(statePath, 'Agent started');
        const state = await readState(statePath);
        expect(state.timeline).toHaveLength(2);
        expect(state.timeline[1].message).toBe('Agent started');
    });

    it('preserves previous timeline entries', async () => {
        await initializeState(statePath, 'feat-1', 'Feature');
        await addTimeline(statePath, 'Step 1');
        await addTimeline(statePath, 'Step 2');
        const state = await readState(statePath);
        expect(state.timeline).toHaveLength(3);
        expect(state.timeline[1].message).toBe('Step 1');
        expect(state.timeline[2].message).toBe('Step 2');
    });
});

describe('addArtifact', () => {
    it('adds an artifact entry', async () => {
        await initializeState(statePath, 'feat-1', 'Feature');
        await addArtifact(statePath, AgentName.INTAKE, '.bifrost/artifacts/IMPACT.md');
        const state = await readState(statePath);
        expect(state.artifacts).toHaveLength(1);
        expect(state.artifacts[0].agent).toBe(AgentName.INTAKE);
        expect(state.artifacts[0].path).toBe('.bifrost/artifacts/IMPACT.md');
    });
});

describe('addBlocker / removeBlocker', () => {
    it('adds a blocker', async () => {
        await initializeState(statePath, 'feat-1', 'Feature');
        await addBlocker(statePath, 'API endpoint not ready');
        const state = await readState(statePath);
        expect(state.blockers).toContain('API endpoint not ready');
    });

    it('removes a specific blocker', async () => {
        await initializeState(statePath, 'feat-1', 'Feature');
        await addBlocker(statePath, 'Blocker A');
        await addBlocker(statePath, 'Blocker B');
        await removeBlocker(statePath, 'Blocker A');
        const state = await readState(statePath);
        expect(state.blockers).not.toContain('Blocker A');
        expect(state.blockers).toContain('Blocker B');
    });
});

describe('addDecision', () => {
    it('adds a decision with date prefix', async () => {
        await initializeState(statePath, 'feat-1', 'Feature');
        await addDecision(statePath, 'Use NgRx for state management');
        const state = await readState(statePath);
        expect(state.decisions).toHaveLength(1);
        expect(state.decisions[0]).toContain('Use NgRx for state management');
    });
});

describe('setNextSteps', () => {
    it('replaces next steps', async () => {
        await initializeState(statePath, 'feat-1', 'Feature');
        await setNextSteps(statePath, ['Step A', 'Step B']);
        const state = await readState(statePath);
        expect(state.nextSteps).toEqual(['Step A', 'Step B']);
    });
});

describe('validateState', () => {
    it('passes for valid state', async () => {
        const state = await initializeState(statePath, 'feat-1', 'Feature');
        const result = validateState(state);
        expect(result.success).toBe(true);
        expect(result.errors).toHaveLength(0);
    });

    it('fails when id is missing', () => {
        const result = validateState({
            id: '',
            feature: 'Test',
            status: BifrostStatus.INITIALIZED,
            created: new Date().toISOString(),
            version: new Date().toISOString(),
            timeline: [],
            artifacts: [],
            decisions: [],
            blockers: [],
            nextSteps: [],
        });
        expect(result.success).toBe(false);
        expect(result.errors).toContain('state.id is required');
    });

    it('fails for invalid status', () => {
        const result = validateState({
            id: 'feat-1',
            feature: 'Test',
            status: 'not-a-status' as BifrostStatus,
            created: new Date().toISOString(),
            version: new Date().toISOString(),
            timeline: [],
            artifacts: [],
            decisions: [],
            blockers: [],
            nextSteps: [],
        });
        expect(result.success).toBe(false);
        expect(result.errors[0]).toContain('not-a-status');
    });
});

describe('isReady / isComplete / hasBlockers', () => {
    it('isReady returns true for initialized state with no blockers', async () => {
        const state = await initializeState(statePath, 'feat-1', 'Feature');
        expect(isReady(state)).toBe(true);
    });

    it('isReady returns false when there are blockers', async () => {
        await initializeState(statePath, 'feat-1', 'Feature');
        await addBlocker(statePath, 'Some blocker');
        const state = await readState(statePath);
        expect(isReady(state)).toBe(false);
    });

    it('isComplete returns true for pr-created status', async () => {
        await initializeState(statePath, 'feat-1', 'Feature');
        await updateStatus(statePath, BifrostStatus.PR_CREATED);
        const state = await readState(statePath);
        expect(isComplete(state)).toBe(true);
    });

    it('hasBlockers returns true when blockers exist', async () => {
        await initializeState(statePath, 'feat-1', 'Feature');
        await addBlocker(statePath, 'Blocker');
        const state = await readState(statePath);
        expect(hasBlockers(state)).toBe(true);
    });
});
