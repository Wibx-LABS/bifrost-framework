import * as fs from 'fs-extra';
import * as path from 'path';
import matter from 'gray-matter';
import {
    AgentName,
    ArtifactEntry,
    AutonomyLevel,
    BifrostState,
    BifrostStatus,
    TimelineEntry,
    ValidationResult,
} from '../../types';

const VALID_STATUSES = new Set(Object.values(BifrostStatus));

function nowIso(): string {
    return new Date().toISOString();
}

function renderState(state: BifrostState): string {
    const frontmatter = [
        '---',
        `id: ${state.id}`,
        `feature: ${state.feature}`,
        `status: ${state.status}`,
        `autonomy: ${state.autonomy}`,
        `created: ${state.created}`,
        `version: ${state.version}`,
        '---',
    ].join('\n');

    const timelineSection = state.timeline.length > 0
        ? state.timeline.map((e) => `- \`${e.timestamp}\` — ${e.message}`).join('\n')
        : '(none)';

    const artifactsSection = state.artifacts.length > 0
        ? state.artifacts.map((a) => `- ${a.agent}: \`${a.path}\` _(${a.timestamp})_`).join('\n')
        : '(none)';

    const decisionsSection = state.decisions.length > 0
        ? state.decisions.map((d) => `- ${d}`).join('\n')
        : '(none)';

    const blockersSection = state.blockers.length > 0
        ? state.blockers.map((b) => `- ${b}`).join('\n')
        : 'None';

    const nextStepsSection = state.nextSteps.length > 0
        ? state.nextSteps.map((s) => `- ${s}`).join('\n')
        : '(none)';

    return [
        frontmatter,
        '',
        '# Bifrost State',
        '',
        '## Timeline',
        timelineSection,
        '',
        '## Artifacts',
        artifactsSection,
        '',
        '## Decisions',
        decisionsSection,
        '',
        '## Blockers',
        blockersSection,
        '',
        '## Next Steps',
        nextStepsSection,
        '',
    ].join('\n');
}

function parseState(raw: string): BifrostState {
    const parsed = matter(raw);
    const { data, content } = parsed;

    const timeline: TimelineEntry[] = [];
    const artifacts: ArtifactEntry[] = [];
    const decisions: string[] = [];
    const blockers: string[] = [];
    const nextSteps: string[] = [];

    let currentSection = '';
    for (const line of content.split('\n')) {
        const h2 = line.match(/^## (.+)$/);
        if (h2) {
            currentSection = h2[1].trim();
            continue;
        }

        const bulletMatch = line.match(/^- (.+)$/);
        if (!bulletMatch) {
            continue;
        }
        const bulletContent = bulletMatch[1].trim();

        switch (currentSection) {
            case 'Timeline': {
                const timelineMatch = bulletContent.match(/`([^`]+)` — (.+)/);
                if (timelineMatch) {
                    timeline.push({ timestamp: timelineMatch[1], message: timelineMatch[2] });
                }
                break;
            }
            case 'Artifacts': {
                const artifactMatch = bulletContent.match(/(@\w+): `([^`]+)` _\(([^)]+)\)_/);
                if (artifactMatch) {
                    artifacts.push({
                        agent: artifactMatch[1] as AgentName,
                        path: artifactMatch[2],
                        timestamp: artifactMatch[3],
                    });
                }
                break;
            }
            case 'Decisions':
                if (bulletContent !== '(none)') {
                    decisions.push(bulletContent);
                }
                break;
            case 'Blockers':
                if (bulletContent.toLowerCase() !== 'none' && bulletContent !== '(none)') {
                    blockers.push(bulletContent);
                }
                break;
            case 'Next Steps':
                if (bulletContent !== '(none)') {
                    nextSteps.push(bulletContent);
                }
                break;
        }
    }

    return {
        id: String(data['id'] ?? ''),
        feature: String(data['feature'] ?? ''),
        status: (data['status'] as BifrostStatus) ?? BifrostStatus.INITIALIZED,
        autonomy: (data['autonomy'] as AutonomyLevel) ?? AutonomyLevel.TASK_GATED,
        created: String(data['created'] ?? nowIso()),
        version: String(data['version'] ?? nowIso()),
        timeline,
        artifacts,
        decisions,
        blockers,
        nextSteps,
    };
}

export async function initializeState(
    statePath: string,
    featureId: string,
    featureName: string,
    autonomyLevel: AutonomyLevel = AutonomyLevel.TASK_GATED,
): Promise<BifrostState> {
    const now = nowIso();
    const state: BifrostState = {
        id: featureId,
        feature: featureName,
        status: BifrostStatus.INITIALIZED,
        autonomy: autonomyLevel,
        created: now,
        version: now,
        timeline: [{ timestamp: now, message: 'Feature initialized' }],
        artifacts: [],
        decisions: [],
        blockers: [],
        nextSteps: [
            'Edit `.bifrost/PATIENT.md` with feature scope',
            'Run `bifrost start` to begin the workflow',
        ],
    };

    await fs.ensureDir(path.dirname(statePath));
    await fs.writeFile(statePath, renderState(state), 'utf8');
    return state;
}

export async function readState(statePath: string): Promise<BifrostState> {
    if (!(await fs.pathExists(statePath))) {
        throw new Error(
            `No STATE.md found at ${statePath}\nRun \`bifrost init\` first to initialize the project.`,
        );
    }
    const raw = await fs.readFile(statePath, 'utf8');
    return parseState(raw);
}

async function writeState(statePath: string, state: BifrostState): Promise<void> {
    state.version = nowIso();
    await fs.writeFile(statePath, renderState(state), 'utf8');
}

export async function updateStatus(statePath: string, status: BifrostStatus): Promise<void> {
    const state = await readState(statePath);
    state.status = status;
    await writeState(statePath, state);
}

export async function addTimeline(statePath: string, message: string): Promise<void> {
    const state = await readState(statePath);
    state.timeline.push({ timestamp: nowIso(), message });
    await writeState(statePath, state);
}

export async function addArtifact(
    statePath: string,
    agent: AgentName,
    artifactPath: string,
): Promise<void> {
    const state = await readState(statePath);
    state.artifacts.push({ agent, path: artifactPath, timestamp: nowIso() });
    await writeState(statePath, state);
}

export async function addBlocker(statePath: string, description: string): Promise<void> {
    const state = await readState(statePath);
    state.blockers.push(description);
    await writeState(statePath, state);
}

export async function removeBlocker(statePath: string, description: string): Promise<void> {
    const state = await readState(statePath);
    state.blockers = state.blockers.filter((b) => b !== description);
    await writeState(statePath, state);
}

export async function addDecision(statePath: string, decision: string): Promise<void> {
    const state = await readState(statePath);
    state.decisions.push(`${new Date().toLocaleDateString()} — ${decision}`);
    await writeState(statePath, state);
}

export async function setNextSteps(statePath: string, steps: string[]): Promise<void> {
    const state = await readState(statePath);
    state.nextSteps = steps;
    await writeState(statePath, state);
}

export function validateState(state: BifrostState): ValidationResult {
    const errors: string[] = [];

    if (!state.id) {
        errors.push('state.id is required');
    }
    if (!state.feature) {
        errors.push('state.feature is required');
    }
    if (!VALID_STATUSES.has(state.status)) {
        errors.push(`state.status "${state.status}" is not valid. Must be one of: ${[...VALID_STATUSES].join(', ')}`);
    }
    if (!state.created) {
        errors.push('state.created is required');
    }

    return { success: errors.length === 0, errors };
}

export function isReady(state: BifrostState): boolean {
    return state.status === BifrostStatus.INITIALIZED && state.blockers.length === 0;
}

export function isComplete(state: BifrostState): boolean {
    return [BifrostStatus.PR_CREATED, BifrostStatus.MERGED].includes(state.status);
}

export function hasBlockers(state: BifrostState): boolean {
    return state.blockers.length > 0;
}
