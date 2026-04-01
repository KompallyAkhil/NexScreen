"""
nodes/score_node.py — Node 6 (terminal node).

Combines semantic_score, keyword_score, and llm_score using
configurable weights from config.py, then builds the final
JSON output object.

Score bands:
  90–100  → Excellent fit
  75–89   → Strong fit
  60–74   → Good fit, some gaps
  45–59   → Partial fit, significant gaps
  0–44    → Poor fit
"""
from __future__ import annotations
import config
from state import ResumeJDState


_BANDS = [
    (90, "Excellent fit"),
    (75, "Strong fit"),
    (60, "Good fit — some gaps"),
    (45, "Partial fit — significant gaps"),
    (0,  "Poor fit"),
]


def _band(score: float) -> str:
    for threshold, label in _BANDS:
        if score >= threshold:
            return label
    return "Poor fit"


def aggregate_score(state: ResumeJDState) -> ResumeJDState:
    """Weighted combination of all three scores → final output."""

    w_s = config.SEMANTIC_WEIGHT
    w_l = config.LLM_WEIGHT
    w_k = config.KEYWORD_WEIGHT

    semantic = state.get("semantic_score", 0.0)
    llm      = state.get("llm_score", 0.0)
    keyword  = state.get("keyword_score", 0.0)

    final = round(w_s * semantic + w_l * llm + w_k * keyword, 2)

    # ── Experience gap flag ───────────────────────────────────────────────────
    candidate_exp = state.get("resume_fields", {}).get("experience_years", 0)
    required_exp  = state.get("jd_fields", {}).get("experience_required", 0)
    exp_gap = max(0.0, float(required_exp) - float(candidate_exp))

    score_breakdown = {
        "final_score":      final,
        "band":             _band(final),
        "components": {
            "semantic_similarity": {
                "score":  semantic,
                "weight": w_s,
                "contribution": round(w_s * semantic, 2),
            },
            "llm_holistic_judge": {
                "score":  llm,
                "weight": w_l,
                "contribution": round(w_l * llm, 2),
            },
            "keyword_overlap": {
                "score":  keyword,
                "weight": w_k,
                "contribution": round(w_k * keyword, 2),
            },
        },
        "candidate": {
            "name":             state.get("resume_fields", {}).get("name", "Unknown"),
            "experience_years": candidate_exp,
            "skills_count":     len(state.get("resume_fields", {}).get("skills", [])),
        },
        "job": {
            "title":              state.get("jd_fields", {}).get("title", "Unknown"),
            "seniority":          state.get("jd_fields", {}).get("seniority", "Unknown"),
            "experience_required": required_exp,
        },
        "skill_analysis": {
            "matched_skills": state.get("matched_skills", []),
            "missing_skills": state.get("missing_skills", []),
            "match_rate":     _skill_match_rate(
                state.get("matched_skills", []),
                state.get("missing_skills", [])
            ),
        },
        "experience_gap_years": exp_gap,
        "llm_assessment": {
            "reasoning":   state.get("llm_reasoning", ""),
            "strengths":   state.get("_llm_strengths", []),
            "concerns":    state.get("_llm_concerns", []),
        },
        "suggestions": state.get("suggestions", []),
        "weights_used": {"semantic": w_s, "llm": w_l, "keyword": w_k},
    }

    return {
        "final_score":    final,
        "score_breakdown": score_breakdown,
    }


def _skill_match_rate(matched: list, missing: list) -> str:
    total = len(matched) + len(missing)
    if total == 0:
        return "N/A"
    rate = len(matched) / total * 100
    return f"{round(rate, 1)}%"
