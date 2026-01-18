# Quickstart Guide: Basic Todo CRUD Operations

**Feature**: 001-basic-todo-crud
**Date**: 2025-12-29
**Phase**: Phase 1 - Design & Contracts

## Purpose

Provide step-by-step instructions for setting up, running, and using the Phase-1 Todo Console Application.

---

## Prerequisites

**System Requirements**:
- Python 3.8 or higher
- Terminal/Command Prompt access
- No external dependencies required

**Check Python Version**:

```bash
# Check Python version
python --version
# or
python3 --version

# Expected output: Python 3.8.x or higher
```

---

## Installation

### Step 1: Clone Repository

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd hackathon-II-todoapp

# Verify branch
git branch
# Should show: * 001-basic-todo-crud
```

### Step 2: Verify Project Structure

```bash
# List project structure
ls -la

# Expected structure:
# src/
# ├── models/
# │   └── task.py
# ├── services/
# │   └── task_service.py
# ├── ui/
# │   └── console.py
# └── main.py
#
# tests/
# ├── unit/
# ├── integration/
# └── contract/
```

### Step 3: Verify Installation (No Dependencies)

Phase-1 uses Python standard library only - no package installation required!

```bash
# Verify Python is accessible
python -c "print('Python is ready!')"
# Expected output: Python is ready!
```

---

## Running the Application

### Start the Application

```bash
# From project root directory
python src/main.py
```

**Expected Output**:
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

---

## Usage Guide

### Operation 1: Add Task

**Purpose**: Create a new task with title and optional description.

**Steps**:
1. Enter `1` at the main menu
2. Enter task title when prompted (1-200 characters)
3. Enter task description when prompted (press Enter to skip, max 1000 chars)
4. Task created with auto-generated ID

**Example**:
```
Enter choice (1-6): 1

Enter task title: Buy groceries
Enter task description (optional): Milk, eggs, bread

Task added successfully! ID: 1
```

**Validation**:
- Title is required (cannot be empty or whitespace-only)
- Title max 200 characters
- Description max 1000 characters (optional)

**Error Example**:
```
Enter choice (1-6): 1

Enter task title:

ERROR: Title is required
Please try again.
```

---

### Operation 2: View Tasks

**Purpose**: Display all tasks in the task list.

**Steps**:
1. Enter `2` at the main menu
2. All tasks displayed with ID, title, description, and completion status

**Example (with tasks)**:
```
Enter choice (1-6): 2

=== All Tasks ===

[1] [ ] Buy groceries
    Description: Milk, eggs, bread

[2] [X] Call dentist
    Description: Schedule annual checkup

[3] [ ] Read book
    Description: Chapter 5

Total tasks: 3
```

**Example (empty list)**:
```
Enter choice (1-6): 2

No tasks found.
```

**Status Indicators**:
- `[ ]` = Incomplete task
- `[X]` = Complete task

---

### Operation 3: Update Task

**Purpose**: Modify an existing task's title and/or description.

**Steps**:
1. Enter `3` at the main menu
2. Enter task ID to update
3. Enter new title (or press Enter to keep current)
4. Enter new description (or press Enter to keep current)
5. Task updated successfully

**Example**:
```
Enter choice (1-6): 3

Enter task ID to update: 1

Current task:
[1] [ ] Buy groceries
    Description: Milk, eggs, bread

Enter new title (or press Enter to keep current): Buy groceries and fruits
Enter new description (or press Enter to keep current): Milk, eggs, bread, apples, oranges

Task updated successfully!
```

**Validation**:
- Task ID must exist
- At least one field (title or description) must be updated
- Same validation rules as Add Task

**Error Example**:
```
Enter choice (1-6): 3

Enter task ID to update: 999

ERROR: Task not found
Please check the task ID and try again.
```

---

### Operation 4: Delete Task

**Purpose**: Permanently remove a task from the list.

**Steps**:
1. Enter `4` at the main menu
2. Enter task ID to delete
3. Task removed from list (no confirmation prompt)

**Example**:
```
Enter choice (1-6): 4

Enter task ID to delete: 1

Task deleted successfully!
```

**Warning**: Deletion is permanent and cannot be undone!

**Error Example**:
```
Enter choice (1-6): 4

Enter task ID to delete: 999

ERROR: Task not found
Please check the task ID and try again.
```

---

### Operation 5: Toggle Complete

**Purpose**: Mark a task as complete or incomplete.

**Steps**:
1. Enter `5` at the main menu
2. Enter task ID to toggle
3. Completion status flipped (incomplete ↔ complete)

**Example (Incomplete → Complete)**:
```
Enter choice (1-6): 5

Enter task ID to toggle: 1

Task marked as complete!
[1] [X] Buy groceries
```

**Example (Complete → Incomplete)**:
```
Enter choice (1-6): 5

Enter task ID to toggle: 1

Task marked as incomplete!
[1] [ ] Buy groceries
```

**Error Example**:
```
Enter choice (1-6): 5

Enter task ID to toggle: 999

ERROR: Task not found
Please check the task ID and try again.
```

---

### Operation 6: Exit

**Purpose**: Exit the application.

**Steps**:
1. Enter `6` at the main menu
2. Application displays goodbye message and terminates

**Example**:
```
Enter choice (1-6): 6

Goodbye!
```

**Important**: All data is lost when the application exits (Phase-1 in-memory constraint).

---

## Common Workflows

### Workflow 1: Create and Complete a Task

```
1. Start application
2. Select "1. Add Task"
   - Title: "Buy groceries"
   - Description: "Milk and eggs"
3. Select "2. View Tasks" (verify task created)
4. Select "5. Toggle Complete"
   - Enter ID: 1
5. Select "2. View Tasks" (verify task marked complete)
6. Select "6. Exit"
```

### Workflow 2: Manage Multiple Tasks

```
1. Start application
2. Add Task 1: "Buy groceries"
3. Add Task 2: "Call dentist"
4. Add Task 3: "Read book"
5. View Tasks (see all 3)
6. Complete Task 1 (Toggle ID 1)
7. Complete Task 3 (Toggle ID 3)
8. View Tasks (Task 1 and 3 show [X], Task 2 shows [ ])
9. Delete Task 2 (Delete ID 2)
10. View Tasks (only Task 1 and 3 remain)
11. Exit
```

### Workflow 3: Update and Correct Tasks

```
1. Start application
2. Add Task: "Buy milk" (no description)
3. View Tasks (see task with empty description)
4. Update Task 1:
   - Title: "Buy groceries"
   - Description: "Milk, eggs, bread"
5. View Tasks (verify changes)
6. Exit
```

---

## Troubleshooting

### Issue: "Python not found" or "command not found"

**Solution**:
```bash
# Try python3 instead of python
python3 src/main.py

# Or check Python installation
which python
which python3

# Install Python if needed
# Visit: https://www.python.org/downloads/
```

### Issue: "ModuleNotFoundError" or import errors

**Solution**:
- Ensure you're in the project root directory
- Verify src/ directory structure exists
- Python 3.8+ is required

```bash
# Check current directory
pwd

# Should be: .../hackathon-II-todoapp

# Verify src/ exists
ls src/
```

### Issue: Application won't start

**Solution**:
```bash
# Verify Python version
python --version
# Must be 3.8 or higher

# Check for syntax errors
python -m py_compile src/main.py

# Run with verbose errors
python -v src/main.py
```

### Issue: Invalid menu choice or input errors

**Solution**:
- Enter numbers 1-6 only for menu choices
- Follow input prompts carefully
- Check character limits (title ≤200, description ≤1000)
- Ensure task IDs exist before updating/deleting/toggling

---

## Running Tests

### Unit Tests

```bash
# Run all unit tests
python -m unittest discover tests/unit

# Run specific test file
python -m unittest tests/unit/test_task_model.py

# Run with verbose output
python -m unittest discover tests/unit -v
```

### Integration Tests

```bash
# Run all integration tests
python -m unittest discover tests/integration

# Run specific integration test
python -m unittest tests/integration/test_todo_app.py -v
```

### Contract Tests

```bash
# Run contract tests
python -m unittest discover tests/contract

# Run specific contract test
python -m unittest tests/contract/test_task_contracts.py -v
```

### All Tests

```bash
# Run all tests in project
python -m unittest discover tests -v
```

---

## Tips & Best Practices

### General Usage

1. **View tasks frequently**: Use "View Tasks" often to see current state
2. **Note task IDs**: Remember or write down task IDs for update/delete/toggle operations
3. **Use descriptions**: Leverage optional description field for detailed notes
4. **Toggle freely**: You can toggle task completion as many times as needed
5. **Plan before exit**: Remember all data is lost on exit - complete your session before closing

### Data Management

1. **No persistence**: All data lost on exit (Phase-1 constraint)
2. **Single session**: Each run starts with empty task list
3. **No backup**: No export/import functionality in Phase-1
4. **No multi-user**: Single-user application, no concurrent access

### Performance

1. **Scale**: Application supports 1000+ tasks efficiently
2. **Response time**: All operations complete in <100ms
3. **Memory**: Uses minimal memory (in-memory list only)

---

## Phase-1 Limitations

**Explicitly Not Supported** (per constitution):

- ❌ Data persistence (no files, databases)
- ❌ Data export/import
- ❌ Task search or filtering
- ❌ Task sorting (displays in creation order)
- ❌ Task priorities or categories
- ❌ Due dates or reminders
- ❌ Undo/redo operations
- ❌ Multi-user support
- ❌ Web or mobile interface

**Future Phases May Add**: Persistence, search, categories, due dates, etc.

---

## Next Steps

**After using the application**:

1. Provide feedback on usability
2. Report any bugs or issues
3. Suggest improvements for future phases
4. Review test coverage
5. Contribute to documentation

**For Developers**:

1. Review code in src/ directory
2. Run test suite
3. Check Phase-2 specification for upcoming features
4. Follow Spec-Driven Development workflow for changes

---

## Support & Resources

**Documentation**:
- `specs/001-basic-todo-crud/spec.md` - Feature specification
- `specs/001-basic-todo-crud/plan.md` - Implementation plan
- `specs/001-basic-todo-crud/data-model.md` - Data structures
- `specs/001-basic-todo-crud/contracts/` - Operation contracts

**Constitution**:
- `.specify/memory/constitution.md` - Project principles and constraints

**Contact**:
- Create issue on GitHub repository
- Follow contribution guidelines in CONTRIBUTING.md

---

## Summary

✅ **No installation required** (Python standard library only)
✅ **Simple console interface** (6 menu options)
✅ **Full CRUD operations** (Create, Read, Update, Delete, Toggle)
✅ **Input validation** (Friendly error messages)
✅ **Fast and responsive** (<100ms operations)

**Remember**: All data is lost when you exit - this is expected Phase-1 behavior!

**Ready to start**: `python src/main.py`
