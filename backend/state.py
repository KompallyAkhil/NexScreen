"""
state.py — the single TypedDict that flows through every LangGraph node.

Every node reads from and writes to this dict. LangGraph passes it
automatically between nodes — no manual plumbing needed.
"""
from __future__ import annotations
from typing import Optional
from typing_extensions import TypedDict


class ResumeJDState(TypedDict, total=False):
    # ── Raw inputs ─────────────────────────────────────────────────────────────
    resume_pdf_path: str          # absolute path to resume PDF
    jd_pdf_path: str              # absolute path to JD PDF

    # ── Extracted text ─────────────────────────────────────────────────────────
    resume_text: str
    jd_text: str

    # ── Structured fields (extracted by LLM) ───────────────────────────────────
    resume_fields: dict           # {name, skills, experience, education, summary}
    jd_fields: dict               # {title, required_skills, preferred_skills, experience_required, responsibilities}

    # ── Embeddings ─────────────────────────────────────────────────────────────
    resume_embedding: list[float]
    jd_embedding: list[float]

    # ── Intermediate scores ────────────────────────────────────────────────────
    semantic_score: float         # cosine similarity 0–100
    keyword_score: float          # token overlap 0–100
    llm_score: float              # LLM judge 0–100
    llm_reasoning: str            # LLM explanation

    # ── Final output ───────────────────────────────────────────────────────────
    final_score: float
    score_breakdown: dict
    matched_skills: list[str]
    missing_skills: list[str]
    suggestions: list[str]
    error: Optional[str]
