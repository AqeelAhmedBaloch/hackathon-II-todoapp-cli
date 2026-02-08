#!/usr/bin/env python3
"""
Script to initialize the database tables manually.
Can be used as a command line utility or imported as a module.
"""
import sys
import os
import logging

# Add the app directory to the path so imports work
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database_init import init_database

# Configure basic logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

def main():
    """Main function to run database initialization."""
    logger = logging.getLogger(__name__)
    logger.info("Starting database initialization...")

    try:
        init_database()
        logger.info("Database initialization completed successfully!")
        return 0
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main())