# Task Operations Contract

**Feature**: 001-basic-todo-crud
**Date**: 2025-12-29
**Phase**: Phase 1 - Design & Contracts

## Purpose

Define the operational contracts for all task management operations in the Phase-1 Todo Console Application. Each contract specifies inputs, outputs, error conditions, preconditions, postconditions, and invariants.

---

## Contract 1: Add Task

**Operation**: `add_task(title: str, description: str = "") -> Task`

**Requirement**: FR-002, FR-003

**Purpose**: Create a new task with auto-generated ID and add it to the task list.

### Input

| Parameter | Type | Required | Constraints |
|-----------|------|----------|-------------|
| title | str | Yes | 1-200 characters, no whitespace-only |
| description | str | No | Max 1000 characters, defaults to "" |

### Output

| Return | Type | Description |
|--------|------|-------------|
| task | Task | Newly created task with generated ID and completed=False |

### Errors

| Error Type | Condition | Message |
|------------|-----------|---------|
| ValidationError | title is empty or None | "Title is required" |
| ValidationError | title is whitespace-only | "Title cannot be empty or whitespace only" |
| ValidationError | len(title) > 200 | "Title must be 200 characters or less" |
| ValidationError | len(description) > 1000 | "Description must be 1000 characters or less" |

### Preconditions

- TaskService is initialized
- Input types are correct (str for both parameters)

### Postconditions

- Task list length increased by 1
- New task added to end of list
- New task has unique ID = previous next_id value
- next_id incremented by 1
- New task has completed=False
- Title and description stored exactly as provided (after strip())

### Invariants

- All task IDs remain unique
- Task list maintains creation order
- next_id always > highest existing task ID

### Example Usage

**Valid**:
```python
# Minimal task
task = service.add_task("Buy groceries")
# Returns: Task(id=1, title="Buy groceries", description="", completed=False)

# Full task
task = service.add_task("Call dentist", "Schedule annual checkup")
# Returns: Task(id=2, title="Call dentist", description="Schedule annual checkup", completed=False)
```

**Invalid**:
```python
# Empty title
service.add_task("")  # Raises ValidationError: "Title is required"

# Title too long
service.add_task("A" * 201)  # Raises ValidationError: "Title must be 200 characters or less"
```

---

## Contract 2: View All Tasks

**Operation**: `get_all_tasks() -> List[Task]`

**Requirement**: FR-005

**Purpose**: Retrieve all tasks in the task list for display.

### Input

(No parameters)

### Output

| Return | Type | Description |
|--------|------|-------------|
| tasks | List[Task] | List of all tasks (may be empty), in creation order |

### Errors

(None - empty list is valid)

### Preconditions

- TaskService is initialized

### Postconditions

- Task list unchanged (read-only operation)
- Returned list is a copy or reference (implementation choice)

### Invariants

- Task list contents unchanged
- Task order preserved (creation order)

### Example Usage

```python
# Empty list
tasks = service.get_all_tasks()
# Returns: []

# Populated list
tasks = service.get_all_tasks()
# Returns: [Task(id=1, ...), Task(id=2, ...), Task(id=3, ...)]
```

---

## Contract 3: Get Task by ID

**Operation**: `get_task_by_id(task_id: int) -> Task`

**Requirement**: Implicit (used by update, delete, toggle operations)

**Purpose**: Retrieve a specific task by its ID.

### Input

| Parameter | Type | Required | Constraints |
|-----------|------|----------|-------------|
| task_id | int | Yes | Must be positive integer |

### Output

| Return | Type | Description |
|--------|------|-------------|
| task | Task | The task with matching ID |

### Errors

| Error Type | Condition | Message |
|------------|-----------|---------|
| TaskNotFoundError | No task with given ID exists | "Task not found" |
| TypeError | task_id is not an integer | "Task ID must be a number" |
| ValidationError | task_id <= 0 | "Invalid task ID" |

### Preconditions

- TaskService is initialized
- task_id is an integer

### Postconditions

- Task list unchanged (read-only operation)
- Returned task is reference to actual task in list

### Invariants

- Task list contents unchanged

### Example Usage

**Valid**:
```python
task = service.get_task_by_id(1)
# Returns: Task(id=1, ...)
```

**Invalid**:
```python
task = service.get_task_by_id(999)  # Raises TaskNotFoundError: "Task not found"
task = service.get_task_by_id("abc")  # Raises TypeError: "Task ID must be a number"
task = service.get_task_by_id(0)  # Raises ValidationError: "Invalid task ID"
```

---

## Contract 4: Update Task

**Operation**: `update_task(task_id: int, new_title: str = None, new_description: str = None) -> Task`

**Requirement**: FR-006

**Purpose**: Update an existing task's title and/or description.

### Input

| Parameter | Type | Required | Constraints |
|-----------|------|----------|-------------|
| task_id | int | Yes | Must exist in task list |
| new_title | str | No | If provided: 1-200 chars, no whitespace-only |
| new_description | str | No | If provided: max 1000 chars |

**Note**: At least one of new_title or new_description must be provided (not both None).

### Output

| Return | Type | Description |
|--------|------|-------------|
| task | Task | The updated task object |

### Errors

| Error Type | Condition | Message |
|------------|-----------|---------|
| TaskNotFoundError | task_id doesn't exist | "Task not found" |
| ValidationError | Both new_title and new_description are None | "Must provide title or description to update" |
| ValidationError | new_title is empty or whitespace-only | "Title cannot be empty or whitespace only" |
| ValidationError | len(new_title) > 200 | "Title must be 200 characters or less" |
| ValidationError | len(new_description) > 1000 | "Description must be 1000 characters or less" |

### Preconditions

- TaskService is initialized
- Task with given ID exists
- At least one field to update is provided

### Postconditions

- Task's title and/or description updated
- Task's ID unchanged
- Task's completed status unchanged
- Task remains in same position in list
- All other tasks unchanged

### Invariants

- Task list length unchanged
- Task IDs remain unique
- Task order preserved

### Example Usage

**Valid**:
```python
# Update title only
task = service.update_task(1, new_title="Buy milk and bread")

# Update description only
task = service.update_task(1, new_description="Updated details")

# Update both
task = service.update_task(1, new_title="New title", new_description="New desc")
```

**Invalid**:
```python
# Task doesn't exist
service.update_task(999, new_title="Test")  # Raises TaskNotFoundError

# Both parameters None
service.update_task(1)  # Raises ValidationError: "Must provide title or description to update"

# Empty title
service.update_task(1, new_title="")  # Raises ValidationError
```

---

## Contract 5: Delete Task

**Operation**: `delete_task(task_id: int) -> bool`

**Requirement**: FR-007

**Purpose**: Permanently remove a task from the task list.

### Input

| Parameter | Type | Required | Constraints |
|-----------|------|----------|-------------|
| task_id | int | Yes | Must exist in task list |

### Output

| Return | Type | Description |
|--------|------|-------------|
| success | bool | True if deletion successful |

### Errors

| Error Type | Condition | Message |
|------------|-----------|---------|
| TaskNotFoundError | task_id doesn't exist | "Task not found" |
| TypeError | task_id is not an integer | "Task ID must be a number" |

### Preconditions

- TaskService is initialized
- Task with given ID exists

### Postconditions

- Task list length decreased by 1
- Task with given ID no longer exists
- ID not reused (next_id not decremented)
- All other tasks unchanged
- Task order preserved for remaining tasks

### Invariants

- next_id never decreases
- Remaining task IDs remain unique

### Example Usage

**Valid**:
```python
success = service.delete_task(1)
# Returns: True
# Task with ID=1 removed from list
```

**Invalid**:
```python
service.delete_task(999)  # Raises TaskNotFoundError: "Task not found"
service.delete_task("abc")  # Raises TypeError: "Task ID must be a number"
```

---

## Contract 6: Toggle Task Completion

**Operation**: `toggle_complete(task_id: int) -> Task`

**Requirement**: FR-008

**Purpose**: Toggle a task's completion status between complete and incomplete.

### Input

| Parameter | Type | Required | Constraints |
|-----------|------|----------|-------------|
| task_id | int | Yes | Must exist in task list |

### Output

| Return | Type | Description |
|--------|------|-------------|
| task | Task | The task with toggled completed status |

### Errors

| Error Type | Condition | Message |
|------------|-----------|---------|
| TaskNotFoundError | task_id doesn't exist | "Task not found" |
| TypeError | task_id is not an integer | "Task ID must be a number" |

### Preconditions

- TaskService is initialized
- Task with given ID exists

### Postconditions

- Task's completed status flipped:
  - If was False (incomplete), now True (complete)
  - If was True (complete), now False (incomplete)
- Task's title and description unchanged
- Task's ID unchanged
- Task position in list unchanged
- All other tasks unchanged

### Invariants

- Task list length unchanged
- Task order preserved
- Task IDs remain unique

### Example Usage

**Valid**:
```python
# Toggle incomplete → complete
task = service.toggle_complete(1)
# Returns: Task(id=1, ..., completed=True)

# Toggle complete → incomplete
task = service.toggle_complete(1)
# Returns: Task(id=1, ..., completed=False)
```

**Invalid**:
```python
service.toggle_complete(999)  # Raises TaskNotFoundError: "Task not found"
```

---

## Contract 7: Display Menu

**Operation**: `display_menu() -> None`

**Requirement**: FR-001

**Purpose**: Display the main menu options to the user.

### Input

(No parameters)

### Output

(None - prints to console)

**Console Output**:
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

### Errors

(None - display operation cannot fail)

### Preconditions

- Console output available (stdout)

### Postconditions

- Menu displayed to user
- Cursor waits for user input
- No application state changed

### Invariants

- Task list unchanged
- Application state unchanged

---

## Contract 8: Exit Application

**Operation**: `exit_application() -> None`

**Requirement**: FR-012

**Purpose**: Cleanly exit the application.

### Input

(No parameters)

### Output

(None - terminates application)

**Console Output**:
```
Goodbye!
```

### Errors

(None - exit operation cannot fail)

### Preconditions

- Application is running

### Postconditions

- Application terminates
- All in-memory data lost (expected behavior for Phase-1)
- Exit code 0 (success)

### Invariants

(None - application terminates)

---

## Error Handling Summary

### Exception Hierarchy

```python
Exception
├── ValueError
│   └── ValidationError  # Custom: input validation failures
└── LookupError
    └── TaskNotFoundError  # Custom: task ID not found
```

### Error Response Format

**For Console UI**:

```
ERROR: [User-friendly message]
[Additional context if helpful]

Please try again.
```

**Examples**:
```
ERROR: Title is required
Please try again.

ERROR: Task not found
Please check the task ID and try again.

ERROR: Title must be 200 characters or less
Please try again.
```

---

## Contract Testing Checklist

For each contract, verify:

- [ ] Valid inputs produce expected outputs
- [ ] Invalid inputs raise appropriate errors
- [ ] Preconditions are checked
- [ ] Postconditions are achieved
- [ ] Invariants are maintained
- [ ] Edge cases handled (empty strings, boundary values, None)
- [ ] Error messages are user-friendly
- [ ] State changes are correct and minimal

---

## Summary

**8 Contracts Defined**:
1. Add Task - Create new task with validation
2. View All Tasks - Retrieve task list
3. Get Task by ID - Find specific task
4. Update Task - Modify title/description
5. Delete Task - Remove task permanently
6. Toggle Complete - Change completion status
7. Display Menu - Show user options
8. Exit Application - Terminate cleanly

**2 Custom Exceptions**:
- ValidationError (input validation failures)
- TaskNotFoundError (task ID not found)

**All contracts include**:
- Input/output specifications
- Error conditions and messages
- Preconditions and postconditions
- Invariants
- Usage examples

**Ready for**: Task generation (`/sp.tasks`) and implementation (`/sp.implement`)
