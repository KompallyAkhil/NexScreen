"""Debug script: tests the JD extraction node directly."""
from dotenv import load_dotenv
load_dotenv()

import config
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field

from utils.pdf_parser import extract_text_from_pdf as extract_text
import json

class JDFields(BaseModel):
    title: str = Field(description="Job title being hired for")
    required_skills: list[str] = Field(description="Must-have skills explicitly stated")
    preferred_skills: list[str] = Field(description="Nice-to-have or preferred skills")
    experience_required: float = Field(description="Minimum years of experience required, 0 if not stated")
    responsibilities: list[str] = Field(description="Key responsibilities (max 8)")
    seniority: str = Field(description="Seniority level: intern/junior/mid/senior/lead/manager")

jd_text = extract_text("JSD.pdf")
print("JD text length:", len(jd_text))
print("JD text preview:", jd_text[:500])

llm = ChatGroq(model=config.GROQ_MODEL, api_key=config.GROQ_API_KEY, temperature=0)
parser = JsonOutputParser(pydantic_object=JDFields)

prompt = ChatPromptTemplate.from_messages([
    ("system", (
        "You are a job description analyst. Extract structured requirements from the JD below. "
        "Return ONLY valid JSON matching the schema exactly. No markdown, no explanation."
    )),
    ("human", (
        "Schema:\n{schema}\n\n"
        "Job description text:\n{jd_text}\n\n"
        "Return JSON:"
    )),
])

chain = prompt | llm | parser
result = chain.invoke({
    "schema": JDFields.model_json_schema(),
    "jd_text": jd_text,
})

print("\n=== JD EXTRACTION RESULT ===")
print(json.dumps(result, indent=2))
