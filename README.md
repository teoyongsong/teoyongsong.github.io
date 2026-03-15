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

Each featured project has its own page under `projects/` with overview, tech stack, and links (repos, live apps, slides).

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

No JavaScript frameworks or build tools; static HTML/CSS only.

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
