"""
Main application entry point for Todo Console Application.

This module orchestrates the application flow and handles the main menu loop.
"""

# Ensure the project root is on sys.path so `from src...` works even when running
# this file directly from the `src/` directory (e.g., `uv run main.py`). This keeps
# the module import behavior consistent regardless of current working directory.
import sys
from pathlib import Path
if __package__ is None:
    project_root = Path(__file__).resolve().parent.parent
    sys.path.insert(0, str(project_root))

from src.services.task_service import TaskService
from src.ui.console import ConsoleUI, Colors


def main():
    """
    Main application loop.

    Initializes services, displays menu, and handles user input until exit.
    """
    # Initialize service and UI
    service = TaskService()
    ui = ConsoleUI(service)

    # Main menu loop
    c = Colors
    while True:
        try:
            # Display menu
            ui.display_menu()

            # Get user choice
            choice = input(f"\n{c.WHITE}{c.BOLD}> Enter choice (1-6): {c.RESET}")

            # Handle menu options
            if choice == "1":
                # Add Task
                ui.add_task_ui()

            elif choice == "2":
                # View Tasks
                ui.view_tasks_ui()

            elif choice == "3":
                # Update Task
                ui.update_task_ui()

            elif choice == "4":
                # Delete Task
                ui.delete_task_ui()

            elif choice == "5":
                # Toggle Complete
                ui.toggle_complete_ui()

            elif choice == "6":
                # Exit
                print(f"\n{c.CYAN}{c.BOLD}[>>] Thank you for using Todo App! Goodbye!{c.RESET}\n")
                break

            else:
                # Invalid choice
                print(f"\n{c.RED}{c.BOLD}[X] ERROR: Invalid choice. Please enter a number between 1 and 6.{c.RESET}")

        except KeyboardInterrupt:
            # Handle Ctrl+C gracefully
            print(f"\n\n{c.CYAN}{c.BOLD}[>>] Thank you for using Todo App! Goodbye!{c.RESET}\n")
            break

        except Exception as e:
            # Catch unexpected errors
            print(f"\n{c.RED}{c.BOLD}[X] An unexpected error occurred: {str(e)}{c.RESET}")
            print(f"{c.YELLOW}Please try again.{c.RESET}")


if __name__ == "__main__":
    main()
