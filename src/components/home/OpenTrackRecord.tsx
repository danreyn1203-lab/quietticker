import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { formatPrice, formatPct, formatDate } from "@/lib/format";
import { ArrowUp, ArrowDown } from "@/components/ui/icons";
import { DISCLOSED_POSITION as pos } from "@/lib/holdings";
import { getQuote } from "@/lib/quotes";

/**
 * "In the open" — a real, disclosed position shown for transparency (§43 trust
 * model, §15 disclosure). Framed as conviction + accountability, NOT as a
 * promise of the reader's results (the plan's core rule is "No hype").
 * Figures are verifiable and dated: the entry is fixed history, the current
 * price refreshes daily from Yahoo Finance (src/lib/quotes.ts).
 */
export async function OpenTrackRecord() {
  const quote = await getQuote(pos.ticker);
  const current = quote?.price ?? pos.fallbackPrice;
  const asOf = quote?.asOf ?? pos.fallbackAsOf;
  const gainPct = ((current - pos.buyPrice) / pos.buyPrice) * 100;
  const up = gainPct >= 0;
  const boughtOn = formatDate(pos.boughtOn);

  return (
    <section className="border-b border-line bg-surface">
      <Container className="py-14">
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="eyebrow mb-3">In the open</p>
            <h2 className="font-serif text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-[2.1rem]">
              I put my own money where my research is.
            </h2>
            <p className="mt-4 max-w-md text-[0.98rem] leading-relaxed text-ink-soft">
              Real research, disclosed in public — including the exact date I
              bought. On {boughtOn} I bought {pos.name}, and I&rsquo;m showing
              you what&rsquo;s happened since. That&rsquo;s the whole idea here:
              watch the thinking, see the risks, and judge the calls for
              yourself.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button href="/journal">See the research</Button>
              <Button href="/methodology" variant="secondary">
                How this works
              </Button>
            </div>
          </div>

          {/* Disclosed position card */}
          <div className="rounded-2xl border border-line bg-paper p-6 shadow-sm sm:p-7">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif text-xl font-semibold text-ink">
                    {pos.name}
                  </span>
                  <span className="tnum rounded bg-surface-sunken px-2 py-0.5 text-sm font-semibold text-ink-soft">
                    {pos.ticker}
                  </span>
                </div>
                <p className="mt-1 text-xs text-ink-muted">
                  Disclosed position · bought {boughtOn}
                </p>
              </div>
              <span
                className={
                  "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-lg font-semibold " +
                  (up ? "bg-pos-soft text-pos" : "bg-neg-soft text-neg")
                }
              >
                {up ? (
                  <ArrowUp width={16} height={16} />
                ) : (
                  <ArrowDown width={16} height={16} />
                )}
                <span className="tnum">{formatPct(gainPct)}</span>
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-muted">
                  My entry
                </p>
                <p className="tnum mt-1 text-2xl font-semibold text-ink">
                  {formatPrice(pos.buyPrice)}
                </p>
                <p className="text-xs text-ink-muted">on {boughtOn}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-muted">
                  Now
                </p>
                <p className="tnum mt-1 text-2xl font-semibold text-ink">
                  {formatPrice(current, quote?.currency ?? "USD")}
                </p>
                <p className="text-xs text-ink-muted">
                  at the {formatDate(asOf)} close
                </p>
              </div>
            </div>

            <p className="mt-6 border-t border-line pt-4 text-xs leading-relaxed text-ink-muted">
              One position I disclosed publicly — <strong>not</strong> a promise
              of your results, and not advice. I log the misses too. Past
              performance doesn&rsquo;t predict the future.
            </p>
            <p className="mt-2 text-xs text-ink-muted">
              Price from Yahoo Finance, refreshed daily
              {quote?.stale ? " (last successful update shown)" : ""}.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
