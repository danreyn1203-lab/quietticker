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

/** Every ticker we keep a daily price for. */
export const TRACKED_TICKERS = [DISCLOSED_POSITION.ticker];
