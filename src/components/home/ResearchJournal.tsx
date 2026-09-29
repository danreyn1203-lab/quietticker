import { getResearchLog } from "@/lib/researchLog";
import { formatDateShort } from "@/lib/format";
import type { Tone } from "@/lib/signals";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const typeTone: Record<string, Tone> = {
  Bought: "pos",
  Rated: "brand",
  Published: "brand",
  Sold: "neg",
  Note: "neutral",
};

export async function ResearchJournal() {
  const log = await getResearchLog();
  const entries = log?.journal ?? [];
  if (entries.length === 0) return null;

  return (
    <section>
      <SectionHeading
        eyebrow="Research journal"
        title="What I did, and when"
        description="Every rating, buy and write-up is logged here with a timestamp. History is added to — never quietly rewritten."
      />

      <Card className="mt-6 divide-y divide-line">
        {entries.map((e, i) => (
          <div
            key={`${e.ticker ?? "x"}-${e.date}-${i}`}
            className="flex flex-col gap-2 p-4 sm:flex-row sm:items-baseline sm:gap-5 sm:px-6"
          >
            <time className="tnum w-32 shrink-0 text-xs font-medium text-ink-muted">
              {formatDateShort(e.date)}
              {e.time ? ` · ${e.time}` : ""}
            </time>
            <div className="flex shrink-0 items-center gap-2 sm:w-28">
              <Badge tone={typeTone[e.type] ?? "neutral"}>{e.type}</Badge>
            </div>
            <p className="min-w-0 flex-1 text-sm text-ink-soft">
              <span className="font-semibold text-ink">{e.title}</span>
              {e.ticker ? (
                <span className="tnum ml-2 text-xs text-ink-muted">{e.ticker}</span>
              ) : null}
              <br className="sm:hidden" />
              <span className="text-ink-soft"> {e.summary}</span>
            </p>
          </div>
        ))}
      </Card>
    </section>
  );
}
