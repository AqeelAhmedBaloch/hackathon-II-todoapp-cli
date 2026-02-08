import google.generativeai as genai
from openai import OpenAI
import json
import logging
from datetime import datetime
from app.core.config import settings

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        # Initialize Gemini
        if settings.GEMINI_API_KEY:
            try:
                genai.configure(api_key=settings.GEMINI_API_KEY)
                self.gemini_model = genai.GenerativeModel('gemini-1.5-flash')
            except Exception as e:
                logger.error(f"Failed to initialize Gemini: {e}")
                self.gemini_model = None
        else:
            self.gemini_model = None
            logger.warning("GEMINI_API_KEY not set.")

        # Initialize OpenAI
        if settings.OPENAI_API_KEY:
            try:
                self.openai_client = OpenAI(api_key=settings.OPENAI_API_KEY)
            except Exception as e:
                logger.error(f"Failed to initialize OpenAI: {e}")
                self.openai_client = None
        else:
            self.openai_client = None
            logger.warning("OPENAI_API_KEY not set.")

    async def parse_task(self, text: str) -> dict:
        """
        Parses natural language text into a structured task object.
        Example: "Remind me to buy milk tomorrow at 2pm" -> 
        {"title": "Buy milk", "due_date": "2026-02-09T14:00:00", "priority": "Medium"}
        """
        if not self.openai_client:
            logger.info("OpenAI client not available, performing mock parsing.")
            return self._mock_parse(text)

        prompt = f"""
        Extract task details from this text: "{text}"
        Return a JSON object with:
        - title: The task name (required)
        - description: Any extra context (optional)
        - priority: Urgent, High, Medium, or Low (default Medium)
        - category: Personal, Work, Shopping, Health, Finance, or Other (default Other)
        - due_date: ISO 8601 format (optional)

        Current time context: {datetime.now().isoformat() if 'datetime' in globals() else 'now'}
        
        ONLY return JSON.
        """

        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a helpful task management assistant that extracts structured data from natural language."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"}
            )
            data = json.loads(response.choices[0].message.content)
            # Ensure required fields exist in response
            if "title" not in data:
                data["title"] = text
            return data
        except Exception as e:
            logger.error(f"OpenAI parsing failed: {e}")
            return self._mock_parse(text)

    async def suggest_task_attributes(self, title: str) -> dict:
        """
        Predicts category and priority based on task title.
        """
        # Try Gemini if available
        if self.gemini_model:
            prompt = f"""
            Given the todo task title: "{title}"
            Suggest a category and priority.
            Categories: Personal, Work, Shopping, Health, Finance, Other
            Priorities: Low, Medium, High, Urgent

            Return ONLY a JSON object like:
            {{"category": "Work", "priority": "High"}}
            """
            try:
                response = self.gemini_model.generate_content(prompt)
                text = response.text.strip()
                if "```json" in text:
                    text = text.split("```json")[1].split("```")[0].strip()
                elif "```" in text:
                    text = text.split("```")[1].split("```")[0].strip()
                return json.loads(text)
            except Exception as e:
                logger.error(f"Gemini suggestion failed: {e}")

        # Fallback to OpenAI if Gemini fails or is missing
        if self.openai_client:
            try:
                response = self.openai_client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": "Suggest category and priority for a task."},
                        {"role": "user", "content": f"Task: {title}. Categories: Personal, Work, Shopping, Health, Finance, Other. Priorities: Low, Medium, High, Urgent. Return JSON."}
                    ],
                    response_format={"type": "json_object"}
                )
                return json.loads(response.choices[0].message.content)
            except Exception as e:
                logger.error(f"OpenAI suggestion failed: {e}")

        return self._mock_suggestion(title)

    def _mock_parse(self, text: str) -> dict:
        return {"title": text, "priority": "Medium", "category": "Other"}

    def _mock_suggestion(self, title: str) -> dict:
        title_lower = title.lower()
        if any(w in title_lower for w in ["buy", "shop", "grocery"]):
            return {"category": "Shopping", "priority": "Medium"}
        if any(w in title_lower for w in ["call", "meeting", "email", "work"]):
            return {"category": "Work", "priority": "High"}
        if any(w in title_lower for w in ["doctor", "gym", "health", "workout"]):
            return {"category": "Health", "priority": "High"}
        return {"category": "Personal", "priority": "Low"}

ai_service = AIService()
