/**
 * Client-safe search index of real, published research (no fs, no server-only).
 * Keep in sync with the article slugs in src/content/articles + research-log.
 */
export interface SearchItem {
  name: string;
  ticker: string;
  sub: string;
  href: string;
}

export const searchItems: SearchItem[] = [
  { name: "Sumitomo Electric Industries", ticker: "SMTOY", sub: "Undersea cables · Industrials", href: "/journal/smtoy-meta-cable" },
  { name: "Amphenol", ticker: "APH", sub: "AI infrastructure · Industrials", href: "/journal/amphenol-aph" },
  { name: "Eaton", ticker: "ETN", sub: "AI infrastructure · Industrials", href: "/journal/eaton-etn" },
  { name: "Duke Energy", ticker: "DUK", sub: "Nuclear & utilities", href: "/journal/nuclear-energy-equities" },
  { name: "Public Service Enterprise Group", ticker: "PEG", sub: "Nuclear & utilities", href: "/journal/nuclear-energy-equities" },
  { name: "VanEck Uranium & Nuclear ETF", ticker: "NLR", sub: "Nuclear & utilities · ETF", href: "/journal/nuclear-energy-equities" },
  { name: "Colgate-Palmolive", ticker: "CL", sub: "Consumer staples · Dividend King", href: "/journal/colgate-cl" },
  { name: "JPMorgan Nasdaq Equity Premium Income", ticker: "JEPQ", sub: "High-dividend ETF", href: "/journal/spyi-vs-jepq" },
  { name: "NEOS S&P 500 High Income", ticker: "SPYI", sub: "High-dividend ETF", href: "/journal/spyi-vs-jepq" },
];
