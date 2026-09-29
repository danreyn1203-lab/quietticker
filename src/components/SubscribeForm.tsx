"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

/** Public email capture. Posts to /api/subscribe. */
export function SubscribeForm({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("busy");
    setMsg("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.ok) {
        setState("done");
        setMsg(
          data.already
            ? "You’re already on the list — thanks!"
            : "You’re in. New research will land in your inbox.",
        );
        setEmail("");
      } else {
        setState("error");
        setMsg(data.error || "Something went wrong.");
      }
    } catch {
      setState("error");
      setMsg("Network error — try again.");
    }
  }

  if (state === "done") {
    return (
      <p className={cn("text-sm font-medium text-pos", className)}>{msg}</p>
    );
  }

  return (
    <form onSubmit={submit} className={cn("w-full", className)}>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          aria-label="Email address"
          className="h-11 flex-1 rounded-md border border-line-strong bg-surface px-3 text-sm text-ink outline-none focus:border-brand"
        />
        <button
          type="submit"
          disabled={state === "busy"}
          className={cn(
            "inline-flex h-11 shrink-0 items-center justify-center rounded-md bg-brand px-5 text-[0.95rem] font-medium text-on-brand transition-colors hover:bg-brand-hover",
            state === "busy" && "cursor-not-allowed opacity-60",
          )}
        >
          {state === "busy" ? "Adding…" : "Get the research"}
        </button>
      </div>
      {state === "error" && <p className="mt-2 text-sm text-neg">{msg}</p>}
    </form>
  );
}
