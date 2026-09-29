"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";

/** Sign out, re-subscribe, or delete — everything a reader can do to their own account. */
export function ProfileActions({
  email,
  subscribed,
}: {
  email: string;
  subscribed: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<null | "out" | "resub" | "leave">(null);
  const [note, setNote] = useState<string | null>(null);

  async function signOut() {
    setBusy("out");
    await fetch("/api/reader/logout", { method: "POST" });
    router.push("/");
    router.refresh(); // the session cookie is gone — re-render the header

  }

  async function resubscribe() {
    setBusy("resub");
    setNote(null);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.ok) {
        router.refresh();
      } else {
        setNote(data.error || "Couldn’t update that just now.");
      }
    } catch {
      setNote("Network error — try again.");
    }
    setBusy(null);
  }

  async function leave() {
    if (
      !confirm(
        "Delete your profile and unsubscribe? This removes your name and email from the site.",
      )
    )
      return;
    setBusy("leave");
    await fetch("/api/reader/leave", { method: "POST" });
    router.push("/");
    router.refresh(); // the account is gone — re-render the header

  }

  const btn =
    "inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors";

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center gap-3">
        {!subscribed && (
          <button
            type="button"
            onClick={resubscribe}
            disabled={busy !== null}
            className={cn(
              btn,
              "bg-brand text-on-brand hover:bg-brand-hover",
              busy !== null && "cursor-not-allowed opacity-60",
            )}
          >
            {busy === "resub" ? "Adding…" : "Put me back on the email"}
          </button>
        )}
        <button
          type="button"
          onClick={signOut}
          disabled={busy !== null}
          className={cn(
            btn,
            "border border-line-strong bg-surface text-ink hover:bg-surface-sunken",
            busy !== null && "cursor-not-allowed opacity-60",
          )}
        >
          {busy === "out" ? "Signing out…" : "Sign out"}
        </button>
        <button
          type="button"
          onClick={leave}
          disabled={busy !== null}
          className={cn(
            btn,
            "text-neg hover:bg-neg-soft",
            busy !== null && "cursor-not-allowed opacity-60",
          )}
        >
          {busy === "leave" ? "Deleting…" : "Delete my profile"}
        </button>
      </div>
      {note && <p className="mt-3 text-sm text-neg">{note}</p>}
    </div>
  );
}
