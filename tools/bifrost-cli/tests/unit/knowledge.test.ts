import * as path from 'path';
import * as fs from 'fs-extra';
import * as os from 'os';
import { loadKnowledge } from '../../src/core/knowledge/loader';

let tmpDir: string;
const knowledgePath = path.resolve(__dirname, '../../..', '..', 'knowledge');

describe('loadKnowledge — real knowledge files', () => {
    const hasKnowledgeFiles = fs.pathExistsSync(knowledgePath);

    const testIf = (condition: boolean) => (condition ? it : it.skip);

    testIf(hasKnowledgeFiles)('loads knowledge from the real /knowledge/ directory', async () => {
        const kb = await loadKnowledge(knowledgePath);
        expect(kb.apis.length).toBeGreaterThan(0);
        expect(kb.components.length).toBeGreaterThan(0);
        expect(kb.gotchas.length).toBeGreaterThan(0);
    });

    testIf(hasKnowledgeFiles)('parses API domains correctly', async () => {
        const kb = await loadKnowledge(knowledgePath);
        const domains = [...new Set(kb.apis.map((a) => a.domain))];
        expect(domains.length).toBeGreaterThan(0);
    });

    testIf(hasKnowledgeFiles)('findApiByDomain works', async () => {
        const kb = await loadKnowledge(knowledgePath);
        const accountingApis = kb.findApiByDomain('accounting');
        expect(accountingApis.length).toBeGreaterThan(0);
    });

    testIf(hasKnowledgeFiles)('findComponent works for known components', async () => {
        const kb = await loadKnowledge(knowledgePath);
        const input = kb.findComponent('InputComponent');
        expect(input).toBeDefined();
        expect(input?.name).toContain('Input');
    });

    testIf(hasKnowledgeFiles)('getConventionRules returns rules for file category', async () => {
        const kb = await loadKnowledge(knowledgePath);
        const rules = kb.getConventionRules('file');
        expect(rules.length).toBeGreaterThan(0);
    });

    testIf(hasKnowledgeFiles)('getRelevantApis filters by keyword', async () => {
        const kb = await loadKnowledge(knowledgePath);
        const apis = kb.getRelevantApis(['finance']);
        expect(apis.length).toBeGreaterThan(0);
        const domains = apis.map((a) => a.domain.toLowerCase());
        expect(domains.some((d) => d.includes('finance'))).toBe(true);
    });

    testIf(hasKnowledgeFiles)('tech stack has required fields', async () => {
        const kb = await loadKnowledge(knowledgePath);
        expect(kb.stack.coreFramework).toContain('Angular');
        expect(kb.stack.stateManagement).toContain('NgRx');
    });
});

describe('loadKnowledge — error handling', () => {
    it('throws when knowledge directory does not exist', async () => {
        await expect(loadKnowledge('/nonexistent/path')).rejects.toThrow(
            'Knowledge directory not found',
        );
    });

    it('handles missing individual knowledge files gracefully', async () => {
        const tmpKnowledgePath = await fs.mkdtemp(path.join(os.tmpdir(), 'bifrost-kb-'));
        try {
            await fs.writeFile(
                path.join(tmpKnowledgePath, 'API_CONTRACTS.md'),
                `# API Contracts\n\n## Domain: Test (\`api.test\`)\n\n### GET /api/test\n\nTest endpoint.\n`,
                'utf8',
            );

            const kb = await loadKnowledge(tmpKnowledgePath);
            expect(kb.apis).toBeDefined();
            expect(kb.components).toEqual([]);
            expect(kb.gotchas).toEqual([]);
        } finally {
            await fs.remove(tmpKnowledgePath);
        }
    });
});
