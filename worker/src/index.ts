/**
 * PetrolPrices API — Cloudflare Worker
 *
 * Proxies the FuelWatch WA RSS feed (XML, CORS-blocked for browsers) into cached,
 * CORS-open JSON. One upstream request per (product, day) returns the whole Perth
 * metropolitan station set (Region=25) with coordinates.
 *
 *   GET /api/prices?product=1&day=today    → { stations: [...], ... }
 *   GET /api/history?product=1             → { days: [{date,min,...}] }   (accrues daily via cron)
 *   GET /api/meta                          → { products, region, ... }
 *
 * Data: FuelWatch WA (https://www.fuelwatch.wa.gov.au). Required attribution in the UI.
 */

interface Env {
  PRICES_KV: KVNamespace;
}

const FEED = "https://www.fuelwatch.wa.gov.au/fuelwatch/fuelWatchRSS";
const REGIONS = ["25", "26", "27"]; // Perth metro: North of River, South of River, Hills/Swan
const CACHE_VER = "v3";             // bump to invalidate the edge cache after a response-shape change
const UA = "PetrolPrices/1.0 (+https://petrolprices.pages.dev)";

// FuelWatch product codes → labels
const PRODUCTS: Record<string, string> = {
  "1": "ULP 91",
  "2": "Premium 95",
  "6": "Premium 98",
  "4": "Diesel",
  "5": "LPG",
  "10": "E85",
};

const CORS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const json = (data: unknown, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json; charset=utf-8", ...CORS, ...headers } });

interface Station {
  brand: string; trading: string; suburb: string; address: string;
  price: number; lat: number | null; lng: number | null; date: string;
}

/** Parse the flat FuelWatch RSS <item> list into station objects, cheapest first. */
function parseStations(xml: string): Station[] {
  const out: Station[] = [];
  const tag = (block: string, t: string): string => {
    const m = new RegExp(`<${t}>([\\s\\S]*?)</${t}>`).exec(block);
    return m ? m[1].replace(/<!\[CDATA\[|\]\]>/g, "").trim() : "";
  };
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
  for (const block of items) {
    const price = parseFloat(tag(block, "price"));
    if (!isFinite(price)) continue;
    const lat = parseFloat(tag(block, "latitude"));
    const lng = parseFloat(tag(block, "longitude"));
    out.push({
      brand: tag(block, "brand"),
      trading: tag(block, "trading-name"),
      suburb: tag(block, "location"),
      address: tag(block, "address"),
      price,
      lat: isFinite(lat) ? lat : null,
      lng: isFinite(lng) ? lng : null,
      date: tag(block, "date"),
    });
  }
  return out.sort((a, b) => a.price - b.price);
}

function feedUrl(product: string, region: string, day: "today" | "tomorrow"): string {
  return `${FEED}?Product=${product}&Region=${region}${day === "tomorrow" ? "&Day=tomorrow" : ""}`;
}

/** Fetch every metro region in parallel and merge (dedup by trading+address), cheapest first. */
async function fetchMetro(product: string, day: "today" | "tomorrow"): Promise<{ stations: Station[]; ok: boolean }> {
  const lists = await Promise.all(REGIONS.map(async (region) => {
    try {
      const r = await fetch(feedUrl(product, region, day), { headers: { "User-Agent": UA } });
      return r.ok ? parseStations(await r.text()) : null;
    } catch { return null; }
  }));
  const ok = lists.some((l) => l !== null);
  const seen = new Map<string, Station>();
  for (const list of lists) if (list) for (const s of list) {
    const key = s.trading + "|" + s.address;
    if (!seen.has(key)) seen.set(key, s);
  }
  return { stations: [...seen.values()].sort((a, b) => a.price - b.price), ok };
}

/** Append one real history point per calendar day (cheapest metro price for a product). */
async function recordDaily(env: Env, product: string, cheapest: Station): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);
  const key = `history:${product}`;
  const hist = ((await env.PRICES_KV.get(key, "json")) as Array<{ date: string }>) || [];
  if (!hist.length || hist[hist.length - 1].date !== today) {
    hist.push({ date: today, min: cheapest.price, brand: cheapest.brand, suburb: cheapest.suburb } as any);
    while (hist.length > 120) hist.shift(); // keep ~4 months
    await env.PRICES_KV.put(key, JSON.stringify(hist));
  }
}

/** Fetch + parse one (product, day) across the metro, backed by the edge cache. */
async function getPrices(product: string, day: "today" | "tomorrow", ctx: ExecutionContext, env: Env): Promise<Response> {
  const cache = caches.default;
  const cacheKey = new Request(`https://cache.petrolprices.internal/${CACHE_VER}/${product}/${day}`);
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const { stations, ok } = await fetchMetro(product, day);
  if (!ok) return json({ error: "fuelwatch_upstream" }, { "Cache-Control": "no-store" });

  const body = {
    product,
    productLabel: PRODUCTS[product] ?? product,
    day,
    region: "Perth metro",
    count: stations.length,
    updated: new Date().toISOString(),
    cheapest: stations[0] ?? null,
    stations,
  };
  // Prices change once/day; 1h shared cache + cron pre-warm keeps FuelWatch load tiny.
  const res = json(body, { "Cache-Control": "public, max-age=600, s-maxage=3600" });
  ctx.waitUntil(cache.put(cacheKey, res.clone()));
  // seed real daily history from live traffic too (complements the cron), once per day
  if (day === "today" && stations.length) ctx.waitUntil(recordDaily(env, product, stations[0]));
  return res;
}

/** Daily cron: pre-warm today's cache and snapshot the cheapest-per-day per product. */
async function snapshot(env: Env): Promise<void> {
  for (const product of Object.keys(PRODUCTS)) {
    try {
      const { stations, ok } = await fetchMetro(product, "today");
      if (!ok || !stations.length) continue;
      const body = {
        product, productLabel: PRODUCTS[product], day: "today", region: "Perth metro",
        count: stations.length, updated: new Date().toISOString(), cheapest: stations[0], stations,
      };
      await caches.default.put(
        new Request(`https://cache.petrolprices.internal/${CACHE_VER}/${product}/today`),
        json(body, { "Cache-Control": "public, max-age=600, s-maxage=3600" }).clone(),
      );
      await recordDaily(env, product, stations[0]);
    } catch { /* skip this product on error */ }
  }
}

export default {
  async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (req.method === "OPTIONS") return new Response(null, { headers: CORS });
    const url = new URL(req.url);

    if (url.pathname === "/api/prices") {
      const product = url.searchParams.get("product") || "1";
      const day = url.searchParams.get("day") === "tomorrow" ? "tomorrow" : "today";
      if (!PRODUCTS[product]) return json({ error: "unknown_product", products: PRODUCTS }, { "Cache-Control": "no-store" });
      return getPrices(product, day, ctx, env);
    }

    if (url.pathname === "/api/history") {
      const product = url.searchParams.get("product") || "1";
      if (!PRODUCTS[product]) return json({ error: "unknown_product" }, { "Cache-Control": "no-store" });
      const days = (await env.PRICES_KV.get(`history:${product}`, "json")) || [];
      return json({ product, productLabel: PRODUCTS[product], days }, { "Cache-Control": "public, max-age=600, s-maxage=3600" });
    }

    if (url.pathname === "/api/meta" || url.pathname === "/" || url.pathname === "/api") {
      return json({
        name: "PetrolPrices API",
        source: "FuelWatch WA",
        region: "Perth metro (Region 25)",
        products: PRODUCTS,
        endpoints: ["/api/prices?product=1&day=today", "/api/history?product=1", "/api/meta"],
      }, { "Cache-Control": "public, max-age=3600" });
    }

    return json({ error: "not_found" }, { "Cache-Control": "no-store" });
  },

  async scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(snapshot(env));
  },
};
