from __future__ import annotations
import json
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
import config

def _parse_json_safely(raw: str) -> dict:
    text = raw.strip()
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
        text = text.strip()
    return json.loads(text)

_MAPPER_PROMPT = ChatPromptTemplate.from_messages([
    ("system",
        "You are an extremely strict technical recruiter analyzing technical skills. "
        "Return ONLY a raw JSON object matching the format requested without any explanations or markdown fences."
    ),
    ("human",
        "Candidate Skills:\n{resume_skills}\n\n"
        "Required JD Skills:\n{jd_skills}\n\n"
        "Task: Categorize each Required JD Skill as either matched or missing based on the Candidate Skills.\n"
        "1. A JD skill is met ONLY if the candidate has that exact skill, OR a specific tool/technology that directly belongs "
        "to that category (Example: 'MySQL' meets 'Databases', 'Git' meets 'Version control systems').\n"
        "2. BE EXTREMELY STRICT. If there is NO direct evidence for a JD requirement in the candidate's skills, it MUST be marked as missing.\n"
        "3. Do not assume the candidate knows a skill just because they know something loosely related.\n\n"
        "Return a JSON object with two exact keys:\n"
        "- 'matched_skills': array of strings (the JD skills that are strictly satisfied)\n"
        "- 'missing_skills': array of strings (the JD skills NOT satisfied)\n\n"
        "IMPORTANT: The elements in matched_skills and missing_skills MUST BE exact strings from the Required JD Skills list.\n\n"
        "Return raw JSON:"
    ),
])

def map_skills_with_llm(resume_skills: list[str], jd_skills: list[str]) -> tuple[list[str], list[str]]:
    """Uses LLM to semantically map candidate skills to JD requirements."""
    if not jd_skills:
        return [], []
        
    llm = ChatGroq(
        model=config.GROQ_MODEL,
        api_key=config.GROQ_API_KEY,
        temperature=0.0,
    )
    chain = _MAPPER_PROMPT | llm | StrOutputParser()
    
    raw = chain.invoke({
        "resume_skills": ", ".join(resume_skills) if resume_skills else "None",
        "jd_skills": ", ".join(jd_skills)
    })
    
    try:
        result = _parse_json_safely(raw)
        matched = result.get("matched_skills", [])
        missing = result.get("missing_skills", [])
    except Exception as e:
        print(f"Fallback due to JSON parse error: {e}")
        # Very basic fallback
        matched = []
        missing = jd_skills.copy()
    
    return matched, missing
