"""
Phase 4 stub — POST /api/chat

Returns a placeholder until Phase 4 (LLM chatbot) is implemented.
The route is registered here to reserve the endpoint pattern and confirm
routing works end-to-end before the real implementation.

When Phase 4 is implemented, this file will:
- Import context_builder.build_dpsm_context()
- Call Groq API with the assembled context
- Stream Server-Sent Events back to the client
- Apply slowapi rate limiting (20 req/min per IP)
"""

from fastapi import APIRouter

router = APIRouter()


@router.post("/chat")
async def chat_stub():
    return {"message": "coming soon"}
