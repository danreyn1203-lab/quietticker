import Link from "next/link";
import { cn } from "@/lib/cn";
import { NameLogo } from "./NameLogo";

/**
 * Header account control, driven by the reader session the root layout reads.
 *
 * Signed in → their first-name logo, linking to their own profile.
 * Signed out → the sign-up call to action. Never anything about the author:
 * the author signs in at /admin and nothing here hints at it.
 */
export function AccountChip({
  firstName,
  className,
}: {
  firstName: string | null;
  className?: string;
}) {
  if (firstName) {
    return (
      <Link
        href="/profile"
        aria-label={`Your profile, ${firstName}`}
        className={cn(
          "inline-flex shrink-0 items-center gap-2 rounded-full border border-line-strong bg-surface py-1 pl-1 pr-3 text-sm font-medium text-ink-soft transition-colors hover:text-ink",
          className,
        )}
      >
        <NameLogo firstName={firstName} className="h-7 max-w-[7.5rem]" />
        <span className="hidden lg:inline">Profile</span>
      </Link>
    );
  }

  return (
    <Link
      href="/signup"
      className={cn(
        "inline-flex h-9 shrink-0 items-center justify-center rounded-md bg-brand px-3.5 text-sm font-medium text-on-brand transition-colors hover:bg-brand-hover",
        className,
      )}
    >
      Sign up
    </Link>
  );
}
