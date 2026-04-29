import { InterrogationAnswersA, ProjectPath, FeatureScope } from '../../types';

/**
 * Pragmatiac Parser for PATIENT.md
 * Extracts key metadata to enable "Silent Ingestion" in the Bifrost CLI.
 */
export function parsePatientMd(content: string): Partial<InterrogationAnswersA> {
    const lines = content.split('\n');
    const answers: Partial<InterrogationAnswersA> = {
        path: ProjectPath.A,
        featureScope: FeatureScope.NEW_SECTION, // Default
        needsApi: true, // Default to true for safety
    };

    let inDescription = false;
    let inBusinessValue = false;
    const descriptionLines: string[] = [];
    const businessValueLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // 1. Header Metadata
        if (line.startsWith('Feature:')) answers.featureName = line.replace('Feature:', '').replace('{{PROJECT_NAME}}', '').trim();
        if (line.startsWith('Target Application:')) answers.targetApp = line.replace('Target Application:', '').replace('{{TARGET_APP}}', '').trim();
        if (line.startsWith('Author:')) answers.featureOwner = line.replace('Author:', '').replace('{{AUTHOR}}', '').trim();

        // 2. Sections
        if (line.includes('## 1. What you\'re building')) {
            inDescription = true;
            continue;
        }
        if (line.includes('## 2. Why you\'re building it')) {
            inDescription = false;
            inBusinessValue = true;
            continue;
        }
        if (line.includes('## 3. How users (or you) will know it works')) {
            inBusinessValue = false;
            continue;
        }

        // 3. Collect Prose
        if (inDescription && !line.startsWith('#') && !line.startsWith('---') && !line.startsWith('**One-paragraph summary**') && !line.startsWith('<!--')) {
            if (line) descriptionLines.push(line);
        }
        if (inBusinessValue && !line.startsWith('#') && !line.startsWith('---') && !line.startsWith('**The problem this solves**') && !line.startsWith('<!--')) {
            if (line) businessValueLines.push(line);
        }

        // 4. Deadlines / Timeline
        if (line.startsWith('**Deadlines**') || line.startsWith('**Timeline:**')) {
            // Find next list item
            for (let j = i + 1; j < lines.length; j++) {
                const subLine = lines[j].trim();
                if (subLine.startsWith('-')) {
                    answers.timeline = subLine.replace('-', '').trim();
                    break;
                }
            }
        }
    }

    answers.featureDescription = descriptionLines.slice(0, 3).join(' '); // Take first few lines as summary
    answers.businessValue = businessValueLines.slice(0, 3).join(' ');

    return answers;
}

export function validatePatientAnswers(answers: Partial<InterrogationAnswersA>): string[] {
    const errors: string[] = [];
    if (!answers.featureName || answers.featureName === '{{PROJECT_NAME}}' || answers.featureName === '...') errors.push('Missing Feature Name');
    if (!answers.targetApp || answers.targetApp === '{{TARGET_APP}}' || answers.targetApp === '...') errors.push('Missing Target Application');
    if (!answers.featureDescription || answers.featureDescription === '...') errors.push('Missing Feature Description');
    return errors;
}
