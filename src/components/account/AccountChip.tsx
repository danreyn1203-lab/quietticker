import Link from "next/link";
import { cn } from "@/lib/cn";
import { NameLogo } from "./NameLogo";

/**
 * Header account control, driven by the sessions the root layout reads.
 *
 * - Author signed in  → a small "Author" badge linking to /admin, so when the
 *   real owner is signed in it's visible right on the home screen. Nobody else
 *   ever sees this, because it only renders when the author cookie verifies.
 * - Reader signed in   → their first-name logo, linking to their own profile.
 * - Signed out         → a quiet "Sign in" link plus the "Sign up" button.
 *
 * Reader and author are independent, so both can show at once (the owner may
 * also keep a reader profile). A reader session never turns into the author
 * badge — that flag is computed server-side from a different, separately signed
 * cookie.
 */
export function AccountChip({
  firstName,
  isAuthor = false,
  className,
}: {
  firstName: string | null;
  isAuthor?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {isAuthor && (
        <Link
          href="/admin"
          aria-label="Author dashboard"
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-brand/30 bg-brand-soft px-3 text-sm font-medium text-brand-ink transition-colors hover:bg-brand-soft/70"
        >
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-pos" />
          Author
        </Link>
      )}

      {firstName ? (
        <Link
          href="/profile"
          aria-label={`Your profile, ${firstName}`}
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-line-strong bg-surface py-1 pl-1 pr-3 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
        >
          <NameLogo firstName={firstName} className="h-7 max-w-[7.5rem]" />
          <span className="hidden lg:inline">Profile</span>
        </Link>
      ) : (
        !isAuthor && (
          <>
            <Link
              href="/signin"
              className="shrink-0 px-1 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="inline-flex h-9 shrink-0 items-center justify-center rounded-md bg-brand px-3.5 text-sm font-medium text-on-brand transition-colors hover:bg-brand-hover"
            >
              Sign up
            </Link>
          </>
        )
      )}
    </div>
  );
}
