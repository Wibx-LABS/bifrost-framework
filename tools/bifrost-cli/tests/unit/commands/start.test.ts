/// <reference types="jest" />
import { Config } from '@oclif/core';
import Start from '../../../src/commands/start';
import * as fs from 'fs-extra';
import * as manager from '../../../src/core/state/manager';
import * as coordinator from '../../../src/core/agent/coordinator';
import * as ui from '../../../src/ui';
import { AgentName, BifrostStatus } from '../../../src/types';

jest.mock('fs-extra');
jest.mock('../../../src/core/state/manager');
jest.mock('../../../src/core/agent/coordinator');
jest.mock('../../../src/ui');

describe('Start Command', () => {
    let oclifConfig: Config;

    beforeEach(async () => {
        oclifConfig = await Config.load();
        jest.clearAllMocks();
        (fs.pathExists as any).mockResolvedValue(true);
    });

    it('aborts if STATE.md is missing', async () => {
        (fs.pathExists as any).mockResolvedValue(false);

        const start = new Start([], oclifConfig);
        try {
            await start.run();
        } catch (err) {
            expect((err as Error).message).toContain('No .bifrost/ found');
        }
    });

    it('triggers the intake agent', async () => {
        const mockState = {
            id: 'feat-1',
            feature: 'Test',
            status: BifrostStatus.INITIALIZED,
            artifacts: [],
            blockers: [],
        };

        (manager.readState as any).mockResolvedValue(mockState);
        
        const mockCoordinator = {
            trigger: jest.fn().mockResolvedValue(undefined),
            poll: jest.fn().mockResolvedValue(undefined),
        };
        (coordinator.createCoordinator as any).mockReturnValue(mockCoordinator);

        const start = new Start([], oclifConfig);
        await start.run();

        expect(mockCoordinator.trigger).toHaveBeenCalledWith(
            AgentName.INTAKE,
            expect.any(String),
            expect.any(String)
        );
        expect(ui.renderStatus).toHaveBeenCalled();
    });

    it('fails if there are blockers', async () => {
        const mockState = {
            id: 'feat-1',
            feature: 'Test',
            status: BifrostStatus.INITIALIZED,
            artifacts: [],
            blockers: ['Some blocker'],
        };

        (manager.readState as any).mockResolvedValue(mockState);

        const mockCoordinator = {
            trigger: jest.fn().mockResolvedValue(undefined),
            poll: jest.fn().mockResolvedValue(undefined),
        };
        (coordinator.createCoordinator as any).mockReturnValue(mockCoordinator);

        const start = new Start([], oclifConfig);
        await start.run();

        expect(mockCoordinator.trigger).not.toHaveBeenCalled();
        expect(ui.warn).toHaveBeenCalledWith(expect.stringContaining('blockers'));
    });
});
