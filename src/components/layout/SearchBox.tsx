"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { searchItems } from "@/lib/searchIndex";
import { Search } from "@/components/ui/icons";

/** Search across published research — ticker / company name / theme (§28). */
export function SearchBox({ className }: { className?: string }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const router = useRouter();
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return searchItems
      .filter(
        (c) =>
          c.ticker.toLowerCase().includes(term) ||
          c.name.toLowerCase().includes(term) ||
          c.sub.toLowerCase().includes(term),
      )
      .slice(0, 6);
  }, [q]);

  function go(href: string) {
    setOpen(false);
    setQ("");
    router.push(href);
  }

  return (
    <div className={cn("relative", className)}>
      <div className="flex h-10 items-center gap-2 rounded-md border border-line-strong bg-surface px-3 text-ink-soft focus-within:border-brand">
        <Search width={16} height={16} className="shrink-0 text-ink-muted" />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
            setActive(0);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            blurTimer.current = setTimeout(() => setOpen(false), 120);
          }}
          onKeyDown={(e) => {
            if (!results.length) return;
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => (a + 1) % results.length);
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => (a - 1 + results.length) % results.length);
            } else if (e.key === "Enter") {
              e.preventDefault();
              go(results[active].href);
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          type="text"
          placeholder="Search companies, tickers, themes…"
          aria-label="Search companies, tickers, themes"
          className="h-full w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted"
        />
      </div>

      {open && results.length > 0 && (
        <ul className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-lg border border-line bg-surface py-1 shadow-lg">
          {results.map((c, i) => (
            <li key={c.ticker}>
              <Link
                href={c.href}
                onMouseDown={(e) => {
                  e.preventDefault();
                  if (blurTimer.current) clearTimeout(blurTimer.current);
                  go(c.href);
                }}
                onMouseEnter={() => setActive(i)}
                className={cn(
                  "flex items-center justify-between gap-3 px-3 py-2 text-sm",
                  i === active ? "bg-surface-sunken" : "",
                )}
              >
                <span className="min-w-0">
                  <span className="font-medium text-ink">{c.name}</span>
                  <span className="ml-2 text-xs text-ink-muted">{c.sub}</span>
                </span>
                <span className="tnum shrink-0 rounded bg-surface-sunken px-1.5 py-0.5 text-xs font-semibold text-ink-soft">
                  {c.ticker}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
