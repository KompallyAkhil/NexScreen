from __future__ import annotations
import os
from dotenv import load_dotenv

load_dotenv()


def _require(key: str) -> str:
    val = os.getenv(key)
    if not val:
        raise EnvironmentError(f"Missing required env var: {key}")
    return val


def _float(key: str, default: float) -> float:
    return float(os.getenv(key, default))


GROQ_API_KEY: str = _require("GROQ_API_KEY")
GROQ_MODEL: str = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")

EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "all-mpnet-base-v2")

SEMANTIC_WEIGHT: float = _float("SEMANTIC_WEIGHT", 0.45)
LLM_WEIGHT: float = _float("LLM_WEIGHT", 0.35)
KEYWORD_WEIGHT: float = _float("KEYWORD_WEIGHT", 0.20)

LANGSMITH_TRACING: bool = os.getenv("LANGCHAIN_TRACING_V2", "false").lower() == "true"
