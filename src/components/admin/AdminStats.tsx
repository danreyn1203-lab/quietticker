import { formatDateShort } from "@/lib/format";
import type { ReaderStats } from "@/lib/readers";

/**
 * Audience panel for the author dashboard: how many people have signed up, how
 * fast that's growing, and who arrived recently. Counts only — the site tracks
 * no behaviour, so there is nothing else to show.
 *
 * One series, so no legend (the heading names it); labels are selective; the
 * numbers are also available as a table for anyone not reading the bars.
 */
export function AdminStats({
  readers,
  subscriberCount,
  broadcastCount,
  lastBroadcastAt,
}: {
  readers: ReaderStats;
  subscriberCount: number;
  broadcastCount: number;
  lastBroadcastAt: string | null;
}) {
  const peak = Math.max(1, ...readers.perWeek.map((w) => w.count));
  const latest = readers.perWeek[readers.perWeek.length - 1];

  return (
    <section className="mt-8">
      <h2 className="font-serif text-xl font-semibold text-ink">Your audience</h2>

      {/* KPI row */}
      <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-4">
        <Tile
          label="Signed-up readers"
          value={readers.total}
          caption={
            readers.total === 0
              ? "no sign-ups yet"
              : `${readers.verified} verified${
                  readers.total > readers.verified
                    ? ` · ${readers.total - readers.verified} pending`
                    : ""
                }`
          }
        />
        <Tile
          label="New this week"
          value={readers.last7Days}
          caption="last 7 days"
        />
        <Tile
          label="New this month"
          value={readers.last30Days}
          caption="last 30 days"
        />
        <Tile
          label="On the email list"
          value={subscriberCount}
          caption={
            subscriberCount > readers.total
              ? `${subscriberCount - readers.total} without a profile`
              : "every sign-up is subscribed"
          }
        />
      </div>

      {/* Sign-ups per week */}
      <div className="mt-4 rounded-lg border border-line bg-surface p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-sm font-semibold text-ink">
            Sign-ups per week{" "}
            <span className="font-normal text-ink-muted">
              · last {readers.perWeek.length} weeks
            </span>
          </h3>
          <p className="text-xs text-ink-muted">
            {broadcastCount} email{broadcastCount === 1 ? "" : "s"} sent
            {lastBroadcastAt
              ? ` · last ${formatDateShort(lastBroadcastAt.slice(0, 10))}`
              : ""}
          </p>
        </div>

        {readers.total === 0 ? (
          <p className="mt-4 text-sm text-ink-soft">
            No sign-ups yet. The form lives at{" "}
            <code className="rounded bg-surface-sunken px-1">/signup</code> and
            the homepage band links to it.
          </p>
        ) : (
          <>
            <div className="mt-5 flex h-28 items-end gap-0.5">
              {readers.perWeek.map((w) => {
                const isPeak = w.count === peak && peak > 0;
                const isLatest = w === latest;
                const pct = (w.count / peak) * 100;
                return (
                  <div
                    key={w.weekStart}
                    className="group relative flex h-full flex-1 flex-col justify-end"
                  >
                    {/* Selective direct labels: the peak week and the current one. */}
                    {(isPeak || isLatest) && w.count > 0 && (
                      <span className="tnum mb-1 text-center text-[0.7rem] font-semibold text-ink-soft">
                        {w.count}
                      </span>
                    )}
                    {w.count > 0 ? (
                      <div
                        className="w-full rounded-t-[4px] bg-chart-b"
                        style={{ height: `${Math.max(pct, 4)}%` }}
                      />
                    ) : (
                      // An empty week reads as zero, not as missing data.
                      <div className="h-0.5 w-full rounded-t-[1px] bg-line-strong" />
                    )}
                    <span
                      role="tooltip"
                      className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 -translate-x-1/2 whitespace-nowrap rounded-md border border-line bg-paper px-2 py-1 text-xs text-ink opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                    >
                      Week of {formatDateShort(w.weekStart)} ·{" "}
                      <span className="tnum font-semibold">{w.count}</span>
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-2 flex justify-between border-t border-line pt-2 text-[0.7rem] text-ink-muted">
              <span>{formatDateShort(readers.perWeek[0].weekStart)}</span>
              <span>this week</span>
            </div>

            <details className="mt-4">
              <summary className="cursor-pointer text-xs font-medium text-ink-soft hover:text-ink">
                Show as a table
              </summary>
              <table className="mt-3 w-full text-left text-xs">
                <thead className="text-ink-muted">
                  <tr>
                    <th className="py-1 font-semibold">Week of</th>
                    <th className="py-1 text-right font-semibold">Sign-ups</th>
                  </tr>
                </thead>
                <tbody className="text-ink-soft">
                  {readers.perWeek.map((w) => (
                    <tr key={w.weekStart} className="border-t border-line">
                      <td className="py-1">{formatDateShort(w.weekStart)}</td>
                      <td className="tnum py-1 text-right">{w.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </details>
          </>
        )}
      </div>

      {/* Recent sign-ups */}
      {readers.recent.length > 0 && (
        <div className="mt-4 overflow-hidden rounded-lg border border-line">
          <div className="flex items-baseline justify-between gap-2 bg-surface-sunken px-5 py-2.5">
            <h3 className="text-sm font-semibold text-ink">Recent sign-ups</h3>
            <p className="text-xs text-ink-muted">
              newest first · {readers.recent.length} of {readers.total}
            </p>
          </div>
          <ul className="divide-y divide-line">
            {readers.recent.map((r) => (
              <li
                key={r.id}
                className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 bg-surface px-5 py-3"
              >
                <div className="min-w-0">
                  <span className="font-medium text-ink">{r.firstName}</span>
                  <span className="ml-2 break-all text-sm text-ink-soft">
                    {r.email}
                  </span>
                  {!r.verified && (
                    <span className="ml-2 rounded bg-warn-soft px-1.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide text-warn">
                      pending
                    </span>
                  )}
                </div>
                <span className="tnum shrink-0 text-xs text-ink-muted">
                  {formatDateShort(r.joinedAt.slice(0, 10))}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function Tile({
  label,
  value,
  caption,
}: {
  label: string;
  value: number;
  caption: string;
}) {
  return (
    <div className="bg-surface p-4">
      <p className="text-[0.68rem] font-semibold uppercase tracking-wide text-ink-muted">
        {label}
      </p>
      <p className="tnum mt-1 text-2xl font-semibold text-ink">{value}</p>
      <p className="mt-0.5 text-xs text-ink-muted">{caption}</p>
    </div>
  );
}
