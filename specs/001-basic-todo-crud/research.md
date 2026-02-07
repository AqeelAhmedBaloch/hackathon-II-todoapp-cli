# Research Document: Basic Todo CRUD Operations

**Feature**: 001-basic-todo-crud
**Date**: 2025-12-29
**Phase**: Phase 0 - Research & Technical Decisions

## Purpose

Document research findings and technical decisions for implementing the Phase-1 Todo Console Application. This document resolves all "NEEDS CLARIFICATION" items from the Technical Context and validates architectural choices against Phase-1 constitution constraints.

## Research Summary

**Status**: All technical aspects clear from specification and constitution constraints. No external research required.

**Conclusion**: Proceed directly to Phase 1 (Design & Contracts) with decisions documented below.

---

## Research Topics & Findings

### 1. Language & Version Selection

**Question**: Which Python version to target?

**Research**:
- Reviewed Python release schedule and support status
- Python 3.8 released October 2019, still in security support until October 2024
- Python 3.8+ provides sufficient features (dataclasses, type hints, f-strings)
- No advanced features from 3.9+ required for Phase-1 scope

**Decision**: Python 3.8+

**Rationale**:
- Wide compatibility with existing systems
- All necessary features available (dataclasses, type hints, modern syntax)
- No external dependencies needed (meets Phase-1 constraint)
- Cross-platform console support (Windows, macOS, Linux)

**Alternatives Considered**:
- Python 3.6-3.7: Rejected - nearing end of life, missing some modern features
- Python 3.10+: Rejected - unnecessarily restricts compatibility, no features needed from 3.10+
- Python 2.x: Rejected - end of life, not suitable for new projects

---

### 2. Data Storage Approach

**Question**: How to structure in-memory task storage?

**Research**:
- Evaluated Python built-in data structures (list, dict, set)
- Considered performance characteristics (O(1) vs O(n) operations)
- Analyzed scale requirements from spec (expected <1000 tasks)
- Reviewed Phase-1 constraint (no external storage, databases, or files)

**Decision**: Python list of Task objects + separate integer counter

**Rationale**:
- Simplest approach meeting Phase-1 constraints
- O(n) lookup acceptable at expected scale (<1000 tasks)
- Natural fit for "view all tasks" operation (iterate list)
- Easy deletion (list.remove() or list comprehension)
- Task objects provide type safety and encapsulation
- Counter ensures unique, sequential, user-friendly IDs

**Alternatives Considered**:
- Dictionary keyed by ID: Rejected - adds complexity without meaningful benefit at this scale, O(1) lookup not needed
- Plain list of dictionaries: Rejected - loses type safety, validation encapsulation, and IDE support
- Set: Rejected - unordered, doesn't preserve task creation order
- SQLite in-memory: Rejected - violates Phase-1 Simplicity constraint (no databases)

**Performance Analysis**:
- Add: O(1) - append to list
- View: O(n) - iterate all tasks (required for display anyway)
- Find by ID: O(n) - linear search (acceptable for <1000 items)
- Update: O(n) - find + modify
- Delete: O(n) - find + remove
- All operations <1ms for realistic workloads

---

### 3. Module Architecture

**Question**: How to organize code for testability and clean architecture?

**Research**:
- Reviewed Clean Architecture principles (Uncle Bob Martin)
- Analyzed constitution's Clean Structure requirement
- Evaluated separation of concerns patterns
- Considered Python project structure best practices

**Decision**: 4-module architecture (models, services, ui, main)

**Rationale**:
- Clear separation of concerns:
  - Models: Data structures only (no logic)
  - Services: Business logic only (no I/O)
  - UI: Presentation layer only (no logic)
  - Main: Orchestration only (glue code)
- Each layer independently testable
- Meets constitution's Clean Structure principle
- Industry standard for console applications
- Prevents logic leakage between layers

**Alternatives Considered**:
- Single file: Rejected - violates Clean Structure principle, impossible to test independently, unmaintainable
- 2 modules (logic + UI): Rejected - mixes data model with business logic
- More modules (6+): Rejected - over-engineering for Phase-1 scope, violates Simplicity principle

**Module Responsibilities**:

| Module | Responsibility | Does NOT Handle |
|--------|---------------|-----------------|
| models/task.py | Task data structure, validation | Business logic, I/O, persistence |
| services/task_service.py | CRUD operations, task management | User input, display formatting, storage |
| ui/console.py | Menu display, input/output | Business logic, validation, task state |
| main.py | Application lifecycle, orchestration | Business logic, data management |

---

### 4. Input Validation Strategy

**Question**: Where and how to validate user input?

**Research**:
- Reviewed validation patterns (client-side, server-side, layered)
- Analyzed FR-009 requirement (validate input, friendly errors)
- Evaluated exception vs return-code approaches in Python
- Considered testability requirements

**Decision**: Validation in service layer with exception-based error signaling

**Rationale**:
- Centralized validation (DRY principle)
- Service layer is correct abstraction level (business rules)
- Exceptions are Pythonic and hard to ignore
- UI layer catches exceptions and translates to user-friendly messages
- Independently testable without UI coupling
- Clear error types (ValidationError, TaskNotFoundError)

**Alternatives Considered**:
- Validation in UI layer: Rejected - violates separation of concerns, duplicated logic if multiple UIs, hard to test
- Return codes: Rejected - not Pythonic, easy to ignore, no error details
- Silent failure with logging: Rejected - poor UX, violates FR-009
- Validation in model only: Rejected - insufficient for business rules (e.g., ID existence checks)

**Validation Rules** (from spec FR-002, FR-014, FR-015):
- Title: Required, 1-200 characters, no whitespace-only
- Description: Optional, max 1000 characters
- Task ID: Must exist in task list, must be valid integer

---

### 5. Error Handling Approach

**Question**: How to handle and communicate errors to users?

**Research**:
- Reviewed Python exception best practices
- Analyzed FR-010 requirement (handle invalid IDs gracefully)
- Evaluated custom vs built-in exception types
- Considered user experience requirements

**Decision**: Custom exception classes + user-friendly error messages

**Rationale**:
- Distinguishes error categories (not found vs validation vs system)
- UI can catch specific exception types for appropriate handling
- Enables helpful, context-specific error messages
- Meets FR-009 and FR-010 requirements
- Pythonic approach with clear intent

**Custom Exceptions**:
```python
class TaskNotFoundError(Exception):
    """Raised when task ID doesn't exist"""
    pass

class ValidationError(Exception):
    """Raised when input validation fails"""
    pass
```

**Alternatives Considered**:
- Generic Exception: Rejected - loses error type information, cannot differentiate handling
- Return tuples (success, error_msg): Rejected - not Pythonic, error-prone
- Status codes: Rejected - C-style, not idiomatic Python
- Built-in exceptions only: Rejected - doesn't convey domain-specific errors clearly

**Error Message Guidelines**:
- Clear and specific: "Title is required" not "Invalid input"
- Actionable: "Title must be 1-200 characters" not "Title error"
- Friendly tone: "Task not found" not "ERROR: ID INVALID"
- Consistent formatting across all operations

---

### 6. ID Generation Strategy

**Question**: How to generate unique task IDs?

**Research**:
- Evaluated ID generation approaches (counter, UUID, timestamp, hash)
- Analyzed spec FR-003 requirement (unique integer, auto-generated)
- Considered user-friendliness (displayed in menu)
- Reviewed Phase-1 scope (single-session, in-memory)

**Decision**: Integer counter starting at 1, incremented on each add

**Rationale**:
- Meets FR-003 requirement (auto-generated unique integer IDs)
- Simple, predictable, deterministic
- User-friendly (1, 2, 3... not UUIDs)
- No collision possible in single-session in-memory storage
- Easy to implement and test
- Aligns with Phase-1 Simplicity principle

**Alternatives Considered**:
- UUID: Rejected - overkill for in-memory single-session, not user-friendly (36-char strings), violates simplicity
- Timestamp-based: Rejected - not guaranteed unique (millisecond collisions possible), not sequential
- Hash-based: Rejected - unnecessary complexity, non-sequential, not user-friendly
- Random integers: Rejected - collision risk, non-sequential, poor UX

**Implementation**:
```python
class TaskService:
    tasks: List[Task] = []
    next_id: int = 1

    def add_task(self, title, description):
        task = Task(id=self.next_id, title=title, description=description)
        self.next_id += 1  # Increment for next task
        self.tasks.append(task)
        return task
```

---

### 7. Testing Framework

**Question**: Which testing framework to use?

**Research**:
- Python standard library: unittest
- Third-party: pytest, nose2
- Phase-1 constraint: Python standard library only (no external dependencies)

**Decision**: unittest (Python standard library)

**Rationale**:
- Built into Python 3.8+ (no installation required)
- Meets Phase-1 constraint (no external dependencies)
- Sufficient features for unit, integration, and contract tests
- Cross-platform, well-documented
- XUnit-style familiar to many developers

**Alternatives Considered**:
- pytest: Rejected - external dependency, violates Phase-1 constraint
- nose2: Rejected - external dependency, declining community support
- doctest: Rejected - insufficient for comprehensive testing, poor for integration tests
- Manual testing only: Rejected - error-prone, not reproducible, no regression detection

**Note**: If pytest is already installed in environment, may use it, but implementation must not require it (unittest as fallback).

---

### 8. Console UI Design

**Question**: How to structure console menu and interaction?

**Research**:
- Analyzed FR-001 requirement (console menu with 6 options)
- Evaluated menu loop patterns
- Reviewed Python input()/print() capabilities
- Considered error recovery and user guidance

**Decision**: Simple numbered menu (1-6) with input loop and exception handling

**Rationale**:
- Meets FR-001 exactly (Add, View, Update, Delete, Toggle, Exit)
- Simple input() for menu choice (1-6)
- Clear menu display with option descriptions
- Try-except blocks for graceful error handling
- Loop until user selects Exit (FR-011, FR-012)
- No external libraries needed (built-in I/O)

**Menu Structure**:
```
=== Todo Application ===
1. Add Task
2. View Tasks
3. Update Task
4. Delete Task
5. Toggle Complete
6. Exit

Enter choice (1-6): _
```

**Alternatives Considered**:
- curses/blessed library: Rejected - external dependency, over-engineering for Phase-1
- argparse CLI: Rejected - not interactive menu as specified
- Web interface: Rejected - violates Phase-1 constraint (console only)
- GUI (tkinter): Rejected - violates Phase-1 constraint (console only)

---

## Architecture Decision Records (ADRs)

**ADR Candidates Identified**: 5 decisions meet ADR significance criteria

The following decisions have long-term impact, multiple alternatives, and cross-cutting influence:

1. **Module Architecture (4-layer clean architecture)** - Affects all future development, testability, maintainability
2. **Data Storage Approach (list + counter)** - Impacts performance, scalability assumptions, future Phase-2 migration
3. **Validation Strategy (service layer + exceptions)** - Affects error handling patterns, user experience, testability
4. **ID Generation (simple counter)** - Impacts user experience, future persistence strategy
5. **Error Handling (custom exceptions)** - Influences debugging, user messaging, code patterns

**Recommendation**: Create ADRs for decisions #1, #2, and #3 (highest impact). Use `/sp.adr` command after Phase 1 completion.

---

## Risk Analysis

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Input validation edge cases missed | Medium | Medium | Comprehensive unit tests, refer to spec edge cases |
| ID counter overflow (>maxint) | Very Low | Low | Not realistic for in-memory Phase-1 (<1000 tasks expected) |
| List performance degradation | Low | Low | O(n) acceptable at <1000 tasks, measured <1ms |
| User confusion with menu | Medium | Medium | Clear labels, friendly errors, consistent UX |
| Scope creep beyond Phase-1 | Medium | High | Strict adherence to 15 FRs, enforce out-of-scope list |
| Violation of Phase-1 constraints | Low | High | Constitution Check gates, code review against constraints |

---

## Conclusion

All research complete. No NEEDS CLARIFICATION items remain.

**Key Findings**:
- Python 3.8+ with standard library only (no external dependencies)
- 4-module clean architecture (models, services, ui, main)
- In-memory list storage with integer counter IDs
- Service-layer validation with custom exceptions
- unittest for testing framework
- Simple numbered console menu (1-6)

**Ready for**: Phase 1 - Design & Contracts

**Next Artifacts**:
- data-model.md (Task entity definition)
- contracts/task-operations.md (operation contracts)
- quickstart.md (setup and usage guide)
