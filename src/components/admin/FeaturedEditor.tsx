"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import type { Featured } from "@/lib/articles/featured";

const inputCls =
  "w-full rounded-md border border-line-strong bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-brand";

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-ink">{label}</span>
      {hint && <span className="block text-xs text-ink-muted">{hint}</span>}
      <span className="mt-1.5 block">{children}</span>
    </label>
  );
}

export function FeaturedEditor({ initial }: { initial: Featured }) {
  const router = useRouter();
  const [f, setF] = useState<Featured>(initial);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  function set<K extends keyof Featured>(k: K, v: Featured[K]) {
    setF((cur) => ({ ...cur, [k]: v }));
  }

  async function save() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/featured", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      const data = await res.json();
      setMsg(
        data.ok
          ? { ok: true, text: "Saved. It’s live on the homepage." }
          : { ok: false, text: data.error || "Save failed." },
      );
      if (data.ok) router.refresh();
    } catch {
      setMsg({ ok: false, text: "Network error. Try again." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 rounded-lg border border-line bg-surface p-5 sm:grid-cols-2">
        <Row label="Ticker"><input className={inputCls} value={f.ticker} onChange={(e) => set("ticker", e.target.value)} /></Row>
        <Row label="Company name"><input className={inputCls} value={f.name} onChange={(e) => set("name", e.target.value)} /></Row>
        <Row label="Exchange"><input className={inputCls} value={f.exchange} onChange={(e) => set("exchange", e.target.value)} /></Row>
        <Row label="Sector"><input className={inputCls} value={f.sector} onChange={(e) => set("sector", e.target.value)} /></Row>
        <Row label="Industry"><input className={inputCls} value={f.industry} onChange={(e) => set("industry", e.target.value)} /></Row>
        <Row label="Fallback price"><input type="number" step="0.01" className={inputCls} value={f.price} onChange={(e) => set("price", parseFloat(e.target.value) || 0)} /></Row>
        <Row label="Fallback price note"><input className={inputCls} value={f.priceNote ?? ""} onChange={(e) => set("priceNote", e.target.value)} /></Row>
        <Row label="Tags (comma-separated)">
          <input
            className={inputCls}
            value={f.tags.join(", ")}
            onChange={(e) => set("tags", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
          />
        </Row>
      </div>

      <div className="space-y-4 rounded-lg border border-line bg-surface p-5">
        <Row label="Why I’m watching this" hint="Markdown: **bold**, *italic*, [text](https://…). Blank line = new paragraph.">
          <textarea className={cn(inputCls, "resize-y")} rows={7} value={f.whyWatching} onChange={(e) => set("whyWatching", e.target.value)} />
        </Row>
        <Row label="Catalyst label"><input className={inputCls} value={f.catalystLabel ?? ""} onChange={(e) => set("catalystLabel", e.target.value)} /></Row>
        <Row label="Catalyst"><textarea className={cn(inputCls, "resize-y")} rows={3} value={f.catalyst ?? ""} onChange={(e) => set("catalyst", e.target.value)} /></Row>
      </div>

      <div className="space-y-4 rounded-lg border border-line bg-surface p-5">
        <label className="flex items-center gap-2 text-sm font-medium text-ink">
          <input type="checkbox" checked={f.owns} onChange={(e) => set("owns", e.target.checked)} />
          I own this stock (show a disclosure)
        </label>
        <Row label="Position note"><input className={inputCls} value={f.positionNote ?? ""} onChange={(e) => set("positionNote", e.target.value)} /></Row>
        <Row label="Extra note"><textarea className={cn(inputCls, "resize-y")} rows={2} value={f.note ?? ""} onChange={(e) => set("note", e.target.value)} /></Row>
        <div className="grid gap-4 sm:grid-cols-2">
          <Row label="Button link (href)"><input className={inputCls} value={f.ctaHref ?? ""} onChange={(e) => set("ctaHref", e.target.value)} placeholder="/journal" /></Row>
          <Row label="Button label"><input className={inputCls} value={f.ctaLabel ?? ""} onChange={(e) => set("ctaLabel", e.target.value)} /></Row>
        </div>
        <Row label="Disclaimer"><textarea className={cn(inputCls, "resize-y")} rows={2} value={f.disclaimer ?? ""} onChange={(e) => set("disclaimer", e.target.value)} /></Row>
        <Row label="Eyebrow"><input className={inputCls} value={f.eyebrow} onChange={(e) => set("eyebrow", e.target.value)} /></Row>
      </div>

      <div className="sticky bottom-0 -mx-4 flex items-center justify-between gap-4 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="text-sm">{msg && <span className={msg.ok ? "text-pos" : "text-neg"}>{msg.text}</span>}</div>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm font-medium text-ink-soft hover:text-ink">View homepage</Link>
          <button
            type="button"
            onClick={save}
            disabled={busy}
            className={cn(
              "inline-flex h-10 items-center rounded-md bg-brand px-5 text-sm font-medium text-on-brand hover:bg-brand-hover",
              busy && "cursor-not-allowed opacity-60",
            )}
          >
            {busy ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
