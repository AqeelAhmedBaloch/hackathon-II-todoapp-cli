from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.routers.auth import get_current_user
from app.models.task import Task
from app.models.user import User

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

@router.get("/dashboard")
def get_analytics_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get analytics dashboard data for the current user.
    """
    # Total tasks
    total_tasks = db.query(Task).filter(Task.user_id == current_user.id).count()
    
    # Completed tasks
    completed_tasks = db.query(Task).filter(
        Task.user_id == current_user.id, 
        Task.completed == True
    ).count()
    
    # Pending tasks
    pending_tasks = total_tasks - completed_tasks
    
    # Completion rate
    completion_rate = 0
    if total_tasks > 0:
        completion_rate = round((completed_tasks / total_tasks) * 100, 1)
        
    # Tasks by priority
    tasks_by_priority = db.query(
        Task.priority, func.count(Task.id)
    ).filter(
        Task.user_id == current_user.id
    ).group_by(Task.priority).all()
    
    priority_data = [{"name": p[0], "value": p[1]} for p in tasks_by_priority]
    
    # Tasks by category
    tasks_by_category = db.query(
        Task.category, func.count(Task.id)
    ).filter(
        Task.user_id == current_user.id
    ).group_by(Task.category).all()
    
    # Handle None category
    category_data = [{"name": c[0] or "Uncategorized", "value": c[1]} for c in tasks_by_category]
    
    return {
        "summary": {
            "total": total_tasks,
            "completed": completed_tasks,
            "pending": pending_tasks,
            "rate": completion_rate
        },
        "by_priority": priority_data,
        "by_category": category_data
    }
