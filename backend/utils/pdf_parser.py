from __future__ import annotations
import fitz  # PyMuPDF


def extract_text_from_pdf(pdf_path: str) -> str:
    """
    Extract all text from a PDF file.

    Args:
        pdf_path: Absolute or relative path to the PDF.

    Returns:
        Cleaned, joined text string.

    Raises:
        FileNotFoundError: if the path does not exist.
        RuntimeError: if extraction yields no text at all.
    """
    doc = fitz.open(pdf_path)
    pages: list[str] = []

    for page in doc:
        text = page.get_text("text")        # plain-text extraction
        if text.strip():
            pages.append(text.strip())

    doc.close()

    if not pages:
        raise RuntimeError(
            f"No extractable text found in '{pdf_path}'. "
            "The PDF may be image-only — consider adding OCR support."
        )
    # print("\n\n".join(pages))

    return "\n\n".join(pages)
