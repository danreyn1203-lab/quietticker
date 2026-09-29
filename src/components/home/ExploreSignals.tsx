import Link from "next/link";
import { EXPLORE_SIGNALS } from "@/lib/signals";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowRight } from "@/components/ui/icons";

export function ExploreSignals() {
  return (
    <section>
      <SectionHeading
        eyebrow="Explore signals"
        title="Browse my research by theme"
        description="These are the threads running through the stocks I’ve recommended. Tap one to see the picks behind it — not investment guarantees."
      />

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {EXPLORE_SIGNALS.map((s) => (
          <Link
            key={s.slug}
            href={`/signals/${s.slug}`}
            className="group flex flex-col rounded-lg border border-line bg-surface p-4 transition-colors hover:border-brand"
          >
            <span className="flex items-center justify-between">
              <span className="font-medium text-ink">{s.label}</span>
              <ArrowRight
                width={15}
                height={15}
                className="text-ink-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand"
              />
            </span>
            <span className="mt-1.5 text-xs leading-relaxed text-ink-muted">
              {s.description}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
