// Placeholder for missing validator
export function validateHydration(hydration: any): { success: boolean; errors: string[] } {
    return { success: true, errors: [] };
}

export function assertValidHydration(hydration: any): void {
    if (!hydration || Object.keys(hydration).length === 0) {
        throw new Error('Invalid hydration: Missing root fields');
    }
    const result = validateHydration(hydration);
    if (!result.success) {
        throw new Error(`Invalid hydration: ${result.errors.join(', ')}`);
    }
}
