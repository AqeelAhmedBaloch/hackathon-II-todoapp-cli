"""
Main FastAPI application entry point.
Phase-2: Full-Stack Web Todo Application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
from app.routers import auth, tasks

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.API_VERSION,
    description="RESTful API for Todo Application with JWT Authentication",
    debug=settings.DEBUG
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    # Allow all headers including custom ones
    allow_origin_regex=None,  # Using allow_origins for explicit control
    # Expose headers for browser access
    expose_headers=["Access-Control-Allow-Origin"]
)

# Include routers
app.include_router(auth.router)
app.include_router(tasks.router)


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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
