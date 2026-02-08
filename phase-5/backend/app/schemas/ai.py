from pydantic import BaseModel
from typing import Optional

class AIParseRequest(BaseModel):
    text: str

class AISuggestionRequest(BaseModel):
    title: str

class AISuggestionResponse(BaseModel):
    category: Optional[str] = "Other"
    priority: Optional[str] = "Medium"
