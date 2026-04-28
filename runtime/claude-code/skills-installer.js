const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

/**
 * Bifrost Skills Installer for Claude Code
 * Injects project-specific agents and skills into Claude's global configuration
 */

function install() {
    const homeDir = os.homedir();
    const claudeSkillsDir = path.join(homeDir, '.claude', 'skills');
    const bifrostBaseDir = path.join(claudeSkillsDir, 'bifrost-framework');

    console.log('[...] Instalando skills do Bifrost no Claude Code...');

    if (!fs.existsSync('.bifrost')) {
        console.error('[ERRO] Diretório .bifrost não encontrado. Execute isto da raiz do seu projeto.');
        process.exit(1);
    }

    try {
        // Create target directory
        if (!fs.existsSync(bifrostBaseDir)) {
            fs.mkdirSync(bifrostBaseDir, { recursive: true });
        }

        // 1. Install Hydrated Agents
        const agentsDir = '.bifrost/agents';
        if (fs.existsSync(agentsDir)) {
            const agents = fs.readdirSync(agentsDir);
            agents.forEach(agent => {
                if (agent.endsWith('.md')) {
                    fs.copyFileSync(path.join(agentsDir, agent), path.join(bifrostBaseDir, agent));
                }
            });
        }

        // 2. Install Project Context
        const contextFile = '.bifrost/PROJECT_CONTEXT.md';
        if (fs.existsSync(contextFile)) {
            fs.copyFileSync(contextFile, path.join(homeDir, '.claude', 'PROJECT_CONTEXT.md'));
        }

        // 3. Install Global Skills (from framework core if available)
        // This part would typically be handled by the framework installer, 
        // but we ensure project-local skills are also accessible.

        console.log('[OK] Skills do Bifrost instaladas com sucesso no Claude Code.');
    } catch (err) {
        console.error(`[ERRO] Falha ao instalar skills: ${err.message}`);
        process.exit(1);
    }
}

if (require.main === module) {
    install();
}

module.exports = { install };
