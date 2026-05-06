import * as path from 'path';
import * as fs from 'fs-extra';
import {
    ApiContract,
    ComponentDef,
    Gotcha,
    KnowledgeBase,
    NamingRule,
    NamingRules,
    TechStackInfo,
} from '../../types';

const KNOWLEDGE_FILES = {
    API_CONTRACTS: 'API_CONTRACTS.md',
    COMPONENT_LIBRARY: 'COMPONENT_LIBRARY.md',
    NAMING_CONVENTIONS: 'NAMING_CONVENTIONS.md',
    TECH_STACK: 'TECH_STACK.md',
    GOTCHAS: 'GOTCHAS.md',
    REPOSITORY_MANUAL: 'FRONTEND_REPOSITORY_MANUAL.md',
} as const;

function extractSections(content: string): Map<string, string> {
    const sections = new Map<string, string>();
    const lines = content.split('\n');
    let currentSection = '';
    let currentContent: string[] = [];

    for (const line of lines) {
        const h2Match = line.match(/^## (.+)$/);
        const h3Match = line.match(/^### (.+)$/);

        if (h2Match || h3Match) {
            if (currentSection) {
                sections.set(currentSection, currentContent.join('\n').trim());
            }
            currentSection = (h2Match || h3Match)![1].trim();
            currentContent = [];
        } else {
            currentContent.push(line);
        }
    }

    if (currentSection) {
        sections.set(currentSection, currentContent.join('\n').trim());
    }

    return sections;
}

function parseApiContracts(content: string): ApiContract[] {
    const apis: ApiContract[] = [];
    const domainBlocks = content.split(/^#+\s+Domain:/m).filter((b) => b.trim());

    for (const block of domainBlocks) {
        const domainMatch = block.match(/^[`']?([^`'\n(]+)/);
        const domain = domainMatch ? domainMatch[1].trim().toLowerCase() : 'unknown';

        const endpointRegex = /###\s+(GET|POST|PUT|PATCH|DELETE)\s+(\S+)\n+([\s\S]*?)(?=###|^#+|$)/g;
        let match: RegExpExecArray | null;

        while ((match = endpointRegex.exec(block)) !== null) {
            const [rawBlock, method, apiPath, rawBody] = match;
            const descLine = rawBody.split('\n').find((l) => l.trim() && !l.startsWith('**'));

            apis.push({
                domain: domain.replace(/\s*\(`api\.[^)]+`\)/, '').trim(),
                method: method as ApiContract['method'],
                path: apiPath,
                description: descLine?.trim() ?? '',
                rawContent: rawBlock.trim(),
            });
        }
    }

    return apis;
}

function parseComponents(content: string): ComponentDef[] {
    const components: ComponentDef[] = [];
    const categoryBlocks = content.split(/^## [A-Z]/m);
    const categoryHeaders = content.match(/^## ([A-Z][^\n]+)/gm) ?? [];
    let categoryIdx = 0;

    const componentRegex = /### (\w+Component)\n+([\s\S]*?)(?=###|^##|$)/gm;
    let match: RegExpExecArray | null;

    while ((match = componentRegex.exec(content)) !== null) {
        const [rawBlock, name, rawBody] = match;
        const selectorMatch = rawBody.match(/selector:\s*['"]([^'"]+)['"]/);
        const descLine = rawBody.split('\n').find((l) => l.trim() && !l.startsWith('```') && !l.startsWith('<'));

        const category = categoryHeaders[categoryIdx]?.replace('## ', '').trim() ?? 'General';

        components.push({
            name,
            selector: selectorMatch ? selectorMatch[1] : `app-${name.toLowerCase().replace('component', '')}`,
            category,
            description: descLine?.trim() ?? '',
            rawContent: rawBlock.trim(),
        });
    }

    return components;
}

function parseNamingConventions(content: string): NamingRules {
    const sections = extractSections(content);
    const rules: NamingRule[] = [];

    const categoryMap: Record<string, NamingRule['category']> = {
        'File Naming': 'file',
        'Class Naming': 'class',
        'Function & Method Naming': 'function',
        'Variable & Property Naming': 'variable',
        'Component Naming': 'component',
        'Service Naming': 'service',
        'Store/State Naming': 'store',
    };

    for (const [sectionName, sectionContent] of sections) {
        const category = categoryMap[sectionName];
        if (!category) {
            continue;
        }

        const ruleMatch = sectionName.match(/Rule:\s*(.+)/);
        const ruleLine = sectionContent.split('\n').find((l) => l.startsWith('Rule:') || l.startsWith('All ') || l.startsWith('Use '));

        const examples: string[] = [];
        const exampleMatches = sectionContent.matchAll(/✅[^\n]+/g);
        for (const ex of exampleMatches) {
            examples.push(ex[0].replace('✅', '').trim());
        }

        rules.push({
            category,
            rule: ruleLine?.trim() ?? sectionName,
            examples: examples.slice(0, 3),
        });
    }

    return { rules, rawContent: content };
}

function parseTechStack(content: string): TechStackInfo {
    const angularMatch = content.match(/\*\*Angular\*\*\s*\|\s*([\d.]+)/);
    const ngrxMatch = content.match(/\*\*@ngrx\/store\*\*\s*\|\s*([\d.]+)/);
    const materialMatch = content.match(/\*\*@angular\/material\*\*\s*\|\s*([\d.]+)/);
    const jestMatch = content.match(/\*\*Jest\*\*\s*\|\s*([\^~\d.]+)/);

    return {
        coreFramework: `Angular ${angularMatch?.[1] ?? '15'}, TypeScript ~4.8.3, RxJS ~6.6.0`,
        stateManagement: `NgRx ${ngrxMatch?.[1] ?? '14.3.2'} (Store, Effects, Entity)`,
        uiLibrary: `Angular Material ${materialMatch?.[1] ?? '15.0.0'}, CDK 15.0.0`,
        testingFramework: `Jest ${jestMatch?.[1] ?? '^29.4.1'}, Cypress ^12.11.0`,
        rawContent: content,
    };
}

function parseGotchas(content: string): Gotcha[] {
    const gotchas: Gotcha[] = [];
    const gotchaRegex = /###\s+(❌|⚠️|✅)\s+(.+)\n+([\s\S]*?)(?=###|^##|$)/gm;
    let match: RegExpExecArray | null;

    while ((match = gotchaRegex.exec(content)) !== null) {
        const [, icon, title, rawBody] = match;
        const descLine = rawBody.split('\n').find((l) => l.startsWith('**Problem:**') || l.startsWith('**Rule:**') || l.trim());

        let severity: Gotcha['severity'] = 'info';
        if (icon === '❌') {
            severity = 'error';
        } else if (icon === '⚠️') {
            severity = 'warning';
        }

        gotchas.push({
            severity,
            title: title.trim(),
            description: descLine?.replace(/\*\*(Problem|Rule|Solution|Right):\*\*/, '').trim() ?? '',
        });
    }

    return gotchas;
}

function parseRepositoryMapping(content: string): any[] {
    const apps: any[] = [];
    
    // 1. Parse Apps (Section 5)
    const appSection = content.split('## 5. Applications In-Depth')[1]?.split('## 6. Shared Libraries')[0];
    if (appSection) {
        const appBlocks = appSection.split(/^###\s+5\.\d+/m).filter(b => b.trim());
        for (const block of appBlocks) {
            const nameMatch = block.match(/^\s*`?(\w+)`?/);
            if (!nameMatch) continue;
            const name = nameMatch[1];
            
            // Try to find container tree
            const treeMatch = block.match(/\*\*Container structure[^*]*\*\*:\n+```\n+containers\/\n+([\s\S]*?)```/);
            let sections: string[] = [];
            let statefulSections: string[] = [];
            
            // Detect stateful sections from NgRx tables
            const storeTableMatch = block.match(/\| Slice\s+\| Purpose\s+\|\n\|[-|\s]+\|\n([\s\S]*?)(?=\n\n|\n[^|]|$)/);
            if (storeTableMatch) {
                statefulSections = storeTableMatch[1]
                    .split('\n')
                    .map(line => line.split('|')[1]?.trim().replace(/`/g, ''))
                    .filter((s): s is string => !!s);
            }

            if (treeMatch) {
                sections = treeMatch[1]
                    .split('\n')
                    .map(line => {
                        const m = line.match(/[├└]──\s+([^/]+)\//);
                        return m ? m[1].trim() : null;
                    })
                    .filter((s): s is string => !!s && s !== 'home' && s !== 'personal');
            } else {
                // Fallback: extract from "Key features" list
                const featureMatch = block.match(/\*\*Key features\*\*:\n+([\s\S]*?)(?=\n\n|\n\*\*)/);
                if (featureMatch) {
                    sections = featureMatch[1]
                        .split('\n')
                        .map(line => line.match(/-\s+([^(]+)/)?.[1]?.trim())
                        .filter((s): s is string => !!s)
                        .map(s => s.toLowerCase().replace(/\s+/g, '-'));
                }
            }
            
            apps.push({ 
                name, 
                sections: [...new Set([...sections, ...statefulSections])],
                statefulSections: [...new Set(statefulSections)],
            });
        }
    }

    // 2. Parse Libraries (Section 6)
    const libSection = content.split('## 6. Shared Libraries')[1]?.split('## 7. State Management')[0];
    if (libSection) {
        const libBlocks = libSection.split(/^###\s+6\.\d+/m).filter(b => b.trim());
        for (const block of libBlocks) {
            const nameMatch = block.match(/^\s*`?(\w+)`?/);
            if (!nameMatch) continue;
            const name = nameMatch[1];
            
            // Extract #### headers as sections (e.g., Components, Services)
            const sections = (block.match(/^####\s+\d+\.\d+\.\d+\s+([^\n]+)/gm) || [])
                .map(s => s.replace(/^####\s+\d+\.\d+\.\d+\s+/, '').trim());
            
            apps.push({ 
                name, 
                sections,
                statefulSections: name === 'wallet' ? sections : [], // Wallet is always stateful
            });
        }
    }

    return apps;
}

function buildKnowledgeBase(
    apis: ApiContract[],
    components: ComponentDef[],
    conventions: NamingRules,
    stack: TechStackInfo,
    gotchas: Gotcha[],
    repositoryMapping: any[],
    rawFiles: Record<string, string>,
): KnowledgeBase {
    return {
        apis,
        components,
        conventions,
        stack,
        gotchas,
        repositoryMapping,
        rawFiles,

        findApiByDomain(domain: string): ApiContract[] {
            const normalized = domain.toLowerCase();
            return this.apis.filter((a) => a.domain.toLowerCase().includes(normalized));
        },

        findComponent(name: string): ComponentDef | undefined {
            const normalized = name.toLowerCase();
            return this.components.find(
                (c) => c.name.toLowerCase().includes(normalized) || c.selector.includes(normalized),
            );
        },

        getConventionRules(category: NamingRule['category']): NamingRule[] {
            return this.conventions.rules.filter((r) => r.category === category);
        },

        getRelevantApis(keywords: string[]): ApiContract[] {
            const normalized = keywords.map((k) => k.toLowerCase());
            return this.apis.filter((a) =>
                normalized.some(
                    (kw) =>
                        a.domain.toLowerCase().includes(kw) ||
                        a.path.toLowerCase().includes(kw) ||
                        a.description.toLowerCase().includes(kw),
                ),
            );
        },
    };
}

export async function loadKnowledge(knowledgePath: string): Promise<KnowledgeBase> {
    if (!(await fs.pathExists(knowledgePath))) {
        throw new Error(
            `Knowledge directory not found: ${knowledgePath}\n` +
            `Set BIFROST_KNOWLEDGE_PATH or BIFROST_FRAMEWORK_PATH env var, ` +
            `or add knowledgePath to .bifrostrc.json`,
        );
    }

    const rawFiles: Record<string, string> = {};

    for (const [key, filename] of Object.entries(KNOWLEDGE_FILES)) {
        const filePath = path.join(knowledgePath, filename);
        try {
            rawFiles[key] = await fs.readFile(filePath, 'utf8');
        } catch {
            rawFiles[key] = '';
        }
    }

    const apis = [
        ...parseApiContracts(rawFiles.API_CONTRACTS),
        ...parseApiContracts(rawFiles.REPOSITORY_MANUAL),
    ];
    const components = parseComponents(rawFiles.COMPONENT_LIBRARY);
    const conventions = parseNamingConventions(rawFiles.NAMING_CONVENTIONS);
    const stack = parseTechStack(rawFiles.TECH_STACK);
    const gotchas = parseGotchas(rawFiles.GOTCHAS);
    const mapping = parseRepositoryMapping(rawFiles.REPOSITORY_MANUAL);

    return buildKnowledgeBase(apis, components, conventions, stack, gotchas, mapping, rawFiles);
}
