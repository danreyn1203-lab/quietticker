import { renderParagraphs, renderInline } from "@/lib/markdown";

/** Body prose — safe inline markdown, editorial serif. */
export function Prose({ md }: { md: string }) {
  const paras = renderParagraphs(md);
  return (
    <div className="reading">
      {paras.map((html, i) => (
        <p key={i} dangerouslySetInnerHTML={{ __html: html }} />
      ))}
    </div>
  );
}

/** A single smaller-emphasis lead-in paragraph. */
export function LeadIn({ md }: { md: string }) {
  return (
    <p
      className="max-w-2xl text-[0.95rem] leading-relaxed text-ink-soft"
      dangerouslySetInnerHTML={{ __html: renderInline(md) }}
    />
  );
}
