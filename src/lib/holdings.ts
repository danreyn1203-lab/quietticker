/**
 * The disclosed position shown on the homepage (§15 disclosure).
 *
 * Entry facts are fixed history and are edited by hand — they must match what
 * actually happened. The *current* price is not stored here: it comes from
 * src/lib/quotes.ts, which refreshes daily from Yahoo Finance. The fallback
 * below is only used if that fetch has never succeeded, and is rendered with
 * its own date so nothing on the page is ever undated.
 */

export interface DisclosedPosition {
  ticker: string;
  name: string;
  /** ISO date (YYYY-MM-DD) of the purchase. */
  boughtOn: string;
  buyPrice: number;
  /** Last hand-verified price, used only when no live quote is available. */
  fallbackPrice: number;
  /** ISO date that fallback price was true. */
  fallbackAsOf: string;
}

export const DISCLOSED_POSITION: DisclosedPosition = {
  ticker: "META",
  name: "Meta Platforms",
  boughtOn: "2026-08-25",
  buyPrice: 570.05,
  fallbackPrice: 747.82,
  fallbackAsOf: "2026-09-26",
};

/**
 * The standout holdings shown in the homepage carousel — the growth names from
 * Daniel's portfolio that price impressively. Edit this list to change what the
 * "Standouts" slider shows; each ticker prices itself daily from Yahoo Finance.
 * Keep to clean US-listed symbols so the quote endpoint resolves them.
 */
export interface Standout {
  ticker: string;
  name: string;
  /** One short line on why it's here — the thesis in a breath. */
  note: string;
}

export const STANDOUTS: Standout[] = [
  { ticker: "AMZN", name: "Amazon", note: "Cloud + retail flywheel; a core long-term hold." },
  { ticker: "ASML", name: "ASML Holding", note: "The one company the whole AI-chip build depends on." },
  { ticker: "MU", name: "Micron Technology", note: "Memory riding the AI-infrastructure wave." },
  { ticker: "SMH", name: "VanEck Semiconductor ETF", note: "The whole semis basket, in one line." },
];

/** Every ticker we keep a daily price for (disclosed position + standouts). */
export const TRACKED_TICKERS = Array.from(
  new Set([DISCLOSED_POSITION.ticker, ...STANDOUTS.map((s) => s.ticker)]),
);
