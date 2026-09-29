import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand text-on-brand hover:bg-brand-hover border border-transparent",
  secondary:
    "bg-surface text-ink border border-line-strong hover:border-ink-muted hover:bg-surface-sunken",
  ghost: "text-ink-soft hover:text-ink hover:bg-surface-sunken border border-transparent",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm gap-1.5",
  md: "h-11 px-5 text-[0.95rem] gap-2",
};

const baseCls =
  "inline-flex items-center justify-center rounded-md font-medium transition-colors duration-150 whitespace-nowrap";

export function Button({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  type = "button",
  onClick,
}: {
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
}) {
  const cls = cn(baseCls, variants[variant], sizes[size], className);
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={cls} onClick={onClick}>
      {children}
    </button>
  );
}
