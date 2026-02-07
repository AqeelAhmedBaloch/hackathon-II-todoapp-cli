"""
Task Service module for Todo Console Application.

This module provides business logic for CRUD operations on tasks.
"""

from typing import List
from src.models.task import Task, ValidationError, TaskNotFoundError


class TaskService:
    """
    Service class for managing tasks with CRUD operations.

    Attributes:
        tasks (List[Task]): In-memory list of all tasks
        next_id (int): Counter for generating unique task IDs
    """

    def __init__(self):
        """Initialize TaskService with empty task list and ID counter."""
        self.tasks: List[Task] = []
        self.next_id: int = 1

    def add_task(self, title: str, description: str = "") -> Task:
        """
        Create a new task with auto-generated ID.

        Args:
            title: Task title (required, 1-200 chars)
            description: Task description (optional, max 1000 chars)

        Returns:
            The newly created Task object

        Raises:
            ValidationError: If validation fails
        """
        # Create task with current next_id
        task = Task(id=self.next_id, title=title, description=description, completed=False)

        # Add to list
        self.tasks.append(task)

        # Increment ID for next task
        self.next_id += 1

        return task

    def get_all_tasks(self) -> List[Task]:
        """
        Retrieve all tasks in the task list.

        Returns:
            List of all tasks (may be empty)
        """
        return self.tasks

    def get_task_by_id(self, task_id: int) -> Task:
        """
        Retrieve a specific task by ID.

        Args:
            task_id: The task ID to find

        Returns:
            The Task object with matching ID

        Raises:
            TaskNotFoundError: If task doesn't exist
            ValueError: If task_id is not a valid integer
        """
        # Validate task_id type and range
        if not isinstance(task_id, int):
            raise ValueError("Task ID must be a number")

        if task_id <= 0:
            raise ValidationError("Invalid task ID")

        # Search for task
        for task in self.tasks:
            if task.id == task_id:
                return task

        # Task not found
        raise TaskNotFoundError("Task not found")

    def update_task(self, task_id: int, new_title: str = None, new_description: str = None) -> Task:
        """
        Update an existing task's title and/or description.

        Args:
            task_id: ID of task to update
            new_title: New title (optional, if provided must meet validation)
            new_description: New description (optional, max 1000 chars)

        Returns:
            The updated Task object

        Raises:
            TaskNotFoundError: If task doesn't exist
            ValidationError: If validation fails or no fields provided
        """
        # Ensure at least one field is provided
        if new_title is None and new_description is None:
            raise ValidationError("Must provide title or description to update")

        # Find task
        task = self.get_task_by_id(task_id)

        # Update title if provided
        if new_title is not None:
            # Validate new title
            if not new_title or new_title.strip() == "":
                raise ValidationError("Title cannot be empty or whitespace only")

            new_title = new_title.strip()

            if len(new_title) > 200:
                raise ValidationError("Title must be 200 characters or less")

            task.title = new_title

        # Update description if provided
        if new_description is not None:
            if len(new_description) > 1000:
                raise ValidationError("Description must be 1000 characters or less")

            task.description = new_description

        return task

    def delete_task(self, task_id: int) -> bool:
        """
        Permanently remove a task from the list.

        Args:
            task_id: ID of task to delete

        Returns:
            True if deletion successful

        Raises:
            TaskNotFoundError: If task doesn't exist
        """
        # Find task (will raise TaskNotFoundError if not found)
        task = self.get_task_by_id(task_id)

        # Remove from list
        self.tasks.remove(task)

        # Note: next_id is NOT decremented - IDs are never reused

        return True

    def toggle_complete(self, task_id: int) -> Task:
        """
        Toggle a task's completion status.

        Args:
            task_id: ID of task to toggle

        Returns:
            The updated Task object with toggled status

        Raises:
            TaskNotFoundError: If task doesn't exist
        """
        # Find task
        task = self.get_task_by_id(task_id)

        # Flip completed status
        task.completed = not task.completed

        return task
