import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { SignInForm } from "@/components/SignInForm";
import { site } from "@/lib/site";
import { getReader } from "@/lib/readerAuth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign in",
  description: `Sign back in to your ${site.name} profile.`,
  alternates: { canonical: "/signin" },
};

export default async function SignInPage() {
  if (await getReader()) redirect("/profile");

  return (
    <Container className="max-w-md py-16 sm:py-24">
      <p className="eyebrow mb-3">Welcome back</p>
      <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink">
        Sign in
      </h1>
      <p className="mt-3 text-[0.98rem] leading-relaxed text-ink-soft">
        Pick up where you left off — your profile and your subscription are tied
        to your email.
      </p>
      <div className="mt-8 rounded-2xl border border-line bg-surface p-6 shadow-sm sm:p-7">
        <SignInForm />
      </div>
    </Container>
  );
}
