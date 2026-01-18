---
id: 002
title: Basic Todo CRUD Implementation Plan
stage: plan
date: 2025-12-29
surface: agent
model: claude-sonnet-4-5
feature: 001-basic-todo-crud
branch: 001-basic-todo-crud
user: Aqeel Ahmed Baloch
command: /sp.plan
labels: ["plan", "todo-app", "architecture", "phase-1", "design"]
links:
  spec: specs/001-basic-todo-crud/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-basic-todo-crud/plan.md
  - specs/001-basic-todo-crud/research.md
  - specs/001-basic-todo-crud/data-model.md
  - specs/001-basic-todo-crud/quickstart.md
  - specs/001-basic-todo-crud/contracts/task-operations.md
tests:
  - N/A (planning phase - no tests yet)
---

## Prompt

# Phase-1 Implementation Plan — Todo Console Application

## Objective
Implement the Phase-1 Todo Console App strictly according to `/sp.specify`, using an in-memory data structure and a console-based user interface. All code must be generated via Claude Code.

## System Architecture

### Components
1. **models.py** - Defines Task data model
2. **services.py** - Business logic for CRUD operations
3. **ui.py** - Console I/O and menu handling
4. **main.py** - Application entrypoint and loop

## Data Structure
Use an in-memory list:
- tasks: List[Task]
- next_id: int (auto-increment)

No database. No file persistence.

## Task Lifecycle
| Action            | Behavior |
|------------------|----------|
| Create Task      | Append new Task |
| View Tasks       | Iterate and print |
| Update Task      | Locate by id & modify |
| Delete Task      | Remove by id |
| Toggle Complete  | Flip boolean flag |

If task not found → show error message.

## Response snapshot

Created comprehensive implementation plan with complete architecture, design decisions, and supporting artifacts for Phase-1 Todo Console Application.

**Plan Structure** (plan.md - 366 lines):

**Technical Context**:
- Language: Python 3.8+
- Dependencies: None (standard library only)
- Storage: In-memory list + counter
- Testing: unittest
- Platform: Cross-platform console
- Performance: <100ms operations, support 1000+ tasks
- Constraints: No external deps, no I/O, no networking, console only

**Constitution Check**: ✅ ALL GATES PASS (5/5)
- Specification First: ✅ Approved spec exists
- Traceability: ✅ All 15 FRs numbered and trackable
- Simplicity: ✅ In-memory only, no external dependencies
- Determinism: ✅ All edge cases defined
- Clean Structure: ✅ 4-module separation (models, services, ui, main)

**Project Structure Defined**:
- Documentation: spec.md, plan.md, research.md, data-model.md, quickstart.md, contracts/
- Source: src/ with models/, services/, ui/, main.py
- Tests: tests/ with unit/, integration/, contract/

**Phase 0: Research** (research.md - 323 lines):

**8 Architecture Decisions Documented**:
1. **Module Organization**: 4-module clean architecture
   - Chosen: models, services, ui, main
   - Rationale: Clear separation of concerns, testable independently
   - Rejected: Single file (untestable), more modules (over-engineering)

2. **Task Storage**: List of Task objects + next_id counter
   - Chosen: Python list with sequential IDs
   - Rationale: Simplest Phase-1 approach, O(n) acceptable at <1000 tasks
   - Rejected: Dictionary (unnecessary complexity), plain dicts (loses type safety)

3. **ID Generation**: Integer counter starting at 1
   - Chosen: Sequential integer increment
   - Rationale: Simple, user-friendly, no collisions in single-session
   - Rejected: UUID (overkill), timestamp (collision risk)

4. **Input Validation**: Service layer with exceptions
   - Chosen: Centralized validation, exception-based signaling
   - Rationale: DRY principle, UI catches and displays friendly errors
   - Rejected: UI validation (violates SoC), return codes (not Pythonic)

5. **Error Handling**: Custom exceptions (ValidationError, TaskNotFoundError)
   - Chosen: Domain-specific exception types
   - Rationale: Clear error categories, specific handling in UI
   - Rejected: Generic exceptions (loses context), return tuples (error-prone)

6. **Testing Framework**: unittest (standard library)
   - Chosen: Built-in unittest module
   - Rationale: No external deps, Phase-1 compliant
   - Rejected: pytest (external dependency violates constraint)

7. **Console UI**: Numbered menu (1-6) with input loop
   - Chosen: Simple print/input with menu loop
   - Rationale: Meets FR-001, no libraries needed
   - Rejected: curses (external dep), argparse (not interactive)

**ADR Candidates Identified**: 5 decisions recommended for ADR documentation
- Top 3: Module architecture, data storage, validation strategy

**Risk Analysis**: 6 risks identified with mitigation strategies

**Phase 1: Design & Contracts** (data-model.md - 339 lines + contracts/task-operations.md - 582 lines):

**Data Model**:
- Single entity: Task (id, title, description, completed)
- Validation rules for each attribute
- State transitions defined (4 states, 5 transition types)
- Storage structure specified (list + counter)
- Performance characteristics documented (O(1) to O(n))
- No relationships (single entity in Phase-1)
- Data integrity rules (5 rules)
- Validation error messages (8 messages)
- Testing considerations (20+ test cases)

**Contracts** (8 operations):
1. **Add Task**: Create with validation (FR-002, FR-003)
2. **View All Tasks**: Retrieve task list (FR-005)
3. **Get Task by ID**: Find specific task (helper operation)
4. **Update Task**: Modify title/description (FR-006)
5. **Delete Task**: Remove permanently (FR-007)
6. **Toggle Complete**: Change status (FR-008)
7. **Display Menu**: Show options (FR-001)
8. **Exit Application**: Terminate cleanly (FR-012)

Each contract includes:
- Input/output specifications
- Error conditions and messages
- Preconditions and postconditions
- Invariants
- Usage examples (valid and invalid)

**Custom Exceptions**:
- ValidationError: Input validation failures
- TaskNotFoundError: Task ID not found

**Quickstart Guide** (quickstart.md - 429 lines):

**Complete user documentation**:
- Prerequisites and installation (no dependencies!)
- Running the application
- Detailed usage for all 6 operations
- 3 common workflows with step-by-step examples
- Troubleshooting section (4 common issues)
- Running tests (unit, integration, contract)
- Tips & best practices
- Phase-1 limitations clearly listed
- Support and resources

**Implementation Notes in Plan**:
- Key implementation points for each module
- Testing strategy (unit, integration, contract)
- Risk mitigation table

**Next Steps Documented**:
- Run `/sp.tasks` to generate task breakdown
- Tasks organized by user story priority (P1→P2→P3→P4)
- Implementation via `/sp.implement`
- Estimated 12-15 tasks

**Traceability**:
- All decisions reference FR requirements from spec
- Constitution principles verified at each step
- Data model aligns with spec entity definitions
- Contracts map to functional requirements
- Clear path from spec → plan → tasks → implementation

## Outcome

- ✅ Impact: Complete implementation plan with all architectural decisions, design artifacts, and contracts ready for task generation
- 🧪 Tests: Testing strategy defined (unit, integration, contract), test frameworks chosen (unittest)
- 📁 Files: Created plan.md (366 lines), research.md (323 lines), data-model.md (339 lines), quickstart.md (429 lines), contracts/task-operations.md (582 lines)
- 🔁 Next prompts: `/sp.tasks` to generate task breakdown from plan; consider `/sp.adr` for documenting 3-5 architectural decisions
- 🧠 Reflection: Plan successfully balances technical depth with simplicity. All Phase-1 constraints honored (no external deps, in-memory only, console interface). Constitution check passed 5/5 gates. Clear module separation enables independent development and testing. Decision rationales documented for future reference. Ready for task generation and implementation.

## Evaluation notes (flywheel)

- Failure modes observed: None - all planning phases completed successfully with constitution compliance
- Graders run and results (PASS/FAIL):
  - Constitution Check: PASS (5/5 gates)
  - Phase 0 Research: PASS (8 decisions documented with alternatives)
  - Phase 1 Design: PASS (complete data model + 8 contracts + quickstart)
  - Artifacts Generated: PASS (5 files, 2039 total lines)
  - Traceability: PASS (all FRs mapped to design decisions)
- Prompt variant (if applicable): N/A (initial planning iteration)
- Next experiment (smallest change to try): Execute `/sp.tasks` to validate plan-to-tasks traceability and ensure granular task breakdown aligns with 4 user story priorities
