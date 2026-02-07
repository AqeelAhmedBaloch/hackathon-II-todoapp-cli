---
id: 003
title: Basic Todo CRUD Task Breakdown
stage: tasks
date: 2025-12-29
surface: agent
model: claude-sonnet-4-5
feature: 001-basic-todo-crud
branch: 001-basic-todo-crud
user: Aqeel Ahmed Baloch
command: /sp.tasks
labels: ["tasks", "todo-app", "breakdown", "user-stories", "phase-1"]
links:
  spec: specs/001-basic-todo-crud/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-basic-todo-crud/tasks.md
tests:
  - N/A (task planning phase - no tests generated)
---

## Prompt

# Phase-1 Task Breakdown — Todo Console Application

## Rule
No code may be generated unless it maps to one of the tasks below.

### ✅ T-001 — Project Initialization
**Goal:** Create clean project structure.
**Output**: /src/main.py, /src/models.py, /src/services.py, /src/ui.py

### ✅ T-002 — Define Task Model
**Goal:** Implement in-memory Task entity.
**Fields**: id, title, description, completed

### ✅ T-003 — Implement Task Storage
**Goal:** Create in-memory list + auto-increment id.
**Output**: tasks[], next_id counter

### ✅ T-004 — Add Task Feature
**Goal:** Create new task.
**Validation**: title required, length ≤ 200 chars

### ✅ T-005 — View Tasks Feature
**Goal:** Display list of tasks with status + id.

### ✅ T-006 — Update Task Feature
**Goal:** Modify title/description.
**Error:** Show message if task not found.

### ✅ T-007 — Delete Task Feature
**Goal:** Remove task by id.

### ✅ T-008 — Toggle Complete
(User input was truncated)

## Response snapshot

Generated comprehensive task breakdown with 65 tasks organized by 4 user stories from spec, enabling independent implementation and testing of each story.

**Tasks File Structure** (tasks.md):

**7 Phases Defined**:
1. **Setup (Phase 1)**: 7 tasks - Project structure initialization
2. **Foundational (Phase 2)**: 7 tasks ⚠️ BLOCKING - Core infrastructure
3. **User Story 1 - P1 (Phase 3)**: 13 tasks 🎯 MVP - Add and View Tasks
4. **User Story 2 - P2 (Phase 4)**: 9 tasks - Mark Tasks Complete
5. **User Story 3 - P3 (Phase 5)**: 12 tasks - Update Task Details
6. **User Story 4 - P4 (Phase 6)**: 8 tasks - Delete Tasks
7. **Polish (Phase 7)**: 9 tasks - Cross-cutting concerns

**Total**: 65 tasks with clear file paths and dependencies

**Task Format Compliance**:
- ✅ All tasks follow required checklist format: `- [ ] [ID] [P?] [Story?] Description`
- ✅ Task IDs sequential (T001-T065)
- ✅ [P] markers for parallelizable tasks (19 tasks)
- ✅ [Story] labels for user story tasks (US1, US2, US3, US4)
- ✅ Exact file paths included in all implementation tasks
- ✅ No test tasks generated (not requested in spec)

**Phase 1: Setup (T001-T007)**:
- Create project directory structure (src/, tests/)
- Create module directories (models/, services/, ui/)
- Create test directories (unit/, integration/, contract/)
- All marked [P] after T004 (can run in parallel)

**Phase 2: Foundational (T008-T014)** ⚠️ BLOCKING:
- T008: Task model class with attributes
- T009-T010: Validation logic (title, description)
- T011: Custom exceptions (ValidationError, TaskNotFoundError)
- T012: TaskService class initialization
- T013: ConsoleUI class with menu display
- T014: Main application entry point
- **CRITICAL**: Must complete before any user story work

**Phase 3: User Story 1 - P1 (T015-T027)** 🎯 MVP:
- **Goal**: Enable add and view tasks
- **Independent Test**: Add task → view tasks → confirm appears correctly
- **13 tasks**:
  - T015-T019: Service layer (add_task, ID generation, validation, get_all_tasks)
  - T020-T024: UI layer (add_task_ui, view_tasks_ui, formatting, empty list)
  - T025-T027: Menu wiring and loop logic
- **Maps to**: FR-001, FR-002, FR-003, FR-004, FR-005, FR-009, FR-011, FR-013, FR-014, FR-015
- **Checkpoint**: User Story 1 fully functional after T027

**Phase 4: User Story 2 - P2 (T028-T036)**:
- **Goal**: Track task completion status
- **Independent Test**: Add tasks → toggle status → view → confirm changes
- **9 tasks**:
  - T028-T031: Service layer (get_task_by_id, toggle_complete, validation)
  - T032-T035: UI layer (toggle_complete_ui, error handling, visual markers)
  - T036: Menu wiring
- **Maps to**: FR-008, FR-009, FR-010, FR-013
- **Checkpoint**: User Stories 1 AND 2 work independently

**Phase 5: User Story 3 - P3 (T037-T048)**:
- **Goal**: Modify task title/description
- **Independent Test**: Add task → update → view → confirm changes
- **12 tasks**:
  - T037-T041: Service layer (update_task, validation, error handling)
  - T042-T047: UI layer (update_task_ui, display current, prompts, errors)
  - T048: Menu wiring
- **Maps to**: FR-006, FR-009, FR-010, FR-015
- **Checkpoint**: All 3 user stories independently functional

**Phase 6: User Story 4 - P4 (T049-T056)**:
- **Goal**: Remove tasks from list
- **Independent Test**: Add tasks → delete → view → confirm removal
- **8 tasks**:
  - T049-T052: Service layer (delete_task, error handling, ID preservation)
  - T053-T055: UI layer (delete_task_ui, error handling, confirmation)
  - T056: Menu wiring
- **Maps to**: FR-007, FR-009, FR-010
- **Checkpoint**: All 4 user stories complete

**Phase 7: Polish (T057-T065)**:
- **9 cross-cutting tasks** (all marked [P]):
- T057: Exit functionality
- T058: Menu input validation
- T059: Exception handling in main loop
- T060: Non-numeric input handling
- T061: Special character support
- T062: Error message consistency
- T063: Empty list edge cases
- T064: Many tasks (50+) testing
- T065: Data loss on exit verification

**Dependencies Documented**:
- Setup → Foundational → User Stories → Polish
- Foundational BLOCKS all user stories (must complete first)
- User Stories independent after Foundational (can run in parallel)
- Tasks within a story are sequential (service → UI → wiring)

**Parallel Opportunities Identified**: 19 tasks
- Setup phase: T005-T007 (test directories)
- Polish phase: T057-T065 (all cross-cutting tasks)
- User stories can be developed in parallel across team members

**Implementation Strategies**:

1. **MVP First** (27 tasks):
   - Phase 1 + Phase 2 + Phase 3 = T001-T027
   - Delivers working app with add and view tasks
   - Independently testable and deployable

2. **Incremental Delivery**:
   - Phase 1-2 → Foundation
   - +Phase 3 → MVP (add/view) → Deploy
   - +Phase 4 → Complete tracking → Deploy
   - +Phase 5 → Update → Deploy
   - +Phase 6 → Delete → Deploy
   - +Phase 7 → Polish → Final release

3. **Parallel Team** (4 developers):
   - Complete Setup + Foundational together
   - Split user stories across developers
   - Stories complete independently
   - Polish together

**Traceability Matrix**:
- User Story 1 → 10 FRs (FR-001-FR-005, FR-009, FR-011, FR-013-FR-015)
- User Story 2 → 4 FRs (FR-008-FR-010, FR-013)
- User Story 3 → 4 FRs (FR-006, FR-009-FR-010, FR-015)
- User Story 4 → 3 FRs (FR-007, FR-009-FR-010)
- Polish → 1 FR + edge cases (FR-012)

**Independent Test Criteria**:
- US1: Launch → add task → view → confirm appears
- US2: Add → toggle → view → confirm status change
- US3: Add → update → view → confirm changes
- US4: Add → delete → view → confirm removal

## Outcome

- ✅ Impact: Complete task breakdown with 65 granular, executable tasks ready for implementation
- 🧪 Tests: Test strategy defined but NO test tasks generated (not requested in spec)
- 📁 Files: Created tasks.md (322 lines with full dependencies and execution strategies)
- 🔁 Next prompts: `/sp.implement` to execute tasks in order; MVP completion at T027; full feature at T065
- 🧠 Reflection: Tasks successfully organized by user story priority (P1-P4) enabling independent implementation. Each story has clear test criteria and can be validated standalone. Foundational phase correctly identified as blocking prerequisite. MVP scope clearly defined (27 tasks for User Story 1). Parallel opportunities identified (19 tasks). All tasks follow required format with checkboxes, IDs, labels, and file paths. Ready for spec-driven implementation via Claude Code.

## Evaluation notes (flywheel)

- Failure modes observed: None - task generation completed successfully with full traceability
- Graders run and results (PASS/FAIL):
  - Task Format: PASS (all 65 tasks follow `- [ ] [ID] [P?] [Story?] Description` format)
  - User Story Organization: PASS (4 stories with independent test criteria)
  - Dependencies: PASS (clear phase dependencies, foundational blocking identified)
  - Traceability: PASS (all 15 FRs mapped to tasks)
  - MVP Definition: PASS (27 tasks for working application)
  - Parallel Opportunities: PASS (19 tasks identified)
- Prompt variant (if applicable): N/A (initial task breakdown)
- Next experiment (smallest change to try): Execute `/sp.implement` to validate tasks are granular enough for LLM execution without additional context; monitor if task descriptions provide sufficient detail for code generation
