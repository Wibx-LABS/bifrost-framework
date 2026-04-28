import * as path from 'path';
import * as fs from 'fs-extra';
import { AgentName, BifrostStatus } from '../../src/types';
import { updateStatus, addTimeline, addArtifact } from '../../src/core/state/manager';

const MOCK_ARTIFACTS: Partial<Record<AgentName, { file: string; content: (feature: string) => string }>> = {
    [AgentName.INTAKE]: {
        file: 'IMPACT.md',
        content: (feature) => `# IMPACT.md\n\n**Feature:** ${feature}\n\n## Impact Analysis\n\n- **Complexity:** Medium\n- **APIs Required:** api.accounting.getUserDetails()\n- **Components Required:** CardComponent, TableComponent\n- **State Changes:** Adds new slice to NgRx store\n\n## Affected Files\n\n- apps/business/src/app/containers/${feature}/\n- libs/commonlib/src/lib/models/\n`,
    },
    [AgentName.PLANNER]: {
        file: 'PLAN.md',
        content: (feature) => `# PLAN.md\n\n**Feature:** ${feature}\n\n## Tasks\n\n### Task 1: Create component\n- **Estimated:** 2h\n- **Files:** ${feature}.component.ts/html/scss\n- **Criteria:** Component renders correctly\n\n### Task 2: Wire up service\n- **Estimated:** 2h\n- **Files:** ${feature}.service.ts\n- **Criteria:** API integration works\n\n### Task 3: Add NgRx state\n- **Estimated:** 3h\n- **Files:** ${feature}.reducer.ts, ${feature}.actions.ts\n- **Criteria:** State updates correctly\n\n### Task 4: Write tests\n- **Estimated:** 2h\n- **Files:** ${feature}.component.spec.ts\n- **Criteria:** 80%+ coverage\n`,
    },
    [AgentName.CODEGEN]: {
        file: 'CODE_REVIEW.md',
        content: (feature) => `# CODE_REVIEW.md\n\n**Feature:** ${feature}\n\n## Self-Review\n\n- [x] Naming conventions followed (kebab-case files, PascalCase classes)\n- [x] No direct .subscribe() without cleanup\n- [x] API calls use centralized \`api\` constant\n- [x] Error handling implemented\n- [x] SafeMath used for financial calculations\n- [x] TypeScript strict mode passes\n- [x] ESLint passes\n\n**Result: PASS**\n`,
    },
    [AgentName.QA]: {
        file: 'QA_REPORT.md',
        content: (feature) => `# QA_REPORT.md\n\n**Feature:** ${feature}\n\n## Test Results\n\n### Happy Path\n- [x] Component renders correctly ✓\n- [x] Data loads from API ✓\n- [x] User interactions work ✓\n\n### Sad Path\n- [x] API error handled gracefully ✓\n- [x] Empty state displayed ✓\n- [x] Loading state shown ✓\n\n### Compliance\n- [x] API calls match api.* pattern ✓\n- [x] No naming violations ✓\n- [x] No memory leaks ✓\n\n**Overall Result: PASS**\n`,
    },
    [AgentName.CONDUCTOR]: {
        file: 'HANDOFF.md',
        content: (feature) => `# HANDOFF.md\n\n**Feature:** ${feature}\n\n## What Was Built\n\nA complete implementation of the ${feature} feature following WiBOO standards.\n\n## Files Changed\n\n- Component, service, reducer, spec files created\n\n## APIs Called\n\n- api.accounting.getUserDetails()\n\n## Tests Written\n\n- Unit tests with 80%+ coverage\n\n## Edge Cases Handled\n\n- Empty state, error state, loading state\n`,
    },
};

export interface MockAgentOptions {
    delayMs?: number;
    shouldFail?: boolean;
    failMessage?: string;
}

export async function runMockAgent(
    agentName: AgentName,
    bifrostDir: string,
    projectPath: string,
    options: MockAgentOptions = {},
): Promise<void> {
    const { delayMs = 500, shouldFail = false, failMessage = 'Mock agent failed' } = options;
    const statePath = path.join(bifrostDir, 'STATE.md');
    const feature = path.basename(bifrostDir);

    await sleep(delayMs);
    await addTimeline(statePath, `${agentName} started (mock)`);

    if (shouldFail) {
        await addTimeline(statePath, `${agentName} failed: ${failMessage}`);
        throw new Error(failMessage);
    }

    const artifactDef = MOCK_ARTIFACTS[agentName];
    if (artifactDef) {
        const artifactDir = path.join(bifrostDir, 'artifacts', agentName);
        await fs.ensureDir(artifactDir);
        const artifactPath = path.join(artifactDir, artifactDef.file);
        await fs.writeFile(artifactPath, artifactDef.content(feature), 'utf8');

        const relativePath = path.relative(path.dirname(bifrostDir), artifactPath);
        await addArtifact(statePath, agentName, relativePath);
    }

    await addTimeline(statePath, `${agentName} completed (mock)`);
}

export function createMockTriggerFile(
    bifrostDir: string,
    agentName: AgentName,
    hydrationPath: string,
): Promise<void> {
    return fs.writeJson(
        path.join(bifrostDir, 'agents', 'trigger.json'),
        {
            agent: agentName,
            hydrationPath,
            bifrostPath: path.join(bifrostDir, 'STATE.md'),
            timestamp: new Date().toISOString(),
            mockMode: true,
        },
        { spaces: 2 },
    );
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
