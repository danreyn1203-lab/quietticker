"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";

const inputCls =
  "h-11 w-full rounded-md border border-line-strong bg-surface px-3 text-sm text-ink outline-none focus:border-brand";

/**
 * Returning-reader sign-in: email only, matching the passwordless sign-up. If
 * the email isn't on file we don't dead-end them — we point at /signup.
 */
export function SignInForm({ className }: { className?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotFound(false);
    try {
      const res = await fetch("/api/reader/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.ok) {
        router.push("/profile");
        router.refresh();
        return;
      }
      if (data.notFound) setNotFound(true);
      else setError(data.error || "Something went wrong.");
    } catch {
      setError("Network error — try again.");
    }
    setBusy(false);
  }

  return (
    <form onSubmit={submit} className={cn("w-full", className)} noValidate>
      <label htmlFor="signin-email" className="block text-sm font-medium text-ink">
        Email
      </label>
      <input
        id="signin-email"
        name="email"
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        className={cn(inputCls, "mt-2")}
      />

      {error && <p className="mt-3 text-sm text-neg">{error}</p>}
      {notFound && (
        <p className="mt-3 text-sm text-ink-soft">
          No account for that email yet.{" "}
          <Link href="/signup" className="font-medium text-brand-ink underline underline-offset-2">
            Sign up
          </Link>{" "}
          — it takes about ten seconds.
        </p>
      )}

      <button
        type="submit"
        disabled={busy || !email.trim()}
        className={cn(
          "mt-5 inline-flex h-11 w-full items-center justify-center rounded-md bg-brand px-5 text-[0.95rem] font-medium text-on-brand transition-colors hover:bg-brand-hover",
          (busy || !email.trim()) && "cursor-not-allowed opacity-60",
        )}
      >
        {busy ? "Signing you in…" : "Sign in"}
      </button>

      <p className="mt-3 text-xs leading-relaxed text-ink-muted">
        No password — your email is the key, matching how you signed up. New here?{" "}
        <Link href="/signup" className="font-medium text-ink-soft underline underline-offset-2 hover:text-ink">
          Create a profile
        </Link>
        .
      </p>
    </form>
  );
}
