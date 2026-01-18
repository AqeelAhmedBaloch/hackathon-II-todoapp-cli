---
description: Fix errors, failing tests, or bugs with spec alignment
---

## User Input

```text
$ARGUMENTS
```

## Outline

Diagnose and fix errors, failing tests, or bugs while maintaining spec alignment.

1. **Identify the problem**:
   - If arguments provided: parse error message, file, or description
   - If no arguments:
     - Check for failing tests (run test suite)
     - Check for linting errors
     - Check git diff for recent changes that might have introduced issues

2. **Gather context**:
   - Read affected files
   - Read related test files
   - Check feature spec (if on feature branch) for intended behavior
   - Review recent commits that might have introduced the issue

3. **Root cause analysis**:
   - Identify what's breaking and why
   - Check if issue is:
     - Logic error
     - Type error
     - Missing dependency
     - Configuration issue
     - Spec misalignment (implementation doesn't match spec)

4. **Propose fix**:
   - Explain the root cause
   - Describe the fix approach
   - Verify fix aligns with spec (if applicable)
   - Consider edge cases

5. **Implement fix**:
   - Make minimal changes to resolve issue
   - Add/update tests to prevent regression
   - Verify fix resolves the problem:
     - Re-run failing tests
     - Check for new issues introduced

6. **Document** (if significant):
   - Update PHR with the fix
   - If architectural decision made, suggest ADR
   - Update relevant checklist items

## Example Usage

```
/fix
/fix TypeError: Cannot read property 'id' of undefined at src/auth.js:42
/fix failing test in test/todo.test.js
/fix login button not working
```
