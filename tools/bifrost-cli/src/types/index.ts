export enum ProjectPath {
    A = 'A',
    B = 'B',
    C = 'C',
}



export enum FeatureScope {
    NEW_SECTION = 'New Section/Page',
    UPDATE_EXISTING = 'Update Existing Section',
    REUSABLE_TOOL = 'Reusable Tool',
}

export enum BifrostStatus {
    INITIALIZED = 'initialized',
    INTAKE = 'intake',
    INTAKE_COMPLETE = 'intake-complete',
    PLANNING = 'planning',
    PLANNING_COMPLETE = 'planning-complete',
    CODING = 'coding',
    QA = 'qa',
    QA_FAILED = 'qa-failed',
    REVIEW = 'review',
    PR_CREATED = 'pr-created',
    MERGED = 'merged',
}

export enum AgentName {
    INTAKE = '@Intake',
    PLANNER = '@Planner',
    CODEGEN = '@CodeGen',
    QA = '@QA',
    CONDUCTOR = '@Conductor',
    REVIEWER = '@Reviewer',
}

export enum AutonomyLevel {
    TASK_GATED = 'task-gated',
    PHASE_GATED = 'phase-gated',
    FULL = 'full',
}

export interface InterrogationAnswersA {
    path: ProjectPath.A;
    targetApp: string;
    featureScope: FeatureScope;
    targetSection?: string;
    needsApi: boolean;
    featureName: string;
    featureDescription: string;
    businessValue: string;
    featureOwner: string;
    constraints?: string;
    timeline: string;
}

export interface InterrogationAnswersB {
    path: ProjectPath.B;
    projectName: string;
    userActions: string[];
    externalServices: string[];
    featureName: string;
    featureDescription: string;
    timeline: string;
}

export interface InterrogationAnswersC {
    path: ProjectPath.C;
    buildingWhat: string;
    featureName: string;
    featureDescription: string;
    timeline: string;
}

export type InterrogationAnswers =
    | InterrogationAnswersA
    | InterrogationAnswersB
    | InterrogationAnswersC;

export interface ApiContract {
    domain: string;
    method: string;
    path: string;
    description: string;
    rawContent: string;
}

export interface ComponentDef {
    name: string;
    selector: string;
    category: string;
    description: string;
    rawContent: string;
}

export interface NamingRule {
    category: 'file' | 'class' | 'function' | 'variable' | 'component' | 'service' | 'store';
    rule: string;
    examples: string[];
}

export interface NamingRules {
    rules: NamingRule[];
    rawContent: string;
}

export interface TechStackInfo {
    coreFramework: string;
    stateManagement: string;
    uiLibrary: string;
    testingFramework: string;
    rawContent: string;
}

export interface Gotcha {
    severity: 'error' | 'warning' | 'info';
    title: string;
    description: string;
}

export interface KnowledgeBase {
    apis: ApiContract[];
    components: ComponentDef[];
    conventions: NamingRules;
    stack: TechStackInfo;
    gotchas: Gotcha[];
    rawFiles: Record<string, string>;

    findApiByDomain(domain: string): ApiContract[];
    findComponent(name: string): ComponentDef | undefined;
    getConventionRules(category: NamingRule['category']): NamingRule[];
    getRelevantApis(keywords: string[]): ApiContract[];
}

export interface CodebaseAnalysis {
    existingComponents: string[];
    existingServices: string[];
    existingState: string[];
    targetPath: string;
}

export interface Hydration {
    project: {
        name: string;
        path: string;
        feature: string;
        description: string;
        targetApp?: string;
        timeline: string;
        needsApi?: boolean;
        autonomyLevel: AutonomyLevel;
    };
    context: {
        wibooKnowledge: {
            apiContracts: ApiContract[];
            components: ComponentDef[];
            namingConventions: NamingRules;
            techStack: TechStackInfo;
            gotchas: Gotcha[];
        };
        codebaseAnalysis: CodebaseAnalysis;
    };
    instructions: {
        featureScope: string;
        acceptanceCriteria: string[];
        constraints: string[];
        timeline: string;
        destination: string;
    };
    meta: {
        bifrostVersion: string;
        createdAt: string;
        interrogationPath: ProjectPath;
    };
}

export interface TimelineEntry {
    timestamp: string;
    message: string;
}

export interface ArtifactEntry {
    agent: AgentName;
    path: string;
    timestamp: string;
}

export interface BifrostState {
    id: string;
    feature: string;
    status: BifrostStatus;
    created: string;
    version: string;
    timeline: TimelineEntry[];
    artifacts: ArtifactEntry[];
    decisions: string[];
    blockers: string[];
    nextSteps: string[];
}

export interface ValidationResult {
    success: boolean;
    errors: string[];
}

export interface BifrostConfig {
    version: string;
    knowledgePath: string;
    bifrostFrameworkPath: string;
    defaultAutonomyLevel: AutonomyLevel;
    agentTimeoutMs: number;
    defaultBranch: string;
    dryRun: boolean;
    targetApps: string[];
}

export interface AgentTrigger {
    agent: AgentName;
    hydrationPath: string;
    bifrostPath: string;
    timestamp: string;
    mockMode: boolean;
}
