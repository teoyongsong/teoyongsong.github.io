# teoyongsong.github.io

Personal portfolio site for **Danny Teo Yong Song**, hosted on [GitHub Pages](https://pages.github.com/).

**Live site:** [https://teoyongsong.github.io/](https://teoyongsong.github.io/)

---

## What’s in this repo

- **About** — Short intro and how I can help (e.g. custom software, data management).
- **Data Lifecycle** — A “from data to business impact” overview: collect → store → clean → analyze → apply → improve.
- **Projects** — Grid of project cards (max 3 per row, responsive) with links to:
  - This portfolio repo
  - Activity Tracker
  - Olist E-Commerce Data Pipeline (BigQuery)
  - HDB Resale Prices (Streamlit)
  - Placeholders for more projects
- **Contact** — WhatsApp, email, GitHub, LinkedIn.
- **Subscribe** — Email signup for “new project” notifications (Formspree + optional automation below).

Each featured project has its own page under `projects/` with overview, tech stack, and links (repos, live apps, slides).

---

## Project update emails (subscribers)

Static GitHub Pages cannot send mail by itself. This repo uses two pieces:

1. **Collect signups (private list)** — [Formspree](https://formspree.io/) form on the homepage posts to their servers; you receive submissions and manage/export addresses in your Formspree dashboard (not committed to git).
2. **Notify everyone when you add a project** — A GitHub Action sends one email (BCC to all subscribers) via [Resend](https://resend.com/) when `projects/**` or `index.html` changes on `main`/`master`.

### 1) Formspree (subscription form)

1. Create a free account at [formspree.io](https://formspree.io/) and create a new form.
2. Copy the form endpoint (looks like `https://formspree.io/f/abcdefgh`).
3. In `index.html`, replace `YOUR_FORM_ID` in the subscribe form `action` with your real form path (the part after `/f/` is your id — use the full URL Formspree gives you).
4. In Formspree, turn on **email confirmations** / spam protection as you prefer.

Subscribers’ emails stay in **your Formspree account** (or forwarded to your inbox) — they are **not** stored in this public repository.

### 2) Resend + GitHub Actions (auto email on new project)

1. Sign up at [resend.com](https://resend.com/), verify a **sender domain** (or use their test sender while experimenting).
2. Create an API key.
3. In this GitHub repo: **Settings → Secrets and variables → Actions → New repository secret**:
   - `RESEND_API_KEY` — your Resend API key  
   - `NOTIFY_FROM_EMAIL` — must be an allowed sender, e.g. `Portfolio <updates@yourdomain.com>`  
   - `SUBSCRIBER_EMAILS` — comma-separated list of subscriber addresses, e.g. `a@x.com,b@y.com`  
     - **Privacy:** the workflow sends **BCC** so recipients do not see each other’s emails.  
     - **Keeping the list updated:** when new people subscribe via Formspree, add their emails to this secret (or re-export from Formspree periodically and paste the full list).

If any of these secrets are missing, the workflow is skipped and nothing breaks.

### Workflow file

- `.github/workflows/notify-subscribers-on-new-project.yml` — runs on push when `projects/**` or `index.html` changes.

---

## Repo structure

```
teoyongsong.github.io/
├── index.html          # Homepage (About, Data Lifecycle, Projects, Contact)
├── style.css           # Global styles and layout
├── favicon.png
├── tys.jpg             # Header photo
├── README.md           # This file
└── projects/
    ├── portfolio.html       # This site (teoyongsong.github.io)
    ├── activity-tracker.html
    ├── olist.html            # Olist BigQuery pipeline
    ├── olist_ppt.html        # Olist findings deck (slides)
    └── hdb-resale-prices.html # HDB Resale Prices (Streamlit)
```

---

## Tech stack

- **HTML5**, **CSS3** (flexbox, grid, media queries)
- **GitHub Pages** for hosting (no build step)
- **Git** for version control

Includes small vanilla JavaScript for visitor/like stats (`visitor-stats.js`). No build step.

---

## Run locally

1. Clone the repo:
   ```bash
   git clone https://github.com/teoyongsong/teoyongsong.github.io.git
   cd teoyongsong.github.io
   ```
2. Open `index.html` in a browser, or serve the folder with a local server, e.g.:
   ```bash
   python3 -m http.server 8000
   ```
   Then visit [http://localhost:8000](http://localhost:8000).

---

## Contact

- **Email:** teo_yongsong@yahoo.com.sg  
- **GitHub:** [github.com/teoyongsong](https://github.com/teoyongsong)  
- **LinkedIn:** [linkedin.com/in/teoyongsong](https://www.linkedin.com/in/teoyongsong/)
