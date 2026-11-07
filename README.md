# Pluripotent Foundation website

A single-page site for the Pluripotent Foundation and its online mentorship work. Built with plain HTML/CSS/JS — no build step, no dependencies, no web fonts.

## Files
- `index.html` — the page (hero, 2025 figures, about, our work, impact, team, mentors, reports, get involved, footer).
- `styles.css` — design tokens at the top, with light and dark themes; responsive.
- `assets/hero.jpg` — the home page picture.
- `assets/reports/` — the Annual Report PDF linked from the Reports section.
- `script.js` — scrollspy, scroll progress, reveal, stat counters, mentor filter, theme toggle, toast messages.

## Updating content
- **Figures, outcomes and testimonials** come from the 2025 Annual Report. Update them with each new report; for stats, change both `data-count` and the text in `.stat-num`.
- **Mentees are children:** don't publish their names or photos without guardian consent.
- **Team photos** are in `assets/team/`. To add one, replace the initials inside `.avatar` with an `<img>`.
- **Mentors:** photos are in `assets/mentors/`. Copy a `.mentor-card` in `index.html`; `data-group` is `doctors`, `engineers` or `other`.

## Preview locally
```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy
Served by GitHub Pages from this repository. Any static host works.

## Still needed before launch
- **Donate button** (footer) — remove `data-soon` and set a real payment link.
- **Social links** — commented out in the footer until profile URLs exist.
- **Organization details** — legal registration, address, and founding year, if you want them shown.
