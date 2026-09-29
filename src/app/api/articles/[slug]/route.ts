import { NextResponse } from "next/server";
import { isAuthor } from "@/lib/auth";
import { getArticle, saveArticle } from "@/lib/articles/store";
import type { Article } from "@/lib/articles/types";

/** Author-only: persist an edited article back to its content file. */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!(await isAuthor())) {
    return NextResponse.json({ ok: false, error: "Not authorized" }, { status: 401 });
  }

  const { slug } = await params;
  const existing = await getArticle(slug);
  if (!existing) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  let article: Article;
  try {
    article = (await request.json()) as Article;
  } catch {
    return NextResponse.json({ ok: false, error: "Bad JSON" }, { status: 400 });
  }

  try {
    // Preserve immutable identity fields; only content is editable.
    await saveArticle(slug, {
      ...article,
      slug,
      publishedAt: existing.publishedAt,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Save failed" },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true });
}
