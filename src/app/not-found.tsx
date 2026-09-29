import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "@/components/ui/icons";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center py-28 text-center">
      <p className="eyebrow mb-3">404</p>
      <h1 className="font-serif text-4xl font-semibold tracking-tight text-ink">
        We couldn&rsquo;t find that page.
      </h1>
      <p className="mt-4 max-w-md text-[0.98rem] leading-relaxed text-ink-soft">
        The company or page you&rsquo;re looking for may not have been published
        yet, or the link may be out of date.
      </p>
      <Button href="/" className="mt-8">
        Back to Discover
        <ArrowRight width={16} height={16} />
      </Button>
    </Container>
  );
}
