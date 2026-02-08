from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.calendar_service import calendar_service
from app.routers.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/calendar", tags=["Calendar"])

@router.get("/connect")
def connect_calendar(current_user: User = Depends(get_current_user)):
    """
    Returns the Google OAuth URL to connect the user's calendar.
    """
    try:
        # Redirect URI should match what is configured in Google Cloud Console
        # For local dev: http://localhost:8000/api/calendar/callback
        redirect_uri = "http://localhost:8003/api/calendar/callback" 
        auth_url = calendar_service.get_auth_url(redirect_uri)
        
        if not auth_url:
            return {"auth_url": None, "message": "Google Calendar integration is not configured. (Missing Credentials)"}
            
        return {"auth_url": auth_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/callback")
def calendar_callback(code: str, db: Session = Depends(get_db)):
    """
    Handles the Google OAuth callback. 
    Exchanges code for credentials and saves them (conceptually).
    In a real app, we'd persist these credentials linked to the user.
    """
    try:
        redirect_uri = "http://localhost:8000/api/calendar/callback"
        credentials = calendar_service.get_credentials(code, redirect_uri)
        
        # TODO: Save credentials.to_json() to the user's profile in DB
        # user.google_calendar_credentials = credentials.to_json()
        # db.commit()

        return {"message": "Calendar connected successfully!", "credentials": "Saved (Simulated)"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/sync/{task_id}")
def sync_task_to_calendar(task_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Syncs a specific task to Google Calendar.
    Requires user to be already connected.
    """
    # 1. Fetch task from DB
    # 2. Check if user has credentials
    # 3. Call calendar_service.create_event()
    return {"message": "Sync feature coming soon (requires credential persistence)"}
