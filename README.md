# PetrolPrices

Live Western Australian fuel-price web app — *the cheapest petrol in Perth, right now.*

**Live:** https://petrolprices.pages.dev

A fast utility wrapped in a premium editorial shell: a cinematic near-black "ink" hero
that flips to a warm "bone" app surface where the cheapest price is huge and scannable.
Search a suburb, compare fuel types, see today vs tomorrow, open any station for its
4-week daily price history, and tap through to Google Maps directions.

## Status

This is the **prototype** — a single self-contained `index.html` with **mock data**.
Prices, rankings, and history are synthesised to demonstrate the experience. Wiring it to
real data is the next phase (see *Roadmap*).

## Stack (prototype)

Single static HTML file. Fonts (Newsreader / Hanken Grotesk / Space Mono) and
[Phosphor icons](https://phosphoricons.com) load from CDN. No build step.

## Design

- `design.md` — the design system (philosophy, colour, type, motion, components).
- `tokens.css` — the design tokens.
- `CLAUDE.md` — the full product brief.

## Run locally

Any static server, e.g.:

```bash
python3 -m http.server 4178
# open http://localhost:4178
```

## Deploy

Hosted on **Cloudflare Pages** (project `petrolprices`).

- **Automatic:** every push to `main` triggers `.github/workflows/deploy.yml`, which deploys
  to Cloudflare Pages. Requires two repo secrets: `CLOUDFLARE_API_TOKEN` and
  `CLOUDFLARE_ACCOUNT_ID`.
- **Manual:**

  ```bash
  mkdir -p dist && cp index.html dist/index.html
  npx wrangler pages deploy dist --project-name=petrolprices --branch=main
  ```

## Roadmap (real data)

1. **Cloudflare Worker** proxy: fetch the CORS-blocked FuelWatch WA RSS feed server-side,
   parse XML → JSON, cache, return CORS-open JSON. Daily cron to pre-warm.
2. Full metro station set (each station carries lat/lng from the feed) + an authoritative
   WA suburb→centroid table, so distance ranking and suburbs like Aubin Grove resolve
   without per-suburb special cases.
3. Migrate the prototype into the Vite + React + TypeScript structure from the brief.

## Data credit

Fuel price data from [FuelWatch WA](https://www.fuelwatch.wa.gov.au), the official
Western Australian fuel-price service.
