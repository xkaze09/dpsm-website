"""
Phase 4 stub — build_dpsm_context()

This module assembles the LLM context string for the chatbot endpoint.
It is stubbed in Phase 1 and will be fully implemented in Phase 4.

When Phase 4 is implemented, this function will:
  1. Fetch all published articles (title + excerpt + tags) from Supabase (~1-3k tokens)
  2. Load javascript/course/data.json from disk (~2-3k tokens)
  3. Load javascript/research/researchData.json from disk (~1-2k tokens)
  4. Format everything into a structured context string
  5. Return the context string to be stuffed into the Groq system prompt

Total context per request: ~6-8k tokens — within Groq's free tier limit.
If content grows beyond the context window, the upgrade path is pgvector on Supabase.
"""


async def build_dpsm_context() -> str:
    """
    Phase 4 stub. Returns an empty string until Phase 4 is implemented.

    Future signature will remain the same — callers in chat.py can call this
    without changes when Phase 4 fills in the implementation.
    """
    return ""
