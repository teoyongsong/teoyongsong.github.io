#!/usr/bin/env python3
"""
Build the Project Digest PDF (lead magnet). Run locally or in GitHub Actions.
Output path: first arg or stdout path default ./project-digest.pdf in cwd.
"""
from __future__ import annotations

import sys
from pathlib import Path

from fpdf import FPDF


class DigestPDF(FPDF):
    def header(self) -> None:
        self.set_font("Helvetica", "B", 16)
        self.cell(0, 10, "Project Digest", ln=True)
        self.set_font("Helvetica", "", 10)
        self.set_text_color(80, 80, 80)
        self.cell(0, 6, "Top 5 AI/ML-style prototypes for business impact", ln=True)
        self.ln(4)
        self.set_text_color(0, 0, 0)

    def footer(self) -> None:
        self.set_y(-15)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(120, 120, 120)
        self.cell(0, 10, "Danny Teo | teoyongsong.github.io | Portfolio builds and demos", align="C")


def build_pdf(output: Path) -> None:
    pdf = DigestPDF()
    pdf.set_auto_page_break(auto=True, margin=18)
    pdf.set_margins(14, 14, 14)
    pdf.add_page()
    pdf.set_font("Helvetica", "", 11)
    col_w = pdf.w - pdf.l_margin - pdf.r_margin

    intro = (
        "This digest summarizes flagship demos from the portfolio: what problem they address, "
        "who benefits, and where to try a live app. Use it with stakeholders who want outcomes "
        "before technical depth."
    )
    pdf.multi_cell(col_w, 6, intro)
    pdf.ln(4)

    items = [
        (
            "1. RAG Studio (private-by-default)",
            "Business impact: Q&A over your own documents without sending content to the cloud - "
            "relevant for legal, HR, and IP-sensitive teams.",
            "Live: rag-model.streamlit.app",
        ),
        (
            "2. HDB resale price predictor",
            "Business impact: faster, evidence-backed resale conversations using public transaction patterns.",
            "Live: hdb-prices-predictor.streamlit.app",
        ),
        (
            "3. CNN waste classification",
            "Business impact: visual feedback for sorting and education - supports operations and compliance narratives.",
            "Live: cnn-waste.streamlit.app",
        ),
        (
            "4. Online retail customer segmentation",
            "Business impact: RFM-style segments with suggested CRM actions - marketing and ops alignment.",
            "Live: see project page for app link.",
        ),
        (
            "5. Once Upon (storytelling MVP)",
            "Business impact: personalized, age-aware stories - shows product and narrative beyond dashboards.",
            "Live: story-telling.streamlit.app",
        ),
    ]

    for title, body, live in items:
        pdf.set_font("Helvetica", "B", 12)
        pdf.multi_cell(col_w, 6, title)
        pdf.set_font("Helvetica", "", 11)
        pdf.multi_cell(col_w, 6, body)
        pdf.set_font("Helvetica", "I", 10)
        pdf.set_text_color(30, 80, 130)
        pdf.multi_cell(col_w, 5, live)
        pdf.set_text_color(0, 0, 0)
        pdf.ln(3)

    pdf.ln(4)
    pdf.set_font("Helvetica", "B", 11)
    pdf.multi_cell(col_w, 6, "Subscribe for new project updates")
    pdf.set_font("Helvetica", "", 10)
    pdf.multi_cell(
        col_w,
        5,
        "You received this PDF as a welcome gift after joining the new-project list at "
        "teoyongsong.github.io. Consulting and speaking: dannyteo.github.io.",
    )

    pdf.output(str(output))


def main() -> None:
    out = Path(sys.argv[1] if len(sys.argv) > 1 else "project-digest.pdf")
    build_pdf(out)
    print(out.resolve())


if __name__ == "__main__":
    main()
