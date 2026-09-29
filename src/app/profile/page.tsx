import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { NameLogo } from "@/components/account/NameLogo";
import { ProfileActions } from "@/components/account/ProfileActions";
import { Button } from "@/components/ui/Button";
import { getReader } from "@/lib/readerAuth";
import { getSubscribers } from "@/lib/subscribers";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your profile",
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const reader = await getReader();
  if (!reader) redirect("/signup");

  const subscribed = (await getSubscribers()).some(
    (s) => s.email === reader.email,
  );
  const joined = formatDate(reader.joinedAt.slice(0, 10));

  return (
    <Container className="max-w-2xl py-14 sm:py-20">
      <p className="eyebrow mb-3">Your profile</p>
      <NameLogo firstName={reader.firstName} size="lg" />
      <h1 className="mt-5 font-serif text-3xl font-semibold tracking-tight text-ink">
        Hello, {reader.firstName}.
      </h1>
      <p className="mt-3 text-[0.98rem] leading-relaxed text-ink-soft">
        This page is yours and only yours. Your profile is signed with your first
        name, it holds nothing but what you typed, and no one else can open it.
      </p>

      <dl className="mt-8 divide-y divide-line overflow-hidden rounded-lg border border-line">
        <Row label="First name" value={reader.firstName} />
        <Row label="Email" value={reader.email} />
        <Row label="Member since" value={joined} />
        <Row
          label="Research email"
          value={
            subscribed
              ? "Subscribed — new write-ups come to you"
              : "Not subscribed"
          }
          tone={subscribed ? "pos" : "muted"}
        />
      </dl>

      <ProfileActions email={reader.email} subscribed={subscribed} />

      <div className="mt-10 rounded-lg border border-line bg-surface p-5">
        <h2 className="font-serif text-lg font-semibold text-ink">
          Where to next
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Everything on the site is free to read whether you&rsquo;re signed in
          or not — the account just puts the research in your inbox.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button href="/journal" size="sm">
            Read the journal
          </Button>
          <Button href="/portfolio" size="sm" variant="secondary">
            See disclosed holdings
          </Button>
        </div>
      </div>

      <p className="mt-8 text-xs leading-relaxed text-ink-muted">
        Your email is only ever used to send research updates — never shared,
        never sold. Deleting your profile removes your name and email from the
        site entirely.
      </p>
    </Container>
  );
}

function Row({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "pos" | "muted";
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 bg-surface px-5 py-4">
      <dt className="text-[0.68rem] font-semibold uppercase tracking-wide text-ink-muted">
        {label}
      </dt>
      <dd
        className={
          "text-sm " +
          (tone === "pos"
            ? "font-medium text-pos"
            : tone === "muted"
              ? "text-ink-muted"
              : "text-ink")
        }
      >
        {value}
      </dd>
    </div>
  );
}
