/// <reference types="jest" />
import { Config } from '@oclif/core';
import Review from '../../../src/commands/review';
import * as fs from 'fs-extra';
import { prompt } from 'enquirer';
import * as manager from '../../../src/core/state/manager';
import * as ui from '../../../src/ui';
import { AgentName, BifrostStatus } from '../../../src/types';

jest.mock('fs-extra');
jest.mock('enquirer');
jest.mock('../../../src/core/state/manager');
jest.mock('../../../src/ui');

describe('Review Command', () => {
    let oclifConfig: Config;

    beforeEach(async () => {
        oclifConfig = await Config.load();
        jest.clearAllMocks();
        (fs.pathExists as any).mockResolvedValue(true);
    });

    it('displays artifacts for review', async () => {
        const mockState = {
            id: 'feat-1',
            feature: 'Test',
            status: BifrostStatus.INTAKE_COMPLETE,
            artifacts: [
                { agent: AgentName.INTAKE, path: '.bifrost/artifacts/@Intake/IMPACT.md', timestamp: new Date().toISOString() }
            ],
            blockers: [],
        };

        (manager.readState as any).mockResolvedValue(mockState);
        (fs.readFile as any).mockResolvedValue('Mock IMPACT content');
        (prompt as any).mockResolvedValue({ action: 'Accept' });

        const review = new Review([], oclifConfig);
        await review.run();

        expect(ui.header).toHaveBeenCalledWith(expect.stringContaining('Reviewing'));
        expect(ui.success).toHaveBeenCalledWith(expect.stringContaining('Accepted'));
    });

    it('allows requesting changes (adding blockers)', async () => {
        const mockState = {
            id: 'feat-1',
            feature: 'Test',
            status: BifrostStatus.INTAKE_COMPLETE,
            artifacts: [
                { agent: AgentName.INTAKE, path: '.bifrost/artifacts/@Intake/IMPACT.md', timestamp: new Date().toISOString() }
            ],
            blockers: [],
        };

        (manager.readState as any).mockResolvedValue(mockState);
        (fs.readFile as any).mockResolvedValue('Mock IMPACT content');
        (prompt as any)
            .mockResolvedValueOnce({ action: 'Request changes' })
            .mockResolvedValueOnce({ blocker: 'Missing API details' });

        const review = new Review([], oclifConfig);
        await review.run();

        expect(manager.addBlocker).toHaveBeenCalledWith(expect.any(String), 'Missing API details');
        expect(ui.warn).toHaveBeenCalledWith(expect.stringContaining('Blocker added'));
    });
});
