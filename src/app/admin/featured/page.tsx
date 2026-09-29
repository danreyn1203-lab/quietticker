import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthor } from "@/lib/auth";
import { getFeatured } from "@/lib/articles/featured";
import { Container } from "@/components/layout/Container";
import { FeaturedEditor } from "@/components/admin/FeaturedEditor";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit spotlight",
  robots: { index: false, follow: false },
};

export default async function EditFeaturedPage() {
  if (!(await isAuthor())) redirect("/admin");
  const featured = await getFeatured();
  if (!featured) redirect("/admin");

  return (
    <Container className="max-w-3xl py-10">
      <Link href="/admin" className="text-sm font-medium text-ink-soft hover:text-ink">
        ← Back to dashboard
      </Link>
      <h1 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-ink">
        This week’s closest look
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        Edit the featured company on the homepage. Saves go live immediately.
      </p>
      <div className="mt-8">
        <FeaturedEditor initial={featured} />
      </div>
    </Container>
  );
}
