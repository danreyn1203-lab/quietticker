import { TONE_VAR, type TableCell } from "@/lib/articles/types";

export function ComparisonTable({
  columns,
  rows,
  note,
}: {
  columns: string[];
  rows: TableCell[][];
  note?: string;
}) {
  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[480px] border-collapse text-sm">
          <thead>
            <tr className="bg-surface-sunken">
              {columns.map((c, i) => (
                <th
                  key={i}
                  className="border-b border-line px-4 py-2.5 text-left text-[0.72rem] font-semibold uppercase tracking-wide text-ink-muted"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className={
                      "border-b border-line px-4 py-3 last:border-b-0 " +
                      (ci === 0
                        ? "font-medium text-ink-soft"
                        : "tnum") +
                      (ci === 0 ? "" : " whitespace-nowrap")
                    }
                    style={
                      ci > 0 && cell.tone
                        ? { color: TONE_VAR[cell.tone] }
                        : undefined
                    }
                  >
                    {cell.v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note && <p className="mt-2 text-sm text-ink-muted">{note}</p>}
    </div>
  );
}
