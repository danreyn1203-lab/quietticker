import type { ReactNode } from "react";
import { formatDate } from "@/lib/format";
import type { Article, ArticleSource } from "@/lib/articles/types";
import { External } from "@/components/ui/icons";

/* ---------------- Masthead ---------------- */
export function ArticleHeader({
  article,
  action,
}: {
  article: Article;
  action?: ReactNode;
}) {
  const chips = [...(article.tickers ?? []), ...article.tags];
  return (
    <header className="border-b border-line pb-7 pt-2">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {chips.slice(0, 6).map((c) => (
          <span
            key={c}
            className="tnum rounded-md border border-line bg-surface-sunken px-2 py-0.5 text-[0.72rem] font-semibold text-ink-soft"
          >
            {c}
          </span>
        ))}
        <span className="rounded-md px-1 text-[0.66rem] font-semibold uppercase tracking-wide text-ink-muted">
          Not investment advice
        </span>
      </div>

      <div className="flex items-start justify-between gap-4">
        <h1 className="max-w-3xl font-serif text-[2.1rem] font-semibold leading-[1.06] tracking-tight text-ink sm:text-5xl">
          {article.headline}
        </h1>
        {action}
      </div>

      <p className="mt-4 max-w-2xl font-serif text-lg leading-relaxed text-ink-soft">
        {article.standfirst}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-muted">
        <strong className="font-semibold text-ink">{article.author}</strong>
        <Dot />
        <span>{formatDate(article.publishedAt)}</span>
        {article.asOf && (
          <>
            <Dot />
            <span>{article.asOf}</span>
          </>
        )}
        {article.updatedAt && article.updatedAt !== article.publishedAt && (
          <>
            <Dot />
            <span>Updated {formatDate(article.updatedAt)}</span>
          </>
        )}
      </div>
    </header>
  );
}

function Dot() {
  return <span className="h-1 w-1 rounded-full bg-ink-muted/50" aria-hidden />;
}

/* ---------------- Sources ---------------- */
export function SourcesList({ sources }: { sources: ArticleSource[] }) {
  return (
    <div className="rounded-lg bg-surface-sunken p-5 sm:p-6">
      <p className="eyebrow mb-3">Sources — check the numbers yourself</p>
      <ol className="space-y-2.5">
        {sources.map((s, i) => (
          <li key={i} className="flex gap-3 text-sm">
            <span className="tnum shrink-0 text-xs font-semibold text-ink-muted">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-ink-soft">
              <span className="font-medium text-ink">{s.publisher}</span> —{" "}
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-brand underline-offset-2 hover:underline"
              >
                {s.title}
                <External width={11} height={11} />
              </a>
              {s.note ? ` — ${s.note}.` : "."}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ---------------- Disclaimer ---------------- */
export function Disclaimer({ text }: { text: string }) {
  return (
    <p className="border-t border-line pt-6 text-xs leading-relaxed text-ink-muted">
      <b className="font-semibold text-ink-soft">Disclaimer.</b> {text}
    </p>
  );
}
