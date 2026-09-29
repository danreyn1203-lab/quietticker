import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { site } from "@/lib/site";
import { CATEGORY_META, ASSESSMENTS } from "@/lib/signals";
import { cn } from "@/lib/cn";
import { toneBadge } from "@/components/ui/tone";

export const metadata: Metadata = {
  title: "How Research Works",
  description:
    "How companies are discovered, how signals are determined, how the research signal is calculated, and how ownership is disclosed.",
};

function Block({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-line pt-10">
      <h2 className="font-serif text-2xl font-semibold tracking-tight text-ink">
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-[0.98rem] leading-relaxed text-ink-soft">
        {children}
      </div>
    </section>
  );
}

const legendOrder = ["strong", "mixed", "weak"] as const;

export default function MethodologyPage() {
  return (
    <Container className="max-w-3xl py-14 sm:py-20">
      <p className="eyebrow mb-3">Methodology</p>
      <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight text-ink">
        How research works
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-ink-soft">
        This page explains the process behind every report — how companies are
        found, how they&rsquo;re assessed, and how ownership is disclosed. It is
        the foundation of the whole project: {site.tagline.toLowerCase()}
      </p>

      <div className="mt-12 space-y-10">
        <Block id="discovery" title="Discovery">
          <p>
            The starting point is companies that aren&rsquo;t the obvious,
            trending choices — businesses that look underfollowed relative to
            their opportunity, often with an industry tailwind, an emerging
            competitive advantage, or improving fundamentals. These are research
            signals to investigate, not guarantees.
          </p>
        </Block>

        <Block id="signals" title="Signals">
          <p>
            Each report is assessed across six dimensions. Every dimension gets a
            plain-language reading backed by evidence, plus a short explanation
            you can expand. Readings use a simple scale:
          </p>
          <div className="flex flex-wrap gap-3">
            {legendOrder.map((a) => (
              <span
                key={a}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold",
                  toneBadge[ASSESSMENTS[a].tone],
                )}
              >
                {ASSESSMENTS[a].label}
              </span>
            ))}
          </div>
          <p>
            <strong className="font-semibold text-ink">Strong</strong> means the
            evidence is clear and consistent;{" "}
            <strong className="font-semibold text-ink">Mixed</strong> means the
            picture is genuinely two-sided;{" "}
            <strong className="font-semibold text-ink">Weak</strong> means the
            evidence is thin or points the wrong way.
          </p>
        </Block>

        <Block id="research-signal" title="My Research Signal">
          <p>
            The overall signal is a weighted combination of the six dimensions.
            The weights are fixed and documented below. Risk is treated as a{" "}
            <strong className="font-semibold text-ink">discount</strong> — a
            higher risk reading lowers the overall signal rather than raising it.
          </p>
          <div className="overflow-hidden rounded-lg border border-line">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line bg-surface-sunken text-left">
                  <th className="px-4 py-2.5 font-semibold text-ink">
                    Dimension
                  </th>
                  <th className="px-4 py-2.5 font-semibold text-ink">Weight</th>
                  <th className="px-4 py-2.5 font-semibold text-ink">
                    What it measures
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {CATEGORY_META.map((c) => (
                  <tr key={c.category}>
                    <td className="px-4 py-3 font-medium text-ink">
                      {c.category}
                    </td>
                    <td className="tnum px-4 py-3 text-ink-soft">
                      {Math.round(c.weight * 100)}%
                    </td>
                    <td className="px-4 py-3 text-ink-soft">{c.definition}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="rounded-lg bg-surface-sunken p-4 text-sm">
            <strong className="font-semibold text-ink">Important:</strong> the
            score summarizes research conviction. It is not a prediction of
            returns, and a high number is not a &ldquo;buy&rdquo; signal.
          </p>
        </Block>

        <Block id="valuation" title="Valuation">
          <p>
            Valuation is explained in plain English and shown with a small set of
            company-appropriate ratios — not every ratio automatically. The goal
            is context (&ldquo;what are you paying, and for what?&rdquo;), never a
            price target.
          </p>
        </Block>

        <Block id="risk" title="Risk & the bear case">
          <p>
            Every report includes a serious bear case — the real ways the thesis
            could fail — and a separate set of specific, testable conditions that
            would change the thesis. These are written in advance, so they
            can&rsquo;t be quietly forgotten later.
          </p>
        </Block>

        <Block id="perspectives" title="Professional perspectives">
          <p>
            Where legitimately available, professional and analyst views are
            shown alongside the thesis, with their source, organization, and
            date — including where they disagree. Opinions are labeled as
            opinions and never presented as fact.
          </p>
        </Block>

        <Block id="performance" title="Performance tracking">
          <p>
            Over time, each published thesis keeps its research date and research
            price so it can be compared with what happened next. The archive is
            designed to include unsuccessful and abandoned theses too — not only
            the winners.
          </p>
        </Block>

        <Block id="disclosures" title="Disclosures">
          <p>
            Ownership is disclosed on every report. It signals personal
            conviction — it is{" "}
            <strong className="font-semibold text-ink">not</strong> evidence a
            stock will perform well, and not owning a stock is not a bearish
            signal.
          </p>
          <p>
            {site.name} is an independent project for educational and
            informational purposes only. Nothing here is investment advice or a
            recommendation. Any sponsorship, if introduced later, will be clearly
            disclosed and kept separate from editorial research — a company can
            never pay for a favorable rating.
          </p>
        </Block>
      </div>
    </Container>
  );
}
