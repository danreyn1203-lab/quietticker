import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { Tone } from "@/lib/signals";
import { toneBadge } from "./tone";

/** Generic small pill. Tone sets the soft background + text color. */
export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        toneBadge[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
