import "server-only";
import { promises as fs } from "fs";
import path from "path";

/**
 * Daily price refresh for disclosed positions.
 *
 * Source is Yahoo Finance's public chart endpoint — no API key, no account.
 * It is a courtesy endpoint, so this module is deliberately defensive: one
 * request per ticker per TTL at most, a short timeout, and a cached last-good
 * price that keeps rendering (marked stale, with its real date) whenever the
 * fetch fails. The site never blocks on, or lies about, a price.
 *
 * The cache is a JSON file so a restart doesn't re-fetch, plus an in-process
 * memo so concurrent requests share one fetch. On a read-only filesystem the
 * file write fails harmlessly and the memo does the work.
 */

export interface Quote {
  ticker: string;
  price: number;
  currency: string;
  /** Previous close, when the source reports one. */
  previousClose: number | null;
  /** Trading day the price belongs to (YYYY-MM-DD, New York time). */
  asOf: string;
  /** Percent change over the trailing ~year, or null when it can't be computed. */
  yearChangePct: number | null;
  /** When we last fetched successfully (ISO timestamp). */
  fetchedAt: string;
  /** True when a refresh failed and this is the last good price. */
  stale: boolean;
}

const CACHE_FILE = path.join(process.cwd(), "src", "content", "quote-cache.json");

/** Refresh at most this often. Six hours → the figure is never a day behind. */
const TTL_MS = 6 * 60 * 60 * 1000;
/**
 * How long to leave the endpoint alone after a failed attempt. Without this,
 * a stale cache would mean every page render retries — which is exactly how a
 * courtesy endpoint starts answering 429 to everything.
 */
const RETRY_COOLDOWN_MS = 20 * 60 * 1000;
const TIMEOUT_MS = 6000;

const endpoint = (ticker: string) =>
  `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
    ticker,
  )}?interval=1d&range=1y`;

let memo: Record<string, Quote> | null = null;
const inFlight = new Map<string, Promise<Quote | null>>();
/** Last failed attempt per ticker, for the back-off above. */
const lastFailure = new Map<string, number>();

async function loadCache(): Promise<Record<string, Quote>> {
  if (memo) return memo;
  try {
    const data = JSON.parse(await fs.readFile(CACHE_FILE, "utf8"));
    memo = data && typeof data.quotes === "object" ? data.quotes : {};
  } catch {
    memo = {};
  }
  return memo!;
}

async function saveCache(quotes: Record<string, Quote>): Promise<void> {
  memo = quotes;
  try {
    await fs.writeFile(CACHE_FILE, JSON.stringify({ quotes }, null, 2), "utf8");
  } catch {
    /* read-only filesystem — the in-process memo still serves this instance */
  }
}

/** Trading day for an epoch-seconds timestamp, in market (New York) time. */
function marketDay(epochSeconds: number): string {
  // en-CA formats as YYYY-MM-DD.
  return new Date(epochSeconds * 1000).toLocaleDateString("en-CA", {
    timeZone: "America/New_York",
  });
}

/** One line on failure — a silent price that never updates is worse. */
function warn(ticker: string, reason: string): void {
  console.warn(`[quotes] ${ticker}: ${reason} — keeping the last good price.`);
}

async function fetchQuote(ticker: string): Promise<Quote | null> {
  try {
    const res = await fetch(endpoint(ticker), {
      headers: {
        // Yahoo rejects requests without a browser-ish agent.
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36",
        Accept: "application/json",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) {
      warn(ticker, `upstream returned HTTP ${res.status}`);
      return null;
    }

    const json = await res.json();
    const meta = json?.chart?.result?.[0]?.meta;
    const price = meta?.regularMarketPrice;
    if (typeof price !== "number" || !Number.isFinite(price)) {
      warn(ticker, "no usable price in the response");
      return null;
    }

    const time =
      typeof meta?.regularMarketTime === "number"
        ? meta.regularMarketTime
        : Math.floor(Date.now() / 1000);

    // Trailing-year change: first finite close in the 1y series is the baseline.
    const closes = json?.chart?.result?.[0]?.indicators?.quote?.[0]?.close;
    let baseline: number | null = null;
    if (Array.isArray(closes)) {
      for (const c of closes) {
        if (typeof c === "number" && Number.isFinite(c)) {
          baseline = c;
          break;
        }
      }
    }
    const yearChangePct =
      baseline && baseline > 0 ? ((price - baseline) / baseline) * 100 : null;

    return {
      ticker,
      price,
      currency: typeof meta?.currency === "string" ? meta.currency : "USD",
      previousClose:
        typeof meta?.chartPreviousClose === "number"
          ? meta.chartPreviousClose
          : null,
      asOf: marketDay(time),
      yearChangePct,
      fetchedAt: new Date().toISOString(),
      stale: false,
    };
  } catch (err) {
    // Network error, timeout, or a shape we don't recognise — caller falls back.
    warn(ticker, err instanceof Error ? `${err.name}: ${err.message}` : String(err));
    return null;
  }
}

/**
 * Current price for a ticker, refreshed at most once per TTL.
 * Returns the last good price (with `stale: true`) if the refresh fails, or
 * null when we have never had one.
 */
export async function getQuote(
  tickerRaw: string,
  { force = false }: { force?: boolean } = {},
): Promise<Quote | null> {
  const ticker = tickerRaw.toUpperCase();
  const cache = await loadCache();
  const cached = cache[ticker];
  const fetchedAt = cached ? Date.parse(cached.fetchedAt) : NaN;

  if (!force && cached && !Number.isNaN(fetchedAt) && Date.now() - fetchedAt < TTL_MS) {
    return cached;
  }

  // Backing off after a failure: show what we have rather than hammering.
  const failedAt = lastFailure.get(ticker);
  if (!force && failedAt && Date.now() - failedAt < RETRY_COOLDOWN_MS) {
    return cached ? { ...cached, stale: true } : null;
  }

  // Single-flight: concurrent renders share one upstream request.
  let pending = inFlight.get(ticker);
  if (!pending) {
    pending = fetchQuote(ticker).finally(() => inFlight.delete(ticker));
    inFlight.set(ticker, pending);
  }
  const fresh = await pending;

  if (fresh) {
    lastFailure.delete(ticker);
    await saveCache({ ...(await loadCache()), [ticker]: fresh });
    return fresh;
  }
  lastFailure.set(ticker, Date.now());
  return cached ? { ...cached, stale: true } : null;
}

/**
 * Current quotes for several tickers at once. Each goes through getQuote, so the
 * per-ticker TTL, single-flight and cache all still apply. Nulls (tickers we've
 * never priced) are dropped so callers get a clean list.
 */
export async function getQuotes(tickers: string[]): Promise<Quote[]> {
  const results = await Promise.all(tickers.map((t) => getQuote(t)));
  return results.filter((q): q is Quote => q !== null);
}

/**
 * Force a refresh of every ticker given. Used by the daily cron route.
 * Only genuinely refreshed quotes come back — a ticker whose fetch failed is
 * left out even though getQuote still serves its cached price, so the caller
 * can report what actually happened.
 */
export async function refreshQuotes(tickers: string[]): Promise<Quote[]> {
  const results = await Promise.all(
    tickers.map((t) => getQuote(t, { force: true })),
  );
  return results.filter((q): q is Quote => q !== null && !q.stale);
}
