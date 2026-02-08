import os
import logging
from sqlalchemy import text, create_engine
from dotenv import load_dotenv

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def migrate_db():
    load_dotenv()
    db_url = os.getenv("DATABASE_URL")
    
    if not db_url:
        logger.error("DATABASE_URL not found in environment")
        return

    # SQLAlchemy 2.0 requires postgresql:// instead of postgres://
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)

    # Adding connect_timeout to prevent hanging during slow cold starts (like Neon)
    engine = create_engine(
        db_url,
        connect_args={"connect_timeout": 10} if "postgresql" in db_url else {}
    )
    
    columns_to_add = [
        ("priority", "VARCHAR(20) DEFAULT 'medium'"),
        ("category", "VARCHAR(50)"),
        ("due_date", "TIMESTAMP WITH TIME ZONE"),
        ("workspace_id", "INTEGER REFERENCES workspaces(id)"),
        ("parent_id", "INTEGER REFERENCES tasks(id)"),
        ("updated_at", "TIMESTAMP WITH TIME ZONE")
    ]

    try:
        with engine.begin() as conn:
            # Check if workspaces table exists (it might be new too)
            table_check = conn.execute(text("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'workspaces')"))
            if not table_check.scalar():
                logger.info("Creating workspaces table...")
                conn.execute(text("""
                    CREATE TABLE workspaces (
                        id SERIAL PRIMARY KEY,
                        name VARCHAR(100) NOT NULL,
                        description TEXT,
                        owner_id INTEGER REFERENCES users(id) NOT NULL,
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP WITH TIME ZONE
                    )
                """))

            # Add columns to tasks table
            for col_name, col_type in columns_to_add:
                # Check if column exists
                check_query = text(f"""
                    SELECT EXISTS (
                        SELECT FROM information_schema.columns 
                        WHERE table_name = 'tasks' AND column_name = '{col_name}'
                    )
                """)
                exists = conn.execute(check_query).scalar()
                
                if not exists:
                    logger.info(f"Adding column '{col_name}' to tasks table...")
                    conn.execute(text(f"ALTER TABLE tasks ADD COLUMN {col_name} {col_type}"))
                else:
                    logger.info(f"Column '{col_name}' already exists in tasks table.")
                    
        logger.info("Migration completed successfully!")
    except Exception as e:
        logger.error(f"Migration failed: {e}")

if __name__ == "__main__":
    migrate_db()
