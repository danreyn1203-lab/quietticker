import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { SignUpForm } from "@/components/SignUpForm";
import { Check } from "@/components/ui/icons";
import { site } from "@/lib/site";
import { getReader } from "@/lib/readerAuth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign up",
  description: `Sign up for ${site.name} — name, email and a password, confirmed with a quick code, and you are on the research email.`,
  alternates: { canonical: "/signup" },
};

const promises = [
  "Every new write-up, the day it goes up.",
  "A note when I change a rating or buy something.",
  "The bear case, not just the bull case.",
  "No hype, no paywall, no affiliate links.",
];

export default async function SignUpPage() {
  // Already signed in? Their profile is the useful page.
  if (await getReader()) redirect("/profile");

  return (
    <Container className="py-14 sm:py-20">
      <div className="grid items-start gap-12 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="eyebrow mb-3">Sign up</p>
          <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight text-ink">
            Get the research as I publish it.
          </h1>
          <p className="mt-4 max-w-md text-[0.98rem] leading-relaxed text-ink-soft">
            Name, email, and a password. We email you a 6-digit code to confirm
            the address is really yours, and once you enter it you&rsquo;re on
            the research list. Free, and nothing to pay.
          </p>

          <ul className="mt-8 space-y-3">
            {promises.map((p) => (
              <li key={p} className="flex gap-3 text-[0.95rem] text-ink-soft">
                <span className="mt-0.5 shrink-0 text-pos">
                  <Check width={18} height={18} />
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-lg border border-line bg-surface p-5">
            <h2 className="font-serif text-lg font-semibold text-ink">
              What your profile is — and isn&rsquo;t
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Your profile is yours: your first name, your email, and your
              subscription. It is signed with your first name and only you can
              see it. It gives you no access to anyone else&rsquo;s
              profile, and none to {site.author}&rsquo;s author tools or the
              research itself — publishing stays with the author, reading stays
              free for everyone.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm sm:p-7">
          <h2 className="font-serif text-xl font-semibold text-ink">
            Create your profile
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            We&rsquo;ll email a code to confirm it&rsquo;s you.{" "}
            <Link
              href="/signin"
              className="font-medium text-ink underline decoration-line-strong underline-offset-2 hover:text-ink-soft"
            >
              Already have one? Sign in
            </Link>
            .
          </p>
          <SignUpForm className="mt-6" />
        </div>
      </div>
    </Container>
  );
}
