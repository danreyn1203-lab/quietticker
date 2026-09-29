import { cn } from "@/lib/cn";
import type { Assessment, SignalCategory } from "@/lib/types";
import { assessmentLabel, signalTone } from "@/lib/signals";
import { toneBadge, toneDot } from "./tone";

/**
 * A signal reading shown as dot + word (never color alone — §39).
 * The dot is decorative; the label carries the meaning for screen readers.
 */
export function SignalBadge({
  category,
  assessment,
  className,
}: {
  category: SignalCategory;
  assessment: Assessment;
  className?: string;
}) {
  const tone = signalTone(category, assessment);
  const label = assessmentLabel(category, assessment);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        toneBadge[tone],
        className,
      )}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full", toneDot[tone])}
        aria-hidden
      />
      {label}
    </span>
  );
}
