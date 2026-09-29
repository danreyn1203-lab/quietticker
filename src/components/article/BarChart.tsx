import { TONE_VAR, type BarDatum } from "@/lib/articles/types";

const MONO: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontVariantNumeric: "tabular-nums",
};

/**
 * Horizontal bar chart, static SVG (no library). Two layouts:
 *  - normal: category gutter on the left, bars from a left axis, value at the end.
 *  - diverging: category label above each bar, bars from a centered zero line,
 *    positives right / negatives left. Used for the YTD-return chart.
 * Colors come from theme tokens so both modes read in light and dark.
 * Each bar carries a native <title> for hover.
 */
export function BarChart({
  title,
  sub,
  data,
  max,
  diverging = false,
  source,
}: {
  title: string;
  sub?: string;
  data: BarDatum[];
  max: number;
  diverging?: boolean;
  source?: string;
}) {
  const chart = diverging ? (
    <DivergingBars data={data} />
  ) : (
    <NormalBars data={data} max={max} />
  );

  return (
    <figure className="my-0 rounded-lg border border-line bg-surface p-[18px] shadow-sm">
      <figcaption className="mb-0">
        <h3 className="text-[1.02rem] font-semibold text-ink">{title}</h3>
        {sub && <p className="mt-0.5 text-sm text-ink-muted">{sub}</p>}
      </figcaption>
      <div className="mt-3">{chart}</div>
      {source && <p className="mt-2 text-xs text-ink-muted">{source}</p>}
    </figure>
  );
}

function NormalBars({ data, max }: { data: BarDatum[]; max: number }) {
  const W = 640;
  const GUTTER = 140; // category labels right-aligned here
  const AXIS = 150;
  const PW = 380; // plot width
  const PITCH = 42;
  const TOP = 14;
  const height = TOP + data.length * PITCH + 8;

  return (
    <svg
      viewBox={`0 0 ${W} ${height}`}
      className="block h-auto w-full overflow-visible"
      role="img"
      aria-label={data.map((d) => `${d.cat}: ${d.label}`).join("; ")}
    >
      <line x1={AXIS} y1={8} x2={AXIS} y2={height - 8} stroke="var(--line-strong)" strokeWidth={1} />
      {data.map((d, i) => {
        const top = TOP + i * PITCH;
        const bh = d.sub ? 20 : 28;
        const barY = top + (28 - bh) / 2;
        const w = Math.max(0, (d.value / max) * PW);
        const midY = top + 14 + 5;
        return (
          <g key={i}>
            <text
              x={GUTTER - 10}
              y={midY}
              textAnchor="end"
              style={MONO}
              fontSize={d.sub ? 12 : 14}
              fontWeight={600}
              fill={d.sub ? "var(--ink-muted)" : "var(--ink)"}
            >
              {d.cat}
            </text>
            <rect x={AXIS} y={barY} width={w} height={bh} rx={4} fill={TONE_VAR[d.tone]}>
              <title>{d.title ?? `${d.cat}: ${d.label}`}</title>
            </rect>
            <text
              x={AXIS + w + 8}
              y={midY}
              style={MONO}
              fontSize={d.sub ? 13 : 15}
              fontWeight={600}
              fill={d.sub ? "var(--ink-muted)" : "var(--ink)"}
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function DivergingBars({ data }: { data: BarDatum[] }) {
  const W = 640;
  const LEFT = 40;
  const RIGHT = 600;
  const ZERO = (LEFT + RIGHT) / 2; // centered zero line
  const HALF = (RIGHT - LEFT) / 2;
  const maxAbs = Math.max(...data.map((d) => Math.abs(d.value))) * 1.04 || 1;
  const scale = HALF / maxAbs;
  const LABEL_H = 15;
  const BAR_H = 22;
  const PITCH = LABEL_H + BAR_H + 12;
  const TOP = 10;
  const height = TOP + data.length * PITCH + 6;

  return (
    <svg
      viewBox={`0 0 ${W} ${height}`}
      className="block h-auto w-full overflow-visible"
      role="img"
      aria-label={data.map((d) => `${d.cat}: ${d.label}`).join("; ")}
    >
      <line x1={ZERO} y1={6} x2={ZERO} y2={height - 6} stroke="var(--line-strong)" strokeWidth={1} />
      {data.map((d, i) => {
        const rowTop = TOP + i * PITCH;
        const barY = rowTop + LABEL_H;
        const w = Math.abs(d.value) * scale;
        const pos = d.value >= 0;
        const barX = pos ? ZERO : ZERO - w;
        const color = TONE_VAR[d.tone];
        return (
          <g key={i}>
            <text
              x={LEFT}
              y={rowTop + 11}
              style={MONO}
              fontSize={12.5}
              fontWeight={600}
              fill="var(--ink)"
            >
              {d.cat}
            </text>
            <rect x={barX} y={barY} width={w} height={BAR_H} rx={4} fill={color}>
              <title>{d.title ?? `${d.cat}: ${d.label}`}</title>
            </rect>
            <text
              x={pos ? barX + w + 7 : barX - 7}
              y={barY + BAR_H / 2 + 5}
              textAnchor={pos ? "start" : "end"}
              style={MONO}
              fontSize={13}
              fontWeight={600}
              fill={color}
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
