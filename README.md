# NexScreen: AI-Powered Resume Screening

NexScreen is a full-stack, production-ready resume scoring platform that uses semantic AI to calibrate candidate resumes against job descriptions instantly. 

Built with **Next.js**, **FastAPI**, **LangGraph**, and **Groq (Llama)**, NexScreen breaks down candidate suitability by analyzing semantic meaning, keyword overlap, and holistic fit—presenting everything in a sleek, glassmorphic UI.

---

## 🚀 Features
- **Semantic Understanding**: Move beyond exact keyword matches. The AI extracts the true context behind every bullet point.
- **Precision Scoring**: A multi-faceted calibration dial powered by a configurable matrix of semantic similarity and holistic LLM assessment.
- **Actionable Insights**: Instant feedback detailing matched competencies, identified gaps, and granular scoring breakdowns.
- **Sleek UI Dashboard**: A premium, animated frontend (Framer Motion + Tailwind CSS v4) mapping the entire LangGraph AI pipeline securely.

---

## 🏗️ Architecture

NexScreen is divided into a robust microservice architecture:

| Component | Technology | Description |
|-----------|-----------|-------------|
| **Frontend** | Next.js (App Router), Tailwind V4, Framer Motion | The beautiful orchestration layer for analysts to upload resumes and process analytics. |
| **Backend** | Python, FastAPI, LangGraph, SentenceTransformers | A high-performance inference engine combining deterministic ML embeddings and LLMs. |

---

## 🛠️ Quickstart (Docker Recommended)

The easiest way to run both the Frontend and the Backend seamlessly is via Docker.

### 1. Configure the AI Keys
Create an environment file for the backend and set your Groq API keys:
```bash
cp backend/.env.example backend/.env
```
Ensure your `backend/.env` has:
- `GROQ_API_KEY`: Fetch from [Groq Console](https://console.groq.com/keys)

### 2. Boot the Pipeline
From the root of the project, run:
```bash
docker compose up --build
```
*Docker will build the lightweight Alpine Node.js frontend and the Python 3.11 backend simultaneously, linking their networks.*

### 3. Open the UI
Navigate to **[http://localhost:3000](http://localhost:3000)** in your browser to access the NexScreen dashboard.

---

## 💻 Manual Local Development

If you prefer to run the components independently without Docker, follow these instructions:

### Backend (FastAPI)
```bash
cd backend
python -m venv .venv
source .venv/bin/activate       # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn run:app --reload
# Runs on localhost:8000
```
*(You can also use the backend purely via CLI: `python run.py --resume path.pdf --jd path.pdf`)*

### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
# Runs on localhost:3000
```

---

## ⚙️ Scoring Algorithm config (`backend/.env`)

The final matching score is mathematically aggregated. By default, it uses:
- **45% Semantic Similarity** (Cosine distance of chunk embeddings)
- **35% LLM Judge** (Holistic, cognitive reasoning of fit)
- **20% Keyword Overlap** (Jaccard similarity on hard skills)

You can tune this at any time by editing the weights in `backend/.env`!
