# PetrolPrices — Project Brief

You are building **PetrolPrices**, a live Western Australian fuel-price web app.
This file is the spec. Build it end to end, committing as you go.

## 0. Goal & feel

A fast utility wrapped in a premium editorial shell. Users open it to answer one
question: *where is the cheapest petrol near me right now*. The landing is
cinematic; the app itself is instant and scannable.

- **Act 1 (hero):** near-black "ink" cinematic intro, big editorial serif headline,
  soft petrol-iridescent glow, scroll cue.
- **Act 2 (app):** flips to warm "bone" cream surface. The cheapest price is huge
  and immediate. Toggles, location, ranked station rows, trend chips.
- **Marquee:** looping ticker of WA suburb names (Sakazuki-style signature).

## 1. Repo & environment

- Create a fresh **public** GitHub repo named `petrolprices` using the `gh` CLI.
- Scaffold **Vite + React + TypeScript**.
- Initialise git, set the remote, commit in logical chunks, push to `main`.

## 2. Stack

- Tailwind CSS (config wired to the design tokens below)
- Framer Motion (scroll reveals, hero choreography)
- A smooth-scroll lib (Lenis) for the cinematic landing
- Recharts (price history — stub the screen, wire later)
- React Leaflet (station map — stub the screen, wire later)
- Lucide React (icons)
- date-fns ("updated 2h ago" timestamps)
- TanStack Query (data fetching/caching against the Worker)

## 3. Design system

Copy `tokens.css` (provided in this folder) into `src/styles/tokens.css` and import
it globally. Map the tokens into the Tailwind theme so utilities reference them.

Fonts (Google Fonts): **Fraunces** (display serif + station names),
**Archivo** (body), **Spline Sans Mono** (all numerals + labels).

Key tokens: ink #0a0a0b, bone #f4efe4, accent lime #c8ff2f, acc-deep #9fd400
(use for accent text on bone), up #ff7a59. Iridescent gradient = hero atmosphere
ONLY. Sharp 4px radius. Ease cubic-bezier(.16,1,.3,1). Honour prefers-reduced-motion.

Reference screenshots are in `/design-ref` — match that layout and rhythm.

## 4. Architecture

src/
  components/   Hero, AppBand, FeaturePrice, StationRow, SegToggle, TrendChip, Marquee, Footer
  screens/      Prices (default), Map (stub), History (stub)
  lib/          api client (TanStack Query hooks), formatting (cents, distance, time)
  styles/       tokens.css + globals
  App.tsx, main.tsx
worker/         Cloudflare Worker (see section 6)

Structure so Map and History screens drop in later without refactoring.

## 5. Core features (v1)

- Cheapest-near-you feature price (hero number on the bone band)
- Ranked station list, sorted cheapest first
- Today / Tomorrow toggle
- ULP 91 / Premium 95 fuel-type toggle
- "Use my location" (geolocation -> nearest suburb)
- Refresh
- Trend chips (down today / up tomorrow)
- PWA basics: manifest, theme-color, apple-mobile-web-app meta, installable
- Footer MUST credit FuelWatch WA with a link to https://www.fuelwatch.wa.gov.au
  (required by their data terms)

## 6. Cloudflare Worker proxy (REQUIRED)

The FuelWatch RSS feed is XML and blocks direct browser fetches (CORS), so the
app talks to a Worker, never the feed directly.

- Feed: https://www.fuelwatch.wa.gov.au/fuelwatch/fuelWatchRSS?
- Params: Product (1=ULP, 2=Premium95), Suburb, Region, Surrounding, Day (today/tomorrow)
- Worker fetches XML server-side, parses to JSON, sets cache headers, returns CORS-open JSON.
- Add a scheduled cron to pre-warm cache daily (prices update once/day).
- Use Wrangler. Provide wrangler.toml. Bind a route the React app calls.
- Frontend reads VITE_API_BASE; default to the Worker dev URL locally.

Each station object should expose: brand, trading name, price (cents),
location/suburb, address, latitude, longitude, date.

## 7. Deploy notes (do not run, just prepare)

- Pages: build `npm run build`, output `dist`.
- Add a README section: connect repo in Cloudflare Pages, deploy Worker via
  `wrangler deploy`, set VITE_API_BASE to the deployed Worker URL.

## 8. Working style

- TypeScript strict. No `any`.
- Mobile-first; this is used at the pump.
- Commit in chunks: scaffold, tokens+fonts, components, screens, worker, README.
- After building, run the dev server and confirm the hero->app->marquee renders.
