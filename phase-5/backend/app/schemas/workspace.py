from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from enum import Enum

class WorkspaceRole(str, Enum):
    OWNER = "owner"
    ADMIN = "admin"
    MEMBER = "member"
    VIEWER = "viewer"

class WorkspaceBase(BaseModel):
    name: str
    description: Optional[str] = None

class WorkspaceCreate(WorkspaceBase):
    pass

class WorkspaceMemberSchema(BaseModel):
    user_id: int
    role: WorkspaceRole
    joined_at: datetime
    
    class Config:
        from_attributes = True

class Workspace(WorkspaceBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]
    # members: List[WorkspaceMemberSchema] = [] 

    class Config:
        from_attributes = True
