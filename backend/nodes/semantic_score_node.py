from __future__ import annotations
import numpy as np
from state import ResumeJDState
from utils.llm_skill_mapper import map_skills_with_llm


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

    # ── Skill gap analysis ────────────────────────────────────────────────────
    resume_skills = state.get("resume_fields", {}).get("skills", [])
    jd_required   = state.get("jd_fields", {}).get("required_skills", [])
    jd_preferred  = state.get("jd_fields", {}).get("preferred_skills", [])

    all_jd_skills = jd_required + jd_preferred
    matched, missing = map_skills_with_llm(resume_skills, all_jd_skills)

    return {
        "semantic_score": semantic_score,
        "matched_skills": matched,
        "missing_skills": missing,
    }
