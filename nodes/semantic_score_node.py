"""
nodes/semantic_score_node.py — Node 4.

Computes cosine similarity between resume and JD embeddings.
Both embeddings are already L2-normalised (normalize_embeddings=True
in embed_node), so cosine similarity = dot product.

Score is mapped from [-1, 1] → [0, 100].
"""
from __future__ import annotations
import numpy as np
from state import ResumeJDState
from utils.keyword_scorer import keyword_overlap_score, matched_and_missing


def compute_semantic_score(state: ResumeJDState) -> ResumeJDState:
    """
    Cosine similarity score + keyword overlap score + skill gap analysis.
    All three are cheap/local — no LLM call needed here.
    """
    # ── Cosine similarity ─────────────────────────────────────────────────────
    r_vec = np.array(state["resume_embedding"])
    j_vec = np.array(state["jd_embedding"])
    cosine = float(np.dot(r_vec, j_vec))          # already normalised
    semantic_score = round((cosine + 1) / 2 * 100, 2)   # map to 0–100

    # ── Keyword overlap ───────────────────────────────────────────────────────
    keyword_score = keyword_overlap_score(
        state["resume_text"], state["jd_text"]
    )

    # ── Skill gap analysis ────────────────────────────────────────────────────
    resume_skills = state.get("resume_fields", {}).get("skills", [])
    jd_required   = state.get("jd_fields", {}).get("required_skills", [])
    jd_preferred  = state.get("jd_fields", {}).get("preferred_skills", [])

    matched, missing = matched_and_missing(resume_skills, jd_required, jd_preferred)

    return {
        "semantic_score": semantic_score,
        "keyword_score": keyword_score,
        "matched_skills": matched,
        "missing_skills": missing,
    }
