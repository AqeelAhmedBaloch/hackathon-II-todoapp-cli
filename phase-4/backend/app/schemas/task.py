"""
Task schemas for request/response validation.
"""
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List


class TaskCreate(BaseModel):
    """Schema for creating a new task."""

    title: str = Field(..., min_length=1, max_length=255, description="Task title")
    description: Optional[str] = Field(None, description="Task description")
    priority: str = "medium"
    category: Optional[str] = None
    due_date: Optional[datetime] = None
    parent_id: Optional[int] = None


class TaskUpdate(BaseModel):
    """Schema for updating an existing task."""

    title: Optional[str] = Field(None, min_length=1, max_length=255, description="Task title")
    description: Optional[str] = Field(None, description="Task description")
    completed: Optional[bool] = Field(None, description="Task completion status")
    priority: Optional[str] = None
    category: Optional[str] = None
    due_date: Optional[datetime] = None


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
    parent_id: Optional[int]
    created_at: datetime
    updated_at: Optional[datetime]
    subtasks: Optional[List['TaskResponse']] = []

    class Config:
        from_attributes = True

TaskResponse.model_rebuild()
