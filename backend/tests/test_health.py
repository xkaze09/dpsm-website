"""C1: GET /api/health"""
import pytest


@pytest.mark.asyncio
async def test_health_returns_200(anon_client):
    response = await anon_client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
