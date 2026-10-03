import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { VerifyForm } from "@/components/VerifyForm";
import { site } from "@/lib/site";
import { getReader, getPendingReader } from "@/lib/readerAuth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Confirm your email",
  robots: { index: false, follow: false },
};

export default async function VerifyPage() {
  // Already fully signed in → nothing to verify.
  if (await getReader()) redirect("/profile");

  // No pending sign-up → there's nothing to confirm; start at sign-in.
  const pending = await getPendingReader();
  if (!pending) redirect("/signin");

  return (
    <Container className="max-w-md py-16 sm:py-24">
      <p className="eyebrow mb-3">One more step</p>
      <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink">
        Confirm your email
      </h1>
      <p className="mt-3 text-[0.98rem] leading-relaxed text-ink-soft">
        This proves the address is yours before {site.name} ever emails you —
        the same confirmed opt-in a good newsletter uses.
      </p>
      <div className="mt-8 rounded-2xl border border-line bg-surface p-6 shadow-sm sm:p-7">
        <VerifyForm email={pending.email} />
      </div>
    </Container>
  );
}
