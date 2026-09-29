import { cn } from "@/lib/cn";

/**
 * "My Research Signal" gauge. Intentionally rendered in the neutral brand
 * color at every value — a high score is NOT a green "buy" light. It
 * summarizes the framework; it does not predict returns (§18, §46).
 */
export function SignalScore({
  score,
  size = "md",
  className,
}: {
  score: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const dims = { sm: 56, md: 84, lg: 116 }[size];
  const stroke = { sm: 5, md: 7, lg: 9 }[size];
  const r = (dims - stroke) / 2;
  const c = 2 * Math.PI * r;
  const frac = Math.max(0, Math.min(1, score / 10));
  const numberSize = { sm: "text-lg", md: "text-2xl", lg: "text-4xl" }[size];

  return (
    <div
      className={cn("relative inline-grid place-items-center", className)}
      style={{ width: dims, height: dims }}
      role="img"
      aria-label={`Research signal ${score.toFixed(1)} out of 10`}
    >
      <svg width={dims} height={dims} className="-rotate-90">
        <circle
          cx={dims / 2}
          cy={dims / 2}
          r={r}
          fill="none"
          stroke="var(--line-strong)"
          strokeWidth={stroke}
        />
        <circle
          cx={dims / 2}
          cy={dims / 2}
          r={r}
          fill="none"
          stroke="var(--brand)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - frac)}
        />
      </svg>
      <div className="absolute flex flex-col items-center leading-none">
        <span className={cn("tnum font-semibold text-ink", numberSize)}>
          {score.toFixed(1)}
        </span>
        {size !== "sm" && (
          <span className="mt-0.5 text-[0.65rem] font-medium text-ink-muted">
            / 10
          </span>
        )}
      </div>
    </div>
  );
}
