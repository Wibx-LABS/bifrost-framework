import * as path from 'path';
import * as fs from 'fs-extra';
import * as os from 'os';
import { info, success, warn } from '../../ui';

export async function installClaudeSkills(frameworkPath: string, bifrostDir: string): Promise<void> {
    const claudeDir = path.join(os.homedir(), '.claude');
    const skillsDir = path.join(claudeDir, 'skills');
    
    if (!(await fs.pathExists(claudeDir))) {
        warn('Claude Code directory (~/.claude) not found. Skills will not be auto-loaded into Claude Code.');
        return;
    }

    await fs.ensureDir(skillsDir);

    // Copy raw skills
    const sourceSkillsDir = path.join(frameworkPath, 'core', 'skills');
    if (await fs.pathExists(sourceSkillsDir)) {
        const categories = await fs.readdir(sourceSkillsDir);
        for (const cat of categories) {
            const catPath = path.join(sourceSkillsDir, cat);
            const skillFile = path.join(catPath, 'SKILL.md');
            
            if ((await fs.stat(catPath)).isDirectory() && await fs.pathExists(skillFile)) {
                const target = path.join(skillsDir, `${cat}.md`);
                await fs.copy(skillFile, target);
                info(`  Installed skill: ${cat}.md`);
            }
        }
    }

    // Copy hydrated agents
    const agentsDir = path.join(bifrostDir, 'agents');
    if (await fs.pathExists(agentsDir)) {
        const agents = await fs.readdir(agentsDir);
        for (const agent of agents) {
            if (agent.endsWith('_HYDRATED.md')) {
                const target = path.join(skillsDir, `bifrost-${agent.replace('_HYDRATED.md', '.md').toLowerCase()}`);
                await fs.copy(path.join(agentsDir, agent), target);
                info(`  Installed agent skill: bifrost-${agent.replace('_HYDRATED.md', '').toLowerCase()}`);
            }
        }
    }

    success('Bifrost skills installed into Claude Code.');
}

export async function installAntigravitySkills(projectPath: string, frameworkPath: string, bifrostDir: string): Promise<void> {
    const targetDir = path.join(projectPath, '.gemini', 'antigravity', 'skills');
    await fs.ensureDir(targetDir);

    const sourceSkillsDir = path.join(frameworkPath, 'core', 'skills');
    if (await fs.pathExists(sourceSkillsDir)) {
        const categories = await fs.readdir(sourceSkillsDir);
        for (const cat of categories) {
            const catPath = path.join(sourceSkillsDir, cat);
            const skillFile = path.join(catPath, 'SKILL.md');
            
            if ((await fs.stat(catPath)).isDirectory() && await fs.pathExists(skillFile)) {
                await fs.copy(skillFile, path.join(targetDir, `${cat}.md`));
            }
        }
    }

    const agentsDir = path.join(bifrostDir, 'agents');
    if (await fs.pathExists(agentsDir)) {
        const agents = await fs.readdir(agentsDir);
        for (const agent of agents) {
            if (agent.endsWith('_HYDRATED.md')) {
                const target = path.join(targetDir, `bifrost-${agent.replace('_HYDRATED.md', '.md').toLowerCase()}`);
                await fs.copy(path.join(agentsDir, agent), target);
            }
        }
    }
}
