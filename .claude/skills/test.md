---
description: Run tests for the current feature or project
---

## User Input

```text
$ARGUMENTS
```

## Outline

Run the test suite for the project, with optional filtering based on arguments.

1. **Determine test scope** from arguments:
   - If empty: run all tests
   - If feature name provided: run tests for that feature only
   - If specific test file/pattern provided: run matching tests

2. **Check for test configuration**:
   - Look for `package.json` scripts (npm/yarn projects)
   - Look for `pytest.ini`, `setup.py`, or `pyproject.toml` (Python projects)
   - Look for test runner configuration (Jest, Mocha, pytest, etc.)

3. **Run tests**:
   - Execute the appropriate test command
   - Capture output including:
     - Number of tests run
     - Pass/fail status
     - Failed test details
     - Coverage information (if available)

4. **Report results**:
   - Summary of test execution
   - If failures exist, list them with details
   - Suggest fixes for common failure patterns
   - Update relevant checklists if they exist

5. **Handle errors**:
   - If no tests found: report and suggest creating tests
   - If test runner not configured: suggest setup steps
   - If tests fail: provide diagnostic information

## Example Usage

```
/test
/test user-auth
/test test/unit/auth.test.js
```
