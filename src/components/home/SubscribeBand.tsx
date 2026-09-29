import { Container } from "@/components/layout/Container";
import { SubscribeForm } from "@/components/SubscribeForm";

export function SubscribeBand() {
  return (
    <section className="border-y border-line bg-surface">
      <Container className="py-14">
        <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="eyebrow mb-3">Stay in the loop</p>
            <h2 className="font-serif text-3xl font-semibold leading-tight tracking-tight text-ink">
              New research, straight to your inbox.
            </h2>
            <p className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-ink-soft">
              When I publish a new write-up, change a rating, or buy something, I
              send a short note. No spam, no hype — just the research. Unsubscribe
              anytime.
            </p>
          </div>
          <div>
            <SubscribeForm />
            <p className="mt-3 text-xs text-ink-muted">
              Your email is only used to send research updates. Nothing is shared
              or sold.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
