import { cn } from "@/lib/cn";
import type { Source, SourceClass } from "@/lib/types";
import type { Tone } from "@/lib/signals";
import { formatDateShort } from "@/lib/format";
import { toneBadge } from "./tone";
import { External, Info } from "./icons";

/** Fact vs. opinion is color-coded so the two never blur together (§27, §69). */
const classTone: Record<SourceClass, Tone> = {
  Primary: "pos",
  Secondary: "neutral",
  "Analyst Opinion": "warn",
  "Author Interpretation": "brand",
};

/**
 * A citation chip. Reveals full provenance on hover/focus — where a number or
 * claim actually came from. Pure CSS popover (no JS): shows on group-hover and
 * group-focus-within so it is keyboard accessible.
 */
export function SourceBadge({
  source,
  label = "Source",
  className,
}: {
  source: Source;
  label?: string;
  className?: string;
}) {
  return (
    <span className={cn("group relative inline-flex align-middle", className)}>
      <button
        type="button"
        className="inline-flex items-center gap-1 rounded-full border border-line-strong bg-surface px-2 py-0.5 text-[0.7rem] font-medium text-ink-soft transition-colors hover:border-ink-muted hover:text-ink"
        aria-label={`Source: ${source.publisher} — ${source.title}`}
      >
        <Info width={11} height={11} />
        {label}
      </button>

      <span
        role="tooltip"
        className="pointer-events-none invisible absolute bottom-full left-0 z-30 mb-2 w-64 translate-y-1 rounded-lg border border-line bg-surface p-3 text-left opacity-0 shadow-lg transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
      >
        <span
          className={cn(
            "mb-1.5 inline-flex rounded-full px-2 py-0.5 text-[0.65rem] font-semibold",
            toneBadge[classTone[source.classification]],
          )}
        >
          {source.classification}
        </span>
        <span className="block text-sm font-medium text-ink">
          {source.title}
        </span>
        <span className="mt-0.5 block text-xs text-ink-soft">
          {source.publisher} · {source.type}
        </span>
        {source.publishedAt && (
          <span className="mt-1 block text-[0.7rem] text-ink-muted">
            Published {formatDateShort(source.publishedAt)}
            {source.accessedAt
              ? ` · accessed ${formatDateShort(source.accessedAt)}`
              : ""}
          </span>
        )}
        {source.url && (
          <span className="mt-1 inline-flex items-center gap-1 text-[0.7rem] text-brand">
            <External width={11} height={11} /> View source
          </span>
        )}
      </span>
    </span>
  );
}
