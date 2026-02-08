import pytest
from app.services.ai_service import ai_service
from app.schemas.ai import AIParseRequest, AISuggestionRequest

@pytest.mark.asyncio
async def test_ai_suggestion_mock():
    # Test mock suggestion when API keys are missing
    title = "Buy milk"
    suggestion = await ai_service.suggest_task_attributes(title)
    assert "category" in suggestion
    assert "priority" in suggestion
    assert suggestion["category"] == "Shopping"

@pytest.mark.asyncio
async def test_ai_parse_mock():
    # Test mock parsing
    text = "Call mom tomorrow"
    parsed = await ai_service.parse_task(text)
    assert "title" in parsed
    assert parsed["title"] == text
