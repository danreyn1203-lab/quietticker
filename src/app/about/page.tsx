import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About",
  description: `About ${site.name} — an independent, transparent stock-research project by ${site.author}.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <Container className="max-w-2xl py-14 sm:py-20">
      <p className="eyebrow mb-3">About</p>
      <h1 className="font-serif text-4xl font-semibold tracking-tight text-ink">
        Independent research, in the open
      </h1>

      <div className="reading mt-6">
        <p>
          {site.name} is an independent stock-research project by {site.author}.
          The idea is simple: pick interesting companies, explain in plain English
          why they’re interesting, back every claim with a real source, and show
          my own money where my conviction is.
        </p>
        <p>
          I’m genuinely good at finding stocks — that’s the fun part. So each
          write-up leads with a clear thesis and my own rating, then backs it up
          with verified figures, cited sources, and charts. I also disclose what I
          actually own and when I bought it, keep a dated research journal, and
          write a real bear case for every idea. If I get something wrong, the
          original stays on the record.
        </p>
        <p>
          Everything here is <strong>free</strong>, and it always aims to{" "}
          <strong>explain</strong> rather than hype. You should be able to check
          my work line by line.
        </p>
      </div>

      <div className="mt-8 rounded-lg border border-line bg-surface p-6">
        <h2 className="font-serif text-lg font-semibold text-ink">How to read it</h2>
        <ul className="mt-3 space-y-2 text-sm text-ink-soft">
          <li>
            <strong className="text-ink">Ratings</strong> are my own judgment (1–10),
            not a prediction of returns.
          </li>
          <li>
            <strong className="text-ink">Facts &amp; figures</strong> are dated and
            linked to their source — verify anything before you act on it.
          </li>
          <li>
            <strong className="text-ink">Disclosures</strong> show whether I own a
            stock. Owning it is conviction, not proof it’ll go up.
          </li>
        </ul>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button href="/journal">Read the research</Button>
        <Button href="/methodology" variant="secondary">
          How research works
        </Button>
      </div>

      <p className="mt-10 border-t border-line pt-6 text-xs leading-relaxed text-ink-muted">
        <strong className="text-ink-soft">Disclaimer.</strong> {site.name} is an
        independent project for educational and informational purposes only.
        Nothing here is investment advice, a recommendation, or an offer to buy or
        sell any security. Always do your own research.
      </p>
    </Container>
  );
}
