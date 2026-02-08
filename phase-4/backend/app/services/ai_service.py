import google.generativeai as genai
import json
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        if settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
        else:
            self.model = None
            logger.warning("GEMINI_API_KEY not set. AI features will use mock fallback.")

    async def suggest_task_attributes(self, title: str) -> dict:
        """
        Predicts category and priority based on task title.
        """
        if not self.model:
            return self._mock_suggestion(title)

        prompt = f"""
        Given the todo task title: "{title}"
        Suggest a category and priority.
        Categories: Personal, Work, Shopping, Health, Finance, Other
        Priorities: Low, Medium, High, Urgent

        Return ONLY a JSON object like:
        {{"category": "Work", "priority": "High"}}
        """

        try:
            response = self.model.generate_content(prompt)
            # Clean response text in case it includes markdown blocks
            text = response.text.strip()
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            elif "```" in text:
                text = text.split("```")[1].split("```")[0].strip()
            
            return json.loads(text)
        except Exception as e:
            logger.error(f"AI suggestion failed: {e}")
            return self._mock_suggestion(title)

    def _mock_suggestion(self, title: str) -> dict:
        title_lower = title.lower()
        
        # Simple keywords
        if any(w in title_lower for w in ["buy", "shop", "grocery"]):
            return {"category": "Shopping", "priority": "Medium"}
        if any(w in title_lower for w in ["call", "meeting", "email", "work"]):
            return {"category": "Work", "priority": "High"}
        if any(w in title_lower for w in ["doctor", "gym", "health", "workout"]):
            return {"category": "Health", "priority": "High"}
        
        return {"category": "Personal", "priority": "Low"}

ai_service = AIService()
