"""
Task model module for Todo Console Application.

This module defines the Task entity and custom exceptions for validation and error handling.
"""


class ValidationError(Exception):
    """Raised when input validation fails."""
    pass


class TaskNotFoundError(Exception):
    """Raised when task ID doesn't exist."""
    pass


class Task:
    """
    Represents a single todo task.

    Attributes:
        id (int): Unique identifier for the task (auto-generated)
        title (str): Task title (required, 1-200 characters)
        description (str): Optional task description (max 1000 characters)
        completed (bool): Completion status (defaults to False)
    """

    def __init__(self, id: int, title: str, description: str = "", completed: bool = False):
        """
        Initialize a new Task.

        Args:
            id: Unique task identifier
            title: Task title (required)
            description: Task description (optional)
            completed: Completion status (defaults to False)

        Raises:
            ValidationError: If validation fails
        """
        self.id = id
        self.title = title
        self.description = description
        self.completed = completed

        # Validate on initialization
        self.validate()

    def validate(self):
        """
        Validate task attributes.

        Raises:
            ValidationError: If any validation rule fails
        """
        # Validate title
        if not self.title or self.title.strip() == "":
            raise ValidationError("Title is required")

        if self.title != self.title.strip():
            # Strip whitespace for validation
            self.title = self.title.strip()

        if len(self.title) == 0:
            raise ValidationError("Title cannot be empty or whitespace only")

        if len(self.title) > 200:
            raise ValidationError("Title must be 200 characters or less")

        # Validate description (optional, but if provided must meet constraints)
        if self.description and len(self.description) > 1000:
            raise ValidationError("Description must be 1000 characters or less")

    def __str__(self):
        """String representation of the task for display."""
        status = "[X]" if self.completed else "[ ]"
        desc_display = f"   Description: {self.description}" if self.description else ""
        return f"[{self.id}] {status} {self.title}{desc_display}"

    def __repr__(self):
        """Developer-friendly representation."""
        return f"Task(id={self.id}, title='{self.title}', description='{self.description}', completed={self.completed})"
