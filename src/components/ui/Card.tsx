import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Card({
  as: Tag = "div",
  className,
  children,
  hover = false,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  hover?: boolean;
}) {
  return (
    <Tag
      className={cn(
        "rounded-lg border border-line bg-surface shadow-sm",
        hover &&
          "transition-shadow transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
