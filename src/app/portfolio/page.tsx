import type { Metadata } from "next";
import { getResearchLog } from "@/lib/researchLog";
import { site } from "@/lib/site";
import { formatPct, formatPrice } from "@/lib/format";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Disclosed holdings, for transparency. This is not a copy-my-trades product.",
};

export default async function PortfolioPage() {
  const log = await getResearchLog();
  const p = log?.portfolio;

  return (
    <Container className="py-14 sm:py-20">
      <p className="eyebrow mb-3">Portfolio</p>
      <h1 className="font-serif text-4xl font-semibold tracking-tight text-ink">
        What I actually own
      </h1>
      <p className="mt-4 max-w-2xl text-[0.98rem] leading-relaxed text-ink-soft">
        For transparency, here&rsquo;s where {site.author} has personally put
        money. It exists so you can see the conviction behind the research — it
        is deliberately <strong className="font-medium text-ink">not</strong> a
        &ldquo;copy-my-trades&rdquo; product, and none of it is investment
        advice.
      </p>

      {!p ? (
        <div className="mt-10 rounded-lg border border-line bg-surface p-10 text-center">
          <p className="text-ink-soft">No holdings are currently disclosed.</p>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-4">
            <Summary label="Total value" value={formatPrice(p.totalValue)} />
            <Summary label="Holdings" value={formatPrice(p.holdingsValue)} />
            <Summary label="Cash" value={formatPrice(p.cash)} />
            <Summary
              label="Total gain/loss"
              value={`${formatPrice(p.gainDollar)} · ${formatPct(p.gainPct)}`}
              tone={p.gainPct >= 0 ? "pos" : "neg"}
            />
          </div>

          {/* Holdings */}
          <div className="mt-8 overflow-hidden rounded-lg border border-line">
            {p.holdings.map((h, i) => (
              <div
                key={h.ticker}
                className={
                  "flex items-center justify-between gap-4 bg-surface px-5 py-3.5" +
                  (i > 0 ? " border-t border-line" : "")
                }
              >
                <div className="min-w-0">
                  <span className="font-medium text-ink">{h.name}</span>
                  {h.note && (
                    <span className="ml-2 text-xs text-ink-muted">{h.note}</span>
                  )}
                </div>
                <span className="tnum shrink-0 rounded bg-surface-sunken px-2 py-0.5 text-xs font-semibold text-ink-soft">
                  {h.ticker}
                </span>
              </div>
            ))}
          </div>

          {p.pending && p.pending.length > 0 && (
            <div className="mt-4 rounded-lg border border-dashed border-line-strong bg-surface p-4">
              <p className="text-sm text-ink-soft">
                <Badge tone="warn">Just added</Badge>{" "}
                {p.pending.map((h) => (
                  <span key={h.ticker}>
                    <strong className="font-medium text-ink">{h.name}</strong> (
                    {h.ticker}){h.note ? ` — ${h.note}` : ""}
                  </span>
                ))}
              </p>
            </div>
          )}

          <p className="mt-8 text-xs leading-relaxed text-ink-muted">
            Snapshot as of {p.asOf}, from my own portfolio tracker. Positions are
            small and some are fractional; per-position cost basis lives in my
            private dashboard. Values move constantly — this is a transparency
            disclosure, not a performance claim, and not advice.
          </p>
        </>
      )}
    </Container>
  );
}

function Summary({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "pos" | "neg";
}) {
  return (
    <div className="bg-surface p-4">
      <p className="text-[0.68rem] font-semibold uppercase tracking-wide text-ink-muted">
        {label}
      </p>
      <p
        className={
          "tnum mt-1 text-lg font-semibold " +
          (tone === "pos"
            ? "text-pos"
            : tone === "neg"
              ? "text-neg"
              : "text-ink")
        }
      >
        {value}
      </p>
    </div>
  );
}
