# Implementation Plan: Basic Todo CRUD Operations

**Branch**: `001-basic-todo-crud` | **Date**: 2025-12-29 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-basic-todo-crud/spec.md`

## Summary

Implement a Python console-based todo application with in-memory storage supporting full CRUD operations (Create, Read, Update, Delete) plus completion status toggling. The application follows clean architecture principles with clear separation between data models, business logic, UI presentation, and application orchestration. All data is stored in-memory using Python's built-in data structures (lists/dictionaries) with no external dependencies beyond Python 3.x standard library.

**Key Requirements**:
- 4 prioritized user stories (Add/View, Complete, Update, Delete)
- 15 functional requirements covering menu system, validation, CRUD operations
- Task entity with auto-increment ID, title (1-200 chars), optional description (max 1000 chars), completion boolean
- Console menu loop with friendly error messages
- No persistence beyond runtime (Phase-1 constraint)

## Technical Context

**Language/Version**: Python 3.8+
**Primary Dependencies**: None (Python standard library only)
**Storage**: In-memory (Python list for tasks, integer counter for next_id)
**Testing**: Python unittest (standard library) or pytest (if available)
**Target Platform**: Cross-platform console (Windows, macOS, Linux)
**Project Type**: Single console application
**Performance Goals**: Instant response (<100ms for all operations), support 1000+ tasks in memory
**Constraints**:
- No external dependencies (Phase-1 constitution constraint)
- No file I/O or database
- No networking or APIs
- Console-only interface (no GUI frameworks)
- In-memory only (data lost on exit)

**Scale/Scope**: Single-user, single-session application for basic task management

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Specification First ✅ PASS
- [X] Approved specification exists at `specs/001-basic-todo-crud/spec.md`
- [X] All requirements documented before implementation
- [X] Spec defines WHAT and WHY, not HOW

### II. Traceability ✅ PASS
- [X] All 15 functional requirements (FR-001 to FR-015) numbered and trackable
- [X] Each user story maps to specific FRs
- [X] Plan references spec requirements throughout
- [X] No orphaned features planned

### III. Simplicity (Phase-1 Constraint) ✅ PASS
- [X] In-memory storage only (Python list + dict)
- [X] No database systems (SQLite, PostgreSQL, etc.)
- [X] No file I/O for persistence
- [X] No networking or HTTP/API calls
- [X] No authentication or user management
- [X] Console interface only (no web/mobile/GUI frameworks)
- [X] Python standard library only (no external packages)

### IV. Determinism ✅ PASS
- [X] All edge cases defined in spec (empty list, invalid IDs, input validation)
- [X] Predictable behavior for all operations
- [X] Error handling specified for all failure scenarios
- [X] Auto-increment IDs ensure consistent task identification

### V. Clean Structure ✅ PASS
- [X] Clear module separation planned:
  - `models.py` - Data structures only (Task class)
  - `services.py` - Business logic (CRUD operations, validation)
  - `ui.py` - User interface (menu display, input handling)
  - `main.py` - Application entry point and orchestration
- [X] Single responsibility per module
- [X] No business logic in UI layer
- [X] No UI concerns in business logic layer

**Overall Status**: ✅ **ALL GATES PASS** - No constitution violations. Proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/001-basic-todo-crud/
├── spec.md              # Feature specification (completed)
├── plan.md              # This file (in progress)
├── research.md          # Phase 0 output (to be created)
├── data-model.md        # Phase 1 output (to be created)
├── quickstart.md        # Phase 1 output (to be created)
├── contracts/           # Phase 1 output (to be created)
│   └── task-operations.md  # Contract for task operations
├── checklists/
│   └── requirements.md  # Spec quality checklist (completed)
└── tasks.md             # Phase 2 output (created by /sp.tasks)
```

### Source Code (repository root)

```text
src/
├── models/
│   └── task.py          # Task data class with validation
├── services/
│   └── task_service.py  # TaskService class with CRUD operations
├── ui/
│   └── console.py       # ConsoleUI class for menu and I/O
└── main.py              # Application entry point

tests/
├── unit/
│   ├── test_task_model.py       # Task model validation tests
│   ├── test_task_service.py     # Service layer tests
│   └── test_console_ui.py       # UI layer tests (input/output mocking)
├── integration/
│   └── test_todo_app.py         # End-to-end workflow tests
└── contract/
    └── test_task_contracts.py   # Contract validation tests
```

**Structure Decision**: Selected **Option 1: Single project** structure. This is appropriate because:
- Single console application (not web app or mobile)
- No frontend/backend split required
- Python project with standard src/ and tests/ layout
- Follows clean architecture with clear module boundaries (models, services, ui)
- Aligns with Phase-1 simplicity constraint

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**No violations detected. This section is not applicable.**

All design decisions align with Phase-1 constitution constraints:
- Using simplest possible data structures (list + dict)
- No unnecessary abstractions or patterns
- Direct CRUD operations without repository pattern
- Console I/O without framework overhead
- Standard library only

---

## Phase 0: Research & Technical Decisions

### Research Topics

All technical aspects are clear from spec and constitution constraints. No research required for:
- ✅ Language: Python 3.8+ (specified in constitution)
- ✅ Storage: In-memory list/dict (Phase-1 constraint)
- ✅ UI: Console input()/print() (Phase-1 constraint)
- ✅ Testing: unittest/pytest (Python standard options)
- ✅ Dependencies: None allowed (Phase-1 constraint)

### Architecture Decisions

**Decision 1: Module Organization**
- **Chosen**: 4-module clean architecture (models, services, ui, main)
- **Rationale**:
  - Separates concerns clearly (data, logic, presentation, orchestration)
  - Testable independently
  - Follows constitution's Clean Structure principle
  - Industry standard for console applications
- **Alternatives considered**:
  - Single file: Rejected - violates Clean Structure principle, untestable
  - More modules: Rejected - over-engineering for Phase-1 scope

**Decision 2: Task Storage**
- **Chosen**: Python list of Task objects with separate next_id counter
- **Rationale**:
  - Simplest Phase-1 compliant approach
  - O(n) lookup acceptable for expected scale (<1000 tasks)
  - Direct list manipulation for add/delete operations
  - Task objects provide type safety and validation
- **Alternatives considered**:
  - Dictionary by ID: Rejected - adds complexity without benefit at this scale
  - Plain dictionaries: Rejected - loses type safety and validation encapsulation

**Decision 3: ID Generation**
- **Chosen**: Integer counter starting at 1, incremented on each add
- **Rationale**:
  - Simple, predictable, user-friendly
  - Meets FR-003 requirement (auto-generated unique IDs)
  - No collision possible with single-session in-memory storage
- **Alternatives considered**:
  - UUID: Rejected - overkill for in-memory, not user-friendly
  - Timestamp-based: Rejected - not guaranteed unique

**Decision 4: Input Validation**
- **Chosen**: Validation in service layer with exception-based error signaling
- **Rationale**:
  - Centralized validation logic (DRY principle)
  - UI layer catches exceptions and displays friendly messages
  - Testable independently from UI
  - Meets FR-009 (validate input, friendly errors)
- **Alternatives considered**:
  - Validation in UI: Rejected - violates separation of concerns, hard to test
  - Silent failure: Rejected - poor UX, violates FR-009

**Decision 5: Error Handling**
- **Chosen**: Custom exceptions (TaskNotFoundError, ValidationError) + user-friendly messages
- **Rationale**:
  - Distinguishes error types for appropriate handling
  - UI can translate exceptions to helpful messages
  - Meets FR-010 (handle invalid IDs gracefully)
- **Alternatives considered**:
  - Return codes: Rejected - not Pythonic, easy to ignore
  - Generic exceptions: Rejected - loses error type information

---

## Phase 1: Data Model & Contracts

### Data Model

See `data-model.md` for detailed entity definitions.

**Task Entity**:
```
Task:
  - id: int (unique, auto-generated, starts at 1)
  - title: str (required, 1-200 chars, no whitespace-only)
  - description: str (optional, max 1000 chars, defaults to empty string)
  - completed: bool (defaults to False)
```

**Validation Rules**:
- Title: Required, 1-200 characters, cannot be empty or whitespace-only
- Description: Optional, max 1000 characters
- ID: Positive integer, unique within session
- Completed: Boolean, no validation needed

**Storage Structure**:
```python
# In-memory storage (TaskService class attributes)
tasks: List[Task] = []           # List of all tasks
next_id: int = 1                 # Counter for next task ID
```

**State Transitions**:
- New → Incomplete (task created with completed=False)
- Incomplete ↔ Complete (toggle via FR-008)
- Any state → Deleted (removed from list via FR-007)
- Any state → Updated (title/description modified via FR-006)

### Contracts

See `contracts/task-operations.md` for full contract specifications.

**Contract Summary**:

**1. Add Task** (FR-002)
- Input: title (str, required), description (str, optional)
- Output: Task object with generated ID
- Errors: ValidationError if title empty/too long or description too long

**2. View Tasks** (FR-005)
- Input: None
- Output: List of all tasks (may be empty)
- Errors: None (empty list is valid)

**3. Update Task** (FR-006)
- Input: task_id (int), new_title (str, optional), new_description (str, optional)
- Output: Updated Task object
- Errors: TaskNotFoundError if ID invalid, ValidationError if new values invalid

**4. Delete Task** (FR-007)
- Input: task_id (int)
- Output: Success boolean
- Errors: TaskNotFoundError if ID invalid

**5. Toggle Complete** (FR-008)
- Input: task_id (int)
- Output: Updated Task object with toggled completed status
- Errors: TaskNotFoundError if ID invalid

**6. Menu Display** (FR-001)
- Input: None
- Output: Displayed menu options (1-6)
- Errors: None

**7. Exit** (FR-012)
- Input: None
- Output: Application termination
- Errors: None

### Quickstart

See `quickstart.md` for step-by-step setup and usage instructions.

**Quick Steps**:
1. Clone repository
2. Navigate to project root
3. Run: `python src/main.py`
4. Use menu options 1-6 to manage tasks
5. Select option 6 to exit

---

## Implementation Notes

### Key Implementation Points

1. **Task Model** (`src/models/task.py`):
   - Python dataclass or simple class with `__init__`
   - Validation in constructor or separate validate() method
   - String representation for display

2. **Task Service** (`src/services/task_service.py`):
   - Singleton pattern (single instance) or class with static methods
   - Maintains tasks list and next_id counter
   - All CRUD operations as methods
   - Raises custom exceptions for error cases

3. **Console UI** (`src/ui/console.py`):
   - Display menu function
   - Input prompt functions for each operation
   - Error message display
   - Format task list for display
   - Try-except blocks to catch service exceptions

4. **Main Application** (`src/main.py`):
   - Initialize TaskService
   - Main loop: display menu → get user choice → call appropriate UI function → repeat
   - Exit loop on user selecting option 6

### Testing Strategy

**Unit Tests**:
- Task model: validation, edge cases
- TaskService: each CRUD operation, error conditions
- ConsoleUI: mocked I/O testing

**Integration Tests**:
- Full workflows (add → view → update → toggle → delete)
- Error recovery flows
- Edge cases (empty list, invalid IDs)

**Contract Tests**:
- Verify each operation matches contract specification
- Input/output type checking
- Error condition validation

### Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Input validation complexity | Centralize in service layer, comprehensive unit tests |
| List manipulation errors | Use Python list methods correctly, test edge cases (empty, single, many) |
| ID collision | Simple counter with increment, impossible to collide in single session |
| User confusion | Clear menu, friendly error messages, consistent UX |
| Scope creep | Strict adherence to 15 FRs in spec, out-of-scope list enforced |

---

## Next Steps

After plan approval:
1. Run `/sp.tasks` to generate detailed task breakdown from this plan
2. Tasks will be organized by user story priority (P1 → P2 → P3 → P4)
3. Implementation via `/sp.implement` following task order
4. Each task maps back to specific FRs in spec for traceability

**Estimated Tasks**: ~12-15 tasks covering:
- Project setup (1-2 tasks)
- Task model implementation (2-3 tasks)
- Service layer implementation (3-4 tasks)
- UI layer implementation (3-4 tasks)
- Integration and testing (2-3 tasks)
