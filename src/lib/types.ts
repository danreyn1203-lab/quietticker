/**
 * Domain types — a UI-facing simplification of the conceptual entities in the
 * master plan (§32). Kept deliberately close to how the research reads so the
 * data layer can later be swapped for a real backend without reshaping the UI.
 */

export type Assessment =
  | "strong"
  | "solid"
  | "mixed"
  | "moderate"
  | "present"
  | "weak";

export type SignalCategory =
  | "Growth"
  | "Competitive Advantage"
  | "Financial Strength"
  | "Valuation"
  | "Catalyst"
  | "Risk";

export type Stance = "Bullish" | "Neutral" | "Bearish";

export type ReportStatus =
  | "Watching"
  | "Researching"
  | "Thesis Built"
  | "Monitoring"
  | "Thesis Weakened"
  | "Thesis Broken";

export interface Signal {
  category: SignalCategory;
  /** normalized level used for color/weight */
  assessment: Assessment;
  /** short human sentence shown in the row */
  explanation: string;
  /** optional deeper "why this signal?" text */
  detail?: string;
}

export interface Company {
  ticker: string;
  name: string;
  exchange: string;
  sector: string;
  industry: string;
  /** one-line plain description */
  blurb: string;
  price: number;
  change: number; // absolute move
  changePct: number; // percent move
  /** demo price series for the sparkline (oldest → newest) */
  spark: number[];
  currency?: string;
}

export interface Ownership {
  owns: boolean;
  averageEntry?: number;
  positionEstablished?: string; // ISO date
  lastUpdated?: string; // ISO date
  note?: string;
}

export interface Metric {
  label: string;
  value: string; // pre-formatted display value, e.g. "$2.4B"
  sub?: string; // e.g. "+18% YoY"
  tone?: "pos" | "neg" | "neutral";
  sourceId: string;
  asOf: string; // ISO date
  definition?: string;
  series?: number[]; // optional trend for a mini chart
}

export interface ValuationRow {
  label: string;
  value: string;
  note?: string;
}

export interface Driver {
  title: string;
  what: string;
  whyItMatters: string;
  evidence: string;
  couldPreventIt: string;
}

export type CatalystKind =
  | "Earnings"
  | "Product"
  | "Regulatory"
  | "Capacity"
  | "Contract"
  | "Industry"
  | "Other";

export interface Catalyst {
  title: string;
  horizon: string; // e.g. "Q4 2026" or "Unknown"
  kind: CatalystKind;
  description: string;
}

export interface BearPoint {
  title: string;
  detail: string;
}

export interface InvalidationCondition {
  condition: string;
  affects: string; // which part of the thesis this would undermine
}

export interface AnalystPerspective {
  source: string; // organization
  analyst?: string;
  date: string; // ISO date
  stance: Stance;
  target?: number; // price target if publicly available
  summary: string;
  sourceId?: string;
}

export type SourceType =
  | "SEC Filing"
  | "Earnings Release"
  | "Investor Presentation"
  | "Company Website"
  | "Financial Data"
  | "Professional Research"
  | "Industry Source";

export type SourceClass =
  | "Primary"
  | "Secondary"
  | "Analyst Opinion"
  | "Author Interpretation";

export interface Source {
  id: string;
  type: SourceType;
  publisher: string;
  title: string;
  url?: string;
  publishedAt?: string;
  accessedAt?: string;
  classification: SourceClass;
}

export type UpdateType =
  | "Initial thesis"
  | "Position established"
  | "Earnings update"
  | "Thesis strengthened"
  | "Thesis weakened"
  | "Correction"
  | "Note";

export interface ResearchUpdate {
  date: string; // ISO date
  type: UpdateType;
  title: string;
  summary: string;
  body?: string;
  priceAtUpdate?: number;
  thesisChanged: boolean;
}

export interface ResearchReport {
  ticker: string; // FK → Company.ticker
  publishedAt: string; // ISO date
  researchPrice: number;
  status: ReportStatus;
  stance: Stance;
  overallSignal: number; // 0–10, summary of the framework (NOT a return forecast)
  tags: string[];
  /** ~100–150 word plain-English "30-second summary" */
  summary: string;
  whyInterested: string[];
  signals: Signal[];
  metrics: Metric[];
  valuation: {
    plainEnglish: string;
    rows: ValuationRow[];
  };
  drivers: Driver[];
  catalysts: Catalyst[];
  bearCase: BearPoint[];
  invalidation: InvalidationCondition[];
  perspectives: AnalystPerspective[];
  disagreement: string[];
  timeline: ResearchUpdate[];
  sources: Source[];
  ownership: Ownership;
}
