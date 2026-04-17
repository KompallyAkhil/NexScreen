
from __future__ import annotations
import json
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from pydantic import BaseModel, Field
import config
from state import ResumeJDState


class LLMJudgeOutput(BaseModel):
    score: float = Field(description="Overall fit score from 0 to 100")
    strengths: list[str] = Field(description="Top 3 strengths of the candidate for this role")
    concerns: list[str] = Field(description="Top 3 concerns or gaps")
    suggestions: list[str] = Field(description="3 actionable suggestions for the candidate to improve fit")
    reasoning: str = Field(description="2-3 sentence overall assessment")


def _parse_json_safely(raw: str) -> dict:
    """Strip markdown fences and parse JSON safely."""
    text = raw.strip()
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
        text = text.strip()
    return json.loads(text)


_JUDGE_PROMPT = ChatPromptTemplate.from_messages([
    ("system",
        "You are a senior technical hiring manager with 15 years of experience. "
        "Evaluate how well a candidate fits a job description. Be honest and precise. "
        "Return ONLY a raw JSON object — no markdown fences, no ``` wrappers, no explanation.\n\n"
        "Fields to return:\n"
        "- score (number 0-100): Overall fit score\n"
        "- strengths (array of 3 strings): Top 3 strengths of the candidate\n"
        "- concerns (array of 3 strings): Top 3 concerns or gaps\n"
        "- suggestions (array of 3 strings): Actionable suggestions to improve fit\n"
        "- reasoning (string): 2-3 sentence overall assessment"
    ),
    ("human",
        "## Job Description\n"
        "Title: {jd_title}\n"
        "Seniority: {seniority}\n"
        "Required skills: {required_skills}\n"
        "Preferred skills: {preferred_skills}\n"
        "Experience required: {exp_required} years\n"
        "Responsibilities: {responsibilities}\n\n"

        "## Candidate\n"
        "Name: {candidate_name}\n"
        "Skills: {candidate_skills}\n"
        "Experience: {candidate_exp} years\n"
        "Previous roles: {job_titles}\n"
        "Education: {education}\n"
        "Summary: {summary}\n\n"

        "## Already matched skills\n{matched}\n\n"
        "## Missing skills\n{missing}\n\n"

        "Return raw JSON:"
    ),
])


def llm_judge(state: ResumeJDState) -> ResumeJDState:
    """Groq-powered holistic fit assessment."""
    jd = state.get("jd_fields", {})
    rf = state.get("resume_fields", {})

    llm = ChatGroq(
        model=config.GROQ_MODEL,
        api_key=config.GROQ_API_KEY,
        temperature=0.5,
    )
    chain = _JUDGE_PROMPT | llm | StrOutputParser()

    raw = chain.invoke({
        "jd_title":        jd.get("title", "N/A"),
        "seniority":       jd.get("seniority", "N/A"),
        "required_skills": ", ".join(jd.get("required_skills", []) or []),
        "preferred_skills": ", ".join(jd.get("preferred_skills", []) or []),
        "exp_required":    jd.get("experience_required", 0),
        "responsibilities": "\n".join(f"- {r}" for r in (jd.get("responsibilities", []) or [])),
        "candidate_name":  rf.get("name", "Unknown"),
        "candidate_skills": ", ".join(rf.get("skills", []) or []),
        "candidate_exp":   rf.get("experience_years", 0),
        "job_titles":      ", ".join(rf.get("job_titles", []) or []),
        "education":       ", ".join(rf.get("education", []) or []),
        "summary":         rf.get("summary", ""),
        "matched":         ", ".join(state.get("matched_skills", []) or []),
        "missing":         ", ".join(state.get("missing_skills", []) or []),
    })

    result = _parse_json_safely(raw)

    return {
        "llm_score":     round(float(result.get("score", 0)), 2),
        "llm_reasoning": result.get("reasoning", ""),
        "suggestions":   result.get("suggestions", []),
        "matched_skills": state.get("matched_skills", []),
        "missing_skills": state.get("missing_skills", []),
        "_llm_strengths": result.get("strengths", []),
        "_llm_concerns":  result.get("concerns", []),
    }
