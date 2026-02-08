"""
Database configuration and session management.
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Create database engine
db_url = settings.DATABASE_URL
# SQLAlchemy 2.0 requires postgresql:// instead of postgres://
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

if db_url.startswith("sqlite"):
    # For SQLite, disable pooling which can cause issues
    engine = create_engine(
        db_url,
        connect_args={"check_same_thread": False},  # Required for SQLite
        pool_pre_ping=True,
        echo=settings.DEBUG
    )
else:
    engine = create_engine(
        db_url,
        pool_pre_ping=True,  # Verify connections before using
        echo=settings.DEBUG  # Log SQL queries in debug mode
    )

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()


def get_db():
    """
    Dependency function to get database session.
    Use with FastAPI Depends().

    Usage:
        @app.get("/items")
        def read_items(db: Session = Depends(get_db)):
            ...
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
