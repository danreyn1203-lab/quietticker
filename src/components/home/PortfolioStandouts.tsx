import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { STANDOUTS } from "@/lib/holdings";
import { getQuotes } from "@/lib/quotes";
import {
  StandoutsCarousel,
  type StandoutSlide,
} from "./StandoutsCarousel";

/**
 * "Standouts" — a rotating look at the impressive names in the portfolio, each
 * priced daily from Yahoo Finance. One band, one card at a time, so it adds a
 * single section rather than a wall of tiles. If no prices are available yet
 * (first render before any fetch has succeeded) the whole band stays hidden
 * rather than showing empty cards.
 */
export async function PortfolioStandouts() {
  const quotes = await getQuotes(STANDOUTS.map((s) => s.ticker));
  const byTicker = new Map(quotes.map((q) => [q.ticker, q]));

  const slides: StandoutSlide[] = STANDOUTS.flatMap((s) => {
    const q = byTicker.get(s.ticker.toUpperCase());
    if (!q) return [];
    return [
      {
        ticker: s.ticker,
        name: s.name,
        note: s.note,
        price: q.price,
        currency: q.currency,
        asOf: q.asOf,
        yearChangePct: q.yearChangePct,
        stale: q.stale,
      },
    ];
  });

  if (slides.length === 0) return null;

  return (
    <section className="border-b border-line bg-paper">
      <Container className="py-14">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <p className="eyebrow mb-3">Standouts</p>
            <h2 className="font-serif text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-[2.1rem]">
              The names carrying the portfolio.
            </h2>
            <p className="mt-4 max-w-md text-[0.98rem] leading-relaxed text-ink-soft">
              A few of the holdings I&rsquo;m most convinced by, with their prices
              kept current from Yahoo Finance. These are real positions I own —
              shown for transparency, not as a tip sheet.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button href="/portfolio" variant="secondary">
                See the full portfolio
              </Button>
            </div>
          </div>

          <StandoutsCarousel slides={slides} />
        </div>
      </Container>
    </section>
  );
}
