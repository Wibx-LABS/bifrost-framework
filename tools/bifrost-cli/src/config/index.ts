import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs-extra';
import { AutonomyLevel, BifrostConfig } from '../types';

const PACKAGE_VERSION = '1.0.0';

const DEFAULTS: BifrostConfig = {
    version: PACKAGE_VERSION,
    knowledgePath: resolveDefaultKnowledgePath(),
    bifrostFrameworkPath: resolveDefaultFrameworkPath(),
    defaultAutonomyLevel: AutonomyLevel.TASK_GATED,
    agentTimeoutMs: 30 * 60 * 1000,
    defaultBranch: 'main',
    dryRun: false,
    targetApps: [],
};

function resolveDefaultFrameworkPath(): string {
    if (process.env.BIFROST_FRAMEWORK_PATH) {
        return process.env.BIFROST_FRAMEWORK_PATH;
    }
    return process.cwd();
}

function resolveDefaultKnowledgePath(): string {
    if (process.env.BIFROST_KNOWLEDGE_PATH) {
        return process.env.BIFROST_KNOWLEDGE_PATH;
    }
    if (process.env.BIFROST_FRAMEWORK_PATH) {
        return path.join(process.env.BIFROST_FRAMEWORK_PATH, 'knowledge');
    }
    return path.join(process.cwd(), 'knowledge');
}

function loadRcFile(filePath: string): Partial<BifrostConfig> {
    try {
        if (fs.existsSync(filePath)) {
            return fs.readJsonSync(filePath);
        }
    } catch {
        // silent — missing or malformed rc file falls back to defaults
    }
    return {};
}

let _cached: BifrostConfig | null = null;

export function loadConfig(projectPath = process.cwd()): BifrostConfig {
    if (_cached) {
        return _cached;
    }

    const userRc = loadRcFile(path.join(os.homedir(), '.bifrostrc.json'));
    const projectRc = loadRcFile(path.join(projectPath, '.bifrostrc.json'));

    const merged: BifrostConfig = {
        ...DEFAULTS,
        ...userRc,
        ...projectRc,
        version: PACKAGE_VERSION,
        dryRun: process.env.BIFROST_DRY_RUN === 'true' || projectRc.dryRun || false,
    };

    if (process.env.BIFROST_KNOWLEDGE_PATH) {
        merged.knowledgePath = process.env.BIFROST_KNOWLEDGE_PATH;
    }
    if (process.env.BIFROST_FRAMEWORK_PATH) {
        merged.bifrostFrameworkPath = process.env.BIFROST_FRAMEWORK_PATH;
        if (!process.env.BIFROST_KNOWLEDGE_PATH && !projectRc.knowledgePath && !userRc.knowledgePath) {
            merged.knowledgePath = path.join(process.env.BIFROST_FRAMEWORK_PATH, 'knowledge');
        }
    }

    _cached = merged;
    return merged;
}

export function clearConfigCache(): void {
    _cached = null;
}

export function getBifrostDir(projectPath = process.cwd()): string {
    return path.join(projectPath, '.bifrost');
}

export function getStatePath(projectPath = process.cwd()): string {
    return path.join(getBifrostDir(projectPath), 'STATE.md');
}

export function getHydrationPath(projectPath = process.cwd()): string {
    return path.join(getBifrostDir(projectPath), 'hydration.json');
}

export function getTriggerPath(projectPath = process.cwd()): string {
    return path.join(getBifrostDir(projectPath), 'agents', 'trigger.json');
}

export function getArtifactsDir(projectPath = process.cwd()): string {
    return path.join(getBifrostDir(projectPath), 'artifacts');
}

export { PACKAGE_VERSION };
