import * as path from 'path';
import * as fs from 'fs-extra';
import { execSync } from 'child_process';
import { Config } from '@oclif/core';
import Init from '../../src/commands/init';
import Start from '../../src/commands/start';
import Status from '../../src/commands/status';
import Review from '../../src/commands/review';
import Deliver from '../../src/commands/deliver';
import { prompt } from 'enquirer';

// Mock enquirer to automate the interrogation
jest.mock('enquirer', () => ({
    prompt: jest.fn(),
}));

describe('Bifrost CLI E2E Workflow', () => {
    let testDir: string | undefined;
    let oclifConfig: Config;
    const originalCwd = process.cwd();

    beforeAll(async () => {
        try {
            // Provide root path to ensure config loads correctly
            oclifConfig = await Config.load({ root: path.resolve(__dirname, '../../') });
        } catch (err) {
            console.error('Failed to load oclif config:', err);
            throw err;
        }
    });

    beforeEach(async () => {
        // Setup a real temp directory for the E2E test
        testDir = path.join(__dirname, '../../tmp-e2e-' + Date.now());
        await fs.ensureDir(testDir);
        process.chdir(testDir);

        // Initialize a real git repo as requested
        try {
            execSync('git init', { cwd: testDir, stdio: 'ignore' });
            execSync('git config user.email "test@example.com"', { cwd: testDir, stdio: 'ignore' });
            execSync('git config user.name "Test User"', { cwd: testDir, stdio: 'ignore' });
            
            // Create a dummy file and make the first commit
            await fs.writeFile(path.join(testDir, 'README.md'), '# Test Project');
            execSync('git add .', { cwd: testDir, stdio: 'ignore' });
            execSync('git commit -m "Initial commit"', { cwd: testDir, stdio: 'ignore' });
        } catch (err) {
            console.error('Git setup failed:', err);
            throw err;
        }

        // Setup a mock knowledge base directory
        const knowledgePath = path.join(testDir, 'knowledge');
        await fs.ensureDir(knowledgePath);
        await fs.writeFile(path.join(knowledgePath, 'API_CONTRACTS.md'), '## Domain: Auth\n### GET /login\nTest login');
        await fs.writeFile(path.join(knowledgePath, 'COMPONENT_LIBRARY.md'), '## UI\n### ButtonComponent\nselector: "app-button"');
        await fs.writeFile(path.join(knowledgePath, 'NAMING_CONVENTIONS.md'), '## File Naming\nRule: kebab-case\n✅ my-file.ts');
        await fs.writeFile(path.join(knowledgePath, 'TECH_STACK.md'), '**Angular** | 15.0.0');
        await fs.writeFile(path.join(knowledgePath, 'GOTCHAS.md'), '### ❌ Error\nDescription');

        // Set env var for knowledge path
        process.env.BIFROST_KNOWLEDGE_PATH = knowledgePath;
        process.env.BIFROST_MOCK = 'true';
    });

    afterEach(async () => {
        process.chdir(originalCwd);
        if (testDir && await fs.pathExists(testDir)) {
            await fs.remove(testDir);
        }
        jest.clearAllMocks();
    });

    it('should complete a full feature workflow from init to deliver', async () => {
        // 1. Step: bifrost init (Path C)
        (prompt as any)
            .mockResolvedValueOnce({ destinationPath: '[C] Landing Page / One-off (Fast-Track)' })
            .mockResolvedValueOnce({ buildingWhat: 'E2E Test Page' })
            .mockResolvedValueOnce({ featureDescription: 'Testing full flow' })
            .mockResolvedValueOnce({ timeline: '1 day' })
            .mockResolvedValueOnce({ confirmed: 'Yes — initialize the project' });

        const init = new Init(['--path', testDir!], oclifConfig);
        await init.run();

        expect(fs.existsSync(path.join(testDir!, '.bifrost', 'STATE.md'))).toBe(true);
        expect(fs.existsSync(path.join(testDir!, '.bifrost', 'hydration.json'))).toBe(true);

        // 2. Step: bifrost start
        const start = new Start(['--path', testDir!, '--mock'], oclifConfig);
        await start.run();

        const stateAfterStart = await fs.readFile(path.join(testDir!, '.bifrost', 'STATE.md'), 'utf8');
        expect(stateAfterStart).toContain('status: intake-complete');
        expect(fs.existsSync(path.join(testDir!, '.bifrost', 'artifacts', '@Intake', 'IMPACT.md'))).toBe(true);

        // 3. Step: bifrost status
        const status = new Status(['--path', testDir!], oclifConfig);
        await status.run();
        // Status just renders to console, so we verify state hasn't crashed

        // 4. Step: bifrost review
        // Mock review responses: Accept the first artifact and quit
        (prompt as any).mockResolvedValueOnce({ decision: 'Accept' });

        const review = new Review(['--path', testDir!], oclifConfig);
        await review.run();

        // 5. Step: bifrost deliver (dry-run)
        (prompt as any).mockResolvedValueOnce({ confirmed: 'Yes — create PR' });

        const deliver = new Deliver(['--path', testDir!, '--dry-run'], oclifConfig);
        await deliver.run();

        // Final Verification
        const finalState = await fs.readFile(path.join(testDir!, '.bifrost', 'STATE.md'), 'utf8');
        expect(finalState).toContain('feature: E2E Test Page');
    });
});
