# teoyongsong.github.io

Personal portfolio site for **Danny Teo Yong Song**, hosted on [GitHub Pages](https://pages.github.com/).

**Live site:** [https://teoyongsong.github.io/](https://teoyongsong.github.io/)

---

## What’s in this repo

- **About** — Short intro and how I can help (e.g. custom software, data management).
- **Data Lifecycle** — A “from data to business impact” overview: collect → store → clean → analyze → apply → improve.
- **Projects** — Grid of project cards (max 3 per row, responsive) with links to:
  - CISSP Domain Quizzes (Streamlit)
  - Web Safety Checker (Streamlit + API)
  - This portfolio repo
  - SG Accounting, Activity Tracker
  - Olist E-Commerce Data Pipeline (BigQuery)
  - HDB Resale Prices (Streamlit)
  - LMS and more
- **Contact** — WhatsApp, email, GitHub, LinkedIn.
- **Subscribe** — Email signup for “new project” notifications (Formspree + optional automation below).

Each featured project has its own page under `projects/` with overview, tech stack, and links (repos, live apps, slides).

---

## Project update emails (subscribers)

Static GitHub Pages cannot send mail by itself. This repo uses two pieces:

1. **Collect signups** — The homepage form uses [FormSubmit](https://formsubmit.co/) and posts to **your** inbox (`teo_yongsong@yahoo.com.sg`). Subscribers are not stored in git. The **first** time someone submits, FormSubmit may ask you to **confirm/activate** that destination email on their site (one-time).
2. **Notify everyone when you add a project** — A GitHub Action sends one email (BCC to all subscribers) via [Resend](https://resend.com/) when `projects/**` or `index.html` changes on `main`/`master`.

### 1) FormSubmit (subscription form — current setup)

- Form `action` is `https://formsubmit.co/teo_yongsong@yahoo.com.sg`.
- To use a **different** inbox, change that email in `index.html` and complete FormSubmit’s activation for the new address.

**If you see “Form not found”** — that was the old **Formspree** placeholder (`YOUR_FORM_ID`). The site now uses FormSubmit instead; deploy the latest `index.html` and try again.

**Alternative:** You can switch to [Formspree](https://formspree.io/) by creating a form there and setting the form `action` to `https://formspree.io/f/<your-hash>`.

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
