import { renderInline } from "@/lib/markdown";
import { TONE_VAR, type StatItem, type SplitSegment, type Tone } from "@/lib/articles/types";

/* ---------------- Section heading ---------------- */
export function ArticleHeading({ num, text }: { num?: string; text: string }) {
  return (
    <div className="mt-4">
      {num && (
        <span className="tnum block text-sm font-semibold tracking-wide text-ink-muted">
          {num}
        </span>
      )}
      <h2 className="mt-2 font-serif text-2xl font-semibold tracking-tight text-ink sm:text-[1.7rem]">
        {text}
      </h2>
    </div>
  );
}

/* ---------------- Callout ---------------- */
export function Callout({ label, md }: { label: string; md: string }) {
  return (
    <aside className="rounded-lg border border-brand/25 bg-brand-soft p-5 sm:p-6">
      <p className="eyebrow text-brand-ink">{label}</p>
      <p
        className="mt-2 font-serif text-[1.05rem] leading-relaxed text-ink"
        dangerouslySetInnerHTML={{ __html: renderInline(md) }}
      />
    </aside>
  );
}

/* ---------------- Stat grid ---------------- */
export function StatGrid({ items }: { items: StatItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3 lg:grid-cols-5">
      {items.map((s, i) => (
        <div key={i} className="bg-surface p-4">
          <div className="text-[0.68rem] font-semibold uppercase tracking-wide text-ink-muted">
            {s.k}
          </div>
          <div
            className="tnum mt-1 text-xl font-semibold"
            style={{ color: s.tone ? TONE_VAR[s.tone] : "var(--ink)" }}
          >
            {s.v}
          </div>
          {s.s && <div className="mt-0.5 text-xs text-ink-muted">{s.s}</div>}
        </div>
      ))}
    </div>
  );
}

/* ---------------- Split bar (concentration) ---------------- */
export function SplitBar({
  label,
  segments,
  caption,
}: {
  label: string;
  segments: SplitSegment[];
  caption?: string;
}) {
  return (
    <div>
      <p className="eyebrow mb-2">{label}</p>
      <div
        className="flex h-9 overflow-hidden rounded-lg border border-line"
        role="img"
        aria-label={segments.map((s) => s.label).join(", ")}
      >
        {segments.map((seg, i) => (
          <div
            key={i}
            className="flex items-center px-3 text-xs font-semibold"
            style={{
              width: `${seg.pct}%`,
              background:
                seg.tone === "neutral" ? "var(--surface-sunken)" : TONE_VAR[seg.tone],
              color: seg.tone === "neutral" ? "var(--ink-soft)" : "#fff",
            }}
          >
            <span className="truncate">{seg.label}</span>
          </div>
        ))}
      </div>
      {caption && <p className="mt-2 text-sm text-ink-muted">{caption}</p>}
    </div>
  );
}

/* ---------------- Legend ---------------- */
export function Legend({ items }: { items: { label: string; tone: Tone }[] }) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-ink-soft">
      {items.map((it, i) => (
        <span key={i} className="inline-flex items-center gap-2">
          <i
            className="inline-block h-3 w-3 rounded-[3px]"
            style={{ background: TONE_VAR[it.tone] }}
          />
          {it.label}
        </span>
      ))}
    </div>
  );
}

/* ---------------- Verdict ---------------- */
export function Verdict({
  kicker,
  heading,
  md,
}: {
  kicker: string;
  heading: string;
  md: string;
}) {
  const paras = md.split(/\n{2,}/).map((p) => renderInline(p.trim()));
  return (
    <div
      className="rounded-2xl border p-6 sm:p-7"
      style={{
        borderColor: "color-mix(in srgb, var(--brand) 35%, var(--line))",
        background: "color-mix(in srgb, var(--brand) 6%, var(--surface))",
      }}
    >
      <p className="eyebrow text-brand-ink">{kicker}</p>
      <h3 className="mt-1.5 font-serif text-2xl font-semibold text-ink">
        {heading}
      </h3>
      <div className="reading mt-3" style={{ maxWidth: "none" }}>
        {paras.map((html, i) => (
          <p key={i} dangerouslySetInnerHTML={{ __html: html }} />
        ))}
      </div>
    </div>
  );
}

/* ---------------- Risk list ---------------- */
export function RiskList({
  items,
}: {
  items: { title: string; body: string }[];
}) {
  return (
    <ul className="grid gap-2.5">
      {items.map((r, i) => (
        <li
          key={i}
          className="rounded-lg border border-line border-l-[3px] border-l-neg bg-surface p-4 text-[0.94rem] text-ink-soft"
        >
          <b className="font-semibold text-ink">{r.title}</b> {r.body}
        </li>
      ))}
    </ul>
  );
}
