# Bifrost Framework Examples

This directory contains reference implementations of common feature types built using the Bifrost workflow. Use these to understand how agents structure code and artifacts.

## Available Examples

### 1. `feature-crud-api/`
- **Type**: Backend / Integration
- **Scenario**: Adding a new REST endpoint for user notifications.
- **Key Artifacts**: 
    - `PATIENT.md` showing API requirements.
    - `PLAN.md` breaking down controller, service, and repository tasks.
    - `QA_REPORT.md` validating status codes and error handling.

### 2. `feature-ui-component/`
- **Type**: Frontend / UI
- **Scenario**: Creating a reusable "Notification Bell" component with a dropdown.
- **Key Artifacts**:
    - `IMPACT.md` analyzing CSS/Design system alignment.
    - `CODE_REVIEW.md` checklist for accessibility and props validation.

### 3. `feature-integration/`
- **Type**: Third-party Service
- **Scenario**: Integrating Stripe for one-time payments.
- **Key Artifacts**:
    - `HEALTH.md` defining strict security gates.
    - `HANDOFF.md` explaining secret management to Backend.

## How to use
You can clone these examples and run `bifrost-init` inside them to see how the framework handles existing code context.
