# World-News-Map
World news map using free tools, claude reviewed code.


Open `index.html` in a browser (Chrome, Edge, Firefox, Safari). No install needed.

- News: GDELT DOC 2.0 API (free, no key), last 24 hours, fetched by a scheduled GitHub workflow into `data/articles.js`.
- Pins: placed where the story happens, detected from place names in the headline (`data/places.js`). If no place is found, the pin falls back to the outlet's city and says so.
- Outlet ratings (lean, funding, audience): `data/sources.js`. All are starter ratings and need review.
- Topic tags: keyword rules in `app.js` (TOPICS).
- If the live feed can't be reached, clearly labeled demo headlines are shown instead.

## Hosting (GitHub Pages)
- `.github/workflows/update-news.yml` runs every 15 minutes, calls `scripts/fetch-news.mjs`, and commits `data/articles.js`.
- GitHub Pages serves the site from the `main` branch root. Each feed commit redeploys it.
- Map: bundled Natural Earth country shapes (`data/world.js`, no key needed) plus OpenStreetMap tiles at zoom 5+ when served over https.
