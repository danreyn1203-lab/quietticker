import Link from "next/link";
import { cn } from "@/lib/cn";

/** A small signal/tag pill. Links to a filtered discovery view when href is set. */
export function Tag({
  label,
  href,
  active = false,
  className,
}: {
  label: string;
  href?: string;
  active?: boolean;
  className?: string;
}) {
  const cls = cn(
    "inline-flex items-center rounded-full border px-3 py-1 text-sm transition-colors",
    active
      ? "border-brand bg-brand-soft text-brand-ink"
      : "border-line-strong bg-surface text-ink-soft hover:border-ink-muted hover:text-ink",
    className,
  );
  if (href) {
    return (
      <Link href={href} className={cls}>
        {label}
      </Link>
    );
  }
  return <span className={cls}>{label}</span>;
}
