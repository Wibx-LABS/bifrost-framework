import { Command, Flags } from '@oclif/core';
import * as path from 'path';
import * as fs from 'fs-extra';
import { prompt } from 'enquirer';
import chalk from 'chalk';
import {
    AutonomyLevel,
    FeatureScope,
    InterrogationAnswers,
    InterrogationAnswersA,
    InterrogationAnswersB,
    InterrogationAnswersC,
    ProjectPath,
} from '../types';
import { loadConfig, getBifrostDir, getStatePath, getHydrationPath, PACKAGE_VERSION } from '../config';
import { writeHydrationFiles } from '../core/hydration/builder';
import { initializeState } from '../core/state/manager';
import { isGitRepo, createBranch } from '../core/git';
import {
    showSplash,
    success,
    fail,
    warn,
    info,
    blank,
    header,
    spinner,
    renderAssetDiscovery,
    renderSetupComplete,
    renderNextSteps,
    microLoader,
    delay,
} from '../ui';
import { loadKnowledge } from '../core/knowledge/loader';
import { KnowledgeBase } from '../types';
import { parsePatientMd, validatePatientAnswers } from '../core/parser/patient';


const FEATURE_SCOPES = Object.values(FeatureScope);
const EXTERNAL_SERVICES = ['Stripe', 'Google Maps', 'Google Analytics', 'Firebase', 'Auth0', 'Twilio', 'SendGrid'];

function generateFeatureId(featureName: string): string {
    const slug = featureName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 30);
    const ts = Date.now().toString(36);
    return `feat-${slug}-${ts}`;
}

function buildBranchName(featureName: string): string {
    return `bifrost/${featureName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 40)}`;
}

async function checkPrerequisites(projectPath: string): Promise<void> {
    const isGit = await isGitRepo(projectPath);
    if (!isGit) {
        warn('Não é um repositório git. Git hooks e branches serão ignorados.');
        warn('Execute `git init` para habilitar o fluxo completo do Bifrost.');
    } else {
        success('Repositório git detectado');
    }
}

async function checkAssets(projectPath: string): Promise<{ hasAssets: boolean; hasInstructions: boolean }> {
    const hasAssets = await fs.pathExists(path.join(projectPath, 'assets'));
    const hasInstructions = await fs.pathExists(path.join(projectPath, 'assets_instruction.md'));
    return { hasAssets, hasInstructions };
}

async function promptPathA(projectPath: string, kb?: KnowledgeBase): Promise<InterrogationAnswers> {
    const config = loadConfig(projectPath);
    
    let targetApps = config.targetApps && config.targetApps.length > 0 ? config.targetApps : ['App 1', 'App 2'];
    const mapping = kb?.repositoryMapping || [];

    if (mapping.length > 0) {
        targetApps = mapping.map(m => m.name);
    }

    const { targetApp } = await prompt<{ targetApp: string }>({
        type: 'autocomplete',
        name: 'targetApp',
        message: 'Which application are we targeting?',
        choices: targetApps,
    });

    const sections = mapping.find(m => m.name === targetApp)?.sections || [];

    const { featureScope } = await prompt<{ featureScope: string }>({
        type: 'select',
        name: 'featureScope',
        message: 'What scope?',
        choices: FEATURE_SCOPES,
    });

    let targetSection: string | undefined;
    if (featureScope === FeatureScope.UPDATE_EXISTING) {
        if (sections.length > 0) {
            const result = await prompt<{ targetSection: string }>({
                type: 'autocomplete',
                name: 'targetSection',
                message: 'Which section? (Type to filter)',
                choices: [...sections, 'Other (Type manually)'],
            });
            
            if (result.targetSection === 'Other (Type manually)') {
                const manual = await prompt<{ targetSection: string }>({
                    type: 'input',
                    name: 'targetSection',
                    message: 'Type the section name:',
                });
                targetSection = manual.targetSection;
            } else {
                targetSection = result.targetSection;
            }
        } else {
            const result = await prompt<{ targetSection: string }>({
                type: 'input',
                name: 'targetSection',
                message: 'Which section? (e.g., "Finance", "Rewards")',
            });
            targetSection = result.targetSection;
        }
    }

    const isKnownStateful = mapping.find(m => m.name === targetApp)?.statefulSections.some(s => 
        (targetSection && s.toLowerCase().includes(targetSection.toLowerCase())) || 
        (targetApp === 'wallet')
    ) || false;

    const { needsApiStr } = await prompt<{ needsApiStr: string }>({
        type: 'select',
        name: 'needsApiStr',
        message: 'Does this need to handle/save information?',
        initial: isKnownStateful ? 0 : 1,
        choices: [
            'Yes (Save/Connect) — requires state management + API patterns',
            'No (Visual Only) — UI only',
        ],
    });

    const { featureName } = await prompt<{ featureName: string }>({
        type: 'input',
        name: 'featureName',
        message: 'What are we working on? (Task/Feature/Fix):',
        validate: (v) => v.length > 0 || 'Task description is required',
    });

    const { featureDescription } = await prompt<{ featureDescription: string }>({
        type: 'input',
        name: 'featureDescription',
        message: 'Brief details (Optional):',
        initial: (input: any) => {
            if (featureName.toLowerCase().startsWith('fix')) return 'Bug fix: ' + featureName;
            if (featureName.toLowerCase().startsWith('refactor')) return 'Technical debt: ' + featureName;
            return 'Work item: ' + featureName;
        },
    });

    const { businessValue } = await prompt<{ businessValue: string }>({
        type: 'input',
        name: 'businessValue',
        message: 'Objective (Optional):',
        initial: 'System maintenance & stability',
    });

    const { featureOwner } = await prompt<{ featureOwner: string }>({
        type: 'input',
        name: 'featureOwner',
        message: 'Point of Contact (Optional):',
        initial: 'caiosobrinho',
    });

    const { constraints } = await prompt<{ constraints: string }>({
        type: 'input',
        name: 'constraints',
        message: 'Constraints (Optional):',
        initial: 'None',
    });

    const { timeline } = await prompt<{ timeline: string }>({
        type: 'input',
        name: 'timeline',
        message: 'Timeline (Optional):',
        initial: 'TBD',
    });

    return {
        path: ProjectPath.A,
        targetApp,
        featureScope: featureScope as FeatureScope,
        targetSection,
        needsApi: needsApiStr.startsWith('Yes'),
        featureName,
        featureDescription,
        businessValue,
        featureOwner,
        constraints,
        timeline,
    } as InterrogationAnswersA;
}

async function promptPathB(projectPath: string): Promise<InterrogationAnswers> {
    const { projectName } = await prompt<{ projectName: string }>({
        type: 'input',
        name: 'projectName',
        message: 'What is the name of this project?',
    });

    info('Liste as 3 ações mais importantes do usuário:');
    const actions: string[] = [];
    for (let i = 1; i <= 3; i++) {
        const { action } = await prompt<{ action: string }>({
            type: 'input',
            name: 'action',
            message: `  ${i}.`,
        });
        actions.push(action);
    }

    const { externalServices } = await prompt<{ externalServices: string[] }>({
        type: 'multiselect',
        name: 'externalServices',
        message: 'Does this require external services? (Space to select, Enter to confirm)',
        choices: EXTERNAL_SERVICES,
    } as never);

    const { featureDescription } = await prompt<{ featureDescription: string }>({
        type: 'input',
        name: 'featureDescription',
        message: 'Brief description?',
    });

    const { timeline } = await prompt<{ timeline: string }>({
        type: 'input',
        name: 'timeline',
        message: 'Timeline?',
        initial: '4 weeks',
    });

    return {
        path: ProjectPath.B,
        projectName,
        featureName: projectName,
        featureDescription,
        userActions: actions,
        externalServices: externalServices ?? [],
        timeline,
    } as InterrogationAnswersB;
}

async function promptPathC(projectPath: string): Promise<InterrogationAnswers> {
    const { buildingWhat } = await prompt<{ buildingWhat: string }>({
        type: 'input',
        name: 'buildingWhat',
        message: 'What are we building? (e.g., "Internal Tool", "Promo Page")',
    });

    const { featureDescription } = await prompt<{ featureDescription: string }>({
        type: 'input',
        name: 'featureDescription',
        message: 'Brief description?',
    });

    const { timeline } = await prompt<{ timeline: string }>({
        type: 'input',
        name: 'timeline',
        message: 'Deadline?',
        initial: '1 week',
    });

    return {
        path: ProjectPath.C,
        buildingWhat,
        featureName: buildingWhat,
        featureDescription,
        timeline,
    } as InterrogationAnswersC;
}

function buildPatientMd(
    featureName: string,
    featureDescription: string,
    businessValue: string,
    featureOwner: string,
    timeline: string,
    destination: string,
): string {
    return [
        `# Feature Scope (PATIENT.md)`,
        ``,
        `**Feature:** ${featureName}`,
        `**Owner:** ${featureOwner}`,
        `**Timeline:** ${timeline}`,
        `**Created:** ${new Date().toISOString()}`,
        ``,
        `---`,
        ``,
        `## Business Value`,
        ``,
        businessValue,
        ``,
        `---`,
        ``,
        `## Description`,
        ``,
        featureDescription,
        ``,
        `---`,
        ``,
        `## User Stories`,
        ``,
        `<!-- Replace with specific user stories -->`,
        `- As a [user type], I want to [action], so that [benefit]`,
        `- As a [user type], I want to [action], so that [benefit]`,
        `- As a [user type], I want to [action], so that [benefit]`,
        ``,
        `---`,
        ``,
        `## Acceptance Criteria`,
        ``,
        `<!-- Replace with specific criteria -->`,
        `- [ ] Criterion 1`,
        `- [ ] Criterion 2`,
        `- [ ] Criterion 3`,
        ``,
        `---`,
        ``,
        `## Constraints & Notes`,
        ``,
        `- Timeline: ${timeline}`,
        `- Target: ${destination}`,
        ``,
        `---`,
        ``,
        `## Edge Cases`,
        ``,
        `- [ ] Edge case 1`,
        `- [ ] Edge case 2`,
        ``,
        `---`,
        ``,
        `**Edit this file with your specific requirements before running \`bifrost start\`.**`,
    ].join('\n');
}

function buildHealthMd(): string {
    return [
        `# Quality Gates (HEALTH.md)`,
        ``,
        `All gates must pass before delivery.`,
        ``,
        `## Code Quality`,
        `- [ ] TypeScript strict mode passes`,
        `- [ ] ESLint passes (no errors)`,
        `- [ ] Naming conventions followed`,
        `- [ ] No console.log in production code`,
        ``,
        `## Testing`,
        `- [ ] Unit tests pass`,
        `- [ ] Happy path tested`,
        `- [ ] Error states tested`,
        `- [ ] Edge cases tested`,
        ``,
        `## API Compliance`,
        `- [ ] All API calls use centralized \`api\` constant`,
        `- [ ] Error handling implemented`,
        ``,
        `## Angular Standards`,
        `- [ ] No unsubscribed observables`,
        `- [ ] OnPush change detection where applicable`,
        `- [ ] trackBy in *ngFor loops`,
        `- [ ] SafeMath for financial calculations`,
        ``,
        `## Delivery`,
        `- [ ] All agents completed`,
        `- [ ] QA_REPORT.md shows PASS`,
        `- [ ] PR description complete`,
    ].join('\n');
}

function buildAutonomyMd(level: AutonomyLevel): string {
    return [
        `# Autonomy Level (AUTONOMY.md)`,
        ``,
        `**Current Level:** ${level}`,
        ``,
        `## Levels`,
        ``,
        `- **task-gated** — Each task requires approval (default)`,
        `- **phase-gated** — Each phase (Intake/Plan/Code/QA) requires approval`,
        `- **full** — Agents proceed autonomously`,
        ``,
        `To change: edit "Current Level" above and restart the workflow.`,
    ].join('\n');
}

function buildTemplateMd(agentName: string): string {
    return `# ${agentName} Output\n\n> This file will be written by the ${agentName} agent when the workflow runs.\n`;
}

function buildProjectContextMd(featureName: string, destination: string): string {
    return [
        `# Project Context: ${featureName}`,
        ``,
        `**Target Application:** ${destination}`,
        `**Stack Lock:** Angular 15, NgRx 14, TailwindCSS`,
        ``,
        `## Domain Knowledge`,
        `This project is part of the Wiboo monorepo.`,
        ``,
        `## Architectural Principles`,
        `- Atomic Design for components`,
        `- Unidirectional data flow (NgRx)`,
        `- Strict TypeScript`,
    ].join('\n');
}

async function createBifrostDirectory(
    bifrostDir: string,
    featureName: string,
    featureDescription: string,
    businessValue: string,
    featureOwner: string,
    constraints: string | undefined,
    timeline: string,
    destination: string,
    autonomyLevel: AutonomyLevel,
): Promise<void> {
    await fs.ensureDir(bifrostDir);
    await fs.ensureDir(path.join(bifrostDir, 'artifacts'));
    await fs.ensureDir(path.join(bifrostDir, 'agents'));

    await Promise.all([
        fs.writeFile(path.join(bifrostDir, 'PATIENT.md'), buildPatientMd(featureName, featureDescription, businessValue, featureOwner, timeline, destination), 'utf8'),
        fs.writeFile(path.join(bifrostDir, 'STATE.md'), buildTemplateMd('@Conductor'), 'utf8'),
        fs.writeFile(path.join(bifrostDir, 'TRAJECTORY.md'), buildTemplateMd('@Intake'), 'utf8'),
        fs.writeFile(path.join(bifrostDir, 'IMPACT.md'), buildTemplateMd('@Intake'), 'utf8'),
        fs.writeFile(path.join(bifrostDir, 'PLAN.md'), buildTemplateMd('@Planner'), 'utf8'),
        fs.writeFile(path.join(bifrostDir, 'CODE_REVIEW.md'), buildTemplateMd('@CodeGen'), 'utf8'),
        fs.writeFile(path.join(bifrostDir, 'QA_REPORT.md'), buildTemplateMd('@QA'), 'utf8'),
        fs.writeFile(path.join(bifrostDir, 'HANDOFF.md'), buildTemplateMd('@Reviewer'), 'utf8'),
        fs.writeFile(path.join(bifrostDir, 'VITALS.md'), buildTemplateMd('@Monitor'), 'utf8'),
        fs.writeFile(path.join(bifrostDir, 'PROJECT_CONTEXT.md'), buildProjectContextMd(featureName, destination), 'utf8'),
    ]);
}

export default class Init extends Command {
    static description = 'Initialize a new Bifrost feature project';

    static examples = [
        '<%= config.bin %> init',
        '<%= config.bin %> init --path /my/project --dry-run',
    ];

    static flags = {
        path: Flags.string({
            char: 'p',
            description: 'Project path (defaults to current directory)',
            default: process.cwd(),
        }),
        'dry-run': Flags.boolean({
            description: 'Preview what would be created without writing files',
            default: false,
        }),
        'skip-git': Flags.boolean({
            description: 'Skip git branch creation',
            default: false,
        }),
        patient: Flags.string({
            char: 'f',
            description: 'Path to PATIENT.md for headless ingestion',
        }),
    };

    async run(): Promise<void> {
        const { flags } = await this.parse(Init);
        const projectPath = path.resolve(flags['path']);
        const dryRun = flags['dry-run'];
        const skipGit = flags['skip-git'];

        const config = loadConfig(projectPath);

        showSplash(PACKAGE_VERSION);

        let kb: KnowledgeBase | undefined;
        try {
            info(`Loading knowledge from: ${config.knowledgePath}`);
            kb = await loadKnowledge(config.knowledgePath);
            if (kb.repositoryMapping.length === 0) {
                warn('Knowledge loaded but no application surfaces were mapped. Check FRONTEND_REPOSITORY_MANUAL.md structure.');
            } else {
                success(`Mapped ${kb.repositoryMapping.length} application surfaces.`);
            }
        } catch (err) {
            warn(`Knowledge Layer not found at ${config.knowledgePath}. Using defaults.`);
        }

        header('Step 1: Checking prerequisites');
        await microLoader('Validating environment...');
        await checkPrerequisites(projectPath);

        const bifrostDir = getBifrostDir(projectPath);
        if (await fs.pathExists(bifrostDir)) {
            const { overwrite } = await prompt<{ overwrite: string }>({
                type: 'select',
                name: 'overwrite',
                message: '.bifrost/ already exists. What would you like to do?',
                choices: ['Overwrite (start fresh)', 'Abort'],
            });
            if (overwrite.startsWith('Abort')) {
                info('Cancelado. A pasta .bifrost/ existente foi mantida.');
                return;
            }
        }

        blank();
        header('Step 2: Searching for assets');
        await microLoader('Scanning for project assets...');
        const { hasAssets, hasInstructions } = await checkAssets(projectPath);
        renderAssetDiscovery(hasAssets, hasInstructions);

        blank();
        header('Step 3: Interview');
        await microLoader('Preparing interrogation protocol...');
        blank();

        let answers: InterrogationAnswers | undefined;

        // --- HEADLESS CHECK ---
        const patientPath = flags['patient'] || (await fs.pathExists(path.join(projectPath, 'PATIENT.md')) ? path.join(projectPath, 'PATIENT.md') : null);

        if (patientPath) {
            const patientContent = await fs.readFile(patientPath, 'utf8');
            const parsedAnswers = parsePatientMd(patientContent);
            const errors = validatePatientAnswers(parsedAnswers);

            if (errors.length === 0) {
                success(`Valid PATIENT.md detected at ${path.basename(patientPath)}`);
                info('Switching to Headless Ingestion mode (Silent Setup)...');
                answers = parsedAnswers as InterrogationAnswersA;
            } else {
                warn(`PATIENT.md found but incomplete: ${errors.join(', ')}`);
                info('Falling back to manual interview...');
            }
        }

        if (!answers) {
            const { destinationPath } = await prompt<{ destinationPath: string }>({
                type: 'select',
                name: 'destinationPath',
                message: 'WHERE IS THE DESTINATION FOR THIS WORK?',
                choices: [
                    '[A] Existing WiBOO Surface (Dashboard, App, etc.)',
                    '[B] New Standalone Project (From Zero)',
                    '[C] Landing Page / One-off (Fast-Track)',
                ],
            });

            if (destinationPath.startsWith('[A]')) {
                answers = await promptPathA(projectPath, kb);
            } else if (destinationPath.startsWith('[B]')) {
                answers = await promptPathB(projectPath);
            } else {
                answers = await promptPathC(projectPath);
            }
        }

        blank();
        header('Step 4: Summary');
        blank();

        const featureName = (answers as { featureName: string; projectName?: string }).featureName
            || (answers as { projectName?: string }).projectName
            || 'feature';

        info(`Funcionalidade: ${featureName}`);
        info(`Descrição: ${(answers as { featureDescription: string }).featureDescription}`);
        info(`Prazo Estimado: ${(answers as { timeline: string }).timeline || 'N/A'}`);

        blank();

        const { confirmed } = await prompt<{ confirmed: string }>({
            type: 'select',
            name: 'confirmed',
            message: 'Proceed with initialization?',
            choices: ['Yes — initialize the project', 'No — start over'],
        });

        if (!confirmed.startsWith('Yes')) {
            info('Cancelado.');
            return;
        }

        if (dryRun) {
            info('Simulação (Dry run) — nenhum arquivo modificado.');
            info(`Criaria: ${bifrostDir}`);
            return;
        }

        blank();
        header('Step 5: Creating .bifrost/ directory');

        const featureId = generateFeatureId(featureName);
        const setupSpinner = spinner('Writing project files...').start();

        try {
            await createBifrostDirectory(
                bifrostDir,
                featureName,
                (answers as InterrogationAnswersA).featureDescription || '',
                (answers as InterrogationAnswersA).businessValue || 'N/A',
                (answers as InterrogationAnswersA).featureOwner || 'N/A',
                (answers as InterrogationAnswersA).constraints,
                (answers as InterrogationAnswersA).timeline || '',
                'src',
                config.defaultAutonomyLevel,
            );

            await writeHydrationFiles(bifrostDir, answers, config.bifrostFrameworkPath);

            const statePath = getStatePath(projectPath);
            await initializeState(statePath, featureId, featureName, config.defaultAutonomyLevel);

            setupSpinner.succeed('Project files created');
        } catch (err) {
            setupSpinner.fail('Falha ao criar arquivos do projeto');
            this.error(err instanceof Error ? err.message : String(err));
        }

        blank();
        header('Step 6: Installing skills');
        try {
            const { installClaudeSkills } = await import('../core/skills/installer');
            await installClaudeSkills(config.bifrostFrameworkPath, bifrostDir);
        } catch (err) {
            warn(`Falha ao instalar skills: ${err instanceof Error ? err.message : String(err)}`);
        }

        blank();
        header('Step 7: Git setup');

        let branchName = '';
        if (!skipGit) {
            const gitOk = await isGitRepo(projectPath);
            if (gitOk) {
                branchName = buildBranchName(featureName);
                const gitSpinner = spinner(`Creating branch ${branchName}...`).start();
                try {
                    await stageAndCommitInit(bifrostDir, branchName, featureName, projectPath);
                    gitSpinner.succeed(`Branch created: ${branchName}`);
                } catch (err) {
                    gitSpinner.warn(`Configuração do Git ignorada: ${err instanceof Error ? err.message : String(err)}`);
                    branchName = '';
                }
            } else {
                info('Ignorando configuração do git (não é um repositório git)');
            }
        }

        renderSetupComplete(featureName, branchName || 'main', path.relative(projectPath, bifrostDir) || '.bifrost');

        renderNextSteps([
            `Edit ${chalk.bold('.bifrost/PATIENT.md')} with your feature scope`,
            `Run ${chalk.bold('bifrost start')} to begin the mission`,
            branchName ? `You are on branch: ${chalk.bold(branchName)}` : 'Run git init to enable branch support',
        ]);
    }
}

async function stageAndCommitInit(
    bifrostDir: string,
    branchName: string,
    featureName: string,
    projectPath: string,
): Promise<void> {
    const { createBranch: cb, stageDirectory, commit } = await import('../core/git');
    await cb(branchName, projectPath);
    await stageDirectory('.bifrost', projectPath);
    await commit(`bifrost: initialize ${featureName}`, projectPath);
}


