---
name: bifrost-caveman-review
description: Structured code review format. One line per finding: L<line>: emoji severity: problem. fix.
---

# bifrost-caveman-review SKILL

When reviewing code, produce output in this format:

## Format

L<line>: <emoji> <severity>: <problem>. <fix>.

## Severity + Emoji

| Emoji | Severity | Meaning | Example |
|-------|----------|---------|---------|
| 🔴 | bug | Functional error, blocker | L42: 🔴 bug: null check missing. Add guard. |
| 🟡 | risk | Security/performance issue, needs decision | L89: 🟡 risk: no pagination on query. Could timeout. |
| 🔵 | nit | Style, naming, clarity (informational) | L120: 🔵 nit: var `d` ambiguous. Rename to `dueDate`. |
| ❓ | q | Question for developer | L150: ❓ q: timezone handling intentional? Verify spec. |

## One Finding = One Line

```
L42: 🔴 bug: null check missing. Add guard clause.
L89: 🟡 risk: query unpaginated. Add limit(100) or pagination.
L120: 🔵 nit: test name "testIt" unclear. Rename to "testFormSubmitsOnValidInput".
```

## When to Use Prose (Exceptions)

Prose-only for:
- Security findings needing CVE/threat context
- Architectural decisions affecting schema or API contracts
- Onboarding explanations for new reviewers

## Example Review Output

```
L15: 🔴 bug: missing await on async function. Add await.
L42: 🟡 risk: user input reaches query directly. Add sanitization.
L89: 🔵 nit: variable `temp` not descriptive. Use `fetchedUserData`.

Security findings (prose):
Lines 15-50: SQL injection risk if user input not sanitized. 
Recommend: use parameterized queries (prisma, typeorm) or escape all inputs.
See OWASP SQL Injection: https://owasp.org/www-community/attacks/SQL_Injection
```
