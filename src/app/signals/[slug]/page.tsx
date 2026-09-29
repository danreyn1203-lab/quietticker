import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EXPLORE_SIGNALS } from "@/lib/signals";
import { getResearchLog } from "@/lib/researchLog";
import { Container } from "@/components/layout/Container";
import { ResearchedCard } from "@/components/home/ResearchedCard";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "@/components/ui/icons";

export const dynamic = "force-dynamic";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = EXPLORE_SIGNALS.find((s) => s.slug === slug);
  if (!meta) return { title: "Signal not found" };
  return { title: `${meta.label} — Discover`, description: meta.description };
}

export default async function SignalPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const meta = EXPLORE_SIGNALS.find((s) => s.slug === slug);
  if (!meta) notFound();

  const log = await getResearchLog();
  const items = (log?.companies ?? []).filter((c) =>
    (c.tags ?? []).includes(meta.label),
  );

  return (
    <Container className="py-14 sm:py-20">
      <Link
        href="/#research"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
      >
        <ArrowRight width={15} height={15} className="rotate-180" />
        All research
      </Link>

      <p className="eyebrow mb-3 mt-6">Signal</p>
      <h1 className="font-serif text-4xl font-semibold tracking-tight text-ink">
        {meta.label}
      </h1>
      <p className="mt-4 max-w-2xl text-[0.98rem] leading-relaxed text-ink-soft">
        {meta.description} Signals are just a way to browse my research by theme —
        not investment guarantees.
      </p>

      {items.length === 0 ? (
        <div className="mt-10 rounded-lg border border-line bg-surface p-12 text-center">
          <h2 className="font-serif text-xl font-semibold text-ink">
            No research tagged &ldquo;{meta.label}&rdquo; yet.
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-ink-soft">
            Nothing published under this signal so far. Browse the rest of the
            research in the meantime.
          </p>
          <Button href="/#research" className="mt-6">
            Explore research
            <ArrowRight width={16} height={16} />
          </Button>
        </div>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((company) => (
            <ResearchedCard key={company.ticker} company={company} />
          ))}
        </div>
      )}
    </Container>
  );
}
