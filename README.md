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
- **Subscribe** — Email signup for “new project” notifications ([FormSubmit](https://formsubmit.co/); see below).
- **Contact** — WhatsApp, email, GitHub, LinkedIn.
- **Visitor statistics** — Page and site visitor/like counts via [counterapi.dev](https://counterapi.dev/) (`visitor-stats.js`).

---

## Project update emails (subscribers)

Static GitHub Pages cannot send mail by itself. This repo uses:

1. **Collect signups** — The homepage form posts to your inbox through **FormSubmit** (`teo_yongsong@yahoo.com.sg`). Addresses are not stored in git. The **first** time someone submits, FormSubmit may ask you to **confirm** that destination email (one-time).
2. **Optional broadcast** — A GitHub Action can email subscribers via **Resend** when project-related files change (see below).

### FormSubmit (subscription form)

- Form `action` is set in `index.html` to `https://formsubmit.co/teo_yongsong@yahoo.com.sg`.
- To use a **different** inbox, change that address and complete FormSubmit activation for it.

**Alternative:** You can switch to [Formspree](https://formspree.io/) or another form backend by changing the form `action` URL.

### Resend + GitHub Actions (optional auto email)

1. Sign up at [resend.com](https://resend.com/), verify a **sender domain** (or use their test sender while experimenting).
2. Create an API key.
3. In this repo: **Settings → Secrets and variables → Actions → New repository secret**:
   - `RESEND_API_KEY` — Resend API key  
   - `NOTIFY_FROM_EMAIL` — allowed sender, e.g. `Portfolio <updates@yourdomain.com>`  
   - `SUBSCRIBER_EMAILS` — comma-separated list, e.g. `a@x.com,b@y.com` (the workflow sends **BCC** so recipients do not see each other).  
   - When new people subscribe via FormSubmit, add their emails to this secret (or maintain your own list).

If any of these secrets are missing, the workflow is skipped.

### Workflow file

- `.github/workflows/notify-subscribers-on-new-project.yml` — runs on push to `main` / `master` when **`projects/**`** or **`index.html`** changes. Updating only `blog/**` or `blog.html` does **not** trigger it unless you extend the `paths` filter.

---

## Repo structure

```
teoyongsong.github.io/
├── index.html              # Homepage (About, Live apps, Projects, Subscribe, Contact, stats)
├── blog.html               # Blog index
├── style.css               # Global styles (layout, blog, projects, subscribe, engagement)
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
