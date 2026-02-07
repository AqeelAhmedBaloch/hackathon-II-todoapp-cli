---
description: Show and explain differences between branches, commits, or files
---

## User Input

```text
$ARGUMENTS
```

## Outline

Display and explain code differences with context about what changed and why.

1. **Parse diff request**:
   - If two branches: `diff branch1 branch2`
   - If two commits: `diff commit1 commit2`
   - If branch vs main: `diff` or `diff branch-name`
   - If specific file: `diff file-path`
   - If no args: diff current changes (staged + unstaged)

2. **Generate diff**:
   - Use git diff with appropriate parameters
   - Capture full diff output
   - Identify modified files and line changes

3. **Analyze changes**:
   - Categorize changes:
     - New features
     - Bug fixes
     - Refactoring
     - Configuration changes
     - Test changes
   - Identify high-impact changes
   - Check for potential issues:
     - Breaking changes
     - Security concerns
     - Spec misalignment (if on feature branch)

4. **Explain changes**:
   - For each significant file change:
     - What was changed
     - Why it matters
     - Potential impact
   - Group related changes
   - Highlight changes that need attention

5. **Check spec alignment** (if on feature branch):
   - Read spec.md
   - Verify changes align with functional requirements
   - Flag any deviations

6. **Provide summary**:
   - Total files changed, insertions, deletions
   - Breakdown by category
   - Notable changes requiring review
   - Recommendations

## Example Usage

```
/diff
/diff main
/diff feature-branch
/diff abc123 def456
/diff src/auth/login.js
```

## Example Output

```markdown
## Diff Summary: 1-user-auth vs main

**Files changed**: 12 files (+485, -123 lines)

### New Features (5 files)
- `src/auth/login.js` (+145 lines) - New JWT-based login system
- `src/auth/jwt.js` (+67 lines) - JWT token generation and validation
- `src/middleware/auth.js` (+89 lines) - Authentication middleware

### Tests (4 files)
- `test/auth/login.test.js` (+124 lines) - Login flow tests
- `test/auth/jwt.test.js` (+45 lines) - Token validation tests

### Configuration (2 files)
- `.env.example` (+8 lines) - Added JWT_SECRET config
- `package.json` (+1, -0) - Added jsonwebtoken dependency

### Documentation (1 file)
- `README.md` (+6 lines) - Updated auth setup instructions

### Notable Changes

⚠️ **Breaking change**: src/auth/login.js:23
- Removed old session-based auth
- Requires database migration for users table

✓ **Spec aligned**: All changes match spec requirements FR-1 through FR-5

⚠️ **Needs review**: src/middleware/auth.js:45
- Error handling could be more specific
- Consider adding rate limiting

### Recommendations

1. Review error handling in auth middleware
2. Add integration tests for full auth flow
3. Document JWT secret rotation process
```
