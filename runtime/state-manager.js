const fs = require('fs');
const path = require('path');

/**
 * Bifrost State Manager (Runtime Version)
 * Used by git hooks and standalone scripts to interact with STATE.md
 */

const VALID_STATUSES = [
    'initialized',
    'intake',
    'intake-complete',
    'planning',
    'planning-complete',
    'coding',
    'qa',
    'qa-failed',
    'review',
    'pr-created',
    'merged'
];

function nowIso() {
    return new Date().toISOString();
}

/**
 * Parses STATE.md into a structured object
 * @param {string} raw - Raw content of STATE.md
 * @returns {Object} State object
 */
function parseState(raw) {
    const lines = raw.split('\n');
    const state = {
        id: '',
        feature: '',
        status: '',
        created: '',
        version: '',
        timeline: [],
        artifacts: [],
        decisions: [],
        blockers: [],
        nextSteps: []
    };

    let inFrontmatter = false;
    let currentSection = '';

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Handle Frontmatter
        if (line === '---') {
            inFrontmatter = !inFrontmatter;
            continue;
        }

        if (inFrontmatter) {
            const [key, ...valueParts] = line.split(':');
            if (key && valueParts.length > 0) {
                const value = valueParts.join(':').trim();
                state[key.trim()] = value;
            }
            continue;
        }

        // Handle Sections
        if (line.startsWith('## ')) {
            currentSection = line.replace('## ', '').trim();
            continue;
        }

        // Handle List Items
        if (line.startsWith('- ')) {
            const content = line.replace('- ', '').trim();
            
            switch (currentSection) {
                case 'Timeline': {
                    const match = content.match(/`([^`]+)` — (.+)/);
                    if (match) {
                        state.timeline.push({ timestamp: match[1], message: match[2] });
                    }
                    break;
                }
                case 'Artifacts': {
                    const match = content.match(/(@\w+): `([^`]+)` _\(([^)]+)\)_/);
                    if (match) {
                        state.artifacts.push({ agent: match[1], path: match[2], timestamp: match[3] });
                    }
                    break;
                }
                case 'Decisions':
                    if (content !== '(none)') state.decisions.push(content);
                    break;
                case 'Blockers':
                    if (content !== 'None' && content !== '(none)') state.blockers.push(content);
                    break;
                case 'Next Steps':
                    if (content !== '(none)') state.nextSteps.push(content);
                    break;
            }
        }
    }

    return state;
}

/**
 * Renders state object back to Markdown
 * @param {Object} state - State object
 * @returns {string} Markdown content
 */
function renderState(state) {
    const frontmatter = [
        '---',
        `id: ${state.id}`,
        `feature: ${state.feature}`,
        `status: ${state.status}`,
        `created: ${state.created}`,
        `version: ${state.version || nowIso()}`,
        '---'
    ].join('\n');

    const timeline = state.timeline.map(e => `- \`${e.timestamp}\` — ${e.message}`).join('\n') || '(none)';
    const artifacts = state.artifacts.map(a => `- ${a.agent}: \`${a.path}\` _(${a.timestamp})_`).join('\n') || '(none)';
    const decisions = state.decisions.map(d => `- ${d}`).join('\n') || '(none)';
    const blockers = state.blockers.length > 0 ? state.blockers.map(b => `- ${b}`).join('\n') : 'None';
    const nextSteps = state.nextSteps.map(s => `- ${s}`).join('\n') || '(none)';

    return `${frontmatter}

# Bifrost State

## Timeline
${timeline}

## Artifacts
${artifacts}

## Decisions
${decisions}

## Blockers
${blockers}

## Next Steps
${nextSteps}
`;
}

/**
 * Loads state from file
 * @param {string} statePath 
 */
function loadState(statePath) {
    if (!fs.existsSync(statePath)) {
        throw new Error(`State file not found: ${statePath}`);
    }
    const raw = fs.readFileSync(statePath, 'utf8');
    return parseState(raw);
}

/**
 * Saves state to file
 * @param {string} statePath 
 * @param {Object} state 
 */
function saveState(statePath, state) {
    state.version = nowIso();
    fs.writeFileSync(statePath, renderState(state), 'utf8');
}

module.exports = {
    loadState,
    saveState,
    parseState,
    renderState,
    VALID_STATUSES
};
