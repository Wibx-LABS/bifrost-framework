import { Command, Flags } from '@oclif/core';
import * as path from 'path';
import * as fs from 'fs-extra';
import { prompt } from 'enquirer';
import chalk from 'chalk';
import { AgentName, BifrostStatus } from '../types';
import { loadConfig, getStatePath, getBifrostDir, getHydrationPath, getArtifactsDir } from '../config';
import { readState, updateStatus, addTimeline, hasBlockers } from '../core/state/manager';
import {
    isGitRepo,
    getCurrentBranch,
    createBranch,
    stageDirectory,
    commit,
    pushBranch,
    createPullRequest,
    buildCommitMessage,
    buildPrBody,
    applyPatch,
} from '../core/git';
import {
    blank,
    header,
    info,
    warn,
    success,
    fail,
    spinner,
    renderCompletionBox,
    renderNextSteps,
} from '../ui';

const DELIVERABLE_STATUSES = new Set([
    BifrostStatus.QA,
    BifrostStatus.REVIEW,
    BifrostStatus.PR_CREATED,
]);

export default class Deliver extends Command {
    static description = 'Create a feature branch and GitHub PR for delivery';

    static examples = [
        '<%= config.bin %> deliver',
        '<%= config.bin %> deliver --dry-run',
        '<%= config.bin %> deliver --base-branch develop',
    ];

    static flags = {
        path: Flags.string({
            char: 'p',
            description: 'Project path (defaults to current directory)',
            default: process.cwd(),
        }),
        'dry-run': Flags.boolean({
            description: 'Preview what would be done without creating a PR',
            default: false,
        }),
        'base-branch': Flags.string({
            description: 'Base branch for the PR',
            default: 'main',
        }),
        'skip-push': Flags.boolean({
            description: 'Skip git push (creates commit but not PR)',
            default: false,
        }),
    };

    async run(): Promise<void> {
        const { flags } = await this.parse(Deliver);
        const projectPath = path.resolve(flags['path']);
        const dryRun = flags['dry-run'];
        const baseBranch = flags['base-branch'];
        const skipPush = flags['skip-push'];

        const config = loadConfig(projectPath);
        const statePath = getStatePath(projectPath);

        header('bifrost deliver');
        blank();

        if (!(await fs.pathExists(statePath))) {
            this.error('Nenhum .bifrost/ encontrado. Execute `bifrost init` para inicializar.');
        }

        let state;
        try {
            state = await readState(statePath);
        } catch (err) {
            this.error(`Falha ao ler STATE.md: ${err instanceof Error ? err.message : String(err)}`);
        }

        if (hasBlockers(state)) {
            fail('Não é possível entregar — existem bloqueios pendentes:');
            state.blockers.forEach((b) => warn(`  - ${b}`));
            info('Resolva todos os bloqueios antes de entregar. Execute `bifrost review` para revisar os artefatos.');
            this.exit(1);
        }

        if (state.artifacts.length === 0) {
            warn('Nenhum artefato ainda. O fluxo pode não ter sido concluído.');
            const { deliverAnyway } = await prompt<{ deliverAnyway: string }>({
                type: 'select',
                name: 'deliverAnyway',
                message: 'Continue with delivery anyway?',
                choices: ['Yes — deliver current state', 'No — abort'],
            });
            if (!deliverAnyway.startsWith('Yes')) {
                info('Cancelado.');
                return;
            }
        }

        info(`Funcionalidade: ${chalk.bold(state.feature)}`);
        info(`Status:  ${state.status}`);
        info(`Artefatos: ${state.artifacts.length}`);
        info(`Bloqueios: ${state.blockers.length === 0 ? chalk.green('Nenhum') : chalk.red(String(state.blockers.length))}`);
        blank();

        const { confirmed } = await prompt<{ confirmed: string }>({
            type: 'select',
            name: 'confirmed',
            message: 'Proceed with delivery?',
            choices: ['Yes — create PR', 'No — abort'],
        });

        if (!confirmed.startsWith('Yes')) {
            info('Aborted.');
            return;
        }

        if (dryRun) {
            blank();
            info('Simulação (Dry run) — nenhuma alteração realizada.');
            info(`Criaria PR: ${chalk.bold(state.feature)}`);
            info(`Branch base: ${baseBranch}`);
            info(`Artefatos a incluir: ${state.artifacts.length}`);
            return;
        }

        const gitOk = await isGitRepo(projectPath);
        if (!gitOk) {
            this.error('Não é um repositório git. Execute `git init` e tente novamente.');
        }

        const hydrationPath = getHydrationPath(projectPath);
        let hydration: { project?: { description?: string } } = {};
        try {
            hydration = await fs.readJson(hydrationPath);
        } catch {
            warn('Não foi possível ler hydration.json — usando STATE.md para conteúdo do PR');
        }

        const featureDescription = (hydration.project?.description) ?? state.feature;
        const featureSlug = state.feature
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
            .slice(0, 40);

        const branchName = `bifrost/${featureSlug}`;
        const currentBranch = await getCurrentBranch(projectPath);

        const branchSpinner = spinner(`Setting up branch: ${branchName}`).start();
        try {
            if (currentBranch !== branchName) {
                await createBranch(branchName, projectPath);
            }
            branchSpinner.succeed(`On branch: ${branchName}`);
        } catch (err) {
            branchSpinner.fail('Falha na configuração do branch');
            this.error(err instanceof Error ? err.message : String(err));
        }

        const commitSpinner = spinner('Applying changes and committing...').start();
        try {
            // Task 5: Apply patches from @CodeGen artifacts
            const artifactsDir = getArtifactsDir(projectPath);
            const codeGenDir = path.join(artifactsDir, AgentName.CODEGEN);
            
            if (await fs.pathExists(codeGenDir)) {
                const files = await fs.readdir(codeGenDir);
                const patches = files.filter(f => f.endsWith('.patch'));
                
                for (const p of patches) {
                    const patchPath = path.join(codeGenDir, p);
                    try {
                        await applyPatch(patchPath, projectPath);
                        info(`  Patch aplicado: ${p}`);
                    } catch (err) {
                        warn(`  Não foi possível aplicar o patch ${p}: ${err instanceof Error ? err.message : String(err)}`);
                        warn('  Continuando com modificações manuais caso existam...');
                    }
                }
            }

            await stageDirectory('.bifrost', projectPath);
            await stageDirectory('.', projectPath); // Stage everything else (generated code)

            const commitMsg = buildCommitMessage(
                state.feature,
                featureDescription,
                state.timeline,
                state.artifacts.map((a) => ({ agent: a.agent, path: a.path })),
            );

            await commit(commitMsg, projectPath);
            commitSpinner.succeed('Committed');
        } catch (err) {
            commitSpinner.warn(`Etapa de commit: ${err instanceof Error ? err.message : String(err)}`);
        }

        if (skipPush) {
            success('Push pulado (--skip-push)');
            await updateStatus(statePath, BifrostStatus.PR_CREATED);
            renderCompletionBox(state.feature);
            return;
        }

        const pushSpinner = spinner(`Pushing ${branchName}...`).start();
        try {
            await pushBranch(branchName, projectPath);
            pushSpinner.succeed('Pushed');
        } catch (err) {
            pushSpinner.fail('Push falhou');
            this.error(err instanceof Error ? err.message : String(err));
        }

        const prSpinner = spinner('Creating PR...').start();
        let prUrl: string;
        try {
            const prBody = buildPrBody(
                state.feature,
                featureDescription,
                state.timeline,
                state.artifacts.map((a) => ({ agent: a.agent, path: a.path })),
            );

            prUrl = await createPullRequest(
                `feat: ${state.feature}`,
                prBody,
                baseBranch,
                projectPath,
            );
            prSpinner.succeed('PR created');
        } catch (err) {
            prSpinner.fail('Falha na criação do PR');
            this.error(err instanceof Error ? err.message : String(err));
        }

        await updateStatus(statePath, BifrostStatus.PR_CREATED);
        await addTimeline(statePath, `PR created: ${prUrl!}`);

        blank();
        renderCompletionBox(state.feature, prUrl!);
        renderNextSteps([
            `Review the PR: ${chalk.blue.underline(prUrl!)}`,
            'Share with the backend team for code review',
            'Once merged, run `bifrost status` to confirm',
        ]);
    }
}
