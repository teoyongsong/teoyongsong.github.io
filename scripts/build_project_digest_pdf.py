#!/usr/bin/env python3
"""
Build the Project Digest PDF: Top 5 AI/ML-style prototypes for business impact
plus how flagship demos map to outcomes. Run locally or in GitHub Actions.
Output path: first arg or ./project-digest.pdf
"""
from __future__ import annotations

import sys
from pathlib import Path

from fpdf import FPDF


class DigestPDF(FPDF):
    def header(self) -> None:
        # Keep header compact; body top margin (t_margin) must clear this block.
        self.set_font("Helvetica", "B", 14)
        self.set_text_color(0, 0, 0)
        self.cell(0, 8, "Project Digest", new_x="LMARGIN", new_y="NEXT")
        self.set_font("Helvetica", "", 8)
        self.set_text_color(75, 75, 75)
        self.cell(
            0,
            4,
            "Top 5 AI/ML-style prototypes for business impact",
            new_x="LMARGIN",
            new_y="NEXT",
        )
        self.set_text_color(0, 0, 0)
        self.ln(1)

    def footer(self) -> None:
        self.set_y(-12)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(120, 120, 120)
        self.cell(0, 6, f"Page {self.page_no()} | Danny Teo | teoyongsong.github.io", align="C")


def section_title(pdf: FPDF, col_w: float, text: str) -> None:
    pdf.ln(2)
    pdf.set_x(pdf.l_margin)
    pdf.set_font("Helvetica", "B", 12)
    pdf.set_text_color(31, 45, 70)
    pdf.multi_cell(col_w, 6, text)
    pdf.set_text_color(0, 0, 0)
    pdf.ln(1)


def para(pdf: FPDF, col_w: float, text: str, size: int = 10) -> None:
    pdf.set_x(pdf.l_margin)
    pdf.set_font("Helvetica", "", size)
    pdf.multi_cell(col_w, 5, text)


def mcell(pdf: FPDF, col_w: float, line_h: float, text: str) -> None:
    """multi_cell from left margin so lines stay within printable width (avoids right-edge clipping)."""
    pdf.set_x(pdf.l_margin)
    pdf.multi_cell(col_w, line_h, text)


def build_pdf(output: Path) -> None:
    pdf = DigestPDF()
    # Wider side margins + tall top margin so header() does not overlap body text.
    pdf.set_margins(left=18, top=40, right=18)
    pdf.set_auto_page_break(auto=True, margin=18)
    pdf.add_page()
    col_w = pdf.epw

    para(
        pdf,
        col_w,
        "This digest is for leaders and peers who want proof before a long programme: five "
        "prototype patterns, each tied to a clear business outcome. Flagship builds on "
        "teoyongsong.github.io show how ideas move from sprint to something you can click, "
        "test, or pilot.",
        10,
    )
    pdf.ln(3)

    # --- Outcome mapping (flagship demos) ---
    section_title(pdf, col_w, "How flagship demos map to outcomes")
    para(
        pdf,
        col_w,
        "Use this summary to brief non-technical stakeholders: what to expect and who it helps.",
        10,
    )
    pdf.ln(2)

    mapping_rows = [
        (
            "RAG Studio",
            "Private Q&A on your own documents without sending files to the public cloud by default.",
            "Trust, speed of answers, auditability for sensitive content.",
            "Legal, HR, risk, IP-heavy teams; internal knowledge bases.",
        ),
        (
            "HDB resale price predictor",
            "Indicative resale estimates from public transaction patterns and flat attributes.",
            "Faster, evidence-backed conversations on price expectations.",
            "Buyers, sellers, agents, policy or research discussions.",
        ),
        (
            "CNN waste classification",
            "Image upload to a trained model for category-style feedback.",
            "Operational sorting support and education; visible \"so what\" from CV.",
            "Facilities, sustainability, training, compliance storytelling.",
        ),
        (
            "Online retail segmentation",
            "RFM-style clusters with suggested actions on a large retail-style dataset.",
            "Marketing and ops alignment around segments, not averages.",
            "CRM, growth, analytics teams explaining \"who\" to target.",
        ),
        (
            "Once Upon (storytelling MVP)",
            "Structured, personalized stories from child profile inputs.",
            "Engagement and product storytelling beyond charts; family-facing UX.",
            "Product, education, innovation demos to non-technical audiences.",
        ),
    ]

    for demo, mechanism, outcome, stakeholders in mapping_rows:
        pdf.set_font("Helvetica", "B", 10)
        mcell(pdf, col_w, 5, demo)
        pdf.set_font("Helvetica", "", 9)
        mcell(pdf, col_w, 4, f"Mechanism: {mechanism}")
        pdf.set_font("Helvetica", "B", 9)
        mcell(pdf, col_w, 4, f"Outcome: {outcome}")
        pdf.set_font("Helvetica", "", 9)
        mcell(pdf, col_w, 4, f"Stakeholders: {stakeholders}")
        pdf.ln(2)

    # --- Top 5 detail ---
    pdf.add_page()
    section_title(pdf, col_w, "Top 5 AI/ML-style prototypes (detail)")

    items = [
        {
            "n": "1",
            "name": "RAG Studio (private-by-default)",
            "problem": "Teams need answers from internal documents without defaulting to public SaaS or leaking data.",
            "outcome": "A working pattern for retrieval-augmented Q&A with local-first posture; good for pilots.",
            "impact": "Reduces \"we cannot use AI\" friction in regulated or cautious environments.",
            "live": "https://rag-model.streamlit.app/",
        },
        {
            "n": "2",
            "name": "HDB resale price predictor",
            "problem": "Resale discussions often rely on anecdotes; stakeholders want a repeatable, transparent baseline.",
            "outcome": "Supervised models on open data packaged for indicative estimates in a browser demo.",
            "impact": "Supports defensible conversations, not a substitute for professional valuation.",
            "live": "https://hdb-prices-predictor.streamlit.app/",
        },
        {
            "n": "3",
            "name": "CNN waste classification",
            "problem": "Waste and recycling narratives need a tangible demo, not only slides.",
            "outcome": "Upload-to-prediction loop with a trained CNN for category-style feedback.",
            "impact": "Makes computer vision legible to ops and sustainability stakeholders.",
            "live": "https://cnn-waste.streamlit.app/",
        },
        {
            "n": "4",
            "name": "Online retail customer segmentation",
            "problem": "One average customer hides segments that need different actions.",
            "outcome": "Unsupervised clustering (e.g. RFM) with profiles and suggested CRM-style moves.",
            "impact": "Bridges analytics and commercial decisions in a single narrative.",
            "live": "See project page for the hosted app link (portfolio: customer segmentation).",
        },
        {
            "n": "5",
            "name": "Once Upon (storytelling MVP)",
            "problem": "Not every initiative is a dashboard; some wins are experiential and narrative.",
            "outcome": "Personalized story flow with profiles and structured sections in a Streamlit MVP.",
            "impact": "Shows product thinking and storytelling as a complement to ML and data work.",
            "live": "https://story-telling.streamlit.app/",
        },
    ]

    for it in items:
        pdf.set_font("Helvetica", "B", 11)
        mcell(pdf, col_w, 6, f"{it['n']}. {it['name']}")
        pdf.set_font("Helvetica", "B", 9)
        mcell(pdf, col_w, 4, f"Problem: {it['problem']}")
        pdf.set_font("Helvetica", "", 9)
        mcell(pdf, col_w, 4, f"Outcome / demo: {it['outcome']}")
        mcell(pdf, col_w, 4, f"Business impact: {it['impact']}")
        pdf.set_font("Helvetica", "I", 9)
        pdf.set_text_color(25, 70, 120)
        mcell(pdf, col_w, 4, f"Try it: {it['live']}")
        pdf.set_text_color(0, 0, 0)
        pdf.ln(3)

    pdf.ln(2)
    pdf.set_font("Helvetica", "B", 10)
    mcell(pdf, col_w, 5, "More on the site")
    pdf.set_font("Helvetica", "", 9)
    pdf.set_x(pdf.l_margin)
    pdf.multi_cell(
        col_w,
        4,
        "Full write-ups: teoyongsong.github.io. Speaking and consulting: dannyteo.github.io. "
        "If you received this PDF as a welcome gift, new project notices arrive separately when "
        "work is added to the portfolio.",
    )

    pdf.output(str(output))


def main() -> None:
    out = Path(sys.argv[1] if len(sys.argv) > 1 else "project-digest.pdf")
    build_pdf(out)
    print(out.resolve())


if __name__ == "__main__":
    main()
