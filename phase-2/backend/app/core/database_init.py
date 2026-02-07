"""
Database initialization utilities for proper table creation.
"""
from sqlalchemy import text
from app.core.database import engine, Base
from app.models import user, task  # Import all models to register them with Base
import logging

logger = logging.getLogger(__name__)

def init_database():
    """
    Initialize the database by creating all tables.
    This function should be called at application startup.
    """
    try:
        # Test the database connection first
        with engine.connect() as conn:
            # Test basic connection
            result = conn.execute(text("SELECT 1"))
            logger.info("Database connection successful")

        # Create all tables
        logger.info("Creating database tables...")
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")

        # Verify tables exist by checking users table
        with engine.connect() as conn:
            # Check if users table exists
            if engine.dialect.has_table(conn, 'users'):
                logger.info("Users table exists")
            else:
                logger.warning("Users table does not exist after creation attempt")

            # Check if tasks table exists
            if engine.dialect.has_table(conn, 'tasks'):
                logger.info("Tasks table exists")
            else:
                logger.warning("Tasks table does not exist after creation attempt")

    except Exception as e:
        logger.error(f"Error initializing database: {e}")
        raise

if __name__ == "__main__":
    init_database()