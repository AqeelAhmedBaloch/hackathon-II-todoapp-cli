# Tasks: Basic Todo CRUD Operations

**Input**: Design documents from `/specs/001-basic-todo-crud/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are NOT requested in the specification - only implementation tasks included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths shown below assume single project per plan.md structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project structure per implementation plan with src/ and tests/ directories
- [X] T002 Create src/models/ directory for Task model
- [X] T003 Create src/services/ directory for TaskService
- [X] T004 Create src/ui/ directory for ConsoleUI
- [X] T005 [P] Create tests/unit/ directory for unit tests
- [X] T006 [P] Create tests/integration/ directory for integration tests
- [X] T007 [P] Create tests/contract/ directory for contract tests

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T008 Create Task model class in src/models/task.py with id, title, description, completed attributes
- [X] T009 Add validation logic to Task model for title (1-200 chars, non-empty, no whitespace-only)
- [X] T010 Add validation logic to Task model for description (optional, max 1000 chars)
- [X] T011 Add custom exception classes (ValidationError, TaskNotFoundError) in src/models/task.py
- [X] T012 Create TaskService class in src/services/task_service.py with tasks list and next_id counter initialization
- [X] T013 Create ConsoleUI class in src/ui/console.py with menu display method (FR-001)
- [X] T014 Create main application entry point in src/main.py with main loop and menu handling

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Add and View Tasks (Priority: P1) 🎯 MVP

**Goal**: Enable users to create tasks and view their task list - core functionality

**Independent Test**: Launch app, add task with title and description, view tasks, confirm task appears with correct details

### Implementation for User Story 1

- [X] T015 [US1] Implement add_task() method in src/services/task_service.py with title and description parameters (FR-002)
- [X] T016 [US1] Add ID auto-generation logic in add_task() using next_id counter (FR-003)
- [X] T017 [US1] Add title validation in add_task() method (empty check, length check, whitespace-only check) (FR-014, FR-015)
- [X] T018 [US1] Add description validation in add_task() method (length check max 1000 chars) (FR-015)
- [X] T019 [US1] Implement get_all_tasks() method in src/services/task_service.py to return task list (FR-005)
- [X] T020 [US1] Implement add_task_ui() method in src/ui/console.py to prompt for title and description
- [X] T021 [US1] Add input validation and error handling in add_task_ui() with friendly error messages (FR-009)
- [X] T022 [US1] Implement view_tasks_ui() method in src/ui/console.py to display all tasks with formatting
- [X] T023 [US1] Add task display formatting in view_tasks_ui() showing ID, title, description, completion status (FR-005, FR-013)
- [X] T024 [US1] Handle empty task list case in view_tasks_ui() with "No tasks found" message
- [X] T025 [US1] Connect menu option 1 (Add Task) to add_task_ui() in src/main.py
- [X] T026 [US1] Connect menu option 2 (View Tasks) to view_tasks_ui() in src/main.py
- [X] T027 [US1] Add menu loop logic in src/main.py to return to menu after each operation (FR-011)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Mark Tasks Complete (Priority: P2)

**Goal**: Enable users to track task completion status

**Independent Test**: Add tasks, toggle completion status, view list to confirm status changes reflected

### Implementation for User Story 2

- [X] T028 [US2] Implement get_task_by_id() method in src/services/task_service.py with ID validation
- [X] T029 [US2] Add TaskNotFoundError handling in get_task_by_id() for invalid IDs (FR-010)
- [X] T030 [US2] Implement toggle_complete() method in src/services/task_service.py to flip completed boolean (FR-008)
- [X] T031 [US2] Add type and range validation for task_id in toggle_complete() method
- [X] T032 [US2] Implement toggle_complete_ui() method in src/ui/console.py to prompt for task ID
- [X] T033 [US2] Add error handling in toggle_complete_ui() for invalid IDs with friendly messages (FR-009, FR-010)
- [X] T034 [US2] Add success confirmation message in toggle_complete_ui() showing task status
- [X] T035 [US2] Update view_tasks_ui() to display completion status with visual markers ([X] vs [ ]) (FR-013)
- [X] T036 [US2] Connect menu option 5 (Toggle Complete) to toggle_complete_ui() in src/main.py

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Update Task Details (Priority: P3)

**Goal**: Enable users to modify task title and description without deletion

**Independent Test**: Add task, select update, modify title/description, view task to confirm changes saved

### Implementation for User Story 3

- [X] T037 [US3] Implement update_task() method in src/services/task_service.py with task_id, new_title, new_description parameters (FR-006)
- [X] T038 [US3] Add validation in update_task() to ensure at least one field is provided
- [X] T039 [US3] Add title validation in update_task() if new_title provided (same rules as add_task)
- [X] T040 [US3] Add description validation in update_task() if new_description provided (max 1000 chars)
- [X] T041 [US3] Add TaskNotFoundError handling in update_task() for invalid task IDs
- [X] T042 [US3] Implement update_task_ui() method in src/ui/console.py to prompt for task ID
- [X] T043 [US3] Display current task details in update_task_ui() before prompting for changes
- [X] T044 [US3] Prompt for new title in update_task_ui() with option to keep current (press Enter)
- [X] T045 [US3] Prompt for new description in update_task_ui() with option to keep current (press Enter)
- [X] T046 [US3] Add error handling in update_task_ui() for validation errors and task not found (FR-009)
- [X] T047 [US3] Add success confirmation message in update_task_ui()
- [X] T048 [US3] Connect menu option 3 (Update Task) to update_task_ui() in src/main.py

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: User Story 4 - Delete Tasks (Priority: P4)

**Goal**: Enable users to remove tasks from the list

**Independent Test**: Add tasks, delete specific tasks by ID, view list to confirm removal

### Implementation for User Story 4

- [X] T049 [US4] Implement delete_task() method in src/services/task_service.py with task_id parameter (FR-007)
- [X] T050 [US4] Add TaskNotFoundError handling in delete_task() for invalid task IDs
- [X] T051 [US4] Implement permanent task removal in delete_task() using list remove or filter
- [X] T052 [US4] Ensure next_id counter is NOT decremented after deletion (IDs never reused)
- [X] T053 [US4] Implement delete_task_ui() method in src/ui/console.py to prompt for task ID
- [X] T054 [US4] Add error handling in delete_task_ui() for invalid IDs with "Task not found" message
- [X] T055 [US4] Add success confirmation message "Task deleted successfully" in delete_task_ui()
- [X] T056 [US4] Connect menu option 4 (Delete Task) to delete_task_ui() in src/main.py

**Checkpoint**: All user stories complete and independently testable

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T057 [P] Implement exit functionality in src/main.py for menu option 6 with "Goodbye!" message (FR-012)
- [X] T058 [P] Add input validation for menu choice (1-6 only) with error message for invalid choices
- [X] T059 [P] Add try-except blocks in main loop to catch unexpected errors gracefully
- [X] T060 [P] Add edge case handling for non-numeric input when task ID expected
- [X] T061 [P] Add edge case handling for special characters and emojis in title/description (should accept)
- [X] T062 [P] Verify all error messages are user-friendly and consistent across operations
- [X] T063 [P] Test application with empty task list for all operations
- [X] T064 [P] Test application with many tasks (50+) to verify display works correctly
- [X] T065 [P] Verify data is lost on exit (in-memory constraint check)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Uses get_task_by_id() but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Uses get_task_by_id() but independently testable
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Uses get_task_by_id() but independently testable

### Within Each User Story

- Service layer methods before UI methods (services provide functionality UI consumes)
- Validation logic before operation implementation
- UI methods before menu wiring in main.py
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T005-T007)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tasks within a user story should be done sequentially (build service → build UI → wire to menu)
- All Polish tasks marked [P] can run in parallel (T057-T065)

---

## Parallel Example: User Story 1

User Story 1 tasks should be executed sequentially within the story:

```bash
# Sequential execution within US1:
T015: Implement add_task() in service
T016: Add ID generation
T017-T018: Add validation
T019: Implement get_all_tasks()
T020-T024: Build UI methods
T025-T027: Wire to main menu
```

But User Story 1 can be worked on in parallel with other stories (after Foundational):

```bash
# Parallel execution across stories (after Phase 2 complete):
Developer A: User Story 1 (T015-T027)
Developer B: User Story 2 (T028-T036)
Developer C: User Story 3 (T037-T048)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T007)
2. Complete Phase 2: Foundational (T008-T014) **CRITICAL - blocks all stories**
3. Complete Phase 3: User Story 1 (T015-T027)
4. **STOP and VALIDATE**: Test User Story 1 independently
   - Can add tasks with title and description
   - Can view all tasks with correct formatting
   - Validation works (empty title rejected, length limits enforced)
   - Menu loops correctly, returns after operations
5. Deploy/demo if ready - **This is a working MVP!**

### Incremental Delivery

1. Complete Setup + Foundational (T001-T014) → Foundation ready
2. Add User Story 1 (T015-T027) → Test independently → Deploy/Demo (**MVP!**)
3. Add User Story 2 (T028-T036) → Test independently → Deploy/Demo
4. Add User Story 3 (T037-T048) → Test independently → Deploy/Demo
5. Add User Story 4 (T049-T056) → Test independently → Deploy/Demo
6. Add Polish (T057-T065) → Final release
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (T001-T014)
2. Once Foundational is done:
   - Developer A: User Story 1 (T015-T027)
   - Developer B: User Story 2 (T028-T036)
   - Developer C: User Story 3 (T037-T048)
   - Developer D: User Story 4 (T049-T056)
3. Stories complete and integrate independently
4. Team completes Polish together (T057-T065)

---

## Task Summary

**Total Tasks**: 65 tasks

**Breakdown by Phase**:
- Phase 1 (Setup): 7 tasks
- Phase 2 (Foundational): 7 tasks ⚠️ BLOCKING
- Phase 3 (User Story 1 - P1): 13 tasks 🎯 MVP
- Phase 4 (User Story 2 - P2): 9 tasks
- Phase 5 (User Story 3 - P3): 12 tasks
- Phase 6 (User Story 4 - P4): 8 tasks
- Phase 7 (Polish): 9 tasks

**Parallel Opportunities**: 19 tasks marked [P] (T005-T007 in Setup, T057-T065 in Polish)

**MVP Scope**: Phases 1-3 (T001-T027) = 27 tasks for working application

**Independent Test Criteria**:
- **US1**: Add task → view tasks → confirm appears with correct details
- **US2**: Add tasks → toggle completion → view → confirm status changes
- **US3**: Add task → update title/description → view → confirm changes
- **US4**: Add tasks → delete specific task → view → confirm removal

---

## Traceability to Spec

**User Story 1 (P1)** maps to:
- FR-001 (menu), FR-002 (add task), FR-003 (auto ID), FR-004 (in-memory storage), FR-005 (view tasks), FR-009 (validation), FR-011 (menu loop), FR-013 (display status), FR-014 (reject empty title), FR-015 (length limits)

**User Story 2 (P2)** maps to:
- FR-008 (toggle complete), FR-009 (validation), FR-010 (handle invalid IDs), FR-013 (display status markers)

**User Story 3 (P3)** maps to:
- FR-006 (update task), FR-009 (validation), FR-010 (handle invalid IDs), FR-015 (length limits)

**User Story 4 (P4)** maps to:
- FR-007 (delete task), FR-009 (validation), FR-010 (handle invalid IDs)

**Polish (Phase 7)** maps to:
- FR-012 (exit cleanly), edge cases from spec, error handling consistency

---

## Notes

- **No [P] markers within user stories**: Tasks within a story are sequential (service → UI → wiring)
- **[P] markers in Setup and Polish**: Independent tasks that can run simultaneously
- Each user story should be independently completable and testable
- Commit after each phase or logical group of tasks
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- **MVP = Phase 1 + Phase 2 + Phase 3** (27 tasks, User Story 1 only)
- **Full feature = All phases** (65 tasks, all 4 user stories)
