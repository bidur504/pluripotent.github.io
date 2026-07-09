# Pluripotent Foundation — CMUS website

A single-page marketing site for the Pluripotent Foundation and its **CMUS** (Connecting Mentors & Students) online mentorship program. Built with plain HTML/CSS/JS — no build step, no dependencies.

## Files
- `index.html` — the page (semantic sections: hero, about, vision/mission/values, team, what we do, reports, contact, footer).
- `styles.css` — purple education-foundation theme, responsive.
- `script.js` — mobile nav toggle, scroll-reveal, footer year.
- `assets/avatar-placeholder.svg` — neutral silhouette used for every team/mentor/mentee/testimonial photo. To use a real photo, drop the image in `assets/` and change that `<img src>` in `index.html`.
- `CMUS Annual Report_2025.pdf` — linked from the "Our Impact" section.

## Preview locally
```bash
cd /Users/bidurbk/projects/cmus
python3 -m http.server 8000
# then open http://localhost:8000
```
Or just open `index.html` directly in a browser.

## Deploy
Drop the whole folder onto any static host — Netlify, GitHub Pages, Cloudflare Pages, or an S3 bucket. Point `pluripotentfoundation.org` at it.

## Placeholders to replace before launch
- **Contact email:** `info@pluripotentfoundation.org` in `index.html`.
- **Donate button** (`#donate` / footer) — wire to a real payment/donation link.
- **Social links** — Facebook / Instagram / LinkedIn `href="#"` in the footer.
