import { describe, it, expect } from '@jest/globals';
import { validateHydration, assertValidHydration } from '../../src/core/hydration/validator';
import { AutonomyLevel, Hydration, ProjectPath } from '../../src/types';

function buildValidHydration(overrides: Partial<Hydration> = {}): Hydration {
    return {
        project: {
            name: 'My Feature',
            path: '/projects/my-app',
            feature: 'My Feature',
            description: 'A test feature',
            timeline: '2 weeks',
            autonomyLevel: AutonomyLevel.TASK_GATED,
            ...overrides.project,
        },
        context: {
            wibooKnowledge: {
                apiContracts: [],
                components: [],
                namingConventions: { rules: [], rawContent: '' },
                techStack: {
                    coreFramework: 'Angular 15',
                    stateManagement: 'NgRx 14',
                    uiLibrary: 'Angular Material',
                    testingFramework: 'Jest',
                    rawContent: '',
                },
                gotchas: [],
                ...overrides.context?.wibooKnowledge,
            },
            codebaseAnalysis: {
                existingComponents: [],
                existingServices: [],
                existingState: [],
                targetPath: 'apps/business/src/app',
                ...overrides.context?.codebaseAnalysis,
            },
        },
        instructions: {
            featureScope: 'New Section/Page in Merchant Platform',
            acceptanceCriteria: [],
            constraints: [],
            timeline: '2 weeks',
            destination: 'apps/business/src/app/containers/my-feature',
            ...overrides.instructions,
        },
        meta: {
            bifrostVersion: '1.0.0',
            createdAt: new Date().toISOString(),
            interrogationPath: ProjectPath.A,
            ...overrides.meta,
        },
    };
}

describe('validateHydration', () => {
    it('passes for a complete, valid hydration', () => {
        const result = validateHydration(buildValidHydration());
        expect(result.success).toBe(true);
        expect(result.errors).toHaveLength(0);
    });

    it('fails when project.name is empty', () => {
        const result = validateHydration(
            buildValidHydration({ project: { name: '', path: '/x', feature: 'f', description: '', timeline: '', autonomyLevel: AutonomyLevel.TASK_GATED } }),
        );
        expect(result.success).toBe(false);
        expect(result.errors.some((e) => e.includes('project.name'))).toBe(true);
    });

    it('fails when project.feature is empty', () => {
        const result = validateHydration(
            buildValidHydration({ project: { name: 'n', path: '/x', feature: '', description: '', timeline: '', autonomyLevel: AutonomyLevel.TASK_GATED } }),
        );
        expect(result.success).toBe(false);
        expect(result.errors.some((e) => e.includes('project.feature'))).toBe(true);
    });

    it('fails when instructions.featureScope is empty', () => {
        const result = validateHydration(
            buildValidHydration({
                instructions: {
                    featureScope: '',
                    acceptanceCriteria: [],
                    constraints: [],
                    timeline: '2w',
                    destination: '/x',
                },
            }),
        );
        expect(result.success).toBe(false);
        expect(result.errors.some((e) => e.includes('instructions.featureScope'))).toBe(true);
    });

    it('fails when the object is missing required fields', () => {
        const result = validateHydration({ project: { name: 'Test' } });
        expect(result.success).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
    });

    it('fails when given null', () => {
        const result = validateHydration(null);
        expect(result.success).toBe(false);
    });

    it('accepts optional fields as undefined', () => {
        const hydration = buildValidHydration();
        delete hydration.project.targetApp;
        delete hydration.project.needsApi;
        const result = validateHydration(hydration);
        expect(result.success).toBe(true);
    });

    it('fails with invalid autonomyLevel enum', () => {
        const hydration = buildValidHydration();
        (hydration.project as { autonomyLevel: string }).autonomyLevel = 'invalid-level';
        const result = validateHydration(hydration);
        expect(result.success).toBe(false);
    });

    it('fails with invalid interrogationPath', () => {
        const hydration = buildValidHydration();
        (hydration.meta as { interrogationPath: string }).interrogationPath = 'D';
        const result = validateHydration(hydration);
        expect(result.success).toBe(false);
    });
});

describe('assertValidHydration', () => {
    it('does not throw for valid hydration', () => {
        expect(() => assertValidHydration(buildValidHydration())).not.toThrow();
    });

    it('throws for invalid hydration', () => {
        expect(() => assertValidHydration({})).toThrow('Invalid hydration');
    });

    it('includes field errors in the thrown message', () => {
        const hydration = buildValidHydration({ instructions: { featureScope: '', acceptanceCriteria: [], constraints: [], timeline: '', destination: '' } });
        expect(() => assertValidHydration(hydration)).toThrow('featureScope');
    });
});
