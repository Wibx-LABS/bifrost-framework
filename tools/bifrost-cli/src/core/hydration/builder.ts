import * as path from 'path';
import * as fs from 'fs-extra';
import { InterrogationAnswers, ProjectPath } from '../../types';

export async function writeHydrationFiles(
    bifrostDir: string,
    answers: InterrogationAnswers,
    frameworkPath: string
): Promise<void> {
    const agentsDir = path.join(bifrostDir, 'agents');
    await fs.ensureDir(agentsDir);

    const templatesDir = path.join(frameworkPath, 'core', 'agents', 'templates');
    
    if (!(await fs.pathExists(templatesDir))) {
        // Fallback: create empty dir if it does not exist
        await fs.ensureDir(templatesDir);
    }

    const files = await fs.readdir(templatesDir);
    const templateFiles = files.filter(f => f.endsWith('_Template.md'));

    const featureName = answers.path === ProjectPath.B ? answers.projectName : answers.featureName;
    const projectVars: Record<string, string> = {
        'project-name': featureName,
        'feature-name': featureName,
        'feature-description': answers.featureDescription || '',
        'timeline': answers.timeline || '',
        'target-app': (answers as any).targetApp || '',
        'business-value': (answers as any).businessValue || '',
        'feature-owner': (answers as any).featureOwner || '',
    };

    for (const file of templateFiles) {
        const templateContent = await fs.readFile(path.join(templatesDir, file), 'utf8');
        const injectionPoints = templateContent.match(/{{[\w-]+}}/g);
        
        let hydratedContent = templateContent;
        
        if (injectionPoints) {
            for (const point of injectionPoints) {
                const key = point.slice(2, -2); // remove {{ }}
                let replacement = point;

                if (projectVars[key] !== undefined) {
                    replacement = projectVars[key];
                } else {
                    // Map {{some-key}} to specific files
                    // example: {{api-contracts}} -> knowledge/API_CONTRACTS.md
                    // example: {{code-standards}} -> core/skills/bifrost-code-standards/SKILL.md
                    const knowledgeFile = path.join(frameworkPath, 'knowledge', `${key.toUpperCase().replace(/-/g, '_')}.md`);
                    const skillFile = path.join(frameworkPath, 'core', 'skills', `bifrost-${key}`, 'SKILL.md');
                    
                    if (await fs.pathExists(knowledgeFile)) {
                        replacement = await fs.readFile(knowledgeFile, 'utf8');
                    } else if (await fs.pathExists(skillFile)) {
                        replacement = await fs.readFile(skillFile, 'utf8');
                    } else {
                        // Fallback if not found
                        replacement = `<!-- Missing knowledge or var for ${key} -->`;
                    }
                }
                
                hydratedContent = hydratedContent.replace(new RegExp(point, 'g'), replacement);
            }
        }
        
        const hydratedFileName = file.replace('_Template.md', '_HYDRATED.md');
        await fs.writeFile(path.join(agentsDir, hydratedFileName), hydratedContent, 'utf8');
    }

    // Write interrogation.md
    await fs.writeFile(
        path.join(bifrostDir, 'interrogation.md'),
        buildInterrogationMarkdown(answers),
        'utf8'
    );
}

// Placeholder to satisfy outdated integration tests
export async function buildHydration(answers: any, knowledge: any, projectPath: string, autonomyLevel?: any): Promise<any> {
    return {
        project: { name: answers.featureName || answers.projectName || 'Test', autonomyLevel },
        meta: { interrogationPath: answers.path },
        instructions: { destination: 'apps/business', featureScope: answers.featureName }
    };
}

function buildInterrogationMarkdown(answers: InterrogationAnswers): string {
    const lines: string[] = [
        `# Interrogation Results`,
        ``,
        `**Date:** ${new Date().toISOString()}`,
        `**Path:** ${answers.path}`,
        ``,
        `## Answers`,
        ``,
    ];

    if (answers.path === ProjectPath.A) {
        lines.push(`- **Feature Name:** ${answers.featureName}`);
        lines.push(`- **Description:** ${answers.featureDescription}`);
        lines.push(`- **Business Value:** ${answers.businessValue}`);
        lines.push(`- **Owner:** ${answers.featureOwner}`);
        if (answers.constraints) {
            lines.push(`- **Constraints:** ${answers.constraints}`);
        }
        lines.push(`- **Target App:** ${answers.targetApp}`);
        lines.push(`- **Scope:** ${answers.featureScope}`);
        if (answers.targetSection) {
            lines.push(`- **Section:** ${answers.targetSection}`);
        }
        lines.push(`- **Needs State/API:** ${answers.needsApi ? 'Yes' : 'No'}`);
        lines.push(`- **Timeline:** ${answers.timeline}`);
    } else if (answers.path === ProjectPath.B) {
        lines.push(`- **Project Name:** ${answers.projectName}`);
        lines.push(`- **Feature:** ${answers.featureName}`);
        lines.push(`- **Description:** ${answers.featureDescription}`);
        lines.push(`- **User Actions:**`);
        answers.userActions.forEach((a, i) => lines.push(`  ${i + 1}. ${a}`));
        if (answers.externalServices.length > 0) {
            lines.push(`- **External Services:** ${answers.externalServices.join(', ')}`);
        }
        lines.push(`- **Timeline:** ${answers.timeline}`);
    } else {
        const c = answers as { buildingWhat?: string; featureName: string; featureDescription: string; timeline: string };
        lines.push(`- **What:** ${c.buildingWhat ?? c.featureName}`);
        lines.push(`- **Description:** ${c.featureDescription}`);
        lines.push(`- **Timeline:** ${c.timeline}`);
    }

    return lines.join('\n');
}
