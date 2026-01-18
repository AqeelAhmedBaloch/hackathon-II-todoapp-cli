"""
Console UI module for Todo Console Application.

This module handles all user interface operations including menu display and user input.
"""

from src.models.task import ValidationError, TaskNotFoundError
from src.services.task_service import TaskService


class Colors:
    """ANSI color codes for terminal styling."""
    # Main colors
    CYAN = '\033[96m'
    BLUE = '\033[94m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    MAGENTA = '\033[95m'
    WHITE = '\033[97m'

    # Styles
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'
    RESET = '\033[0m'

    # Background colors
    BG_BLUE = '\033[44m'
    BG_GREEN = '\033[42m'
    BG_RED = '\033[41m'


class ConsoleUI:
    """
    Console user interface for the todo application.

    Attributes:
        service (TaskService): The task service for business logic
    """

    def __init__(self, service: TaskService):
        """
        Initialize ConsoleUI with a TaskService.

        Args:
            service: The TaskService instance to use
        """
        self.service = service

    def display_menu(self):
        """Display the main menu options to the user."""
        c = Colors

        print(f"\n{c.CYAN}{c.BOLD}{'=' * 56}{c.RESET}")
        print(f"{c.CYAN}{c.BOLD}|{c.WHITE}{c.BOLD}{'TODO APPLICATION - PHASE 1':^54}{c.CYAN}|{c.RESET}")
        print(f"{c.CYAN}{c.BOLD}{'=' * 56}{c.RESET}")
        print(f"{c.CYAN}|  {c.GREEN}[*] 1.{c.WHITE} Add Task{' ' * 37}{c.CYAN}|{c.RESET}")
        print(f"{c.CYAN}|  {c.BLUE}[*] 2.{c.WHITE} View Tasks{' ' * 35}{c.CYAN}|{c.RESET}")
        print(f"{c.CYAN}|  {c.YELLOW}[*] 3.{c.WHITE} Update Task{' ' * 34}{c.CYAN}|{c.RESET}")
        print(f"{c.CYAN}|  {c.RED}[*] 4.{c.WHITE} Delete Task{' ' * 34}{c.CYAN}|{c.RESET}")
        print(f"{c.CYAN}|  {c.MAGENTA}[*] 5.{c.WHITE} Toggle Complete{' ' * 30}{c.CYAN}|{c.RESET}")
        print(f"{c.CYAN}|  {c.RED}[X] 6.{c.WHITE} Exit{' ' * 41}{c.CYAN}|{c.RESET}")
        print(f"{c.CYAN}{c.BOLD}{'=' * 56}{c.RESET}")

    def add_task_ui(self):
        """
        Prompt user for task details and create a new task.

        Handles input validation and displays friendly error messages.
        """
        c = Colors
        try:
            print(f"\n{c.GREEN}{c.BOLD}{'=' * 44}{c.RESET}")
            print(f"{c.GREEN}{c.BOLD}|{c.WHITE}{'[+] ADD NEW TASK':^42}{c.GREEN}|{c.RESET}")
            print(f"{c.GREEN}{c.BOLD}{'=' * 44}{c.RESET}")

            # Prompt for title
            title = input(f"{c.CYAN}Enter task title: {c.RESET}")

            # Prompt for description (optional)
            description = input(f"{c.CYAN}Enter description (optional): {c.RESET}")

            # Call service to add task
            task = self.service.add_task(title, description)

            print(f"\n{c.GREEN}{c.BOLD}[OK] Task added successfully! ID: {task.id}{c.RESET}")

        except ValidationError as e:
            print(f"\n{c.RED}{c.BOLD}[X] ERROR: {str(e)}{c.RESET}")
            print(f"{c.YELLOW}Please try again.{c.RESET}")

    def view_tasks_ui(self):
        """
        Display all tasks with formatting showing ID, title, description, and completion status.

        Displays "No tasks found" message if list is empty.
        """
        c = Colors
        print(f"\n{c.BLUE}{c.BOLD}{'=' * 64}{c.RESET}")
        print(f"{c.BLUE}{c.BOLD}|{c.WHITE}{'[#] ALL TASKS':^62}{c.BLUE}|{c.RESET}")
        print(f"{c.BLUE}{c.BOLD}{'=' * 64}{c.RESET}")

        tasks = self.service.get_all_tasks()

        if not tasks:
            print(f"\n{c.YELLOW}[i] No tasks found.{c.RESET}")
            return

        print()
        for task in tasks:
            if task.description:
                if task.completed:
                    print(f"{c.GREEN}[Task] [{task.id}] {c.WHITE}{task.title}  |  {c.CYAN}{task.description}{c.RESET}")
                else:
                    print(f"{c.YELLOW}[Task] [{task.id}] {c.WHITE}{task.title}  |  {c.CYAN}{task.description}{c.RESET}")
            else:
                if task.completed:
                    print(f"{c.GREEN}[Task] [{task.id}] {c.WHITE}{task.title}{c.RESET}")
                else:
                    print(f"{c.YELLOW}[Task] [{task.id}] {c.WHITE}{task.title}{c.RESET}")

        print(f"\n{c.CYAN}{'-' * 60}{c.RESET}")
        print(f"{c.BOLD}Total Tasks: {c.WHITE}{len(tasks)}{c.RESET}")

    def update_task_ui(self):
        """
        Prompt user to update a task's title and/or description.

        Handles errors with friendly messages.
        """
        c = Colors
        try:
            print(f"\n{c.YELLOW}{c.BOLD}{'=' * 44}{c.RESET}")
            print(f"{c.YELLOW}{c.BOLD}|{c.WHITE}{'[~] UPDATE TASK':^42}{c.YELLOW}|{c.RESET}")
            print(f"{c.YELLOW}{c.BOLD}{'=' * 44}{c.RESET}")

            # Prompt for task ID
            task_id_input = input(f"\n{c.CYAN}Enter task ID to update: {c.RESET}")

            # Validate and convert to int
            try:
                task_id = int(task_id_input)
            except ValueError:
                print(f"\n{c.RED}{c.BOLD}[X] ERROR: Task ID must be a number{c.RESET}")
                print(f"{c.YELLOW}Please try again.{c.RESET}")
                return

            # Get current task to display
            try:
                task = self.service.get_task_by_id(task_id)
                print(f"\n{c.CYAN}Current task:{c.RESET}")
                if task.completed:
                    print(f"{c.GREEN}[DONE] [{task.id}] {task.title}{c.RESET}")
                else:
                    print(f"{c.YELLOW}[TODO] [{task.id}] {task.title}{c.RESET}")
                if task.description:
                    print(f"   {c.CYAN}  -> {task.description}{c.RESET}")
            except (TaskNotFoundError, ValidationError) as e:
                print(f"\n{c.RED}{c.BOLD}[X] ERROR: {str(e)}{c.RESET}")
                print(f"{c.YELLOW}Please check the task ID and try again.{c.RESET}")
                return

            # Prompt for new title
            print(f"\n{c.CYAN}Enter new title (press Enter to keep current):{c.RESET}")
            new_title_input = input()
            new_title = new_title_input if new_title_input.strip() else None

            # Prompt for new description
            print(f"{c.CYAN}Enter new description (press Enter to keep current):{c.RESET}")
            new_description_input = input()
            new_description = new_description_input if new_description_input != "" or new_title is None else None

            # Update task
            self.service.update_task(task_id, new_title, new_description)

            print(f"\n{c.GREEN}{c.BOLD}[OK] Task updated successfully!{c.RESET}")

        except TaskNotFoundError as e:
            print(f"\n{c.RED}{c.BOLD}[X] ERROR: {str(e)}{c.RESET}")
            print(f"{c.YELLOW}Please check the task ID and try again.{c.RESET}")
        except ValidationError as e:
            print(f"\n{c.RED}{c.BOLD}[X] ERROR: {str(e)}{c.RESET}")
            print(f"{c.YELLOW}Please try again.{c.RESET}")

    def delete_task_ui(self):
        """
        Prompt user for task ID and delete the task.

        Handles errors with friendly messages.
        """
        c = Colors
        try:
            print(f"\n{c.RED}{c.BOLD}{'=' * 44}{c.RESET}")
            print(f"{c.RED}{c.BOLD}|{c.WHITE}{'[-] DELETE TASK':^42}{c.RED}|{c.RESET}")
            print(f"{c.RED}{c.BOLD}{'=' * 44}{c.RESET}")

            # Prompt for task ID
            task_id_input = input(f"\n{c.CYAN}Enter task ID to delete: {c.RESET}")

            # Validate and convert to int
            try:
                task_id = int(task_id_input)
            except ValueError:
                print(f"\n{c.RED}{c.BOLD}[X] ERROR: Task ID must be a number{c.RESET}")
                print(f"{c.YELLOW}Please try again.{c.RESET}")
                return

            # Delete task
            self.service.delete_task(task_id)

            print(f"\n{c.GREEN}{c.BOLD}[OK] Task deleted successfully!{c.RESET}")

        except TaskNotFoundError as e:
            print(f"\n{c.RED}{c.BOLD}[X] ERROR: {str(e)}{c.RESET}")
            print(f"{c.YELLOW}Please check the task ID and try again.{c.RESET}")
        except ValidationError as e:
            print(f"\n{c.RED}{c.BOLD}[X] ERROR: {str(e)}{c.RESET}")
            print(f"{c.YELLOW}Please try again.{c.RESET}")

    def toggle_complete_ui(self):
        """
        Prompt user for task ID and toggle its completion status.

        Handles errors with friendly messages.
        """
        c = Colors
        try:
            print(f"\n{c.MAGENTA}{c.BOLD}{'=' * 44}{c.RESET}")
            print(f"{c.MAGENTA}{c.BOLD}|{c.WHITE}{'[!] TOGGLE COMPLETION':^42}{c.MAGENTA}|{c.RESET}")
            print(f"{c.MAGENTA}{c.BOLD}{'=' * 44}{c.RESET}")

            # Prompt for task ID
            task_id_input = input(f"\n{c.CYAN}Enter task ID to toggle: {c.RESET}")

            # Validate and convert to int
            try:
                task_id = int(task_id_input)
            except ValueError:
                print(f"\n{c.RED}{c.BOLD}[X] ERROR: Task ID must be a number{c.RESET}")
                print(f"{c.YELLOW}Please try again.{c.RESET}")
                return

            # Toggle completion
            task = self.service.toggle_complete(task_id)

            # Display status
            if task.completed:
                print(f"\n{c.GREEN}{c.BOLD}[OK] Task marked as complete!{c.RESET}")
                print(f"{c.GREEN}[DONE] [{task.id}] {task.title}{c.RESET}")
            else:
                print(f"\n{c.YELLOW}{c.BOLD}[>>] Task marked as incomplete!{c.RESET}")
                print(f"{c.YELLOW}[TODO] [{task.id}] {task.title}{c.RESET}")

            if task.description:
                print(f"   {c.CYAN}  -> {task.description}{c.RESET}")

        except TaskNotFoundError as e:
            print(f"\n{c.RED}{c.BOLD}[X] ERROR: {str(e)}{c.RESET}")
            print(f"{c.YELLOW}Please check the task ID and try again.{c.RESET}")
        except ValidationError as e:
            print(f"\n{c.RED}{c.BOLD}[X] ERROR: {str(e)}{c.RESET}")
            print(f"{c.YELLOW}Please try again.{c.RESET}")
