"""C22: POST /api/chat → {"message": "coming soon"}"""
import pytest


@pytest.mark.asyncio
async def test_chat_stub_returns_coming_soon(anon_client):
    response = await anon_client.post("/api/chat")
    assert response.status_code == 200
    assert response.json() == {"message": "coming soon"}
