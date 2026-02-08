"""
Task model for todo items.
"""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Task(Base):
    """Task model representing a todo item."""

    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    completed = Column(Boolean, default=False, nullable=False)
    priority = Column(String(20), default="medium")  # low, medium, high
    category = Column(String(50), nullable=True)
    due_date = Column(DateTime(timezone=True), nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    parent_id = Column(Integer, ForeignKey("tasks.id"), nullable=True)  # For subtasks
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship to user
    owner = relationship("User", back_populates="tasks")
    # Self-referential relationship for subtasks
    subtasks = relationship("Task", backref="parent", remote_side=[id])

    def __repr__(self):
        status = "✓" if self.completed else "○"
        return f"<Task(id={self.id}, {status} '{self.title}', owner_id={self.owner_id})>"
