import Link from "next/link";
import type { Article } from "@/lib/articles/types";
import { formatDateShort } from "@/lib/format";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight } from "@/components/ui/icons";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Card as="article" hover className="h-full">
      <Link
        href={`/journal/${article.slug}`}
        className="flex h-full flex-col p-6"
      >
        <div className="flex flex-wrap gap-1.5">
          {(article.tickers ?? article.tags).slice(0, 3).map((t) => (
            <Badge key={t} tone="brand">
              {t}
            </Badge>
          ))}
        </div>
        <h3 className="mt-4 font-serif text-xl font-semibold leading-snug text-ink">
          {article.headline}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
          {article.summary}
        </p>
        <div className="mt-5 flex items-center justify-between border-t border-line pt-3 text-xs text-ink-muted">
          <span>
            {article.author} · {formatDateShort(article.publishedAt)}
          </span>
          <span className="inline-flex items-center gap-1 font-medium text-brand">
            Read <ArrowRight width={13} height={13} />
          </span>
        </div>
      </Link>
    </Card>
  );
}
