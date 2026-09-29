"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";

const inputCls =
  "h-11 w-full rounded-md border border-line-strong bg-surface px-3 text-sm text-ink outline-none focus:border-brand";

/**
 * Reader sign-up: first name + email, and that's the whole account.
 * Submitting also subscribes them to the research email — one step, no
 * checkbox to miss. On success they land on their own profile.
 */
export function SignUpForm({ className }: { className?: string }) {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/reader/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, email }),
      });
      const data = await res.json();
      if (data.ok) {
        // refresh() as well as push(): the session cookie just changed, and the
        // refresh re-renders the shared layout so the header greets them at once.
        router.push("/profile");
        router.refresh();
        return;
      }
      setError(data.error || "Something went wrong.");
    } catch {
      setError("Network error — try again.");
    }
    setBusy(false);
  }

  return (
    <form onSubmit={submit} className={cn("w-full", className)} noValidate>
      <div className="space-y-4">
        <div>
          <label htmlFor="first-name" className="block text-sm font-medium text-ink">
            First name
          </label>
          <input
            id="first-name"
            name="firstName"
            required
            maxLength={40}
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Sam"
            className={cn(inputCls, "mt-2")}
          />
          <p className="mt-1.5 text-xs text-ink-muted">
            This is what your profile is signed with — nothing else.
          </p>
        </div>

        <div>
          <label htmlFor="signup-email" className="block text-sm font-medium text-ink">
            Email
          </label>
          <input
            id="signup-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className={cn(inputCls, "mt-2")}
          />
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-neg">{error}</p>}

      <button
        type="submit"
        disabled={busy || !firstName.trim() || !email.trim()}
        className={cn(
          "mt-5 inline-flex h-11 w-full items-center justify-center rounded-md bg-brand px-5 text-[0.95rem] font-medium text-on-brand transition-colors hover:bg-brand-hover",
          (busy || !firstName.trim() || !email.trim()) &&
            "cursor-not-allowed opacity-60",
        )}
      >
        {busy ? "Setting you up…" : "Sign up & get the research"}
      </button>

      <p className="mt-3 text-xs leading-relaxed text-ink-muted">
        Signing up puts you on the research email — that&rsquo;s the point of
        the account, so there&rsquo;s no extra box to tick. No password, no
        tracking, unsubscribe whenever you like.
      </p>
    </form>
  );
}
