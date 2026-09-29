import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle } from "@/lib/articles/store";
import { isAuthor } from "@/lib/auth";
import { site } from "@/lib/site";
import { ArticleRenderer } from "@/components/article/ArticleRenderer";
import {
  ArticleHeader,
  SourcesList,
  Disclaimer,
} from "@/components/article/parts";
import { ArrowRight } from "@/components/ui/icons";

export const dynamic = "force-dynamic";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "Not found" };
  const url = `/journal/${slug}`;
  return {
    title: article.title,
    description: article.summary,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: article.headline,
      description: article.summary,
      url,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt ?? article.publishedAt,
      authors: [article.author],
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: article.headline,
      description: article.summary,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const [article, author] = await Promise.all([getArticle(slug), isAuthor()]);
  if (!article) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AnalysisNewsArticle",
    headline: article.headline,
    description: article.summary,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    author: { "@type": "Person", name: article.author },
    publisher: { "@type": "Organization", name: site.name },
    mainEntityOfPage: `${site.url.replace(/\/$/, "")}/journal/${slug}`,
    keywords: article.tags.join(", "),
    about: (article.tickers ?? []).map((t) => ({ "@type": "Thing", name: t })),
    citation: article.sources.map((s) => s.url),
  };

  return (
    <article className="mx-auto max-w-3xl px-4 pb-8 pt-8 sm:px-6 sm:pt-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href="/journal"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
      >
        <ArrowRight width={15} height={15} className="rotate-180" />
        All research notes
      </Link>

      <div className="mt-5">
        <ArticleHeader
          article={article}
          action={
            author ? (
              <Link
                href={`/journal/${slug}/edit`}
                className="shrink-0 rounded-md border border-line-strong bg-surface px-3 py-1.5 text-sm font-medium text-ink hover:bg-surface-sunken"
              >
                Edit
              </Link>
            ) : undefined
          }
        />
      </div>

      <div className="mt-8">
        <ArticleRenderer blocks={article.blocks} />
      </div>

      <div className="mt-12 flex flex-col gap-6">
        <SourcesList sources={article.sources} />
        {article.disclaimer && <Disclaimer text={article.disclaimer} />}
      </div>
    </article>
  );
}
