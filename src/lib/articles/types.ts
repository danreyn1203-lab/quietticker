/**
 * Article content model. Articles are the long-form research write-ups
 * (e.g. "SPYI vs JEPQ", "Nuclear Energy Equities"). Stored as structured JSON
 * so they render with the site's components AND can be edited by the author.
 */

/** Which palette slot a mark/value uses. */
export type Tone = "a" | "b" | "ref" | "pos" | "neg" | "brand" | "neutral";

export interface StatItem {
  k: string;
  v: string;
  s?: string;
  tone?: Tone;
}

export interface SplitSegment {
  label: string;
  pct: number;
  tone: Tone;
}

export interface BarDatum {
  cat: string;
  value: number;
  label: string; // pre-formatted value label, e.g. "$0.54" or "16.0%"
  tone: Tone;
  sub?: boolean; // render as a thinner reference/secondary bar
  title?: string; // hover tooltip text
}

export interface TableCell {
  v: string;
  tone?: Tone;
}

export type ArticleBlock =
  | { type: "prose"; md: string }
  | { type: "callout"; label: string; md: string }
  | { type: "heading"; num?: string; text: string }
  | { type: "stats"; items: StatItem[] }
  | { type: "leadin"; md: string }
  | {
      type: "splitbar";
      label: string;
      segments: SplitSegment[];
      caption?: string;
    }
  | { type: "legend"; items: { label: string; tone: Tone }[] }
  | {
      type: "barchart";
      title: string;
      sub?: string;
      data: BarDatum[];
      max: number;
      diverging?: boolean;
      source?: string;
    }
  | {
      type: "table";
      columns: string[];
      rows: TableCell[][];
      note?: string;
    }
  | { type: "verdict"; kicker: string; heading: string; md: string }
  | { type: "risks"; items: { title: string; body: string }[] };

export interface ArticleSource {
  publisher: string;
  title: string;
  url: string;
  note?: string;
}

export interface Article {
  slug: string;
  title: string; // short name (tab / nav / cards)
  headline: string; // display H1
  standfirst: string;
  author: string;
  publishedAt: string; // ISO date
  updatedAt?: string;
  asOf?: string; // e.g. "Aug–Sep 2026"
  tags: string[];
  tickers?: string[];
  summary: string; // card / SEO description
  blocks: ArticleBlock[];
  sources: ArticleSource[];
  disclaimer?: string;
}

/** Fields the palette maps for the two-series + reference chart scheme. */
export const TONE_VAR: Record<Tone, string> = {
  a: "var(--chart-a)",
  b: "var(--chart-b)",
  ref: "var(--chart-ref)",
  pos: "var(--pos)",
  neg: "var(--neg)",
  brand: "var(--brand)",
  neutral: "var(--neutral)",
};
