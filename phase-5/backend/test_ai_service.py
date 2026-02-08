import asyncio
import sys
import os

# Add the current directory to sys.path so we can import app
sys.path.append(os.getcwd())

from app.services.ai_service import ai_service

async def test_parsing():
    print("Testing AI Task Parsing...")
    text = "Buy milk tomorrow at 5pm"
    try:
        result = await ai_service.parse_task(text)
        print("Success! Parsed Result:")
        print(result)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_parsing())
