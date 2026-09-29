import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getAllArticles } from "@/lib/articles/store";
import { EXPLORE_SIGNALS } from "@/lib/signals";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/journal`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/portfolio`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/methodology`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/signup`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  const articles = await getAllArticles();
  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${base}/journal/${a.slug}`,
    lastModified: new Date(a.updatedAt ?? a.publishedAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const signalRoutes: MetadataRoute.Sitemap = EXPLORE_SIGNALS.map((s) => ({
    url: `${base}/signals/${s.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.4,
  }));

  return [...staticRoutes, ...articleRoutes, ...signalRoutes];
}
