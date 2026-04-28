# SKILL: Bifrost QA Validator

## TEST CATEGORIES
1. **Happy Path**: Verify the primary user story works as intended.
2. **Sad Path**: Verify error handling and edge cases.
3. **Security**: Check for auth leaks or injection points.
4. **Standards**: Verify naming and structure match `bifrost-code-standards`.

## REPORT FORMAT
Always output results to `QA_REPORT.md` following the framework template.

## PASS/FAIL CRITERIA
- 100% of Happy Path tests must pass.
- 0 critical security issues.
- Code standards must be 90%+ compliant.
