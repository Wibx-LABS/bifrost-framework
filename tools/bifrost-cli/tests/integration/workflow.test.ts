import * as path from 'path';
import * as fs from 'fs-extra';
import * as os from 'os';
import { AgentName, BifrostStatus, ProjectPath, AutonomyLevel } from '../../src/types';
import { initializeState, readState, updateStatus, addArtifact, addBlocker } from '../../src/core/state/manager';
import { buildHydration, writeHydrationFiles } from '../../src/core/hydration/builder';
import { validateHydration } from '../../src/core/hydration/validator';
import { getBifrostDir, getStatePath, getHydrationPath } from '../../src/config';

const EMPTY_KNOWLEDGE = {
    apis: [],
    components: [],
    conventions: { rules: [], rawContent: '' },
    stack: { coreFramework: 'Angular 15', stateManagement: 'NgRx 14', uiLibrary: 'Material', testingFramework: 'Jest', rawContent: '' },
    gotchas: [],
    rawFiles: {},
    findApiByDomain: () => [],
    findComponent: () => undefined,
    getConventionRules: () => [],
    getRelevantApis: () => [],
} as any;

let tmpDir: string;

beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'bifrost-integ-'));
});

afterEach(async () => {
    await fs.remove(tmpDir);
});

describe('Full workflow: init → start → status → deliver', () => {
    it('initializes state and validates hydration for Path A', async () => {
        const bifrostDir = path.join(tmpDir, '.bifrost');
        const statePath = path.join(bifrostDir, 'STATE.md');

        const answers = {
            path: ProjectPath.A as const,
            targetApp: 'Merchant Platform (Business)' as any,
            featureScope: 'New Section/Page' as any,
            needsApi: true,
            featureName: 'Search Portal',
            featureDescription: 'Advanced search for products',
            timeline: '2 weeks',
        };

        const hydration = await buildHydration(answers, EMPTY_KNOWLEDGE, tmpDir, AutonomyLevel.TASK_GATED);
        const validation = validateHydration(hydration);

        expect(validation.success).toBe(true);
        expect(hydration.project.name).toBe('Search Portal');
        expect(hydration.project.autonomyLevel).toBe(AutonomyLevel.TASK_GATED);
        expect(hydration.meta.interrogationPath).toBe(ProjectPath.A);
        expect(hydration.instructions.destination).toContain('apps/business');
    });

    it('initializes state and builds hydration for Path B', async () => {
        const answers = {
            path: ProjectPath.B as const,
            projectName: 'Admin Dashboard',
            featureName: 'Admin Dashboard',
            featureDescription: 'Internal tool for admins',
            userActions: ['View users', 'Manage roles', 'Export data'],
            externalServices: ['Google Analytics'],
            timeline: '4 weeks',
        };

        const hydration = await buildHydration(answers, EMPTY_KNOWLEDGE, tmpDir, AutonomyLevel.FULL);
        const validation = validateHydration(hydration);

        expect(validation.success).toBe(true);
        expect(hydration.project.name).toBe('Admin Dashboard');
        expect(hydration.instructions.featureScope).toContain('Admin Dashboard');
    });

    it('initializes state and tracks the full pipeline', async () => {
        const bifrostDir = path.join(tmpDir, '.bifrost');
        const statePath = path.join(bifrostDir, 'STATE.md');

        await initializeState(statePath, 'feat-integ-001', 'Integration Test Feature');

        let state = await readState(statePath);
        expect(state.status).toBe(BifrostStatus.INITIALIZED);
        expect(state.blockers).toHaveLength(0);

        await updateStatus(statePath, BifrostStatus.INTAKE);
        state = await readState(statePath);
        expect(state.status).toBe(BifrostStatus.INTAKE);

        await addArtifact(statePath, AgentName.INTAKE, '.bifrost/artifacts/@Intake/IMPACT.md');
        await updateStatus(statePath, BifrostStatus.INTAKE_COMPLETE);

        state = await readState(statePath);
        expect(state.status).toBe(BifrostStatus.INTAKE_COMPLETE);
        expect(state.artifacts).toHaveLength(1);
        expect(state.artifacts[0].agent).toBe(AgentName.INTAKE);

        await updateStatus(statePath, BifrostStatus.PLANNING);
        await addArtifact(statePath, AgentName.PLANNER, '.bifrost/artifacts/@Planner/PLAN.md');
        await updateStatus(statePath, BifrostStatus.PLANNING_COMPLETE);

        state = await readState(statePath);
        expect(state.status).toBe(BifrostStatus.PLANNING_COMPLETE);
        expect(state.artifacts).toHaveLength(2);

        await updateStatus(statePath, BifrostStatus.CODING);
        await updateStatus(statePath, BifrostStatus.QA);

        state = await readState(statePath);
        expect(state.status).toBe(BifrostStatus.QA);

        await updateStatus(statePath, BifrostStatus.REVIEW);
        await updateStatus(statePath, BifrostStatus.PR_CREATED);

        state = await readState(statePath);
        expect(state.status).toBe(BifrostStatus.PR_CREATED);
    });

    it('records and resolves blockers correctly', async () => {
        const bifrostDir = path.join(tmpDir, '.bifrost');
        const statePath = path.join(bifrostDir, 'STATE.md');

        await initializeState(statePath, 'feat-block-001', 'Blocker Test');
        await addBlocker(statePath, 'API endpoint not available');
        await addBlocker(statePath, 'Design not approved');

        let state = await readState(statePath);
        expect(state.blockers).toHaveLength(2);

        const { removeBlocker } = await import('../../src/core/state/manager');
        await removeBlocker(statePath, 'API endpoint not available');

        state = await readState(statePath);
        expect(state.blockers).toHaveLength(1);
        expect(state.blockers[0]).toBe('Design not approved');
    });

    it('writes hydration files to disk', async () => {
        const bifrostDir = path.join(tmpDir, '.bifrost');
        const statePath = path.join(bifrostDir, 'STATE.md');

        const answers = {
            path: ProjectPath.A as const,
            targetApp: 'Merchant Platform (Business)' as any,
            featureScope: 'New Section/Page' as any,
            needsApi: true,
            featureName: 'Test Feature',
            featureDescription: 'A test feature for integration testing',
            timeline: '1 week',
        };

        const hydration = await buildHydration(answers, EMPTY_KNOWLEDGE, tmpDir);
        await writeHydrationFiles(bifrostDir, hydration, answers, EMPTY_KNOWLEDGE);

        expect(await fs.pathExists(path.join(bifrostDir, 'hydration.json'))).toBe(true);
        expect(await fs.pathExists(path.join(bifrostDir, 'interrogation.md'))).toBe(true);
        expect(await fs.pathExists(path.join(bifrostDir, 'agents', 'Intake_HYDRATED.md'))).toBe(true);
        expect(await fs.pathExists(path.join(bifrostDir, 'agents', 'Planner_HYDRATED.md'))).toBe(true);
        expect(await fs.pathExists(path.join(bifrostDir, 'agents', 'CodeGen_HYDRATED.md'))).toBe(true);
        expect(await fs.pathExists(path.join(bifrostDir, 'agents', 'QA_HYDRATED.md'))).toBe(true);
        expect(await fs.pathExists(path.join(bifrostDir, 'agents', 'Conductor_HYDRATED.md'))).toBe(true);
        expect(await fs.pathExists(path.join(bifrostDir, 'PROJECT_CONTEXT.md'))).toBe(true);

        const hydrationJson = await fs.readJson(path.join(bifrostDir, 'hydration.json'));
        expect(hydrationJson.project.feature).toBe('Test Feature');
    });
});
