"""
nodes/embed_node.py — Node 3 (runs twice in parallel branches).

Embeds the full resume text and JD text using a local SentenceTransformer
model. The embeddings are used downstream for cosine similarity scoring.

Why embed the full text (not just skills)?
  Skill lists miss context. Embedding full text captures experience
  descriptions, project summaries, and domain vocabulary that enrich matching.
"""
from __future__ import annotations
from sentence_transformers import SentenceTransformer
import config
from state import ResumeJDState

_model_instance: SentenceTransformer | None = None


def _model() -> SentenceTransformer:
    """Load model once and cache it. Avoids reloading on every node call."""
    global _model_instance
    if _model_instance is None:
        _model_instance = SentenceTransformer(config.EMBEDDING_MODEL)
    return _model_instance


def embed_resume(state: ResumeJDState) -> ResumeJDState:
    """Embed resume text into a dense vector."""
    model = _model()
    skills_str = ", ".join(state.get("resume_fields", {}).get("skills", []) or [])
    combined = f"{state['resume_text']}\n\nKey skills: {skills_str}"
    embedding = model.encode(combined, normalize_embeddings=True).tolist()
    return {"resume_embedding": embedding}


def embed_jd(state: ResumeJDState) -> ResumeJDState:
    """Embed JD text into a dense vector."""
    model = _model()
    req_skills = ", ".join(state.get("jd_fields", {}).get("required_skills", []) or [])
    combined = f"{state['jd_text']}\n\nRequired skills: {req_skills}"
    embedding = model.encode(combined, normalize_embeddings=True).tolist()
    return {"jd_embedding": embedding}
