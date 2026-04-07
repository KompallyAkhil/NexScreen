"""
nodes/parse_node.py — Node 1 (runs twice in parallel branches).

Reads both PDFs and stores raw text in the state.
LangGraph runs parse_resume and parse_jd as separate nodes so
LangSmith traces them independently.
"""
from __future__ import annotations
from state import ResumeJDState
from utils.pdf_parser import extract_text_from_pdf


def parse_resume(state: ResumeJDState) -> ResumeJDState:
    """Extract text from the resume PDF."""
    path = state["resume_pdf_path"]
    text = extract_text_from_pdf(path)
    return {"resume_text": text}


def parse_jd(state: ResumeJDState) -> ResumeJDState:
    """Extract text from the job description PDF."""
    path = state["jd_pdf_path"]
    text = extract_text_from_pdf(path)
    return {"jd_text": text}
