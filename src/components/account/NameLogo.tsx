import { cn } from "@/lib/cn";

/**
 * A reader's personal mark: their first name set as the logo, in the same
 * brand tile the site wordmark uses. Their name, not the site's, is the thing
 * their profile is signed with.
 */
export function NameLogo({
  firstName,
  size = "sm",
  className,
}: {
  firstName: string;
  size?: "sm" | "lg";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center justify-center rounded-md bg-brand font-serif font-semibold text-on-brand",
        size === "lg"
          ? "h-14 px-5 text-2xl"
          : "h-8 px-2.5 text-sm leading-none",
        className,
      )}
    >
      <span className="truncate">{firstName}</span>
    </span>
  );
}
