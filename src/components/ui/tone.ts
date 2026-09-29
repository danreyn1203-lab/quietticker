import type { Tone } from "@/lib/signals";

/** Soft-background chip styles per semantic tone. */
export const toneBadge: Record<Tone, string> = {
  pos: "bg-pos-soft text-pos",
  warn: "bg-warn-soft text-warn",
  neutral: "bg-neutral-soft text-ink-soft",
  neg: "bg-neg-soft text-neg",
  brand: "bg-brand-soft text-brand-ink",
};

/** Solid dot color per tone (paired with text for accessibility). */
export const toneDot: Record<Tone, string> = {
  pos: "bg-pos",
  warn: "bg-warn",
  neutral: "bg-neutral",
  neg: "bg-neg",
  brand: "bg-brand",
};

/** Foreground text color per tone. */
export const toneText: Record<Tone, string> = {
  pos: "text-pos",
  warn: "text-warn",
  neutral: "text-ink-soft",
  neg: "text-neg",
  brand: "text-brand",
};
