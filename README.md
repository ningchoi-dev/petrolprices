# PetrolPrices

Live Western Australian fuel-price web app — *the cheapest petrol in Perth, right now.*

**Live:** https://petrolprices.pages.dev

A fast utility wrapped in a premium editorial shell: a cinematic near-black "ink" hero
that flips to a warm "bone" app surface where the cheapest price is huge and scannable.
Search a suburb, compare fuel types, see today vs tomorrow, open any station for its
4-week daily price history, and tap through to Google Maps directions.

## Status

**Live on real data.** A single static `index.html` fetches real Perth-metro prices from
the Cloudflare Worker (`worker/`), which proxies the FuelWatch WA feed. Prices, rankings,
distance/suburb logic, and the today-vs-tomorrow signal are all real.

The one modelled element: the per-station chart draws the *typical* WA weekly cycle with the
station's **real current price** marked, because FuelWatch only publishes today + tomorrow.
The Worker is accruing real metro daily history in KV (cron snapshots) for a future area-trend view.

## Stack

- **Frontend:** single static HTML file. Fonts (Newsreader / Hanken Grotesk / Space Mono) and
  [Phosphor icons](https://phosphoricons.com) load from CDN. No build step.
- **Backend:** `worker/` — Cloudflare Worker (`petrolprices-api`). Merges FuelWatch metro
  regions 25/26/27 → cached CORS-open JSON. Endpoints: `/api/prices`, `/api/history`, `/api/meta`.
  Daily cron pre-warms the cache and snapshots cheapest-per-day into KV.

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

## Roadmap

1. ~~Cloudflare Worker proxy for FuelWatch (cache + cron).~~ ✅ Done.
2. ~~Full metro station set with coords + data-derived suburb centroids.~~ ✅ Done.
3. Real per-area price history once the KV snapshots accrue (replace the modelled cycle).
4. Migrate to the Vite + React + TypeScript structure from the brief.
5. Custom domain + PWA manifest/installability.

## Data credit

Fuel price data from [FuelWatch WA](https://www.fuelwatch.wa.gov.au), the official
Western Australian fuel-price service.
