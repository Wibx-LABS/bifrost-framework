import { Command, Flags } from '@oclif/core';
import * as path from 'path';
import * as fs from 'fs-extra';
import { loadConfig, getBifrostDir, getStatePath } from '../config';
import { readState } from '../core/state/manager';
import { blank, header, info, renderStatus } from '../ui';

export default class Status extends Command {
    static description = 'Show the current Bifrost workflow status';

    static examples = [
        '<%= config.bin %> status',
        '<%= config.bin %> status --json',
    ];

    static flags = {
        path: Flags.string({
            char: 'p',
            description: 'Project path (defaults to current directory)',
            default: process.cwd(),
        }),
        json: Flags.boolean({
            description: 'Output raw JSON',
            default: false,
        }),
    };

    async run(): Promise<void> {
        const { flags } = await this.parse(Status);
        const projectPath = path.resolve(flags['path']);

        const statePath = getStatePath(projectPath);

        if (!(await fs.pathExists(statePath))) {
            this.error('Nenhum .bifrost/ encontrado. Execute `bifrost init` para inicializar o projeto.');
        }

        let state;
        try {
            state = await readState(statePath);
        } catch (err) {
            this.error(`Falha ao ler STATE.md: ${err instanceof Error ? err.message : String(err)}`);
        }

        if (flags['json']) {
            this.log(JSON.stringify(state, null, 2));
            return;
        }

        renderStatus(state);
    }
}
