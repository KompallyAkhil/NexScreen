from __future__ import annotations
import json
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from pydantic import BaseModel, Field
import config
from state import ResumeJDState


# ── Pydantic schemas ──────────────────────────────────────────────────────────

class ResumeFields(BaseModel):
    name: str = Field(description="Candidate full name, or 'Unknown'")
    skills: list[str] = Field(description="All technical and soft skills mentioned")
    experience_years: float = Field(description="Total years of explicit full-time post-graduation work experience. MUST be 0 if the resume implies the person is a student, or if experience solely consists of college projects.")
    education: list[str] = Field(description="Degrees and institutions")
    job_titles: list[str] = Field(description="Previous job titles held")
    summary: str = Field(description="2-sentence professional summary of the candidate")


class JDFields(BaseModel):
    title: str = Field(description="Job title being hired for")
    required_skills: list[str] = Field(description="Must-have skills explicitly stated")
    preferred_skills: list[str] = Field(description="Nice-to-have or preferred skills")
    experience_required: float = Field(description="Minimum years of experience required, 0 if not stated")
    responsibilities: list[str] = Field(description="Key responsibilities (max 8)")
    seniority: str = Field(description="Seniority level: intern/junior/mid/senior/lead/manager")


# ── LLM setup ─────────────────────────────────────────────────────────────────

def _llm() -> ChatGroq:
    return ChatGroq(
        model=config.GROQ_MODEL,
        api_key=config.GROQ_API_KEY,
        temperature=0.5,
    )


def _parse_json_safely(raw: str, model_cls):
    """Strip markdown fences and parse JSON, falling back to Pydantic defaults."""
    # Strip ```json ... ``` or ``` ... ```
    text = raw.strip()
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
        text = text.strip()
    return model_cls.model_validate(json.loads(text))


# ── Resume extraction ─────────────────────────────────────────────────────────

_RESUME_PROMPT = ChatPromptTemplate.from_messages([
    ("system",
        "You are a resume parser. Extract structured information from the resume. "
        "Return ONLY a raw JSON object — no markdown fences, no ``` wrappers, no explanation. "
        "The JSON must match the fields described below exactly."
    ),
    ("human",
        "Fields to extract:\n"
        "- name (string): Candidate full name, or 'Unknown'\n"
        "- skills (array of strings): All technical and soft skills mentioned. CRITICAL: Extract as short, specific keywords (e.g. 'Java', 'SQL') rather than long phrases.\n"
        "- experience_years (number): Total years of explicit full-time post-graduation work experience. MUST be 0 if the resume implies the person is a student, or if experience solely consists of college projects.\n"
        "- education (array of strings): Degrees and institutions\n"
        "- job_titles (array of strings): Previous job titles held\n"
        "- summary (string): 2-sentence professional summary of the candidate\n\n"
        "Resume text:\n{resume_text}\n\n"
        "Return raw JSON:"
    ),
])


def extract_resume_fields(state: ResumeJDState) -> ResumeJDState:
    """LLM-powered structured extraction from resume text."""
    chain = _RESUME_PROMPT | _llm() | StrOutputParser()
    raw = chain.invoke({"resume_text": state["resume_text"]})
    result = _parse_json_safely(raw, ResumeFields)
    return {"resume_fields": result.model_dump()}


# ── JD extraction ─────────────────────────────────────────────────────────────

_JD_PROMPT = ChatPromptTemplate.from_messages([
    ("system",
        "You are a job description analyst. Extract structured requirements from the job description. "
        "Return ONLY a raw JSON object — no markdown fences, no ``` wrappers, no explanation. "
        "The JSON must match the fields described below exactly."
    ),
    ("human",
        "Fields to extract:\n"
        "- title (string): Job title being hired for\n"
        "- required_skills (array of strings): Must-have skills explicitly stated. CRITICAL: Extract only short, specific tech keywords (e.g. 'Git', 'MongoDB', 'React'). Do NOT extract broad sentences like 'web fundamentals'. Break generic terms into specific keywords.\n"
        "- preferred_skills (array of strings): Nice-to-have skills. Also extract only short, specific tech keywords.\n"
        "- experience_required (number): Minimum years of experience required, 0 if not stated\n"
        "- responsibilities (array of strings): Key responsibilities, max 8 items\n"
        "- seniority (string): One of intern/junior/mid/senior/lead/manager\n\n"
        "Job description text:\n{jd_text}\n\n"
        "Return raw JSON:"
    ),
])


def extract_jd_fields(state: ResumeJDState) -> ResumeJDState:
    """LLM-powered structured extraction from JD text."""
    chain = _JD_PROMPT | _llm() | StrOutputParser()
    raw = chain.invoke({"jd_text": state["jd_text"]})
    result = _parse_json_safely(raw, JDFields)
    return {"jd_fields": result.model_dump()}