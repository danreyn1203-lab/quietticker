"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";

const inputCls =
  "h-11 w-full rounded-md border border-line-strong bg-surface px-3 text-sm text-ink outline-none focus:border-brand";

/**
 * Reader sign-up: first name, email, password. Submitting creates an
 * unverified account and emails a 6-digit code; we then send them to /verify
 * to enter it. The account is subscribed to the research email only once the
 * code is confirmed (confirmed opt-in).
 */
export function SignUpForm({ className }: { className?: string }) {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
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
        body: JSON.stringify({ firstName, email, password }),
      });
      const data = await res.json();
      if (data.ok) {
        router.push("/verify");
        router.refresh();
        return;
      }
      setError(data.error || "Something went wrong.");
    } catch {
      setError("Network error — try again.");
    }
    setBusy(false);
  }

  const ready = firstName.trim() && email.trim() && password.length >= 8;

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
            This is what your profile is signed with.
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
          <p className="mt-1.5 text-xs text-ink-muted">
            We’ll send a 6-digit code here to confirm it’s really you.
          </p>
        </div>

        <div>
          <label htmlFor="signup-password" className="block text-sm font-medium text-ink">
            Password
          </label>
          <div className="relative mt-2">
            <input
              id="signup-password"
              name="password"
              type={show ? "text" : "password"}
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className={cn(inputCls, "pr-16")}
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              className="absolute inset-y-0 right-0 px-3 text-xs font-medium text-ink-soft hover:text-ink"
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? "Hide" : "Show"}
            </button>
          </div>
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-neg">{error}</p>}

      <button
        type="submit"
        disabled={busy || !ready}
        className={cn(
          "mt-5 inline-flex h-11 w-full items-center justify-center rounded-md bg-brand px-5 text-[0.95rem] font-medium text-on-brand transition-colors hover:bg-brand-hover",
          (busy || !ready) && "cursor-not-allowed opacity-60",
        )}
      >
        {busy ? "Sending your code…" : "Create account"}
      </button>

      <p className="mt-3 text-xs leading-relaxed text-ink-muted">
        After you confirm the code, you’re on the research email — that’s the
        point of the account. No spam, unsubscribe anytime.
      </p>
    </form>
  );
}
