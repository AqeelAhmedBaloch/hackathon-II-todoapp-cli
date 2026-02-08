#!/bin/bash
# ============================================================================
# Hugging Face Space Startup Script
# ============================================================================

set -e  # Exit on error

echo "===== Todo App Backend Startup ====="
echo "Starting at $(date)"
echo ""

# Print environment info (without sensitive data)
echo "Python version: $(python --version)"
echo "Working directory: $(pwd)"
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "ERROR: DATABASE_URL environment variable is not set!"
    echo "Please configure it in Hugging Face Space settings."
    exit 1
fi

echo "✓ DATABASE_URL is configured"

# Check if JWT_SECRET_KEY is set
if [ -z "$JWT_SECRET_KEY" ]; then
    echo "WARNING: JWT_SECRET_KEY not set, using default (NOT SECURE!)"
fi

echo ""
echo "===== Initializing & Migrating Database ====="
# Initialize database tables and add missing columns
python migrate_db.py || {
    echo "WARNING: Database migration failed, falling back to basic initialization..."
    python -c "from app.core.database_init import init_database; init_database()"
}

echo ""
echo "===== Starting FastAPI Server ====="
echo "Server will be available on port 7860"
echo ""

# Start the FastAPI application
exec uvicorn app.main:app \
    --host 0.0.0.0 \
    --port 7860 \
    --workers 1 \
    --log-level info
