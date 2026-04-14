from __future__ import annotations
from typing import Optional
from typing_extensions import TypedDict


class ResumeJDState(TypedDict, total=False):
    resume_pdf_path: str          # absolute path to resume PDF
    jd_pdf_path: str              # absolute path to JD PDF

    resume_text: str
    jd_text: str

    resume_fields: dict           # {name, skills, experience, education, summary}
    jd_fields: dict               # {title, required_skills, preferred_skills, experience_required, responsibilities}

    resume_embedding: list[float]
    jd_embedding: list[float]

    semantic_score: float         # cosine similarity 0–100
    llm_score: float              # LLM judge 0–100
    llm_reasoning: str            # LLM explanation

    final_score: float
    score_breakdown: dict
    matched_skills: list[str]
    missing_skills: list[str]
    suggestions: list[str]
    error: Optional[str]
