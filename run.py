"""
run.py — CLI entry point.

Usage:
    python run.py --resume path/to/resume.pdf --jd path/to/jd.pdf
    python run.py --resume resume.pdf --jd jd.pdf --output result.json
"""
from __future__ import annotations
import argparse
import json
import sys
from pathlib import Path

from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich import box

from pipeline import pipeline

console = Console()


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

    # ── Header panel ─────────────────────────────────────────────────────────
    console.print(Panel(
        f"[bold {colour}]{score} / 100[/bold {colour}]  —  {band}",
        title="[bold]Resume ↔ JD Match Score[/bold]",
        expand=False,
    ))

    # ── Score components table ────────────────────────────────────────────────
    t = Table(box=box.SIMPLE_HEAD, show_header=True)
    t.add_column("Component",     style="dim")
    t.add_column("Score",         justify="right")
    t.add_column("Weight",        justify="right")
    t.add_column("Contribution",  justify="right")

    for name, vals in breakdown["components"].items():
        t.add_row(
            name.replace("_", " ").title(),
            f"{vals['score']:.1f}",
            f"{vals['weight']:.0%}",
            f"{vals['contribution']:.1f}",
        )
    console.print(t)

    # ── Skill analysis ────────────────────────────────────────────────────────
    sa = breakdown["skill_analysis"]
    console.print(f"[green]✓ Matched skills ({len(sa['matched_skills'])}):[/green] "
                  + ", ".join(sa["matched_skills"] or ["—"]))
    console.print(f"[red]✗ Missing skills ({len(sa['missing_skills'])}):[/red] "
                  + ", ".join(sa["missing_skills"] or ["—"]))
    console.print(f"  Skill match rate: [bold]{sa['match_rate']}[/bold]\n")

    # ── LLM assessment ────────────────────────────────────────────────────────
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

    # ── Suggestions ───────────────────────────────────────────────────────────
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
