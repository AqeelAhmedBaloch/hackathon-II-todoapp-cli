"""
Chat router for AI-powered task assistant.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.routers.auth import get_current_user
from app.models.user import User
from app.services.chat_service import get_ai_response
from pydantic import BaseModel
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/chat", tags=["AI Chat"])


class ChatMessage(BaseModel):
    """Schema for chat message."""
    message: str


class ChatResponse(BaseModel):
    """Schema for chat response."""
    response: str


@router.post("", response_model=ChatResponse)
async def chat(
    chat_message: ChatMessage,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Send a message to AI chatbot and get response.
    
    The AI has access to your task data and can answer questions about:
    - Your tasks and their status
    - Task priorities and categories
    - Upcoming deadlines
    - Task statistics and summaries
    """
    try:
        # Get AI response with database context
        ai_response = await get_ai_response(
            user_message=chat_message.message,
            db=db,
            user_id=current_user.id
        )
        
        return ChatResponse(response=ai_response)
        
    except Exception as e:
        logger.error(f"Chat endpoint error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get AI response"
        )
