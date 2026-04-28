/// <reference types="jest" />
import { Config } from '@oclif/core';
import Deliver from '../../../src/commands/deliver';
import * as fs from 'fs-extra';
import { prompt } from 'enquirer';
import * as manager from '../../../src/core/state/manager';
import * as git from '../../../src/core/git';
import * as ui from '../../../src/ui';
import { BifrostStatus } from '../../../src/types';

jest.mock('fs-extra');
jest.mock('enquirer');
jest.mock('../../../src/core/state/manager');
jest.mock('../../../src/core/git');
jest.mock('../../../src/ui');

describe('Deliver Command', () => {
    let oclifConfig: Config;

    beforeEach(async () => {
        oclifConfig = await Config.load();
        jest.clearAllMocks();
        (fs.pathExists as any).mockResolvedValue(true);
    });

    it('stages, commits, pushes and creates a PR', async () => {
        const mockState = {
            id: 'feat-1',
            feature: 'Test Feature',
            status: BifrostStatus.REVIEW,
            artifacts: [{ agent: '@CodeGen', path: 'code.ts' }],
            blockers: [],
            timeline: [],
        };

        (manager.readState as any).mockResolvedValue(mockState);
        (manager.hasBlockers as any).mockReturnValue(false);
        (prompt as any).mockResolvedValue({ confirmed: 'Yes — create PR' });
        (git.isGitRepo as any).mockResolvedValue(true);
        (git.getCurrentBranch as any).mockResolvedValue('main');
        (git.createPullRequest as any).mockResolvedValue('https://github.com/PR/123');
        (fs.readJson as any).mockResolvedValue({ project: { description: 'desc' }, instructions: { destination: 'src' } });
        (fs.readdir as any).mockResolvedValue([]); // No patches

        const deliver = new Deliver([], oclifConfig);
        await deliver.run();

        expect(git.createBranch).toHaveBeenCalled();
        expect(git.stageDirectory).toHaveBeenCalled();
        expect(git.commit).toHaveBeenCalled();
        expect(git.pushBranch).toHaveBeenCalled();
        expect(git.createPullRequest).toHaveBeenCalled();
        expect(ui.renderCompletionBox).toHaveBeenCalledWith('Test Feature', 'https://github.com/PR/123');
    });

    it('applies patches if present', async () => {
        const mockState = {
            id: 'feat-1',
            feature: 'Test',
            status: BifrostStatus.REVIEW,
            artifacts: [],
            blockers: [],
            timeline: [],
        };

        (manager.readState as any).mockResolvedValue(mockState);
        (prompt as any).mockResolvedValue({ confirmed: 'Yes — create PR' });
        (git.isGitRepo as any).mockResolvedValue(true);
        (fs.readJson as any).mockResolvedValue({ project: { description: 'desc' }, instructions: { destination: 'src' } });
        
        // Mock finding a patch
        (fs.readdir as any).mockResolvedValue(['fix.patch']);
        (fs.pathExists as any).mockResolvedValue(true);

        const deliver = new Deliver([], oclifConfig);
        await deliver.run();

        expect(git.applyPatch).toHaveBeenCalledWith(expect.stringContaining('fix.patch'), expect.any(String));
    });
});
