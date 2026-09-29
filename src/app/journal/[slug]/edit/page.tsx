import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getArticle } from "@/lib/articles/store";
import { isAuthor } from "@/lib/auth";
import { Container } from "@/components/layout/Container";
import { ArticleEditor } from "@/components/admin/ArticleEditor";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit",
  robots: { index: false, follow: false },
};

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!(await isAuthor())) redirect("/admin");

  const article = await getArticle(slug);
  if (!article) notFound();

  return (
    <Container className="max-w-3xl py-10">
      <Link
        href={`/journal/${slug}`}
        className="text-sm font-medium text-ink-soft hover:text-ink"
      >
        ← Back to note
      </Link>
      <h1 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-ink">
        Editing: {article.title}
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        Prose uses simple markdown — <code className="rounded bg-surface-sunken px-1">**bold**</code>,{" "}
        <code className="rounded bg-surface-sunken px-1">*italic*</code>, and{" "}
        <code className="rounded bg-surface-sunken px-1">[text](https://…)</code>. Charts and
        tables edit as structured data.
      </p>
      <div className="mt-8">
        <ArticleEditor initial={article} />
      </div>
    </Container>
  );
}
