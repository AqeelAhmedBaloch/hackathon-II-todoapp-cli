---
description: Review code changes against spec and quality standards
---

## User Input

```text
$ARGUMENTS
```

## Outline

Perform a comprehensive code review focusing on spec alignment, quality standards, and best practices.

1. **Determine review scope**:
   - If arguments provided: review specific files/feature mentioned
   - If no arguments: review recent changes (git diff)
   - Check for active feature branch and related spec

2. **Gather context**:
   - Read relevant spec.md (if feature-specific)
   - Read constitution.md for project standards
   - Identify files changed (use git diff or explicit file list)

3. **Invoke quality agent**:
   - Use the agent-quality-standards agent to check:
     - Code structure and organization
     - Adherence to clean architecture principles
     - Modularity and readability
     - Test coverage

4. **Check spec alignment** (if spec exists):
   - Compare implementation against functional requirements
   - Verify success criteria are met
   - Check that acceptance scenarios are satisfied
   - Flag any deviation from spec

5. **Security and best practices**:
   - Check for common security issues (OWASP top 10)
   - Verify error handling
   - Check for hardcoded secrets or credentials
   - Validate input sanitization

6. **Generate report**:
   - Summary of findings (pass/fail for each category)
   - Specific issues with file:line references
   - Suggestions for improvements
   - Blockers vs. nice-to-haves

7. **Update checklist** (if exists):
   - Mark completed items in feature checklists
   - Add new items for issues found

## Example Usage

```
/review
/review src/auth/login.js
/review user-auth
```
