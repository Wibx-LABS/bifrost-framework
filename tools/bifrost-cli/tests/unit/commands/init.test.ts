/// <reference types="jest" />
import { Config } from '@oclif/core';
import Init from '../../../src/commands/init';
import * as fs from 'fs-extra';
import { prompt } from 'enquirer';
import * as ui from '../../../src/ui';

jest.mock('fs-extra');
jest.mock('enquirer');
jest.mock('../../../src/ui');
jest.mock('../../../src/core/knowledge/loader');
jest.mock('../../../src/core/hydration/builder');
jest.mock('../../../src/core/state/manager');
jest.mock('../../../src/core/git');

import * as builder from '../../../src/core/hydration/builder';

describe('Init Command', () => {
    let oclifConfig: Config;

    beforeEach(async () => {
        oclifConfig = await Config.load();
        jest.clearAllMocks();
        // Default mock behaviors
        (fs.pathExists as any).mockResolvedValue(false);
    });

    it('aborts if .bifrost exists and user chooses to abort', async () => {
        (fs.pathExists as any).mockResolvedValue(true);
        (prompt as any).mockResolvedValue({ overwrite: 'Abort' });

        const init = new Init([], oclifConfig);
        await init.run();

        expect(ui.info).toHaveBeenCalledWith(expect.stringContaining('Aborted'));
    });

    it('completes the interrogation and creates the directory', async () => {
        // Interrogation sequence
        (prompt as any)
            .mockResolvedValueOnce({ destinationPath: '[C] Landing Page / One-off (Fast-Track)' })
            .mockResolvedValueOnce({ buildingWhat: 'Promo Page', featureDescription: 'Cool page', timeline: '1 week' })
            .mockResolvedValueOnce({ confirmed: 'Yes — initialize the project' });

        // Dependencies
        const mockHydration = {
            project: { description: 'Cool page', timeline: '1 week' },
            instructions: { destination: 'src' }
        };
        (builder.buildHydration as any).mockResolvedValue(mockHydration);

        const init = new Init([], oclifConfig);
        await init.run();

        expect(ui.header).toHaveBeenCalledWith(expect.stringContaining('Interview'));
        expect(ui.header).toHaveBeenCalledWith(expect.stringContaining('Creating .bifrost/ directory'));
        expect(ui.renderSetupComplete).toHaveBeenCalled();
    });
});
