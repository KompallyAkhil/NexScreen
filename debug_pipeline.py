"""Debug script: runs the full pipeline and prints interim state values."""
from dotenv import load_dotenv
load_dotenv()

from pipeline import pipeline

result = pipeline.invoke({
    "resume_pdf_path": "AkhilKompally.pdf",
    "jd_pdf_path": "JSD.pdf",
})

print("\n=== RESUME FIELDS ===")
rf = result.get("resume_fields", {})
print("Name:", rf.get("name"))
print("Skills:", rf.get("skills"))
print("Experience:", rf.get("experience_years"))

print("\n=== JD FIELDS ===")
jd = result.get("jd_fields", {})
print("Title:", jd.get("title"))
print("Required skills:", jd.get("required_skills"))
print("Experience required:", jd.get("experience_required"))

print("\n=== SCORES ===")
print("Semantic:", result.get("semantic_score"))
print("Keyword:", result.get("keyword_score"))
print("LLM:", result.get("llm_score"))

print("\n=== SKILLS ===")
print("Matched:", result.get("matched_skills"))
print("Missing:", result.get("missing_skills"))

print("\n=== LLM REASONING ===")
print(result.get("llm_reasoning"))
