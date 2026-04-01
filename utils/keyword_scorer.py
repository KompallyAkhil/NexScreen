"""
utils/keyword_scorer.py — lightweight keyword overlap scorer.

Tokenises both texts, removes stopwords, then computes
Jaccard similarity between the two token sets scaled to 0–100.
"""
from __future__ import annotations
import re

_STOPWORDS = {
    "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "is", "are", "was", "were", "be", "been",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "shall", "can", "not", "no", "nor", "so",
    "yet", "both", "either", "neither", "as", "if", "than", "that", "this",
    "we", "you", "he", "she", "it", "they", "i", "my", "your", "our",
}


def _tokenise(text: str) -> set[str]:
    tokens = re.findall(r"[a-z][a-z0-9+#.]*", text.lower())
    return {t for t in tokens if t not in _STOPWORDS and len(t) > 1}


def keyword_overlap_score(resume_text: str, jd_text: str) -> float:
    """
    Jaccard similarity between resume and JD token sets, scaled to 0–100.

    Returns:
        Float in [0, 100].
    """
    resume_tokens = _tokenise(resume_text)
    jd_tokens = _tokenise(jd_text)

    if not jd_tokens:
        return 0.0

    intersection = resume_tokens & jd_tokens
    union = resume_tokens | jd_tokens

    jaccard = len(intersection) / len(union)
    # Jaccard tends to be low even for good matches; scale it generously
    # (cap at 1.0 before multiplying)
    return round(min(jaccard * 3.5, 1.0) * 100, 2)


def matched_and_missing(
    resume_skills: list[str], jd_required: list[str], jd_preferred: list[str]
) -> tuple[list[str], list[str]]:
    """
    Compare skill lists (case-insensitive substring match).

    Returns:
        (matched_skills, missing_skills)
    """
    resume_lower = {s.lower() for s in resume_skills}
    all_jd = jd_required + jd_preferred

    matched: list[str] = []
    missing: list[str] = []

    for skill in all_jd:
        skill_l = skill.lower()
        # partial match: "python" matches "python 3", "pytorch" etc.
        if any(skill_l in r or r in skill_l for r in resume_lower):
            matched.append(skill)
        else:
            missing.append(skill)

    return matched, missing
