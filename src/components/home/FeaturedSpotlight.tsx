import { getFeatured } from "@/lib/articles/featured";
import { site } from "@/lib/site";
import { formatPrice, formatDate } from "@/lib/format";
import { getQuote } from "@/lib/quotes";
import { renderParagraphs, renderInline } from "@/lib/markdown";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Check } from "@/components/ui/icons";

export async function FeaturedSpotlight() {
  const f = await getFeatured();
  if (!f) return null;

  // Price is fetched live from Yahoo Finance (daily-cached) when the ticker
  // resolves; otherwise we fall back to the price typed in /admin/featured, so
  // the card is never blank — handy for thin OTC names Yahoo may not carry.
  const quote = f.ticker ? await getQuote(f.ticker) : null;
  const price = quote?.price ?? f.price;
  const currency = quote?.currency ?? f.currency ?? "USD";
  const priceNote = quote
    ? `at the ${formatDate(quote.asOf)} close${quote.stale ? " · last update" : ""}`
    : f.priceNote;

  const thesis = renderParagraphs(f.whyWatching);

  return (
    <section>
      <SectionHeading
        eyebrow={f.eyebrow}
        title="One company, up close"
        description="The stock I’m paying the most attention to right now — the thesis, the catalyst, and my disclosure."
      />

      <Card className="mt-6 overflow-hidden">
        <div className="grid gap-0 lg:grid-cols-[1.55fr_1fr]">
          {/* Thesis */}
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-serif text-2xl font-semibold text-ink">
                    {f.name}
                  </h3>
                  <span className="tnum rounded bg-surface-sunken px-2 py-0.5 text-sm font-semibold text-ink-soft">
                    {f.ticker}
                  </span>
                </div>
                <p className="mt-1 text-sm text-ink-muted">
                  {f.exchange} · {f.sector} · {f.industry}
                </p>
              </div>
              <div className="text-right">
                <div className="tnum text-2xl font-semibold text-ink">
                  {formatPrice(price, currency)}
                </div>
                {priceNote && (
                  <p className="mt-0.5 text-xs text-ink-muted">{priceNote}</p>
                )}
                {quote && (
                  <p className="mt-0.5 text-[0.7rem] text-ink-muted">
                    Yahoo Finance · daily
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <p className="eyebrow mb-2">Why I’m watching this</p>
              <div className="reading text-[1.02rem]">
                {thesis.map((html, i) => (
                  <p key={i} dangerouslySetInnerHTML={{ __html: html }} />
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {f.tags.map((t) => (
                <Badge key={t} tone="brand">
                  {t}
                </Badge>
              ))}
            </div>

            {f.ctaHref && (
              <div className="mt-7">
                <Button href={f.ctaHref}>
                  {f.ctaLabel ?? "Read more"}
                  <ArrowRight width={16} height={16} />
                </Button>
              </div>
            )}
          </div>

          {/* Side panel */}
          <div className="flex flex-col gap-5 border-t border-line bg-surface-sunken p-6 sm:p-8 lg:border-l lg:border-t-0">
            {f.catalyst && (
              <div>
                <p className="eyebrow mb-1.5">{f.catalystLabel ?? "The catalyst"}</p>
                <p
                  className="text-sm leading-relaxed text-ink-soft"
                  dangerouslySetInnerHTML={{ __html: renderInline(f.catalyst) }}
                />
              </div>
            )}

            <div className="rounded-lg border border-line bg-surface p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-ink">
                  {site.author}’s position
                </p>
                <span
                  className={
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold " +
                    (f.owns
                      ? "bg-pos-soft text-pos"
                      : "bg-neutral-soft text-ink-soft")
                  }
                >
                  {f.owns && <Check width={12} height={12} />}
                  {f.owns ? "Owns shares" : "No position"}
                </span>
              </div>
              {f.positionNote && (
                <p className="mt-2 text-xs leading-relaxed text-ink-soft">
                  {f.positionNote}
                </p>
              )}
            </div>

            {f.note && (
              <p className="text-xs leading-relaxed text-ink-muted">{f.note}</p>
            )}
            {f.disclaimer && (
              <p className="border-t border-line pt-3 text-xs leading-relaxed text-ink-muted">
                {f.disclaimer}
              </p>
            )}
          </div>
        </div>
      </Card>
    </section>
  );
}
