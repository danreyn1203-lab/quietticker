"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { formatPrice, formatPct, formatDate } from "@/lib/format";
import { ArrowUp, ArrowDown } from "@/components/ui/icons";

/** A slide's worth of data — plain values, computed on the server. */
export interface StandoutSlide {
  ticker: string;
  name: string;
  note: string;
  price: number;
  currency: string;
  asOf: string;
  yearChangePct: number | null;
  stale: boolean;
}

/**
 * A quiet auto-advancing showcase of the portfolio's standout holdings.
 * One card at a time so it never crowds the page — the minimalist band stays
 * one band tall no matter how many stocks are in the list. Auto-play pauses on
 * hover/focus and is disabled entirely under prefers-reduced-motion; dots and
 * arrows drive it by hand. All prices come from Yahoo Finance (daily).
 */
export function StandoutsCarousel({ slides }: { slides: StandoutSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  const go = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count],
  );

  // Auto-advance, unless paused or the viewer prefers reduced motion.
  const reduced = useRef(false);
  useEffect(() => {
    reduced.current =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (count < 2 || paused || reduced.current) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), 5500);
    return () => clearInterval(id);
  }, [count, paused, index]);

  if (count === 0) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      role="group"
      aria-roledescription="carousel"
      aria-label="Standout holdings"
    >
      {/* Track */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((s, i) => (
            <div
              key={s.ticker}
              className="w-full shrink-0 px-0.5"
              aria-hidden={i !== index}
            >
              <Card slide={s} />
            </div>
          ))}
        </div>
      </div>

      {count > 1 && (
        <div className="mt-5 flex items-center justify-between">
          {/* Dots */}
          <div className="flex items-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.ticker}
                type="button"
                onClick={() => go(i)}
                aria-label={`Show ${s.name}`}
                aria-current={i === index}
                className={
                  "h-2 rounded-full transition-all " +
                  (i === index
                    ? "w-6 bg-brand"
                    : "w-2 bg-line-strong hover:bg-ink-muted")
                }
              />
            ))}
          </div>

          {/* Arrows */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous"
              className="grid h-9 w-9 place-items-center rounded-full border border-line-strong bg-surface text-ink-soft transition-colors hover:text-ink"
            >
              <span aria-hidden className="-ml-0.5 rotate-180">
                <ArrowRightGlyph />
              </span>
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next"
              className="grid h-9 w-9 place-items-center rounded-full border border-line-strong bg-surface text-ink-soft transition-colors hover:text-ink"
            >
              <ArrowRightGlyph />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Card({ slide }: { slide: StandoutSlide }) {
  const pct = slide.yearChangePct;
  const up = (pct ?? 0) >= 0;

  return (
    <div className="rounded-2xl border border-line bg-paper p-6 shadow-sm sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-serif text-xl font-semibold text-ink">
              {slide.name}
            </span>
            <span className="tnum rounded bg-surface-sunken px-2 py-0.5 text-sm font-semibold text-ink-soft">
              {slide.ticker}
            </span>
          </div>
          <p className="mt-1 text-xs text-ink-muted">In my portfolio</p>
        </div>

        {pct !== null && (
          <span
            className={
              "inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-lg font-semibold " +
              (up ? "bg-pos-soft text-pos" : "bg-neg-soft text-neg")
            }
          >
            {up ? (
              <ArrowUp width={16} height={16} />
            ) : (
              <ArrowDown width={16} height={16} />
            )}
            <span className="tnum">{formatPct(pct)}</span>
          </span>
        )}
      </div>

      <div className="mt-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-ink-muted">Price</p>
          <p className="tnum mt-1 text-3xl font-semibold text-ink">
            {formatPrice(slide.price, slide.currency)}
          </p>
          <p className="text-xs text-ink-muted">
            at the {formatDate(slide.asOf)} close
          </p>
        </div>
        {pct !== null && (
          <p className="text-right text-xs text-ink-muted">
            past 12 months
            <br />
            <span className={up ? "text-pos" : "text-neg"}>
              {up ? "up" : "down"} {formatPct(pct).replace(/^[+−-]/, "")}
            </span>
          </p>
        )}
      </div>

      <p className="mt-6 border-t border-line pt-4 text-sm leading-relaxed text-ink-soft">
        {slide.note}
      </p>
      <p className="mt-2 text-xs text-ink-muted">
        Live price from Yahoo Finance, refreshed daily
        {slide.stale ? " (last successful update shown)" : ""}. A market return,
        not my personal return — and not advice.
      </p>
    </div>
  );
}

/** Small chevron used by the carousel arrows. */
function ArrowRightGlyph() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
