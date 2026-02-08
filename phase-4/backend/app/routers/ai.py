from fastapi import APIRouter, Depends, HTTPException
from app.services.ai_service import ai_service
from app.routers.auth import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/api/ai", tags=["AI Integration"])

class AISuggestionRequest(BaseModel):
    title: str

class AISuggestionResponse(BaseModel):
    category: str
    priority: str

@router.post("/suggest", response_model=AISuggestionResponse)
async def get_ai_suggestions(
    request: AISuggestionRequest,
    current_user=Depends(get_current_user)
):
    """
    Get AI-powered suggestions for task category and priority based on title.
    """
    if not request.title:
        raise HTTPException(status_code=400, detail="Title is required for suggestions")
    
    suggestion = await ai_service.suggest_task_attributes(request.title)
    return suggestion
