"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import type { Article, ArticleBlock, ArticleSource } from "@/lib/articles/types";

/* ---------- small field primitives ---------- */

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-ink">{label}</span>
      {hint && <span className="block text-xs text-ink-muted">{hint}</span>}
      <span className="mt-1.5 block">{children}</span>
    </label>
  );
}

const inputCls =
  "w-full rounded-md border border-line-strong bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-brand";

function Text({
  value,
  onChange,
  ...rest
}: {
  value: string;
  onChange: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return (
    <input
      {...rest}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={inputCls}
    />
  );
}

function Area({
  value,
  onChange,
  rows = 4,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className={cn(inputCls, "resize-y font-[inherit] leading-relaxed")}
    />
  );
}

/** Controlled JSON editor: keeps its own text, emits parsed value when valid. */
function JsonArea({
  initial,
  onValid,
}: {
  initial: unknown;
  onValid: (v: unknown) => void;
}) {
  const [text, setText] = useState(() => JSON.stringify(initial, null, 2));
  const [error, setError] = useState<string | null>(null);
  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          try {
            onValid(JSON.parse(e.target.value));
            setError(null);
          } catch {
            setError("Invalid JSON — last valid version will be saved.");
          }
        }}
        rows={10}
        spellCheck={false}
        className={cn(inputCls, "resize-y font-mono text-xs leading-relaxed")}
      />
      {error && <p className="mt-1 text-xs text-neg">{error}</p>}
    </div>
  );
}

/* ---------- per-block editors ---------- */

function BlockEditor({
  block,
  onChange,
}: {
  block: ArticleBlock;
  onChange: (b: ArticleBlock) => void;
}) {
  switch (block.type) {
    case "prose":
    case "leadin":
      return (
        <Area
          value={block.md}
          onChange={(md) => onChange({ ...block, md })}
          rows={block.type === "prose" ? 6 : 3}
        />
      );
    case "callout":
      return (
        <div className="space-y-3">
          <Text
            value={block.label}
            onChange={(label) => onChange({ ...block, label })}
            placeholder="Label"
          />
          <Area value={block.md} onChange={(md) => onChange({ ...block, md })} />
        </div>
      );
    case "heading":
      return (
        <div className="space-y-3">
          <Text
            value={block.num ?? ""}
            onChange={(num) => onChange({ ...block, num })}
            placeholder="Eyebrow (e.g. 01 / The buy list)"
          />
          <Text
            value={block.text}
            onChange={(text) => onChange({ ...block, text })}
            placeholder="Heading"
          />
        </div>
      );
    case "verdict":
      return (
        <div className="space-y-3">
          <Text
            value={block.kicker}
            onChange={(kicker) => onChange({ ...block, kicker })}
            placeholder="Kicker"
          />
          <Text
            value={block.heading}
            onChange={(heading) => onChange({ ...block, heading })}
            placeholder="Heading"
          />
          <Area value={block.md} onChange={(md) => onChange({ ...block, md })} />
        </div>
      );
    case "risks":
      return (
        <div className="space-y-2">
          {block.items.map((r, i) => (
            <div key={i} className="rounded-md border border-line p-3">
              <Text
                value={r.title}
                onChange={(title) => {
                  const items = block.items.map((x, j) =>
                    j === i ? { ...x, title } : x,
                  );
                  onChange({ ...block, items });
                }}
                placeholder="Risk title"
              />
              <div className="mt-2">
                <Area
                  rows={2}
                  value={r.body}
                  onChange={(body) => {
                    const items = block.items.map((x, j) =>
                      j === i ? { ...x, body } : x,
                    );
                    onChange({ ...block, items });
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      );
    default:
      // stats / splitbar / legend / barchart / table → structured JSON
      return (
        <JsonArea
          initial={block}
          onValid={(v) => onChange(v as ArticleBlock)}
        />
      );
  }
}

function blockName(b: ArticleBlock): string {
  const t = b.type;
  if (t === "heading") return `Heading — ${b.text}`;
  if (t === "barchart") return `Chart — ${b.title}`;
  if (t === "table") return "Comparison table";
  if (t === "stats") return "Stat tiles";
  if (t === "splitbar") return `Split bar — ${b.label}`;
  if (t === "verdict") return `Verdict — ${b.heading}`;
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/* ---------- main editor ---------- */

export function ArticleEditor({ initial }: { initial: Article }) {
  const router = useRouter();
  const [article, setArticle] = useState<Article>(initial);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  function set<K extends keyof Article>(key: K, value: Article[K]) {
    setArticle((a) => ({ ...a, [key]: value }));
  }

  function setBlock(i: number, b: ArticleBlock) {
    setArticle((a) => ({
      ...a,
      blocks: a.blocks.map((x, j) => (j === i ? b : x)),
    }));
  }

  function setSource(i: number, s: ArticleSource) {
    setArticle((a) => ({
      ...a,
      sources: a.sources.map((x, j) => (j === i ? s : x)),
    }));
  }

  async function save() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/articles/${article.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(article),
      });
      const data = await res.json();
      if (data.ok) {
        setMsg({ ok: true, text: "Saved. Your changes are live." });
        router.refresh();
      } else {
        setMsg({ ok: false, text: data.error || "Save failed." });
      }
    } catch {
      setMsg({ ok: false, text: "Network error. Try again." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Meta */}
      <section className="space-y-4 rounded-lg border border-line bg-surface p-5">
        <h2 className="font-serif text-lg font-semibold text-ink">Basics</h2>
        <Field label="Headline">
          <Text value={article.headline} onChange={(v) => set("headline", v)} />
        </Field>
        <Field label="Standfirst" hint="The intro line under the headline.">
          <Area value={article.standfirst} onChange={(v) => set("standfirst", v)} rows={2} />
        </Field>
        <Field label="Card summary" hint="Shown on the journal cards + search.">
          <Area value={article.summary} onChange={(v) => set("summary", v)} rows={2} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="As of">
            <Text value={article.asOf ?? ""} onChange={(v) => set("asOf", v)} />
          </Field>
          <Field label="Tickers" hint="Comma-separated">
            <Text
              value={(article.tickers ?? []).join(", ")}
              onChange={(v) =>
                set(
                  "tickers",
                  v.split(",").map((s) => s.trim()).filter(Boolean),
                )
              }
            />
          </Field>
          <Field label="Tags" hint="Comma-separated">
            <Text
              value={article.tags.join(", ")}
              onChange={(v) =>
                set("tags", v.split(",").map((s) => s.trim()).filter(Boolean))
              }
            />
          </Field>
        </div>
      </section>

      {/* Body blocks */}
      <section className="space-y-4">
        <h2 className="font-serif text-lg font-semibold text-ink">Body</h2>
        {article.blocks.map((b, i) => (
          <div key={i} className="rounded-lg border border-line bg-surface p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">
              {blockName(b)}
            </p>
            <BlockEditor block={b} onChange={(nb) => setBlock(i, nb)} />
          </div>
        ))}
      </section>

      {/* Sources */}
      <section className="space-y-3 rounded-lg border border-line bg-surface p-5">
        <h2 className="font-serif text-lg font-semibold text-ink">Sources</h2>
        {article.sources.map((s, i) => (
          <div key={i} className="grid gap-2 rounded-md border border-line p-3 sm:grid-cols-2">
            <Text value={s.publisher} onChange={(v) => setSource(i, { ...s, publisher: v })} placeholder="Publisher" />
            <Text value={s.title} onChange={(v) => setSource(i, { ...s, title: v })} placeholder="Title" />
            <Text value={s.url} onChange={(v) => setSource(i, { ...s, url: v })} placeholder="https://…" />
            <Text value={s.note ?? ""} onChange={(v) => setSource(i, { ...s, note: v })} placeholder="Note (optional)" />
          </div>
        ))}
      </section>

      {/* Disclaimer */}
      <section className="space-y-3 rounded-lg border border-line bg-surface p-5">
        <h2 className="font-serif text-lg font-semibold text-ink">Disclaimer</h2>
        <Area value={article.disclaimer ?? ""} onChange={(v) => set("disclaimer", v)} rows={4} />
      </section>

      {/* Save bar */}
      <div className="sticky bottom-0 -mx-4 flex items-center justify-between gap-4 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="text-sm">
          {msg && (
            <span className={msg.ok ? "text-pos" : "text-neg"}>{msg.text}</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`/journal/${article.slug}`}
            className="text-sm font-medium text-ink-soft hover:text-ink"
          >
            View note
          </a>
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
