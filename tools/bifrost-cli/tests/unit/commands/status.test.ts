/// <reference types="jest" />
import { Config } from '@oclif/core';
import Status from '../../../src/commands/status';
import * as manager from '../../../src/core/state/manager';
import * as ui from '../../../src/ui';
import { BifrostStatus } from '../../../src/types';
import * as fs from 'fs-extra';

jest.mock('../../../src/core/state/manager');
jest.mock('../../../src/ui');
jest.mock('fs-extra');

describe('Status Command', () => {
    let oclifConfig: Config;

    beforeEach(async () => {
        oclifConfig = await Config.load();
        jest.clearAllMocks();
    });

    it('displays an error if STATE.md does not exist', async () => {
        (fs.pathExists as any).mockResolvedValue(false);

        const status = new Status([], oclifConfig);
        try {
            await status.run();
        } catch (err) {
            expect((err as Error).message).toContain('No .bifrost/ found');
        }
    });

    it('renders the state if STATE.md exists', async () => {
        const mockState = {
            id: 'feat-1',
            feature: 'Test Feature',
            status: BifrostStatus.INITIALIZED,
            timeline: [],
            artifacts: [],
            blockers: [],
            nextSteps: [],
        };

        (fs.pathExists as any).mockResolvedValue(true);
        (manager.readState as any).mockResolvedValue(mockState);

        const status = new Status([], oclifConfig);
        await status.run();

        expect(manager.readState).toHaveBeenCalled();
        expect(ui.renderStatus).toHaveBeenCalledWith(mockState);
    });

    it('outputs JSON if --json flag is provided', async () => {
        const mockState = {
            id: 'feat-1',
            feature: 'Test Feature',
            status: BifrostStatus.INITIALIZED,
        };

        (fs.pathExists as any).mockResolvedValue(true);
        (manager.readState as any).mockResolvedValue(mockState);

        const status = new Status(['--json'], oclifConfig);
        const logSpy = jest.spyOn(status, 'log').mockImplementation();

        await status.run();

        expect(logSpy).toHaveBeenCalledWith(JSON.stringify(mockState, null, 2));
        expect(ui.renderStatus).not.toHaveBeenCalled();
    });
});
