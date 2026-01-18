---
description: Refactor code while maintaining functionality and spec alignment
---

## User Input

```text
$ARGUMENTS
```

## Outline

Refactor code to improve quality while preserving functionality and spec alignment.

1. **Parse refactoring request**:
   - Identify target: file, function, module, or pattern
   - Understand goal: performance, readability, maintainability, testability
   - Check if specific refactoring pattern mentioned (extract function, rename, consolidate, etc.)

2. **Pre-refactoring checks**:
   - Read current code
   - Check if tests exist for the code
   - If no tests: create characterization tests first
   - Read spec (if feature-specific) to ensure understanding of intended behavior
   - Check constitution.md for project quality standards

3. **Analyze current state**:
   - Identify code smells or quality issues
   - Map dependencies and coupling
   - Understand current behavior (including edge cases)
   - Identify what should be preserved vs. changed

4. **Plan refactoring**:
   - Choose refactoring approach
   - Identify steps to minimize risk
   - Plan to preserve all existing functionality
   - Ensure spec alignment is maintained

5. **Execute refactoring**:
   - Make incremental changes
   - Run tests after each step
   - Maintain git history (small commits showing progression)
   - Keep changes focused (avoid scope creep)

6. **Verification**:
   - Run full test suite
   - Verify spec alignment (functional requirements still met)
   - Invoke agent-quality-standards for quality check
   - Compare behavior before/after

7. **Document**:
   - Create PHR for refactoring work
   - If architectural decision made, suggest ADR
   - Update comments if behavior is non-obvious

8. **Report**:
   - Summary of changes made
   - Quality improvements achieved
   - Test results
   - Code references for changes

## Refactoring Principles

- **Preserve functionality**: All tests must pass before and after
- **Small steps**: Incremental changes are safer
- **Spec alignment**: Don't change what the code does, only how
- **Test first**: Ensure good test coverage before refactoring
- **No new features**: Refactoring is about improving code quality, not adding functionality

## Example Usage

```
/refactor src/auth/login.js
/refactor extract function from validateUser
/refactor improve error handling in payment module
/refactor rename confusing variable names in src/utils/helpers.js
```
