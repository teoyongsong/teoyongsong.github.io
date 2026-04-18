# teoyongsong.github.io

Personal portfolio site for **Danny Teo Yong Song**, hosted on [GitHub Pages](https://pages.github.com/).

**Live site:** [https://teoyongsong.github.io/](https://teoyongsong.github.io/)

---

## What’s on the site

- **About** — Short intro and how you can get in touch for custom software or data management help. The homepage and footer also link to **[dannyteo.github.io](https://dannyteo.github.io/)** for speaking, training, and consulting (companion professional site).
- **Live apps** — Streamlit (and similar) apps you can open in the browser, with links to detail pages:
  - Once Upon App (Storytelling MVP) · [story-telling.streamlit.app](https://story-telling.streamlit.app/)
  - RAG Studio (Private-by-Default) · [rag-model.streamlit.app](https://rag-model.streamlit.app/)
  - CNN waste classification · [cnn-waste.streamlit.app](https://cnn-waste.streamlit.app/)
  - Online Retail Customer Segmentation · [teoyongsong.github.io/unsupervised-clustering-online-retail](https://teoyongsong.github.io/unsupervised-clustering-online-retail/)
  - HDB resale price predictor · [hdb-prices-predictor.streamlit.app](https://hdb-prices-predictor.streamlit.app/)
  - Python & ML practice quizzes · [python-tests.streamlit.app](https://python-tests.streamlit.app/)
  - Quantum Dice · [quqntumdice.streamlit.app](https://quqntumdice.streamlit.app/)
  - CISSP Domain Quizzes · [cissp-quiz.streamlit.app](https://cissp-quiz.streamlit.app/)
  - Web Safety Checker · [web-safety.streamlit.app](https://web-safety.streamlit.app/)
  - HDB Resale Prices · [hdb-resale-prices.streamlit.app](https://hdb-resale-prices.streamlit.app/)
- **Projects** — Responsive grid of project cards (up to three per row on desktop), each linking to a page under `projects/` with overview, tech, and links (repos, live apps, slides where relevant). Includes Once Upon App (storytelling MVP), RAG Studio (private-by-default), CNN waste classification (computer vision), Online Retail Customer Segmentation (unsupervised learning), HDB resale price predictor (ML), Python & ML quizzes, Quantum Dice, CISSP quizzes, Web Safety, this portfolio, SG Accounting, HDB Resale Prices (exploration app), Activity Tracker, Olist pipeline, LMS, and more.
- **Blog** — [blog.html](https://teoyongsong.github.io/blog.html) lists posts; the first article is *From Data to Business Impact* (data lifecycle: collect → store → clean → analyze → apply → improve). New posts can be started from `blog/post-template.html`.
- **Work together** — Homepage section with links to the consulting profile and email for project briefs.
- **Contact** — WhatsApp, email, GitHub, LinkedIn.
- **Visitor statistics** — Page and site visitor/like counts via [counterapi.dev](https://counterapi.dev/) (`visitor-stats.js`).

---

## Project Digest PDF (optional local asset)

Regenerate the digest with:

`python3 scripts/build_project_digest_pdf.py private/project-digest.pdf`

The PDF is not linked from the site; see `private/README.md` if you use it as an attachment.

---

## Repo structure

```
teoyongsong.github.io/
├── index.html              # Homepage (About, Live apps, Projects, Work together, Contact, stats)
├── robots.txt              # Disallow /private/ (no PDF is stored there on purpose)
├── requirements.txt        # fpdf2 — local / optional: build Project Digest PDF
├── scripts/
│   └── build_project_digest_pdf.py
├── private/
│   ├── README.md
│   └── project-digest.pdf  # Project Digest (regenerate via scripts/build_project_digest_pdf.py)
├── blog.html               # Blog index
├── style.css               # Global styles (layout, blog, projects, engagement)
├── visitor-stats.js        # Visitor / like counters (counterapi.dev)
├── favicon.png
├── tys.jpg                 # Header photo
├── README.md
├── blog/
│   ├── post-template.html  # Duplicate to add a new post
│   └── from-data-to-business-impact.html
└── projects/
    ├── portfolio.html
    ├── once-upon-storytelling.html
    ├── rag-studio.html
    ├── cnn-waste.html
    ├── customer-segmentation.html
    ├── hdb-price-predictor.html
    ├── python-test.html
    ├── quqntum-dice.html
    ├── cissp-quiz.html
    ├── web-safety.html
    ├── sg-accounting.html
    ├── hdb-resale-prices.html
    ├── activity-tracker.html
    ├── olist.html
    ├── olist_ppt.html
    └── lms.html
```

---

## Tech stack

- **HTML5**, **CSS3** (flexbox, grid, `clamp` / responsive spacing)
- **GitHub Pages** — no build step
- **Vanilla JavaScript** — `visitor-stats.js` only  
- No frameworks or bundler.

---

## Run locally

```bash
git clone https://github.com/teoyongsong/teoyongsong.github.io.git
cd teoyongsong.github.io
```

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000) (use a server so links like `blog.html` and `projects/...` resolve consistently).

---

## Contact

- **Email:** teo_yongsong@yahoo.com.sg  
- **GitHub:** [github.com/teoyongsong](https://github.com/teoyongsong)  
- **LinkedIn:** [linkedin.com/in/teoyongsong](https://www.linkedin.com/in/teoyongsong/)
