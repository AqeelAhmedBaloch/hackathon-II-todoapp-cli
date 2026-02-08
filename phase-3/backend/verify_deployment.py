#!/usr/bin/env python3
"""
Hugging Face Deployment Verification Script
Checks if all required files and configurations are ready for deployment.
"""

import os
import sys
from pathlib import Path

# Set UTF-8 encoding for Windows console
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# ANSI color codes
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'
BOLD = '\033[1m'

def print_header(text):
    print(f"\n{BOLD}{BLUE}{'='*60}{RESET}")
    print(f"{BOLD}{BLUE}{text.center(60)}{RESET}")
    print(f"{BOLD}{BLUE}{'='*60}{RESET}\n")

def print_success(text):
    print(f"{GREEN}✅ {text}{RESET}")

def print_error(text):
    print(f"{RED}❌ {text}{RESET}")

def print_warning(text):
    print(f"{YELLOW}⚠️  {text}{RESET}")

def print_info(text):
    print(f"{BLUE}ℹ️  {text}{RESET}")

def check_file_exists(filepath, required=True):
    """Check if a file exists."""
    path = Path(filepath)
    if path.exists():
        size = path.stat().st_size
        print_success(f"{filepath} ({size} bytes)")
        return True
    else:
        if required:
            print_error(f"{filepath} - MISSING (REQUIRED)")
        else:
            print_warning(f"{filepath} - Missing (Optional)")
        return not required

def check_file_content(filepath, search_strings, description):
    """Check if file contains specific strings."""
    path = Path(filepath)
    if not path.exists():
        print_error(f"{filepath} - File not found")
        return False

    content = path.read_text(encoding='utf-8')
    all_found = True

    for search_string in search_strings:
        if search_string in content:
            print_success(f"  ✓ Contains: {description}")
        else:
            print_error(f"  ✗ Missing: {description}")
            all_found = False

    return all_found

def main():
    print_header("🚀 Hugging Face Deployment Verification")

    script_dir = Path(__file__).parent
    os.chdir(script_dir)

    all_checks_passed = True

    # Check 1: Required Files
    print_header("📁 Required Files Check")

    required_files = [
        "README.md",
        "Dockerfile",
        ".dockerignore",
        "requirements.txt",
        "startup.sh",
        "app/main.py",
        "app/core/config.py",
        "app/core/database.py",
        "app/core/database_init.py",
    ]

    for file in required_files:
        if not check_file_exists(file, required=True):
            all_checks_passed = False

    # Check 2: Optional but Recommended Files
    print_header("📋 Optional Files Check")

    optional_files = [
        ".python-version",
        ".env.huggingface",
        "HUGGINGFACE_DEPLOYMENT.md",
        "DEPLOYMENT_SUMMARY.md",
    ]

    for file in optional_files:
        check_file_exists(file, required=False)

    # Check 3: README.md YAML Frontmatter
    print_header("📝 README.md Validation")

    readme_checks = [
        ("---", "YAML frontmatter markers"),
        ("sdk: docker", "Docker SDK specified"),
        ("app_port: 7860", "Port 7860 configured"),
    ]

    for search, desc in readme_checks:
        if not check_file_content("README.md", [search], desc):
            all_checks_passed = False

    # Check 4: Dockerfile Configuration
    print_header("🐳 Dockerfile Validation")

    dockerfile_checks = [
        ("EXPOSE 7860", "Port 7860 exposed"),
        ("startup.sh", "Startup script configured"),
        ("python:3.11", "Python 3.11 base image"),
    ]

    for search, desc in dockerfile_checks:
        if not check_file_content("Dockerfile", [search], desc):
            all_checks_passed = False

    # Check 5: Config.py Settings
    print_header("⚙️  Config.py Validation")

    config_checks = [
        ("PORT: int = Field", "PORT field configuration"),
        ("7860", "Default port 7860"),
        ("DEBUG: bool = Field", "DEBUG field configuration"),
    ]

    for search, desc in config_checks:
        check_file_content("app/core/config.py", [search], desc)

    # Check 6: Startup Script
    print_header("🚀 Startup Script Validation")

    startup_path = Path("startup.sh")
    if startup_path.exists():
        # Check if executable
        if os.access(startup_path, os.X_OK):
            print_success("startup.sh is executable")
        else:
            print_warning("startup.sh is not executable (run: chmod +x startup.sh)")

        # Check content
        startup_checks = [
            ("uvicorn app.main:app", "Uvicorn command present"),
            ("--port 7860", "Port 7860 configured"),
            ("DATABASE_URL", "Database check present"),
        ]

        for search, desc in startup_checks:
            check_file_content("startup.sh", [search], desc)
    else:
        print_error("startup.sh not found")
        all_checks_passed = False

    # Check 7: Requirements.txt
    print_header("📦 Requirements.txt Validation")

    requirements_checks = [
        ("fastapi", "FastAPI included"),
        ("uvicorn", "Uvicorn included"),
        ("sqlalchemy", "SQLAlchemy included"),
        ("psycopg2-binary", "PostgreSQL driver included"),
    ]

    for search, desc in requirements_checks:
        check_file_content("requirements.txt", [search], desc)

    # Check 8: Directory Structure
    print_header("📂 Directory Structure Check")

    required_dirs = [
        "app",
        "app/core",
        "app/models",
        "app/routers",
        "app/schemas",
    ]

    for dir_path in required_dirs:
        path = Path(dir_path)
        if path.is_dir():
            print_success(f"{dir_path}/ directory exists")
        else:
            print_error(f"{dir_path}/ directory missing")
            all_checks_passed = False

    # Final Summary
    print_header("📊 Verification Summary")

    if all_checks_passed:
        print_success(f"{BOLD}All critical checks passed!{RESET}")
        print_info("Your backend is ready for Hugging Face deployment! 🚀")
        print()
        print_info("Next steps:")
        print("  1. Get DATABASE_URL from Neon/Supabase")
        print("  2. Generate JWT_SECRET_KEY")
        print("  3. Push to Hugging Face Space")
        print("  4. Add secrets in Space settings")
        print()
        print_info("Deployment guide: HUGGINGFACE_DEPLOYMENT.md")
        return 0
    else:
        print_error(f"{BOLD}Some checks failed!{RESET}")
        print_warning("Please fix the errors above before deploying.")
        print()
        print_info("For help, see: HUGGINGFACE_DEPLOYMENT.md")
        return 1

if __name__ == "__main__":
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print(f"\n{YELLOW}Verification cancelled by user.{RESET}")
        sys.exit(130)
    except Exception as e:
        print_error(f"Verification failed with error: {e}")
        sys.exit(1)
