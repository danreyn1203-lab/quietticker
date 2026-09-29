import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { formatPrice, formatPct } from "@/lib/format";
import { ArrowUp } from "@/components/ui/icons";

/**
 * "In the open" — a real, disclosed position shown for transparency (§43 trust
 * model, §15 disclosure). Framed as conviction + accountability, NOT as a
 * promise of the reader's results (the plan's core rule is "No hype").
 * Figures are verifiable and dated.
 */
const META = {
  ticker: "META",
  name: "Meta Platforms",
  boughtOn: "August 25, 2026",
  buyPrice: 570.05,
  current: 747.82,
  asOf: "September 26, 2026",
};

export function OpenTrackRecord() {
  const gainPct = ((META.current - META.buyPrice) / META.buyPrice) * 100;

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
              bought. On {META.boughtOn} I bought {META.name}, and I&rsquo;m
              showing you what&rsquo;s happened since. That&rsquo;s the whole
              idea here: watch the thinking, see the risks, and judge the calls
              for yourself.
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
                    {META.name}
                  </span>
                  <span className="tnum rounded bg-surface-sunken px-2 py-0.5 text-sm font-semibold text-ink-soft">
                    {META.ticker}
                  </span>
                </div>
                <p className="mt-1 text-xs text-ink-muted">
                  Disclosed position · bought {META.boughtOn}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-pos-soft px-3 py-1.5 text-lg font-semibold text-pos">
                <ArrowUp width={16} height={16} />
                <span className="tnum">{formatPct(gainPct)}</span>
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-muted">
                  My entry
                </p>
                <p className="tnum mt-1 text-2xl font-semibold text-ink">
                  {formatPrice(META.buyPrice)}
                </p>
                <p className="text-xs text-ink-muted">on {META.boughtOn}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-muted">
                  Now
                </p>
                <p className="tnum mt-1 text-2xl font-semibold text-ink">
                  {formatPrice(META.current)}
                </p>
                <p className="text-xs text-ink-muted">as of {META.asOf}</p>
              </div>
            </div>

            <p className="mt-6 border-t border-line pt-4 text-xs leading-relaxed text-ink-muted">
              One position I disclosed publicly — <strong>not</strong> a promise
              of your results, and not advice. I log the misses too. Past
              performance doesn&rsquo;t predict the future.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
