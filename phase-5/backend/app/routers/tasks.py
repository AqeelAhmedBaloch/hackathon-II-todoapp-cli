"""
Tasks router for CRUD operations on todo items.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse
from app.models.task import Task
from app.models.user import User
from app.routers.auth import get_current_user
from app.core.websockets import manager

router = APIRouter(prefix="/api/tasks", tags=["Tasks"])


@router.get("", response_model=List[TaskResponse])
def get_tasks(
    completed: bool = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all tasks for the current user.

    Optional query parameter:
    - **completed**: Filter by completion status (true/false)

    Returns list of tasks owned by the authenticated user.
    """
    query = db.query(Task).filter(Task.owner_id == current_user.id)

    # By default, only get top-level tasks for the main list
    # unless a parent_id is specified (if we add that filter)
    query = query.filter(Task.parent_id == None)

    # Apply completed filter if provided
    if completed is not None:
        query = query.filter(Task.completed == completed)

    tasks = query.order_by(Task.created_at.desc()).all()
    return tasks


@router.get("/{task_id}", response_model=TaskResponse)
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific task by ID.

    - **task_id**: Task ID

    Returns the task if it exists and belongs to the current user.
    """
    task = db.query(Task).filter(
        Task.id == task_id,
        Task.owner_id == current_user.id
    ).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return task


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_data: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new task.

    - **title**: Task title (required, max 255 characters)
    - **description**: Task description (optional)

    Returns the created task.
    """
    new_task = Task(
        title=task_data.title,
        description=task_data.description,
        priority=task_data.priority,
        category=task_data.category,
        due_date=task_data.due_date,
        parent_id=task_data.parent_id,
        owner_id=current_user.id,
        completed=False
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    # Broadcast task creation
    await manager.broadcast_to_user(
        current_user.id, 
        {"type": "TASK_CREATED", "task": TaskResponse.from_orm(new_task).dict()}
    )

    return new_task


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: int,
    task_data: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update an existing task.

    - **task_id**: Task ID
    - **title**: New title (optional)
    - **description**: New description (optional)
    - **completed**: New completion status (optional)

    Returns the updated task.
    """
    task = db.query(Task).filter(
        Task.id == task_id,
        Task.owner_id == current_user.id
    ).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Update fields if provided
    if task_data.title is not None:
        task.title = task_data.title
    if task_data.description is not None:
        task.description = task_data.description
    if task_data.completed is not None:
        task.completed = task_data.completed

    db.commit()
    db.refresh(task)

    # Broadcast task update
    await manager.broadcast_to_user(
        current_user.id, 
        {"type": "TASK_UPDATED", "task": TaskResponse.from_orm(task).dict()}
    )

    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete a task.

    - **task_id**: Task ID

    Returns 204 No Content on success.
    """
    task = db.query(Task).filter(
        Task.id == task_id,
        Task.owner_id == current_user.id
    ).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    db.delete(task)
    db.commit()

    # Broadcast task deletion
    await manager.broadcast_to_user(
        current_user.id, 
        {"type": "TASK_DELETED", "task_id": task_id}
    )

    return None


@router.patch("/{task_id}/toggle", response_model=TaskResponse)
async def toggle_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Toggle task completion status.

    - **task_id**: Task ID

    Returns the updated task with toggled completion status.
    """
    task = db.query(Task).filter(
        Task.id == task_id,
        Task.owner_id == current_user.id
    ).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    task.completed = not task.completed
    db.commit()
    db.refresh(task)

    # Broadcast task toggle
    await manager.broadcast_to_user(
        current_user.id, 
        {"type": "TASK_UPDATED", "task": TaskResponse.from_orm(task).dict()}
    )

    return task
