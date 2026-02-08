"""
Main FastAPI application entry point.
Phase-2: Full-Stack Web Todo Application
"""
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import get_db
from app.core.database_init import init_database
from app.routers import auth, tasks
from app.core.websockets import manager
from fastapi import WebSocket, WebSocketDisconnect
import logging

# Initialize database tables
try:
    init_database()
except Exception as e:
    logging.error(f"Failed to initialize database: {e}")
    raise

# Initialize FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.API_VERSION,
    description="RESTful API for Todo Application with JWT Authentication",
    debug=settings.DEBUG
)

# Configure CORS
origins = settings.cors_origins_list
logging.info(f"Configuring CORS with origins: {origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(tasks.router)

@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
    await manager.connect(websocket, user_id)
    try:
        while True:
            # We can receive messages if needed, but for now we mainly broadcast
            data = await websocket.receive_text()
            # client can send heartbeats or other messages
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)


@app.get("/")
def root():
    """Root endpoint - API health check."""
    return {
        "message": "Todo App API - Phase 2",
        "version": settings.API_VERSION,
        "status": "running",
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


@app.get("/test-db-connection")
def test_db_connection(db: Session = Depends(get_db)):
    """Diagnostic endpoint to test database connectivity."""
    try:
        from sqlalchemy import text
        db.execute(text("SELECT 1"))
        return {"status": "success", "message": "Database connection is working"}
    except Exception as e:
        logging.error(f"Database connection test failed: {e}")
        return {"status": "error", "message": str(e)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=8001,
        reload=settings.DEBUG
    )
