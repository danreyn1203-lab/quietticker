import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Check } from "@/components/ui/icons";

const trust = [
  "Independent research",
  "Transparent process",
  "Sources & disclosures",
  "Long-term focus",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      {/* Very subtle paper texture / warmth — no glowing charts */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(60% 60% at 15% 0%, var(--brand-soft) 0%, transparent 60%)",
        }}
        aria-hidden
      />
      <Container className="relative py-20 sm:py-28">
        <div className="max-w-3xl">
          <p className="eyebrow mb-4">Independent stock research</p>
          <h1 className="font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-6xl">
            Find companies before they become obvious.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
            Independent, transparent research on companies with interesting
            growth opportunities, unusual competitive advantages, and
            potentially overlooked fundamentals.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button href="/#research">
              Explore Research
              <ArrowRight width={16} height={16} />
            </Button>
            <Button href="/methodology" variant="secondary">
              How research works
            </Button>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
            {trust.map((t) => (
              <li
                key={t}
                className="inline-flex items-center gap-2 text-sm text-ink-soft"
              >
                <span className="grid h-5 w-5 place-items-center rounded-full bg-pos-soft text-pos">
                  <Check width={12} height={12} />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
