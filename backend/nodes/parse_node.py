from __future__ import annotations
from pathlib import Path
from state import ResumeJDState
from utils.pdf_parser import extract_text_from_pdf


def parse_resume(state: ResumeJDState) -> ResumeJDState:
    """Extract text from the resume PDF."""
    path = state["resume_pdf_path"]
    text = extract_text_from_pdf(path)
    return {"resume_text": text}


def parse_jd(state: ResumeJDState) -> ResumeJDState:
    """Extract text from the job description — supports both PDF and plain text."""
    path = state["jd_pdf_path"]
    if Path(path).suffix.lower() == ".txt":
        # Plain-text JD pasted by the user
        text = Path(path).read_text(encoding="utf-8", errors="replace").strip()
        if not text:
            raise RuntimeError("The pasted job description is empty.")
    else:
        text = extract_text_from_pdf(path)
    return {"jd_text": text}
