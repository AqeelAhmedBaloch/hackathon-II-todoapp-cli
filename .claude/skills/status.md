---
description: Show current project and feature status
---

## User Input

```text
$ARGUMENTS
```

## Outline

Provide a comprehensive status overview of the current project state.

1. **Git status**:
   - Current branch
   - Uncommitted changes (staged/unstaged)
   - Unpushed commits
   - Branch relationship to remote

2. **Feature context** (if on feature branch):
   - Extract feature name from branch (format: N-feature-name)
   - Check for specs/N-feature-name/ directory
   - List available artifacts:
     - spec.md (with completion status)
     - plan.md (with completion status)
     - tasks.md (with task count and completion)
     - checklists/ (list files)
     - history/adr/ (list ADRs for this feature)

3. **Current phase detection**:
   - Determine where in workflow: spec → clarify → plan → tasks → implement → test → review → commit
   - Suggest next command based on phase

4. **Recent activity**:
   - Last 3 commits on current branch
   - Last 3 PHRs created
   - Recent ADRs (if any)

5. **Health check**:
   - Are there uncommitted changes?
   - Are there failing tests? (if test runner available)
   - Are there [NEEDS CLARIFICATION] markers in spec?
   - Are there TODO/FIXME comments in changed files?

6. **Suggested next steps**:
   - Based on current phase and health check
   - Link to relevant commands

## Example Output

```markdown
## Project Status

**Branch**: 1-user-auth (3 commits ahead of main)
**Phase**: Implementation
**Uncommitted changes**: 5 files modified

### Feature: User Authentication (1-user-auth)

Artifacts:
- ✓ spec.md (complete)
- ✓ plan.md (complete)
- ✓ tasks.md (8/12 tasks complete)
- ✓ checklists/implementation.md (in progress)

### Health Check

- ⚠️ 2 failing tests in test/auth.test.js:15
- ✓ No [NEEDS CLARIFICATION] markers
- ⚠️ 3 TODO comments in changed files

### Suggested Next Steps

1. Fix failing tests in test/auth.test.js:15
2. Complete remaining 4 tasks from tasks.md
3. Run `/review` before committing
```

## Example Usage

```
/status
```
