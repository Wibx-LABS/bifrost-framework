const fs = require('fs');
const path = require('path');

/**
 * Bifrost Agent Hydration System
 * Injects project context into agent templates
 */

function hydrate(projectPath, context) {
    console.log(`💧 Hydrating agents for project: ${context.PROJECT_NAME || 'Unknown'}`);

    const agentsTemplateDir = path.join(__dirname, '../templates');
    const targetAgentsDir = path.join(projectPath, '.bifrost/agents');
    const injectionPointsPath = path.join(__dirname, 'injection-points.json');

    if (!fs.existsSync(targetAgentsDir)) {
        fs.mkdirSync(targetAgentsDir, { recursive: true });
    }

    let injectionPoints = {};
    if (fs.existsSync(injectionPointsPath)) {
        injectionPoints = JSON.parse(fs.readFileSync(injectionPointsPath, 'utf8'));
    }

    const templates = fs.readdirSync(agentsTemplateDir);
    templates.forEach(templateFile => {
        if (!templateFile.endsWith('.md')) return;

        const templatePath = path.join(agentsTemplateDir, templateFile);
        let content = fs.readFileSync(templatePath, 'utf8');

        // Apply global context variables
        Object.keys(context).forEach(key => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            content = content.replace(regex, context[key]);
        });

        // Apply template-specific injection points
        const templateConfig = injectionPoints[templateFile];
        if (templateConfig) {
            Object.keys(templateConfig).forEach(key => {
                const placeholder = templateConfig[key];
                // In a real system, we would resolve these placeholders from knowledge/ or skills/
                // For now, we'll use the provided context or a default message
                const value = context[key] || `[Reference: ${placeholder}]`;
                const regex = new RegExp(`{{${key}}}`, 'g');
                content = content.replace(regex, value);
            });
        }

        const hydratedFileName = templateFile.replace('_Template.md', '_HYDRATED.md');
        fs.writeFileSync(path.join(targetAgentsDir, hydratedFileName), content);
    });

    console.log('✅ Agents hydrated successfully.');
}

if (require.main === module) {
    // Example usage for testing
    const exampleContext = {
        PROJECT_NAME: "Example Feature",
        TECH_STACK: "Node.js, TypeScript",
        TARGET_PATH: "src/features/example"
    };
    hydrate(process.cwd(), exampleContext);
}

module.exports = { hydrate };
