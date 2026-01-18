# Todo App CLI - Phase 1

Phase-1 Todo Console Application with in-memory CRUD operations.

## Features

- Add tasks with title and optional description
- View all tasks with completion status
- Update task title and description
- Delete tasks
- Toggle task completion status
- Console menu interface

## Running the Application

### With uv (recommended)

```bash
cd todoappcli
uv run -m src.main
```

### With Python directly

```bash
cd todoappcli
python -m src.main
```

## Requirements

- Python 3.8+
- No external dependencies (standard library only)

## Documentation

See `specs/001-basic-todo-crud/` for complete specification, plan, and implementation details.

## Phase-1 Constraints

- In-memory storage only (data lost on exit)
- Console interface only
- No persistence, networking, or authentication
- Python standard library only
