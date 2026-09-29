import { cn } from "@/lib/cn";
import { direction, formatChange, formatPct } from "@/lib/format";
import { ArrowDown, ArrowUp } from "./icons";

/**
 * Price move shown with an arrow AND a signed number AND color — never color
 * alone (§39). Screen readers get an explicit up/down phrase.
 */
export function PriceChange({
  change,
  changePct,
  size = "md",
  className,
}: {
  change: number;
  changePct: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const dir = direction(change);
  const color =
    dir === "up" ? "text-pos" : dir === "down" ? "text-neg" : "text-ink-muted";
  const icon =
    size === "sm" ? { width: 12, height: 12 } : { width: 14, height: 14 };
  const text = size === "sm" ? "text-xs" : "text-sm";

  return (
    <span className={cn("inline-flex items-center gap-1 font-medium", color, text, className)}>
      {dir === "up" && <ArrowUp {...icon} />}
      {dir === "down" && <ArrowDown {...icon} />}
      <span className="tnum">
        {formatChange(change)} ({formatPct(changePct)})
      </span>
      <span className="sr-only">
        {dir === "up" ? "up" : dir === "down" ? "down" : "unchanged"}
      </span>
    </span>
  );
}
