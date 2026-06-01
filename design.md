# PetrolPrices — Design Document

> Source of truth: the design system bundle at `petrolprices-design-system/`. All tokens are in `colors_and_type.css`. This document interprets and extends that source for implementation.

---

## Philosophy

**Warm editorial minimalism.** PetrolPrices behaves like a trusted notice board — a few precise numbers, set beautifully, with as little chrome as possible. It earns trust by being quiet, accurate, and fast. The reference aesthetic is sakazuki.io: warm monochrome paper/ink, a single saturated accent, generous whitespace, all-caps spaced labels, large elegant serif numerals.

The product has two surfaces with a deliberate contrast:

- **Marketing site** — cinematic. Opens on a dark ink hero with petrol-sheen atmosphere; flows into bright bone sections. Sells the product.
- **App (applet)** — instant utility. Stays bright and warm throughout. Readable at the pump in daylight glare. The bone/paper surface earns trust; dark mode would hurt readability.

The tension between these two surfaces is a design principle, not a compromise.

---

## Colour System

All tokens live in `src/styles/tokens.css` (mapped from the design system's `colors_and_type.css`). Never hard-code hex values in component files.

### Warm Neutrals (page → ink)

| Token | Value | Use |
|---|---|---|
| `--paper` | `#F4F0E7` | Page background — warm cream |
| `--paper-2` | `#EFE9DC` | Alt section band |
| `--surface` | `#FBF8F1` | Raised cards, panels, sticky header |
| `--surface-pure` | `#FFFFFF` | High-contrast cards, inputs |
| `--ink` | `#1B1813` | Primary text — warm near-black |
| `--ink-2` | `#4C463C` | Secondary text |
| `--ink-3` | `#877E6D` | Tertiary, muted labels |
| `--ink-4` | `#B4AB97` | Faint, disabled |
| `--line` | `#E0D9C9` | Hairline borders on paper |
| `--line-2` | `#D0C7B2` | Stronger divider |
| `--line-ink` | `#1B1813` | Full-ink editorial rule |

Nothing is pure grey — every neutral is tinted warm.

### Brand Accent

One accent only: **vermillion**. If everything is red, nothing is. Restraint is the rule.

| Token | Value | Use |
|---|---|---|
| `--vermillion` | `#C83E27` | Wordmark, primary CTA, active tab underline |
| `--vermillion-deep` | `#A63017` | Hover / press state |
| `--vermillion-soft` | `#F3E0D8` | Tint backgrounds (e.g. active bell icon bg) |

### Price Semantics

These form their own scale — appear as small dots, chip labels, and chart fills. Never as big colour fields.

| Token | Value | Use |
|---|---|---|
| `--price-low` | `#2E7547` | Cheap / fill up now — deep forest green, NOT fluoro |
| `--price-low-soft` | `#E5EFE5` | Tint background for low recommendation card |
| `--price-mid` | `#B6802A` | Fair / holding |
| `--price-mid-soft` | `#F2EAD6` | Tint background |
| `--price-high` | `#C83E27` | Expensive / wait — shares brand vermillion |
| `--price-high-soft` | `#F4E1DA` | Tint background for high recommendation card |

### Complementary Warm

| Token | Value | Use |
|---|---|---|
| `--coral` | `#E0613F` | "Price rose / dearer / trend up" on paper surfaces |
| `--coral-bright` | `#FF7A59` | Same meaning on dark ink surfaces |
| `--coral-soft` | `#F8E0D6` | Tint background |

Coral is distinct from vermillion — lighter, salmon. Never use coral as a primary CTA colour.

### Dark "Ink" Cinematic Surfaces

Used only for the marketing hero, one dark payoff band, and the footer. Never on the app itself.

| Token | Value | Use |
|---|---|---|
| `--ink-bg` | `#0C0B0A` | Page on dark |
| `--ink-bg-2` | `#161410` | Raised panel on dark |
| `--ink-bg-3` | `#211E18` | Nested / hover on dark |
| `--ink-line` | `#2C2922` | Hairline on dark surfaces |
| `--on-ink-hi` | `#F4F0E7` | Primary text on dark (= `--paper`) |
| `--on-ink-mid` | `#A8A294` | Secondary on dark |
| `--on-ink-lo` | `#6E685B` | Muted labels on dark |

### Petrol Sheen

`--petrol-sheen: linear-gradient(110deg, #41E6C4 0%, #5AA9FF 30%, #B07CFF 60%, #FF8AC4 84%, #FF7A59 100%)`

**Used three times in the entire product, never more:**
1. Behind the dark marketing hero — low-opacity blurred glow (atmosphere).
2. In one dark "best time to fill up" payoff band — one final allowed use.

Never on text, buttons, fills, or the app band. The fluoro-lime start (`#c8ff2f`) has been intentionally removed from this gradient.

---

## Typography

Three fonts, strict roles. Load via Google Fonts.

```html
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,300;1,6..72,400&family=Hanken+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
```

| Variable | Font | Role |
|---|---|---|
| `--serif` | Newsreader, Georgia, serif | All headlines, hero price numeral — the soul of the brand |
| `--sans` | Hanken Grotesk, system-ui, sans-serif | Body, labels, buttons, table data |
| `--mono` | Space Mono, ui-monospace, monospace | Ticker prices, station codes, timestamps, units — "instrument/applet texture" |

**Rule:** every number that matters is Newsreader (price hero) or Space Mono (data rows, units). Hanken Grotesk numerals never appear in price contexts.

### Semantic Type Classes

Use `.pp-*` classes rather than repeating these styles manually.

| Class | Font | Size | Weight | Use |
|---|---|---|---|---|
| `.pp-eyebrow` | Mono | 12px | 400 | ALL CAPS, 0.18em tracked — section labels, units |
| `.pp-display` | Serif | clamp(40px, 6vw, 78px) | 300 | Hero headline |
| `.pp-h1` | Serif | clamp(32px, 4vw, 48px) | 400 | Page headings |
| `.pp-h2` | Serif | 30px | 400 | Section headings |
| `.pp-h3` | Sans | 19px | 600 | Sub-headings |
| `.pp-body-lg` | Sans | 19px | 400 | Lead body |
| `.pp-body` | Sans | 16px | 400 | Body copy |
| `.pp-small` | Sans | 13px | 400 | Captions, footnotes |
| `.pp-price-display` | Serif | clamp(64px, 12vw, 160px) | 300 | Hero price numeral |
| `.pp-price-mono` | Mono | 18px | 700 | Data/ticker prices |
| `.pp-meta` | Mono | 11px | 400 | Timestamps, station codes, units — all-caps |

**Casing rules:**
- Sentence case for all headlines, buttons, body.
- ALL CAPS only for `.pp-eyebrow` and `.pp-meta` — editorial device, used sparingly.
- No Title Case sentences.

**Tracking:** `--tracking-label: 0.18em` for eyebrows/labels. `--tracking-tight: -0.02em` for large serif display.

---

## Price Display

The hero price uses a split-decimal treatment: the whole number in large serif, the decimal in ~50% size, the unit `c/L` in small mono.

```jsx
// PriceBig component pattern
<span style={{ fontFamily: "var(--serif)", fontWeight: 300, lineHeight: 0.9, letterSpacing: "-0.03em" }}>
  <span style={{ fontSize: size }}>{whole}</span>
  <span style={{ fontSize: size * 0.5 }}>.{dec}</span>
  <span style={{ fontFamily: "var(--mono)", fontSize: size * 0.13, fontWeight: 700, color: "var(--ink-3)" }}>c/L</span>
</span>
```

Station rows use serif at 30px with the decimal at 18px (same split-decimal pattern, smaller scale).

---

## Spacing

4px base grid. Use the tokens.

```
--s-1: 4px   --s-2: 8px   --s-3: 12px  --s-4: 16px
--s-5: 24px  --s-6: 32px  --s-7: 48px  --s-8: 64px  --s-9: 96px
```

Generous whitespace is a feature, not wasted space.

---

## Radius & Shape

Editorial — gently rounded, not pill-heavy.

| Token | Value | Use |
|---|---|---|
| `--r-xs` | `3px` | Tightest — small inline elements |
| `--r-sm` | `6px` | Buttons, segmented controls, icon buttons |
| `--r-md` | `10px` | Cards, toasts |
| `--r-lg` | `16px` | Large panels, recommendation cards |
| `--r-pill` | `999px` | Filter chips, fuel-type chips, location pill, live-dot — not for buttons |

Buttons are `--r-sm`, never pill. Cards are `--r-md` or `--r-lg`, never tightly rounded.

---

## Elevation

Minimal, warm-tinted shadows. Three levels only.

| Token | Value | Use |
|---|---|---|
| `--shadow-sm` | `0 1px 2px rgba(27,24,19,.05)` | Inputs, small cards |
| `--shadow-md` | `0 4px 16px rgba(27,24,19,.07)` | Raised panels, hovered cards |
| `--shadow-lg` | `0 18px 48px rgba(27,24,19,.10)` | Modals, popovers, toasts |

No coloured or neon shadows. Warm-tinting (`rgba(27,24,19,...)`) keeps shadows from going blue-grey.

---

## Motion

Understated and quick. Motion should feel like ink settling, not bouncing.

| Duration | Value | Use |
|---|---|---|
| Hover/focus | 120–150ms ease-out | Icon button opacity, border colour |
| Interaction | 200ms ease-out | Chip state, filter toggle |
| Entrance | 220–320ms ease-out | Panel reveals, section fades |
| Toast | 220ms ease-out | Rise from bottom (translateY 8px → 0) |

**No bounces.** No spring overshoot. No parallax. No transforms larger than 8px translateY.

Price values may count/tick subtly into place — small scale only.

Always honour `prefers-reduced-motion` — the CSS tokens file disables all animation/transition globally when set.

---

## Interactive States

### Hover
- Text links: shift to `--vermillion` or gain a hairline underline.
- Buttons: fill darkens to `--vermillion-deep`; ghost buttons get `--shadow-md` + border → `--ink`.
- Cards: background → `--surface`, border darkens to `--line-2`.
- Icon buttons: opacity shifts (1 → 0.7) or colour → `--ink`.

### Press
- `transform: scale(0.98)` + darker fill.
- Duration: 90ms.
- No ripple.

### Focus
- `outline: 2px solid var(--vermillion)`, `outline-offset: 3px`.
- Never remove focus outlines.

### Active / selected chip
- Fuel chip: `background: var(--ink); color: var(--paper); border-color: var(--ink)`.
- Segmented control active segment: same ink fill.
- Active tab: `color: var(--ink)`, `border-bottom: 2px solid var(--vermillion)`.
- Active bell (tracked): `color: var(--vermillion); border-color: var(--vermillion); background: var(--vermillion-soft)`.

---

## Components

### Buttons (`.pp-btn`)

```css
.pp-btn { display: inline-flex; align-items: center; gap: 8px; font-weight: 600; font-size: 14px;
          border-radius: var(--r-sm); padding: 11px 18px; transition: .15s; white-space: nowrap; }
.pp-btn.primary { background: var(--vermillion); color: #fff; }
.pp-btn.primary:hover { background: var(--vermillion-deep); }
.pp-btn.primary:active { transform: scale(.98); }
.pp-btn.ghost { border: 1px solid var(--line-2); color: var(--ink); }
.pp-btn.ghost:hover { border-color: var(--ink); background: var(--surface); }
```

On dark surfaces: use a `text-light` variant — `color: var(--on-ink-hi)`, `border-color: rgba(244,240,231,.3)`.

### Fuel / Filter Chips (`.pp-chip`)

```css
.pp-chip { font-size: 13px; font-weight: 500; border-radius: var(--r-pill); padding: 7px 14px;
           border: 1px solid var(--line-2); background: var(--surface); color: var(--ink-2);
           transition: .15s; white-space: nowrap; }
.pp-chip:hover { border-color: var(--ink); }
.pp-chip.on { background: var(--ink); color: var(--paper); border-color: var(--ink); }
```

### Segmented Control (`.pp-seg`)

```css
.pp-seg { display: inline-flex; border: 1px solid var(--line-2); border-radius: var(--r-sm); overflow: hidden; }
.pp-seg button { padding: 8px 13px; font-size: 13px; font-weight: 500; color: var(--ink-2); white-space: nowrap; }
.pp-seg button.on { background: var(--ink); color: var(--paper); }
```

### Location Pill (`.pp-pill`)

```css
.pp-pill { font-size: 13px; font-weight: 500; color: var(--ink); background: var(--surface);
           border: 1px solid var(--line-2); border-radius: var(--r-pill); padding: 7px 13px; white-space: nowrap; }
.pp-pill:hover { border-color: var(--ink); }
```

### Icon Button (`.pp-iconbtn`)

```css
.pp-iconbtn { width: 38px; height: 38px; border-radius: var(--r-sm); border: 1px solid var(--line-2);
              background: var(--surface); display: inline-flex; align-items: center;
              justify-content: center; font-size: 18px; color: var(--ink-2); transition: .15s; }
.pp-iconbtn:hover { color: var(--ink); border-color: var(--ink); }
.pp-iconbtn.sm { width: 32px; height: 32px; font-size: 15px; }
.pp-iconbtn.active { color: var(--vermillion); border-color: var(--vermillion); background: var(--vermillion-soft); }
```

### Card (`.pp-card`)

```css
.pp-card { border: 1px solid var(--line); border-radius: var(--r-lg); padding: 18px 20px; }
```

Background defaults to `--surface`. Recommendation cards use price-semantic soft tints:
- Low: `background: var(--price-low-soft); border-color: #cfe0cf`
- High: `background: var(--price-high-soft); border-color: #e6c9bf`

### Station Row (`.pp-row`)

```css
.pp-row { display: flex; align-items: center; gap: 14px; padding: 15px 22px;
          border-bottom: 1px solid var(--line); transition: background .12s; }
.pp-row:hover { background: var(--surface); }
```

Row structure: `[dot] [brand + suburb/distance] [bell] [price]`
- Dot: 8px circle, `--price-{sem}` background
- Brand: sans, 15px, weight 600
- Suburb + distance: Space Mono, 11px, `--ink-3`, uppercase, `letter-spacing: .04em`
- Price: Newsreader, 30px (whole) + 18px (decimal), right-aligned

### Tab (`.pp-tab`)

```css
.pp-tab { font-size: 14px; font-weight: 600; color: var(--ink-3); padding: 0 0 12px;
          border-bottom: 2px solid transparent; margin-bottom: -1px; }
.pp-tab[data-on="true"] { color: var(--ink); border-color: var(--vermillion); }
```

### Toast (`.pp-toast`)

```css
.pp-toast { position: fixed; left: 50%; bottom: 26px; transform: translateX(-50%);
            background: var(--ink); color: var(--paper); padding: 12px 18px;
            border-radius: var(--r-md); font-size: 13px; font-weight: 500;
            box-shadow: var(--shadow-lg); animation: rise .22s ease-out; }
@keyframes rise { from { opacity: 0; transform: translate(-50%, 8px); } to { opacity: 1; transform: translate(-50%, 0); } }
```

### Sticky Header

```css
background: rgba(244,240,231,.82);
backdrop-filter: blur(10px);
-webkit-backdrop-filter: blur(10px);
border-bottom: 1px solid var(--line);
```

Transparency + blur only for the sticky header and modal scrims. Not decorative elsewhere.

---

## Price Semantic Dots

Every station row and chart node carries a semantic dot computed from position within the visible range:

```js
function semFor(price, min, max) {
  const t = (price - min) / Math.max(0.1, max - min);
  if (t < 0.34) return "low";   // --price-low
  if (t < 0.67) return "mid";   // --price-mid
  return "high";                // --price-high
}
```

The dot is relative — the cheapest station on the board always shows green, even if the absolute price is high. This is intentional UX.

---

## Layout Structure

### App

```
┌─────────────────────────────────────┐
│ [Sticky TopBar: wordmark + location] │  ← rgba(--paper, .82) + blur
├─────────────────────────────────────┤
│ [FilterBar: fuel chips | sort | km] │  ← --paper background
├─────────────────────────────────────┤
│         169.7¢                      │  ← PriceBig, --serif, 300 weight
│  TODAY'S CHEAPEST · ULP 91          │  ← .pp-eyebrow
│  ● Low price · fill up now          │  ← PriceDot semantic
│                                     │
│  Board | Tracker (tabs)             │  ← .pp-tab, --vermillion underline
│                                     │
│  [StationRow × N]                   │  ← .pp-row, hairline dividers
└─────────────────────────────────────┘
```

### Marketing Site Structure

1. **Sticky header** — `--surface` + blur, vermillion "Open the app" CTA
2. **Hero** — `--ink-bg` dark surface, petrol-sheen glow top-right, serif display headline, live price card
3. **How it works** — `--paper` band, three-column hairline grid
4. **Tracker section** — `--paper-2` band, weekly cycle SVG chart
5. **Coverage** — `--paper` band, Perth suburb chips
6. **FAQ** — `--paper-2` band, accordion
7. **"Hold off" payoff band** — `--ink-bg` dark (second and last allowed dark section in body), petrol-sheen bottom-left, vermillion CTA
8. **Footer** — `--ink-bg` dark (closes the bookend: dark hero → bright body → dark footer)

---

## Iconography

**Icon set: Phosphor Icons**, regular weight (1.5px stroke, rounded terminals). Load via CDN:

```html
<script src="https://unpkg.com/@phosphor-icons/web@2.1.1"></script>
```

Usage: `<i class="ph ph-drop"></i>`. Use `ph-fill` variant only for the active/filled state (e.g. filled bell on tracked stations).

Common icons in this product:

| Icon | Class | Use |
|---|---|---|
| Fuel drop | `ph-drop` | Brand/fuel reference |
| Trend down | `ph-trend-down` | Price falling, "fill up" |
| Trend up | `ph-trend-up` | Price rising, "hold off" |
| Map pin | `ph-map-pin` | Suburb selector |
| Clock | `ph-clock` | "Updated X min ago" |
| Bell (empty) | `ph-bell` | Track price (untracked) |
| Bell (filled) | `ph-fill ph-bell` | Track price (active) |
| Caret down | `ph-caret-down` | Dropdowns |
| List | `ph-list` | Board view |
| Map | `ph-map-trifold` | Map view |
| Check | `ph-check` | Confirmation |
| Arrow up-right | `ph-arrow-up-right` | External link |

Icons are monochrome `--ink` or `--ink-2`. Vermillion only for active/alert states. Never multicolour. **Never emoji. Never unicode glyphs** (✓, ↗, etc.).

---

## Brand Mark

Assets in `src/assets/`:
- `logo-mark.svg` — fuel-drop outline framing a downward price tick. Single colour, uses `currentColor`.
- `logo-wordmark.svg` — horizontal lockup.

Wordmark component: `Petrol` (weight 700) + `Prices` (weight 400), preceded by the mark at 1.35× text size.

The mark can be ink (default), paper (knockout on dark), or vermillion (accented). Provisional — replace when a final logo exists.

---

## Content Voice

**Calm, plain-spoken local.** Like a knowledgeable Perth neighbour who just tells you the answer.

- Lead with the number or answer, then explain. Never hype.
- No exclamation marks. No "Woohoo." Small dry wit is allowed in microcopy.
- Always cite where and when: "ULP 91 · United, Kewdale · updated 7 min ago".
- Imperatives for actions: "Fill up today." / "Hold off until Tuesday."
- Address reader as "you". Product is "PetrolPrices" (one word), never "we".
- **Sentence case** for headlines and buttons. ALL CAPS only for eyebrow labels and data units.
- Numbers: cents per litre, one decimal — `171.9`. Unit `c/L` is small and muted.
- **Never emoji** in product or marketing. Warmth comes from type and restraint.

---

## What Not To Do

- No fluoro/neon accents — lime was explicitly removed from the palette
- No Fraunces, Archivo, or Spline Sans Mono — those were the v1 font choices
- No 4px sharp radius everywhere — use the 3/6/10/16px scale
- No lime or fluoro start in the petrol-sheen gradient
- No petrol sheen outside the two permitted hero/payoff uses
- No dark mode on the app surface — dark = marketing atmosphere only
- No bouncy spring animations or parallax
- No coloured or neon drop shadows — warm-tinted only
- No pill-shaped buttons — `--r-sm` (6px) for buttons
- No pure-grey neutrals — everything warm-tinted
- No hard-coded hex values in component files — CSS vars only
- No emoji anywhere in the product
- No Title Case sentences
- No unicode glyphs as icons — use Phosphor equivalents
