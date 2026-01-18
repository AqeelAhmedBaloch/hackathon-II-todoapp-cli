---
description: Explain how code works or how a feature is implemented
---

## User Input

```text
$ARGUMENTS
```

## Outline

Provide clear explanations of code, features, or implementation details.

1. **Parse request**:
   - If file path provided: explain that file
   - If feature name provided: explain feature implementation
   - If function/class name: find and explain it
   - If concept/pattern: explain how it's used in the codebase

2. **Gather context**:
   - Read relevant files
   - Check feature spec (if applicable) for intended behavior
   - Look for related tests to understand expected behavior
   - Check ADRs for architectural decisions

3. **Analyze the code/feature**:
   - Identify main components and their roles
   - Trace data flow
   - Identify key patterns and design decisions
   - Note any non-obvious behavior or edge cases

4. **Structure explanation**:
   - **Overview**: What it does (high-level purpose)
   - **How it works**: Step-by-step flow
   - **Key components**: Main functions/classes/modules
   - **Data flow**: How information moves through the system
   - **Design decisions**: Why it's structured this way (reference ADRs if applicable)
   - **Examples**: Concrete usage examples
   - **Edge cases**: Non-obvious behavior
   - **Related**: Links to specs, tests, related code

5. **Visual aids** (when helpful):
   - ASCII diagrams for flow
   - Call hierarchies
   - Data structure diagrams

6. **Provide code references**:
   - Use file:line format for all references
   - Link to specific functions/classes

## Example Usage

```
/explain src/auth/login.js
/explain user-auth feature
/explain how authentication works
/explain validateToken function
```

## Example Output

```markdown
## Explanation: User Authentication (src/auth/login.js:1)

### Overview
The authentication system provides secure user login using JWT tokens with session management.

### How it works

1. User submits credentials (src/auth/login.js:15)
2. Credentials validated against database (src/auth/login.js:23)
3. JWT token generated with user claims (src/auth/login.js:45)
4. Token stored in httpOnly cookie (src/auth/login.js:52)
5. User session created in Redis (src/auth/session.js:18)

### Key components

- `validateCredentials()` (src/auth/login.js:23) - Checks username/password
- `generateToken()` (src/auth/jwt.js:12) - Creates JWT with 24h expiry
- `createSession()` (src/auth/session.js:18) - Stores session data

### Design decisions

Per ADR-003 (history/adr/003-jwt-authentication.md), we use JWT over session-only auth to support:
- Stateless API authentication
- Cross-domain authentication
- Mobile app support

### Edge cases

- Token refresh within 5min of expiry (src/auth/refresh.js:8)
- Concurrent login detection (src/auth/session.js:34)
- Logout clears both cookie and session (src/auth/logout.js:12)
```
