import { describe, it, expect } from '@jest/globals';
import { parsePatientMd, validatePatientAnswers } from '../../../src/core/parser/patient';
import { ProjectPath, FeatureScope } from '../../../src/types';

describe('PatientMd Parser', () => {
    const validContent = `
# PATIENT.md: Feature Scope

Feature: User Dashboard 2.0
Target Application: Merchant Portal
Author: John Doe
Date: 2026-04-29

---

## 1. What you're building
**One-paragraph summary**
This is a brand new dashboard for merchants to track their sales and payouts in real-time. It includes interactive charts and a detailed transaction table.

## 2. Why you're building it
**The problem this solves**
Merchants currently have to wait 24 hours to see their sales data. This dashboard provides immediate feedback.

## 5. Stakeholders and context
**Deadlines**
- 2026-05-15 (Hard deadline for investor demo)
`;

    it('should correctly parse feature metadata', () => {
        const result = parsePatientMd(validContent);
        expect(result.featureName).toBe('User Dashboard 2.0');
        expect(result.targetApp).toBe('Merchant Portal');
        expect(result.featureOwner).toBe('John Doe');
        expect(result.path).toBe(ProjectPath.A);
    });

    it('should extract description and business value', () => {
        const result = parsePatientMd(validContent);
        expect(result.featureDescription).toContain('dashboard for merchants');
        expect(result.businessValue).toContain('wait 24 hours');
    });

    it('should extract timeline/deadlines', () => {
        const result = parsePatientMd(validContent);
        expect(result.timeline).toBe('2026-05-15 (Hard deadline for investor demo)');
    });

    it('should validate complete answers successfully', () => {
        const result = parsePatientMd(validContent);
        const errors = validatePatientAnswers(result);
        expect(errors.length).toBe(0);
    });

    it('should catch missing fields during validation', () => {
        const incompleteContent = `
# PATIENT.md
Feature: {{PROJECT_NAME}}
Target Application: ...
`;
        const result = parsePatientMd(incompleteContent);
        const errors = validatePatientAnswers(result);
        expect(errors).toContain('Missing Feature Name');
        expect(errors).toContain('Missing Target Application');
        expect(errors).toContain('Missing Feature Description');
    });
});
