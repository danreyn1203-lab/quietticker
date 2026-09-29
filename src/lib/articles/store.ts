import "server-only";
import { promises as fs } from "fs";
import path from "path";
import type { Article } from "./types";

/**
 * Filesystem-backed article store. Content lives in src/content/articles/*.json.
 * Reads work anywhere; writes (author edits) work when running on a Node server
 * (local `next dev` / a Node host) — the admin workflow is not public (§49).
 */

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "articles");

const SLUG_RE = /^[a-z0-9-]+$/;

function fileFor(slug: string): string {
  if (!SLUG_RE.test(slug)) throw new Error("Invalid article slug");
  return path.join(CONTENT_DIR, `${slug}.json`);
}

export async function listArticleSlugs(): Promise<string[]> {
  try {
    const files = await fs.readdir(CONTENT_DIR);
    return files
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(/\.json$/, ""));
  } catch {
    return [];
  }
}

export async function getArticle(slug: string): Promise<Article | null> {
  try {
    const raw = await fs.readFile(fileFor(slug), "utf8");
    return JSON.parse(raw) as Article;
  } catch {
    return null;
  }
}

export async function getAllArticles(): Promise<Article[]> {
  const slugs = await listArticleSlugs();
  const articles = await Promise.all(slugs.map((s) => getArticle(s)));
  return articles
    .filter((a): a is Article => a !== null)
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
}

/** Author-only write. Validates slug + basic shape before persisting. */
export async function saveArticle(slug: string, article: Article): Promise<void> {
  if (!SLUG_RE.test(slug)) throw new Error("Invalid article slug");
  if (article.slug !== slug) throw new Error("Slug mismatch");
  if (!article.title || !Array.isArray(article.blocks)) {
    throw new Error("Malformed article");
  }
  const updated: Article = {
    ...article,
    updatedAt: new Date().toISOString().slice(0, 10),
  };
  await fs.writeFile(fileFor(slug), JSON.stringify(updated, null, 2), "utf8");
}
