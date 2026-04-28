import { Command, Flags } from '@oclif/core';
import * as path from 'path';
import * as fs from 'fs-extra';
import { prompt } from 'enquirer';
import chalk from 'chalk';
import { AgentName, BifrostStatus } from '../types';
import { getStatePath, getBifrostDir } from '../config';
import { readState, addBlocker, addDecision, updateStatus, addTimeline } from '../core/state/manager';
import { blank, header, info, warn, success, fail, renderArtifact, renderNextSteps } from '../ui';

const REVIEWABLE_STATUSES = new Set([
    BifrostStatus.INTAKE_COMPLETE,
    BifrostStatus.PLANNING_COMPLETE,
    BifrostStatus.CODING,
    BifrostStatus.QA,
    BifrostStatus.REVIEW,
    BifrostStatus.PR_CREATED,
]);

export default class Review extends Command {
    static description = 'Review agent artifact outputs';

    static examples = [
        '<%= config.bin %> review',
        '<%= config.bin %> review --artifact @Intake',
    ];

    static flags = {
        path: Flags.string({
            char: 'p',
            description: 'Project path (defaults to current directory)',
            default: process.cwd(),
        }),
        artifact: Flags.string({
            char: 'a',
            description: 'Review a specific artifact (e.g., @Intake)',
        }),
    };

    async run(): Promise<void> {
        const { flags } = await this.parse(Review);
        const projectPath = path.resolve(flags['path']);
        const specificArtifact = flags['artifact'];

        const statePath = getStatePath(projectPath);

        if (!(await fs.pathExists(statePath))) {
            this.error('Nenhum .bifrost/ encontrado. Execute `bifrost init` para inicializar.');
        }

        let state;
        try {
            state = await readState(statePath);
        } catch (err) {
            this.error(`Falha ao ler STATE.md: ${err instanceof Error ? err.message : String(err)}`);
        }

        if (state.artifacts.length === 0) {
            info('Nenhum artefato ainda. Execute `bifrost start` para gerar saídas.');
            return;
        }

        const artifactsToReview = specificArtifact
            ? state.artifacts.filter((a) => a.agent === specificArtifact || a.agent.includes(specificArtifact))
            : state.artifacts;

        if (artifactsToReview.length === 0) {
            warn(`Nenhum artefato encontrado para: ${specificArtifact}`);
            info(`Artefatos disponíveis: ${state.artifacts.map((a) => a.agent).join(', ')}`);
            return;
        }

        header('bifrost review');
        blank();

        let allAccepted = true;

        for (const artifact of artifactsToReview) {
            const artifactAbsPath = path.resolve(projectPath, artifact.path);

            if (!(await fs.pathExists(artifactAbsPath))) {
                warn(`Arquivo de artefato não encontrado: ${artifact.path}`);
                continue;
            }

            const content = await fs.readFile(artifactAbsPath, 'utf8');
            renderArtifact(artifact.agent, content, artifact.path);

            const { decision } = await prompt<{ decision: string }>({
                type: 'select',
                name: 'decision',
                message: `Review ${chalk.bold(artifact.agent)}: what is your decision?`,
                choices: [
                    'Accept — continue to next step',
                    'Request changes — add blocker',
                    'Skip — review later',
                    'Quit — exit review',
                ],
            });

            if (decision.startsWith('Accept')) {
                success(`${artifact.agent} aceito`);
                await addDecision(statePath, `${artifact.agent} accepted by reviewer`);
            } else if (decision.startsWith('Request changes')) {
                allAccepted = false;
                const { blockerDescription } = await prompt<{ blockerDescription: string }>({
                    type: 'input',
                    name: 'blockerDescription',
                    message: 'Describe the required changes:',
                });
                await addBlocker(statePath, `${artifact.agent}: ${blockerDescription}`);
                await addTimeline(statePath, `${artifact.agent} rejected — changes requested`);
                warn(`Bloqueio adicionado: ${artifact.agent} precisa de mudanças`);
            } else if (decision.startsWith('Skip')) {
                info(`${artifact.agent} pulado`);
            } else {
                info('Sessão de revisão finalizada.');
                break;
            }

            blank();
        }

        const updatedState = await readState(statePath);

        if (allAccepted && updatedState.blockers.length === 0) {
            if (updatedState.status === BifrostStatus.REVIEW) {
                await updateStatus(statePath, BifrostStatus.PR_CREATED);
                await addTimeline(statePath, 'All artifacts reviewed and accepted');
                success('Todos os artefatos aceitos! Pronto para entregar.');
                renderNextSteps(['Run `bifrost deliver` to create the PR']);
            } else {
                success('Revisão concluída. Sem bloqueios.');
            }
        } else if (updatedState.blockers.length > 0) {
            blank();
            warn(`${updatedState.blockers.length} bloqueio(s) registrado(s):`);
            updatedState.blockers.forEach((b) => warn(`  - ${b}`));
            renderNextSteps([
                'Have agents address the blockers',
                'Re-run `bifrost review` after changes are made',
            ]);
        }
    }
}
