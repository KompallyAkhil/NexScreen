from __future__ import annotations
import argparse
import json
import sys
import tempfile
from pathlib import Path

from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich import box

from pipeline import pipeline
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(title="Resume Scorer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
console = Console()


# ── FastAPI Routes ─────────────────────────────────────────────────────────────

@app.post("/score")
async def score_resume(
    resume: UploadFile = File(..., description="Resume PDF"),
    jd:     UploadFile = File(..., description="Job Description PDF or plain text"),
):
    if not resume.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail=f"Expected a PDF for resume, got: {resume.filename}"
        )

    jd_ext = Path(jd.filename).suffix.lower() if jd.filename else ""
    if jd_ext not in (".pdf", ".txt", ""):
        raise HTTPException(
            status_code=400,
            detail=f"Expected a PDF or plain-text file for job description, got: {jd.filename}"
        )
        
    jd_is_text = jd_ext != ".pdf"

    with tempfile.TemporaryDirectory() as tmpdir:
        tmp = Path(tmpdir)

        resume_path = tmp / "resume.pdf"
        jd_suffix   = ".txt" if jd_is_text else ".pdf"
        jd_path     = tmp / f"jd{jd_suffix}"

        resume_path.write_bytes(await resume.read())
        jd_path.write_bytes(await jd.read())

        try:
            result: dict = pipeline.invoke({
                "resume_pdf_path": str(resume_path),
                "jd_pdf_path":     str(jd_path),
            })
        except Exception as exc:
            raise HTTPException(status_code=500, detail=f"Pipeline error: {exc}")

    breakdown = result.get("score_breakdown", {})
    return JSONResponse(content=breakdown)


@app.get("/health")
def health():
    return {"status": "ok"}


def _validate_path(p: str, label: str) -> str:
    path = Path(p)
    if not path.exists():
        console.print(f"[red]✗ {label} not found: {p}[/red]")
        sys.exit(1)
    if path.suffix.lower() != ".pdf":
        console.print(f"[yellow]⚠ {label} is not a .pdf file. Proceeding anyway.[/yellow]")
    return str(path.resolve())


def _print_result(breakdown: dict) -> None:
    score = breakdown["final_score"]
    band  = breakdown["band"]

    colour = (
        "green"  if score >= 75 else
        "yellow" if score >= 50 else
        "red"
    )

    console.print(Panel(
        f"[bold {colour}]{score} / 100[/bold {colour}]  —  {band}",
        title="[bold]Resume ↔ JD Match Score[/bold]",
        expand=False,
    ))

    t = Table(box=box.SIMPLE_HEAD, show_header=True)
    t.add_column("Component",    style="dim")
    t.add_column("Score",        justify="right")
    t.add_column("Weight",       justify="right")
    t.add_column("Contribution", justify="right")

    for name, vals in breakdown["components"].items():
        t.add_row(
            name.replace("_", " ").title(),
            f"{vals['score']:.1f}",
            f"{vals['weight']:.0%}",
            f"{vals['contribution']:.1f}",
        )
    console.print(t)

    sa = breakdown["skill_analysis"]
    console.print(f"[green]✓ Matched skills ({len(sa['matched_skills'])}):[/green] "
                  + ", ".join(sa["matched_skills"] or ["—"]))
    console.print(f"[red]✗ Missing skills ({len(sa['missing_skills'])}):[/red] "
                  + ", ".join(sa["missing_skills"] or ["—"]))
    console.print(f"  Skill match rate: [bold]{sa['match_rate']}[/bold]\n")

    llm = breakdown["llm_assessment"]
    if llm.get("reasoning"):
        console.print(Panel(llm["reasoning"], title="LLM Assessment", expand=False))
    if llm.get("strengths"):
        console.print("[bold green]Strengths:[/bold green]")
        for s in llm["strengths"]:
            console.print(f"  + {s}")
    if llm.get("concerns"):
        console.print("[bold red]Concerns:[/bold red]")
        for c in llm["concerns"]:
            console.print(f"  - {c}")

    if breakdown.get("suggestions"):
        console.print("\n[bold]Suggestions to improve fit:[/bold]")
        for i, s in enumerate(breakdown["suggestions"], 1):
            console.print(f"  {i}. {s}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Score a resume against a job description.")
    parser.add_argument("--resume",  required=True, help="Path to resume PDF")
    parser.add_argument("--jd",      required=True, help="Path to job description PDF")
    parser.add_argument("--output",  default=None,  help="Optional: save JSON output to this file")
    args = parser.parse_args()

    resume_path = _validate_path(args.resume, "Resume")
    jd_path     = _validate_path(args.jd,     "Job description")

    console.print(f"\n[dim]Running pipeline…[/dim]")
    console.print(f"  Resume : {resume_path}")
    console.print(f"  JD     : {jd_path}\n")

    try:
        result: dict = pipeline.invoke({
            "resume_pdf_path": resume_path,
            "jd_pdf_path":     jd_path,
        })
    except Exception as exc:
        console.print(f"[red bold]Pipeline error:[/red bold] {exc}")
        raise

    breakdown = result.get("score_breakdown", {})
    _print_result(breakdown)

    if args.output:
        out_path = Path(args.output)
        out_path.write_text(json.dumps(breakdown, indent=2))
        console.print(f"\n[dim]JSON saved to {out_path}[/dim]")
    else:
        console.print("\n[dim]── Raw JSON output ──[/dim]")
        console.print_json(json.dumps(breakdown))


if __name__ == "__main__":
    main()