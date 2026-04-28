# SKILL: Bifrost API Integration

## CLIENT PATTERN
Use the centralized `ApiClient` located at `src/core/api/client.ts`.

## ERROR HANDLING
- All API calls must be wrapped in try/catch.
- Use the `ErrorHandler` service for reporting.

## CONTRACT VALIDATION
- Always check `knowledge/API_CONTRACTS.md` for endpoint signatures.
- Validate inputs using Zod schemas before sending.

## AUTHENTICATION
- Do not handle tokens manually.
- Use the `AuthInterceptor` provided by the framework.
