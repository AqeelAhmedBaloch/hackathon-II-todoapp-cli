from fastapi import APIRouter, Depends, HTTPException
from app.services.ai_service import ai_service
from app.routers.auth import get_current_user
from app.schemas.ai import AIParseRequest, AISuggestionRequest, AISuggestionResponse

router = APIRouter(prefix="/api/ai", tags=["AI Integration"])

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

@router.post("/parse")
async def parse_natural_language_task(
    request: AIParseRequest,
    current_user=Depends(get_current_user)
):
    """
    Parse natural language text into a structured task object.
    """
    if not request.text:
        raise HTTPException(status_code=400, detail="Text is required for parsing")
    
    parsed_task = await ai_service.parse_task(request.text)
    return parsed_task
