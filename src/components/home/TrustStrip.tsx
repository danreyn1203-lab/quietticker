import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "@/components/ui/icons";

const principles = [
  {
    title: "Every claim is sourced",
    body: "Factual statements link to filings, earnings releases, and primary documents. If it can't be verified, it isn't presented as verified.",
  },
  {
    title: "Ownership is disclosed",
    body: "You always see whether I own a stock — and that's treated as personal conviction, never as proof the stock will go up.",
  },
  {
    title: "History is preserved",
    body: "Published theses aren't quietly edited. When I'm wrong, the original stays on the record and the update explains what changed.",
  },
];

export function TrustStrip() {
  return (
    <section className="border-y border-line bg-surface">
      <Container className="py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:items-center">
          <div>
            <p className="eyebrow mb-3">Show your work</p>
            <h2 className="font-serif text-3xl font-semibold leading-tight tracking-tight text-ink">
              Research you can check, line by line.
            </h2>
            <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-ink-soft">
              The advantage here isn&rsquo;t more data — it&rsquo;s
              understanding and transparency. See exactly why a company is
              interesting, what could go wrong, and what I said before the stock
              moved.
            </p>
            <Button href="/methodology" variant="secondary" className="mt-6">
              Read the methodology
              <ArrowRight width={16} height={16} />
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {principles.map((p) => (
              <div
                key={p.title}
                className="rounded-lg border border-line bg-paper p-5"
              >
                <h3 className="text-sm font-semibold text-ink">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
