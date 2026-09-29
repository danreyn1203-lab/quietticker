import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getAllArticles } from "@/lib/articles/store";
import { isAuthor } from "@/lib/auth";
import { getReaderStats } from "@/lib/readers";
import { getSubscribers, getBroadcasts } from "@/lib/subscribers";
import { Container } from "@/components/layout/Container";
import { AdminClient } from "@/components/admin/AdminClient";
import { AdminStats } from "@/components/admin/AdminStats";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Author",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const [author, articles] = await Promise.all([isAuthor(), getAllArticles()]);
  const refs = articles.map((a) => ({
    slug: a.slug,
    title: a.title,
    headline: a.headline,
  }));

  // Audience figures are loaded (and rendered) only for a signed-in author.
  // Passed in as an element so the server component keeps the data server-side.
  let stats: ReactNode = null;
  if (author) {
    const [readers, subscribers, broadcasts] = await Promise.all([
      getReaderStats(),
      getSubscribers(),
      getBroadcasts(),
    ]);
    stats = (
      <AdminStats
        readers={readers}
        subscriberCount={subscribers.length}
        broadcastCount={broadcasts.length}
        lastBroadcastAt={broadcasts[0]?.sentAt ?? null}
      />
    );
  }

  return (
    <Container className="py-14 sm:py-20">
      <p className="eyebrow mb-3">Author tools</p>
      <h1 className="font-serif text-4xl font-semibold tracking-tight text-ink">
        {author ? "Author dashboard" : "Author sign-in"}
      </h1>
      <p className="mt-4 max-w-2xl text-[0.98rem] leading-relaxed text-ink-soft">
        {author
          ? "Edit your published research. Changes save straight to the site."
          : "Sign in to edit research. Readers never see this — published research is read-only to everyone else."}
      </p>
      <AdminClient authed={author} articles={refs} stats={stats} />
    </Container>
  );
}
