from __future__ import annotations
from langgraph.graph import StateGraph, END

from state import ResumeJDState
from nodes.parse_node import parse_resume, parse_jd
from nodes.extract_node import extract_resume_fields, extract_jd_fields
from nodes.embed_node import embed_resume, embed_jd
from nodes.semantic_score_node import compute_semantic_score
from nodes.llm_judge_node import llm_judge
from nodes.score_node import aggregate_score


def build_pipeline() -> StateGraph:
    """
    Construct and compile the LangGraph pipeline.

    Returns:
        A compiled LangGraph app ready to invoke.
    """
    graph = StateGraph(ResumeJDState)

    # ── Register nodes ────────────────────────────────────────────────────────
    graph.add_node("parse_resume",           parse_resume)
    graph.add_node("parse_jd",               parse_jd)
    graph.add_node("extract_resume_fields",  extract_resume_fields)
    graph.add_node("extract_jd_fields",      extract_jd_fields)
    graph.add_node("embed_resume",           embed_resume)
    graph.add_node("embed_jd",               embed_jd)
    graph.add_node("compute_semantic_score", compute_semantic_score)
    graph.add_node("llm_judge",              llm_judge)
    graph.add_node("aggregate_score",        aggregate_score)

    graph.set_entry_point("parse_resume")

    graph.add_edge("__start__", "parse_jd")

    graph.add_edge("parse_resume",          "extract_resume_fields")
    graph.add_edge("extract_resume_fields", "embed_resume")

    graph.add_edge("parse_jd",          "extract_jd_fields")
    graph.add_edge("extract_jd_fields", "embed_jd")

    graph.add_edge("embed_resume", "compute_semantic_score")
    graph.add_edge("embed_jd",     "compute_semantic_score")

    graph.add_edge("compute_semantic_score", "llm_judge")
    graph.add_edge("llm_judge",              "aggregate_score")
    graph.add_edge("aggregate_score",        END)

    # print(graph.compile())

    return graph.compile()


pipeline = build_pipeline()
