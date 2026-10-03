"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";

const inputCls =
  "h-11 w-full rounded-md border border-line-strong bg-surface px-3 text-sm text-ink outline-none focus:border-brand";

/** Returning-reader sign-in: email + password. */
export function SignInForm({ className }: { className?: string }) {
  const router = useRouter();
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
      const res = await fetch("/api/reader/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.ok) {
        if (data.needsVerification) {
          // Account exists but was never confirmed — finish the code step.
          router.push("/verify");
        } else {
          router.push("/profile");
        }
        router.refresh();
        return;
      }
      setError(data.error || "Something went wrong.");
    } catch {
      setError("Network error — try again.");
    }
    setBusy(false);
  }

  const ready = email.trim() && password.length > 0;

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

      <label htmlFor="signin-password" className="mt-4 block text-sm font-medium text-ink">
        Password
      </label>
      <div className="relative mt-2">
        <input
          id="signin-password"
          name="password"
          type={show ? "text" : "password"}
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
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

      {error && <p className="mt-3 text-sm text-neg">{error}</p>}

      <button
        type="submit"
        disabled={busy || !ready}
        className={cn(
          "mt-5 inline-flex h-11 w-full items-center justify-center rounded-md bg-brand px-5 text-[0.95rem] font-medium text-on-brand transition-colors hover:bg-brand-hover",
          (busy || !ready) && "cursor-not-allowed opacity-60",
        )}
      >
        {busy ? "Signing you in…" : "Sign in"}
      </button>

      <p className="mt-3 text-xs leading-relaxed text-ink-muted">
        New here?{" "}
        <Link href="/signup" className="font-medium text-ink-soft underline underline-offset-2 hover:text-ink">
          Create a profile
        </Link>
        . Forgot your password? You can re-register the same email to reset it.
      </p>
    </form>
  );
}
