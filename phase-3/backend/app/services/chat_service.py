"""
Chat service for AI-powered task assistant using Google Gemini.
"""
import google.generativeai as genai
from sqlalchemy.orm import Session
from app.models.task import Task
from app.models.user import User
from app.core.config import settings
from typing import List, Dict
import logging

logger = logging.getLogger(__name__)

# Configure Gemini API
GEMINI_API_KEY = settings.GEMINI_API_KEY
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-2.5-flash')
    logger.info("Google Gemini AI (gemini-2.5-flash) configured successfully")
else:
    logger.warning("GEMINI_API_KEY not set in environment")
    model = None


def get_user_tasks_context(db: Session, user_id: int) -> str:
    """
    Get user's tasks from database and format as context for AI.
    """
    tasks = db.query(Task).filter(Task.owner_id == user_id).all()
    
    if not tasks:
        return "User has no tasks in the database."
    
    context = f"User has {len(tasks)} tasks:\n\n"
    
    for i, task in enumerate(tasks, 1):
        status = "✅ Completed" if task.completed else "⏳ Pending"
        priority = task.priority or "Not set"
        category = task.category or "Uncategorized"
        due_date = task.due_date.strftime("%Y-%m-%d") if task.due_date else "No deadline"
        
        context += f"{i}. {task.title}\n"
        context += f"   Status: {status}\n"
        context += f"   Priority: {priority}\n"
        context += f"   Category: {category}\n"
        context += f"   Due Date: {due_date}\n"
        if task.description:
            context += f"   Description: {task.description}\n"
        context += "\n"
    
    # Add statistics
    completed_count = sum(1 for t in tasks if t.completed)
    pending_count = len(tasks) - completed_count
    
    context += f"\nSummary:\n"
    context += f"- Total tasks: {len(tasks)}\n"
    context += f"- Completed: {completed_count}\n"
    context += f"- Pending: {pending_count}\n"
    
    # Priority breakdown
    high_priority = sum(1 for t in tasks if t.priority and t.priority.lower() in ['high', 'urgent'])
    if high_priority > 0:
        context += f"- High/Urgent priority: {high_priority}\n"
    
    return context


async def get_ai_response(user_message: str, db: Session, user_id: int) -> str:
    """
    Get AI response using Google Gemini with database context.
    """
    if not model:
        return "AI chatbot is not configured. Please set GEMINI_API_KEY in environment."
    
    try:
        # Get user's tasks as context
        tasks_context = get_user_tasks_context(db, user_id)
        
        # Create system prompt
        system_prompt = f"""You are a helpful AI assistant for a Todo application. 
You help users manage their tasks by answering questions about their task list.

Here is the user's current task data from the database:

{tasks_context}

Based on this information, answer the user's question helpfully and concisely.
If they ask about tasks, priorities, deadlines, or statistics, use the data provided above.
Be friendly and helpful. If you suggest actions, make them actionable."""

        # Combine system prompt and user message
        full_prompt = f"{system_prompt}\n\nUser Question: {user_message}\n\nAssistant:"
        
        # Generate response
        response = model.generate_content(full_prompt)
        
        return response.text
        
    except Exception as e:
        logger.error(f"Error generating AI response: {e}")
        return f"Sorry, I encountered an error: {str(e)}"
