import Link from "next/link";
import type { ResearchedCompany } from "@/lib/researchLog";
import { formatDateShort } from "@/lib/format";
import { Card } from "@/components/ui/Card";
import { Check } from "@/components/ui/icons";

/** A real researched company. Links to its article; shows Daniel's rating + disclosure. */
export function ResearchedCard({ company }: { company: ResearchedCompany }) {
  const href = company.articleSlug ? `/journal/${company.articleSlug}` : undefined;

  const inner = (
    <div className="flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-serif text-lg font-semibold text-ink">
            {company.name}
          </h3>
          <span className="tnum text-xs font-medium text-ink-muted">
            {company.ticker} · {company.sector}
          </span>
        </div>
        {company.rating && (
          <div className="shrink-0 rounded-lg bg-surface-sunken px-2.5 py-1 text-center">
            <div className="tnum text-base font-semibold text-brand">
              {company.rating}
            </div>
            <div className="text-[0.6rem] uppercase tracking-wide text-ink-muted">
              my rating
            </div>
          </div>
        )}
      </div>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
        {company.note}
      </p>

      <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-xs text-ink-muted">
        <span className="inline-flex items-center gap-1.5">
          {company.owns ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-pos-soft px-2 py-0.5 font-semibold text-pos">
              <Check width={11} height={11} />
              Owns{company.ownsNote ? ` · ${company.ownsNote}` : ""}
            </span>
          ) : (
            <span className="rounded-full bg-neutral-soft px-2 py-0.5 font-medium text-ink-soft">
              Watching
            </span>
          )}
        </span>
        <span>{formatDateShort(company.dateResearched)}</span>
      </div>
    </div>
  );

  if (href) {
    return (
      <Card as="article" hover className="h-full">
        <Link href={href} className="block h-full">
          {inner}
        </Link>
      </Card>
    );
  }
  return (
    <Card as="article" className="h-full">
      {inner}
    </Card>
  );
}
