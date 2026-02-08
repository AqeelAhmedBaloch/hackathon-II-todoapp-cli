"""
Task schemas for request/response validation.
"""
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class TaskCreate(BaseModel):
    """Schema for creating a new task."""

    title: str = Field(..., min_length=1, max_length=255, description="Task title")
    description: Optional[str] = Field(None, description="Task description")
    priority: Optional[str] = Field("medium", description="Task priority (low, medium, high)")
    category: Optional[str] = Field(None, description="Task category")
    due_date: Optional[datetime] = Field(None, description="Task due date")
    workspace_id: Optional[int] = Field(None, description="Workspace ID")
    parent_id: Optional[int] = Field(None, description="Parent task ID for subtasks")


class TaskUpdate(BaseModel):
    """Schema for updating an existing task."""

    title: Optional[str] = Field(None, min_length=1, max_length=255, description="Task title")
    description: Optional[str] = Field(None, description="Task description")
    completed: Optional[bool] = Field(None, description="Task completion status")
    priority: Optional[str] = Field(None, description="Task priority")
    category: Optional[str] = Field(None, description="Task category")
    due_date: Optional[datetime] = Field(None, description="Task due date")


class TaskResponse(BaseModel):
    """Schema for task response."""

    id: int
    title: str
    description: Optional[str]
    completed: bool
    priority: str
    category: Optional[str]
    due_date: Optional[datetime]
    owner_id: int
    workspace_id: Optional[int]
    parent_id: Optional[int]
    created_at: datetime
    updated_at: Optional[datetime]
    # subtasks: list['TaskResponse'] = [] # Circular dependency handling might be needed

    class Config:
        from_attributes = True  # Enable ORM mode for SQLAlchemy models
