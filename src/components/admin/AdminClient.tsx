"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";

type ArticleRef = { slug: string; title: string; headline: string };

export function AdminClient({
  authed,
  articles,
  stats,
}: {
  authed: boolean;
  articles: ArticleRef[];
  /** Audience panel, rendered on the server and only when signed in. */
  stats?: ReactNode;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.ok) {
        setEmail("");
        setPassword("");
        router.refresh();
      } else {
        setError(data.error || "Sign-in failed.");
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
  }

  if (!authed) {
    return (
      <form onSubmit={login} className="mt-10 max-w-sm">
        <label
          htmlFor="author-email"
          className="block text-sm font-medium text-ink"
        >
          Email
        </label>
        <input
          id="author-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          className="mt-2 h-11 w-full rounded-md border border-line-strong bg-surface px-3 text-ink outline-none focus:border-brand"
          placeholder="you@email.com"
        />
        <label
          htmlFor="author-password"
          className="mt-4 block text-sm font-medium text-ink"
        >
          Password
        </label>
        <input
          id="author-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="mt-2 h-11 w-full rounded-md border border-line-strong bg-surface px-3 text-ink outline-none focus:border-brand"
          placeholder="••••••••"
        />
        {error && <p className="mt-2 text-sm text-neg">{error}</p>}
        <button
          type="submit"
          disabled={busy || !email || !password}
          className={cn(
            "mt-4 inline-flex h-11 items-center justify-center rounded-md bg-brand px-5 text-[0.95rem] font-medium text-on-brand transition-colors hover:bg-brand-hover",
            (busy || !email || !password) && "cursor-not-allowed opacity-60",
          )}
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
        <p className="mt-4 text-xs leading-relaxed text-ink-muted">
          Only the author can edit research. The password is set on the server
          (environment variable) and is never stored in the browser.
        </p>
      </form>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between gap-4 rounded-lg border border-pos/30 bg-pos-soft px-4 py-3">
        <p className="text-sm font-medium text-ink">
          Signed in as the author. You can edit research below.
        </p>
        <button
          type="button"
          onClick={logout}
          className="shrink-0 text-sm font-medium text-ink-soft hover:text-ink"
        >
          Sign out
        </button>
      </div>

      {stats}

      <div className="mt-8 flex items-center justify-between gap-4 rounded-lg border border-line bg-surface p-4">
        <div className="min-w-0">
          <p className="font-medium text-ink">This week’s closest look</p>
          <p className="text-xs text-ink-muted">
            The featured company on the homepage.
          </p>
        </div>
        <Link
          href="/admin/featured"
          className="shrink-0 rounded-md border border-line-strong bg-surface px-3 py-1.5 text-sm font-medium text-ink hover:bg-surface-sunken"
        >
          Edit spotlight
        </Link>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4 rounded-lg border border-line bg-surface p-4">
        <div className="min-w-0">
          <p className="font-medium text-ink">Subscribers &amp; email</p>
          <p className="text-xs text-ink-muted">
            See who’s subscribed and send everyone an update at once.
          </p>
        </div>
        <Link
          href="/admin/email"
          className="shrink-0 rounded-md border border-line-strong bg-surface px-3 py-1.5 text-sm font-medium text-ink hover:bg-surface-sunken"
        >
          Open email
        </Link>
      </div>

      <h2 className="mt-8 font-serif text-xl font-semibold text-ink">
        Your research notes
      </h2>
      <ul className="mt-4 divide-y divide-line overflow-hidden rounded-lg border border-line">
        {articles.map((a) => (
          <li
            key={a.slug}
            className="flex items-center justify-between gap-4 bg-surface p-4"
          >
            <div className="min-w-0">
              <p className="truncate font-medium text-ink">{a.headline}</p>
              <p className="tnum text-xs text-ink-muted">/journal/{a.slug}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <Link
                href={`/journal/${a.slug}`}
                className="text-sm text-ink-soft hover:text-ink"
              >
                View
              </Link>
              <Link
                href={`/journal/${a.slug}/edit`}
                className="rounded-md border border-line-strong bg-surface px-3 py-1.5 text-sm font-medium text-ink hover:bg-surface-sunken"
              >
                Edit
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
