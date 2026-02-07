---
description: Generate boilerplate code structure for new components or modules
---

## User Input

```text
$ARGUMENTS
```

## Outline

Create boilerplate code structure following project conventions and clean architecture principles.

1. **Parse scaffolding request**:
   - Identify type: component, module, service, API endpoint, test, etc.
   - Extract name and any specific options
   - Determine target location

2. **Gather project context**:
   - Read constitution.md for project standards
   - Check existing similar files for patterns
   - Identify project structure (e.g., src/, lib/, components/)
   - Determine language/framework from package.json or requirements.txt

3. **Check feature context**:
   - If on feature branch, check spec for relevant requirements
   - Align scaffold with feature needs

4. **Generate structure**:
   - Create directory structure (if needed)
   - Generate main file with:
     - Appropriate imports/requires
     - Standard structure (class/function/module)
     - Basic documentation comments
     - Type definitions (if TypeScript/typed language)
   - Generate test file following test conventions
   - Add to exports/index if pattern used

5. **Follow project patterns**:
   - Match existing naming conventions
   - Use project's standard file structure
   - Include error handling patterns
   - Follow architectural layers (domain, application, infrastructure)

6. **Minimal but complete**:
   - Include only structure, not implementation
   - Add TODO comments for implementation points
   - Keep it simple - avoid over-engineering

7. **Report**:
   - List files created
   - Explain structure
   - Suggest next steps for implementation

## Example Usage

```
/scaffold component UserProfile
/scaffold service AuthenticationService
/scaffold API endpoint /api/users
/scaffold module payment-processing
/scaffold test for validateEmail
```

## Example Output

```markdown
## Scaffolded: AuthenticationService

Created files:
- src/services/auth/AuthenticationService.js:1
- src/services/auth/AuthenticationService.test.js:1
- src/services/auth/index.js:1

### Structure

**AuthenticationService.js**:
- login(credentials) - TODO: Implement login logic
- logout(userId) - TODO: Implement logout logic
- validateToken(token) - TODO: Implement token validation
- refreshToken(token) - TODO: Implement token refresh

**Test file** includes basic test structure for each method.

### Next steps

1. Implement login() method per spec requirement FR-1
2. Add integration with JWT token generation
3. Connect to user database
4. Implement error handling
```
