


# Resume ↔ JD Scorer

A production-quality resume scoring pipeline built with **LangGraph**, **LangChain**, and **Groq (Llama)**.  
Traces every step automatically in **LangSmith**.

---

## Architecture

```
[PDF Resume] ──► parse ──► extract fields ──► embed ──┐
                                                        ├──► semantic match ──► LLM judge ──► score
[PDF JD]     ──► parse ──► extract fields ──► embed ──┘
```
https://github.com/user-attachments/assets/73ccc804-0635-4bc7-9c17-b93e4672e7f2

Two parallel branches process the resume and JD independently,  
then converge at the semantic matching node.

**Score = 60% semantic similarity + 40% LLM judge**  
(Weights configurable in `.env`)

---

## Setup

### 1. Clone / copy the project

```bash
cd resume_jd_scorer
```

### 2. Create a virtual environment

```bash
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure API keys

```bash
cp .env.example .env
```

Edit `.env` and fill in:

| Variable            | Where to get it                    |
| ------------------- | ---------------------------------- |
| `GROQ_API_KEY`      | https://console.groq.com/keys      |
| `LANGCHAIN_API_KEY` | https://smith.langchain.com (free) |

LangSmith is optional but **highly recommended** — it traces every node so you can debug prompts visually.

---

## Usage

```bash
# Basic run
python app.py --resume path/to/resume.pdf --jd path/to/jd.pdf

# Save output to JSON
python app.py --resume resume.pdf --jd jd.pdf --output result.json
```

### Example output

```json
{
  "final_score": 78.4,
  "band": "Strong fit",
  "components": {
    "semantic_similarity": {
      "score": 81.2,
      "weight": 0.45,
      "contribution": 36.5
    },
    "llm_holistic_judge": {
      "score": 74.0,
      "weight": 0.35,
      "contribution": 25.9
    },
    "keyword_overlap": { "score": 80.3, "weight": 0.2, "contribution": 16.1 }
  },
  "skill_analysis": {
    "matched_skills": ["Python", "FastAPI", "PostgreSQL", "Docker"],
    "missing_skills": ["Kubernetes", "Terraform"],
    "match_rate": "66.7%"
  },
  "llm_assessment": {
    "reasoning": "Strong backend Python background with 4 years experience...",
    "strengths": [
      "Solid Python/FastAPI experience",
      "PostgreSQL expertise",
      "System design skills"
    ],
    "concerns": ["No Kubernetes experience", "Limited DevOps background"]
  },
  "suggestions": [
    "Add a Kubernetes side project or certification to address the main gap",
    "Highlight any cloud deployment work even if informal",
    "Quantify impact in current role descriptions"
  ]
}
```

---

## Project structure

```
resume_jd_scorer/
├── config.py                  # All config from .env, zero hardcoded values
├── state.py                   # LangGraph TypedDict state
├── pipeline.py                # StateGraph definition and compilation
├── run.py                     # CLI entry point
├── requirements.txt
├── .env.example
├── nodes/
│   ├── parse_node.py          # PDF text extraction (PyMuPDF)
│   ├── extract_node.py        # LLM structured field extraction
│   ├── embed_node.py          # SentenceTransformer embeddings
│   ├── semantic_score_node.py # Cosine similarity + keyword overlap
│   ├── llm_judge_node.py      # Groq LLM holistic fit judge
│   └── score_node.py          # Weighted score aggregation
└── utils/
    ├── pdf_parser.py          # PyMuPDF wrapper
    └── keyword_scorer.py      # Jaccard keyword overlap
```

---

## Tuning scores

Edit `.env` to adjust weights (must sum to 1.0):

```env
SEMANTIC_WEIGHT=0.60
LLM_WEIGHT=0.40
```

Change the Groq model:

```env
GROQ_MODEL=llama-3.3-70b-versatile  # higher quality, slower
GROQ_MODEL=llama-3.1-8b-instant     # default — fast and cheap
```

---

## LangSmith tracing

When `LANGCHAIN_TRACING_V2=true` and `LANGCHAIN_API_KEY` are set,  
every pipeline run appears at https://smith.langchain.com with:

- Full input/output per node
- Token usage and latency per LLM call
- Error traces with full stack

---

## Extending the pipeline

| What to add                    | Where                                   |
| ------------------------------ | --------------------------------------- |
| ATS keyword boost scoring      | `nodes/semantic_score_node.py`          |
| Cover letter generation        | New node after `aggregate_score`        |
| Role-specific rubrics          | `nodes/llm_judge_node.py` prompt        |
| Batch scoring multiple resumes | `run.py` loop over `pipeline.invoke`    |
| FastAPI endpoint               | New `api.py` wrapping `pipeline.invoke` |
