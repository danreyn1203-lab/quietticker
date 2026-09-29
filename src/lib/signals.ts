/**
 * Signal + methodology configuration.
 *
 * "My Research Signal" is a summary of a documented framework — NOT a
 * prediction of returns (master plan §18, §46). Weights and definitions live
 * here so the methodology page and the badges stay in sync.
 */

import type { Assessment, SignalCategory } from "./types";

export type Tone = "pos" | "warn" | "neutral" | "neg" | "brand";

interface AssessmentMeta {
  label: string;
  tone: Tone;
  /** relative strength 0–1, used only to describe the framework */
  strength: number;
}

export const ASSESSMENTS: Record<Assessment, AssessmentMeta> = {
  strong: { label: "Strong", tone: "pos", strength: 1 },
  solid: { label: "Solid", tone: "pos", strength: 0.8 },
  mixed: { label: "Mixed", tone: "warn", strength: 0.5 },
  moderate: { label: "Moderate", tone: "warn", strength: 0.5 },
  present: { label: "Present", tone: "neutral", strength: 0.5 },
  weak: { label: "Weak", tone: "neg", strength: 0.25 },
};

export interface CategoryMeta {
  category: SignalCategory;
  weight: number; // documented framework weight (sums to 1 across categories)
  definition: string;
}

/**
 * Documented weights. Risk is treated as a discount on conviction, not a
 * positive contributor — a higher risk reading lowers the overall signal.
 */
export const CATEGORY_META: CategoryMeta[] = [
  {
    category: "Growth",
    weight: 0.22,
    definition:
      "How fast the business is expanding, and how durable that expansion looks.",
  },
  {
    category: "Competitive Advantage",
    weight: 0.2,
    definition:
      "Whether the company has a structural edge that is hard for rivals to copy.",
  },
  {
    category: "Financial Strength",
    weight: 0.18,
    definition:
      "Balance-sheet health, cash generation, and resilience through a downturn.",
  },
  {
    category: "Valuation",
    weight: 0.15,
    definition:
      "What you pay today relative to the business you are buying — context, not a target.",
  },
  {
    category: "Catalyst",
    weight: 0.1,
    definition:
      "Identifiable events that could change how the market sees the company.",
  },
  {
    category: "Risk",
    weight: 0.15,
    definition:
      "Known ways the thesis could break. Higher risk lowers the overall signal.",
  },
];

/** Risk is never colored like a positive — it reads as caution, not "good". */
export function signalTone(category: SignalCategory, a: Assessment): Tone {
  if (category === "Risk") {
    if (a === "weak") return "neg";
    if (a === "strong" || a === "solid") return "pos"; // "low risk"
    return "warn";
  }
  return ASSESSMENTS[a].tone;
}

/** Risk phrases its levels differently ("Low / Moderate / Elevated"). */
export function assessmentLabel(category: SignalCategory, a: Assessment): string {
  if (category === "Risk") {
    if (a === "strong" || a === "solid") return "Low";
    if (a === "weak") return "Elevated";
    if (a === "present") return "Present";
    return "Moderate";
  }
  return ASSESSMENTS[a].label;
}

/* ---- Explore Signals: the clickable discovery tags (§11) ---- */

export interface SignalTagMeta {
  label: string;
  slug: string;
  description: string;
}

export const EXPLORE_SIGNALS: SignalTagMeta[] = [
  {
    label: "AI Infrastructure",
    slug: "ai-infrastructure",
    description: "The picks-and-shovels behind the AI boom — power, connectors, and cables.",
  },
  {
    label: "Data Centers",
    slug: "data-centers",
    description: "Companies selling straight into the data-center build-out.",
  },
  {
    label: "Nuclear & Utilities",
    slug: "nuclear-utilities",
    description: "Boring, regulated power — real dividends, and actually being used.",
  },
  {
    label: "High Dividend",
    slug: "high-dividend",
    description: "Stocks and ETFs that pay you well while you wait.",
  },
  {
    label: "Industrials",
    slug: "industrials",
    description: "Tangible “boring industries” that everything else depends on.",
  },
  {
    label: "Consumer Staples",
    slug: "consumer-staples",
    description: "Everyday products people buy in any market — steady, dependable payers.",
  },
  {
    label: "Undersea Cables",
    slug: "undersea-cables",
    description: "The literal backbone of the internet, laid under the ocean.",
  },
  {
    label: "Underfollowed",
    slug: "underfollowed",
    description: "Interesting names to find before the whole world catches on.",
  },
];

/** Ordered category list for iterating signals consistently. */
export const CATEGORY_ORDER: SignalCategory[] = CATEGORY_META.map(
  (c) => c.category,
);
