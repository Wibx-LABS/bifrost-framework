import * as path from 'path';
import * as fs from 'fs-extra';
import { InterrogationAnswers, ProjectPath, KnowledgeBase } from '../../types';
import { loadKnowledge } from '../knowledge/loader';

export async function writeHydrationFiles(
    bifrostDir: string,
    answers: InterrogationAnswers,
    frameworkPath: string
): Promise<void> {
    const configPath = path.join(frameworkPath, 'core', 'agents', 'hydration', 'injection-points.json');
    if (!(await fs.pathExists(configPath))) {
        throw new Error(`Critical Error: injection-points.json not found at ${configPath}`);
    }
    const config = await fs.readJson(configPath);

    const featureName = answers.path === ProjectPath.B ? answers.projectName : answers.featureName;
    const projectVars: Record<string, any> = {
        'project-name': featureName,
        'feature-name': featureName,
        'feature-description': answers.featureDescription || '',
        'timeline': answers.timeline || '',
        'target-app': (answers as any).targetApp || '',
        'business-value': (answers as any).businessValue || '',
        'feature-owner': (answers as any).featureOwner || '',
        'author-name': (answers as any).featureOwner || 'Bifrost Agent',
    };

    let kb: KnowledgeBase | undefined;
    try {
        kb = await loadKnowledge(path.join(frameworkPath, 'knowledge'));
    } catch (e) {
        console.warn('[WARNING] Failed to load knowledge base.');
    }

    // 1. Hydrate Artifacts (core/templates)
    await hydrateSet(
        path.join(frameworkPath, 'core', 'templates'),
        bifrostDir,
        config._artifact_templates,
        projectVars,
        kb,
        frameworkPath,
        false
    );

    // 2. Hydrate Agents (core/agents/templates)
    const agentsDir = path.join(bifrostDir, 'agents');
    await fs.ensureDir(agentsDir);
    await hydrateSet(
        path.join(frameworkPath, 'core', 'agents', 'templates'),
        agentsDir,
        config._agent_templates,
        projectVars,
        kb,
        frameworkPath,
        true
    );

    await fs.writeFile(path.join(bifrostDir, 'interrogation.md'), buildInterrogationMarkdown(answers), 'utf8');
}

async function hydrateSet(
    sourceDir: string,
    destDir: string,
    mapping: any,
    projectVars: Record<string, any>,
    kb: KnowledgeBase | undefined,
    frameworkPath: string,
    renameToHydrated: boolean
) {
    for (const [templateName, points] of Object.entries(mapping)) {
        const sourcePath = path.join(sourceDir, templateName);
        if (!(await fs.pathExists(sourcePath))) continue;

        let content = await fs.readFile(sourcePath, 'utf8');
        const tags = content.match(/{{[\w-]+}}/g) || [];

        // Pre-resolve all unique tags to prevent redundant processing
        const uniqueTags = Array.from(new Set(tags));
        for (const tag of uniqueTags) {
            const key = tag.slice(2, -2).toLowerCase().replace(/_/g, '-');
            const pointKey = Object.keys(points as object).find(k => k.toLowerCase().replace(/_/g, '-') === key);
            const pointConfig = pointKey ? (points as any)[pointKey] : null;
            
            let replacement = tag;
            if (pointConfig) {
                replacement = await resolveInjection(pointConfig, projectVars, kb, frameworkPath, key);
            } else if (projectVars[key]) {
                replacement = projectVars[key];
            }

            content = content.split(tag).join(replacement);
        }

        const destFileName = renameToHydrated ? templateName.replace('_Template.md', '_HYDRATED.md') : templateName;
        await fs.writeFile(path.join(destDir, destFileName), content, 'utf8');
    }
}

async function resolveInjection(
    config: any,
    projectVars: Record<string, any>,
    kb: KnowledgeBase | undefined,
    frameworkPath: string,
    key: string
): Promise<string> {
    switch (config.source) {
        case 'interview':
            const interviewKey = config.key.toLowerCase().replace(/_/g, '-');
            return String(projectVars[interviewKey] || `<!-- Missing interview key: ${config.key} -->`);
        case 'computed':
            if (config.value === 'iso-date') return new Date().toISOString().split('T')[0];
            if (config.value === 'iso-timestamp') return new Date().toISOString();
            if (config.value === 'framework-version') return '1.0.0-os';
            if (config.value === 'constant:pending') return 'pending';
            if (config.value.startsWith('constant:')) return config.value.replace('constant:', '');
            if (config.value === 'uuid') return Math.random().toString(36).substring(2, 15);
            if (config.value === 'kebab-case-of-project-name') {
                return String(projectVars['project-name'] || 'unknown').toLowerCase().replace(/\s+/g, '-');
            }
            return `<!-- Unknown computed value: ${config.value} -->`;
        case 'agent_fill':
            return `{{${key}}}`;
        case 'knowledge':
            if (key === 'api-contracts' && kb) {
                const targetApp = projectVars['target-app'];
                const filtered = targetApp ? kb.findApiByDomain(targetApp) : kb.apis;
                return filtered.length > 0 ? filtered.map(api => api.rawContent).join('\n\n---\n\n') : `<!-- No APIs found for ${targetApp} -->`;
            }
            if (key === 'component-library' && kb) {
                const targetApp = projectVars['target-app'];
                const filtered = kb.components.filter(c => 
                    c.category.toLowerCase().includes('general') || 
                    c.category.toLowerCase().includes('common') ||
                    (targetApp && c.rawContent.toLowerCase().includes(targetApp.toLowerCase()))
                );
                return filtered.map(c => c.rawContent).join('\n\n---\n\n');
            }

            const filePath = path.join(frameworkPath, 'knowledge', config.file);
            if (!(await fs.pathExists(filePath))) return `<!-- Knowledge file missing: ${config.file} -->`;
            let fileContent = await fs.readFile(filePath, 'utf8');
            if (config.sections || config.section) {
                return extractMarkdownSections(fileContent, config.sections || [config.section]);
            }
            return fileContent;
        default:
            return `<!-- Unknown source: ${config.source} -->`;
    }
}

function extractMarkdownSections(content: string, sections: string[]): string {
    const lines = content.split('\n');
    const result: string[] = [];
    let capturing = false;

    for (const line of lines) {
        if (line.startsWith('## ')) {
            const header = line.replace('## ', '').trim();
            const shouldStart = sections.some(s => {
                const cleanS = s.toString().toLowerCase();
                const cleanH = header.toLowerCase();
                return cleanH.startsWith(cleanS + '.') || cleanH === cleanS || cleanH.startsWith(cleanS + ' ');
            });

            if (shouldStart) {
                capturing = true;
                result.push(line);
            } else {
                capturing = false;
            }
            continue;
        }
        
        if (capturing) {
            result.push(line);
        }
    }
    return result.length > 0 ? result.join('\n').trim() : `<!-- No matching sections found for: ${sections.join(', ')} -->`;
}

function buildInterrogationMarkdown(answers: InterrogationAnswers): string {
    const lines: string[] = [`# Interrogation Results`, ``, `**Date:** ${new Date().toISOString()}`, `**Path:** ${answers.path}`, ``];
    if (answers.path === ProjectPath.A) {
        lines.push(`- **Feature Name:** ${answers.featureName}`, `- **Description:** ${answers.featureDescription}`, `- **Target App:** ${answers.targetApp}`, `- **Scope:** ${answers.featureScope}`, `- **Timeline:** ${answers.timeline}`);
    }
    return lines.join('\n');
}
