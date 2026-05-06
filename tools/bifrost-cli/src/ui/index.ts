import chalk from 'chalk';
import ora, { Ora } from 'ora';
import { BifrostState, BifrostStatus } from '../types';

const BIFROST_LOGO = `
██████╗ ██╗███████╗██████╗  ██████╗ ███████╗████████╗
██╔══██╗██║██╔════╝██╔══██╗██╔═══██╗██╔════╝╚══██╔══╝
██████╔╝██║█████╗  ██████╔╝██║   ██║███████╗   ██║
██╔══██╗██║██╔══╝  ██╔══██╗██║   ██║╚════██║   ██║
██████╔╝██║██║     ██║  ██║╚██████╔╝███████║   ██║
╚═════╝ ╚═╝╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚══════╝   ╚═╝
`.trim();

export function showSplash(version: string): void {
    console.log('');
    console.log(chalk.bold.hex('#7C3AED')(BIFROST_LOGO));
    console.log('');
    console.log(chalk.gray(`  WiBX Labs  |  Agentic Infrastructure Framework  |  v${version}`));
    console.log('');
}

export function success(msg: string): void {
    console.log(`${chalk.green('[OK]')} ${msg}`);
}

export function fail(msg: string): void {
    console.log(`${chalk.red('[ERRO]')} ${msg}`);
}

export function warn(msg: string): void {
    console.log(`${chalk.yellow('[AVISO]')} ${msg}`);
}

export function info(msg: string): void {
    console.log(`${chalk.blue('[INFO]')} ${msg}`);
}

export function step(msg: string): void {
    console.log(`  ${chalk.dim('->')} ${msg}`);
}

export function blank(): void {
    console.log('');
}

export function header(msg: string): void {
    console.log('');
    console.log(chalk.bold(msg));
    console.log(chalk.dim('─'.repeat(msg.length)));
}

export function spinner(text: string): Ora {
    return ora({
        text,
        color: 'magenta',
        spinner: 'dots',
    });
}

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function microLoader(text: string, duration = 800): Promise<void> {
    const s = spinner(chalk.dim(text)).start();
    await delay(duration);
    s.stop();
}

function padRight(str: string, width: number): string {
    const visibleLength = str.replace(/\x1b\[[0-9;]*m/g, '').length;
    return str + ' '.repeat(Math.max(0, width - visibleLength));
}

function renderBox(lines: string[], title = '', width = 52): string {
    const innerWidth = width - 2;

    const topBorder = title
        ? `╭─ ${title} ${'─'.repeat(Math.max(0, innerWidth - title.length - 3))}╮`
        : `╭${'─'.repeat(innerWidth)}╮`;

    const body = lines.map((line) => {
        const stripped = line.replace(/\x1b\[[0-9;]*m/g, '');
        const pad = Math.max(0, innerWidth - 2 - stripped.length);
        return `│ ${line}${' '.repeat(pad)} │`;
    });

    const bottomBorder = `╰${'─'.repeat(innerWidth)}╯`;

    return [topBorder, ...body, bottomBorder].join('\n');
}

const STATUS_ICON: Record<BifrostStatus, string> = {
    [BifrostStatus.INITIALIZED]: chalk.blue('[*]'),
    [BifrostStatus.INTAKE]: chalk.yellow('[...]'),
    [BifrostStatus.INTAKE_COMPLETE]: chalk.green('[OK]'),
    [BifrostStatus.PLANNING]: chalk.yellow('[...]'),
    [BifrostStatus.PLANNING_COMPLETE]: chalk.green('[OK]'),
    [BifrostStatus.CODING]: chalk.yellow('[...]'),
    [BifrostStatus.QA]: chalk.yellow('[...]'),
    [BifrostStatus.QA_FAILED]: chalk.red('[ERRO]'),
    [BifrostStatus.REVIEW]: chalk.yellow('[...]'),
    [BifrostStatus.PR_CREATED]: chalk.green('[OK]'),
    [BifrostStatus.MERGED]: chalk.green('[FINALIZADO]'),
};

const STATUS_LABEL: Record<BifrostStatus, string> = {
    [BifrostStatus.INITIALIZED]: 'inicializado — pronto para começar',
    [BifrostStatus.INTAKE]: 'intake — analisando escopo',
    [BifrostStatus.INTAKE_COMPLETE]: 'intake concluído',
    [BifrostStatus.PLANNING]: 'planejamento — dividindo em tarefas',
    [BifrostStatus.PLANNING_COMPLETE]: 'planejamento concluído',
    [BifrostStatus.CODING]: 'codificação — gerando código',
    [BifrostStatus.QA]: 'qa — executando testes',
    [BifrostStatus.QA_FAILED]: 'qa falhou — revisão necessária',
    [BifrostStatus.REVIEW]: 'revisão — preparando entrega',
    [BifrostStatus.PR_CREATED]: 'pr criado — aguardando merge',
    [BifrostStatus.MERGED]: 'merged — completo',
};

const PIPELINE_STAGES = [
    { label: 'Intake', statuses: [BifrostStatus.INTAKE, BifrostStatus.INTAKE_COMPLETE] },
    { label: 'Planejamento', statuses: [BifrostStatus.PLANNING, BifrostStatus.PLANNING_COMPLETE] },
    { label: 'Geração de Código', statuses: [BifrostStatus.CODING] },
    { label: 'QA', statuses: [BifrostStatus.QA, BifrostStatus.QA_FAILED] },
    { label: 'Revisão', statuses: [BifrostStatus.REVIEW] },
];

function getStageIcon(stageName: string, currentStatus: BifrostStatus): string {
    const statusOrder: BifrostStatus[] = [
        BifrostStatus.INITIALIZED,
        BifrostStatus.INTAKE,
        BifrostStatus.INTAKE_COMPLETE,
        BifrostStatus.PLANNING,
        BifrostStatus.PLANNING_COMPLETE,
        BifrostStatus.CODING,
        BifrostStatus.QA,
        BifrostStatus.QA_FAILED,
        BifrostStatus.REVIEW,
        BifrostStatus.PR_CREATED,
        BifrostStatus.MERGED,
    ];

    const stage = PIPELINE_STAGES.find((s) => s.label === stageName);
    if (!stage) {
        return chalk.dim('[-]');
    }

    const currentIdx = statusOrder.indexOf(currentStatus);

    if (currentStatus === BifrostStatus.QA_FAILED && stageName === 'QA') {
        return chalk.red('[ERRO]');
    }

    const stageCompletedStatus = stage.statuses[stage.statuses.length - 1];
    const stageIdx = statusOrder.indexOf(stageCompletedStatus);

    if (currentIdx > stageIdx) {
        return chalk.green('[OK]');
    }
    if (stage.statuses.includes(currentStatus)) {
        return chalk.yellow('[...]');
    }
    return chalk.dim('[-]');
}

export function renderStatus(state: BifrostState): void {
    const created = new Date(state.created).toLocaleString('pt-BR');
    const icon = STATUS_ICON[state.status] ?? chalk.dim('[?]');
    const label = STATUS_LABEL[state.status] ?? state.status;

    const lines: string[] = [
        `${chalk.bold('Funcionalidade:')} ${state.feature}`,
        `${chalk.bold('Status:')}         ${icon} ${label}`,
        `${chalk.bold('Criado em:')}      ${created}`,
        `${chalk.bold('ID:')}             ${state.id}`,
        '',
        chalk.bold('Pipeline:'),
    ];

    for (const stage of PIPELINE_STAGES) {
        const stageIcon = getStageIcon(stage.label, state.status);
        lines.push(`  ${stageIcon} ${stage.label}`);
    }

    if (state.artifacts.length > 0) {
        lines.push('');
        lines.push(chalk.bold('Artefatos:'));
        for (const artifact of state.artifacts) {
            lines.push(`  - ${artifact.agent}: ${chalk.dim(artifact.path)}`);
        }
    }

    if (state.timeline.length > 0) {
        lines.push('');
        lines.push(chalk.bold('Linha do Tempo Recente:'));
        const recent = state.timeline.slice(-5);
        for (const entry of recent) {
            const time = new Date(entry.timestamp).toLocaleTimeString('pt-BR');
            lines.push(`  ${chalk.dim(time)} — ${entry.message}`);
        }
    }

    lines.push('');
    lines.push(
        state.blockers.length > 0
            ? `${chalk.bold('Bloqueios:')} ${chalk.red(state.blockers.join(', '))}`
            : `${chalk.bold('Bloqueios:')} ${chalk.green('Nenhum')}`,
    );

    console.log('');
    console.log(renderBox(lines, 'Status do Bifrost'));
    console.log('');
}

export function renderNextSteps(steps: string[]): void {
    console.log('');
    console.log(chalk.bold('Próximos Passos:'));
    steps.forEach((step, i) => {
        console.log(`  ${chalk.cyan(`${i + 1}.`)} ${step}`);
    });
    console.log('');
}

export function renderArtifact(agentName: string, content: string, filePath: string): void {
    console.log('');
    console.log(chalk.bold(`─── ${agentName} ──────────────────────────────`));
    console.log(chalk.dim(`Arquivo: ${filePath}`));
    console.log(chalk.dim(`Tamanho: ${content.length} bytes`));
    console.log('');

    const lines = content.split('\n').slice(0, 50);
    for (const line of lines) {
        if (line.startsWith('# ')) {
            console.log(chalk.bold.blue(line));
        } else if (line.startsWith('## ')) {
            console.log(chalk.bold.cyan(line));
        } else if (line.startsWith('### ')) {
            console.log(chalk.cyan(line));
        } else if (line.startsWith('- ')) {
            console.log(chalk.white(line));
        } else {
            console.log(chalk.gray(line));
        }
    }

    if (content.split('\n').length > 50) {
        console.log(chalk.dim(`... (${content.split('\n').length - 50} mais linhas)`));
    }

    console.log('');
}

export function renderCompletionBox(featureName: string, prUrl?: string): void {
    const lines: string[] = [
        '',
        chalk.green('[OK] CONFIGURAÇÃO CONCLUÍDA'),
        '',
        `${chalk.bold('Funcionalidade:')} ${featureName}`,
        `${chalk.bold('Diretório:')} .bifrost/`,
    ];

    if (prUrl) {
        lines.push('');
        lines.push(`${chalk.bold('PR:')} ${chalk.blue.underline(prUrl)}`);
    }

    console.log('');
    console.log(renderBox(lines, ''));
    console.log('');
}

export function renderSetupComplete(
    featureName: string,
    branchName: string,
    bifrostDir: string,
): void {
    const lines = [
        '',
        chalk.green.bold('[OK] CONFIGURAÇÃO CONCLUÍDA'),
        '',
        `${chalk.bold('Área de Trabalho:')} ${bifrostDir}`,
        `${chalk.bold('Branch Git:')}       ${branchName}`,
        '',
        chalk.bold('PRÓXIMOS PASSOS:'),
        `  ${chalk.cyan('1.')} Edite ${chalk.bold('.bifrost/PATIENT.md')} com o escopo da funcionalidade`,
        `  ${chalk.cyan('2.')} Execute ${chalk.bold('bifrost start')} para iniciar a missão`,
        '',
    ];

    console.log('');
    console.log(renderBox(lines, ''));
    console.log('');
}

export function renderAssetDiscovery(hasAssets: boolean, hasInstructions: boolean): void {
    const lines = [
        '',
        hasAssets
            ? `${chalk.green('[OK]')} pasta /assets detectada`
            : `${chalk.dim('[-]')} pasta /assets não encontrada`,
        hasInstructions
            ? `${chalk.green('[OK]')} assets_instruction.md detectado`
            : `${chalk.dim('[-]')} assets_instruction.md não encontrado`,
        '',
        hasAssets || hasInstructions
            ? 'O Bifrost usará estes arquivos como base para decisões de design.'
            : chalk.dim('Nenhum asset local encontrado — prosseguindo com padrões do framework.'),
        '',
    ];

    console.log(renderBox(lines, 'PROCURANDO ASSETS'));
}
