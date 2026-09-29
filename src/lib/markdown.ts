/**
 * Minimal, safe inline-markdown renderer for author-edited prose.
 * Escapes HTML first, then applies a tiny whitelist: **bold**, *italic*,
 * [text](url), and paragraph breaks on blank lines. No raw HTML passes through,
 * so author edits can never inject markup.
 */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inline(s: string): string {
  let out = escapeHtml(s);
  // links [text](https://…) — only http(s), rendered safe
  out = out.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    (_m, text, url) =>
      `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`,
  );
  // bold then italic
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
  return out;
}

/** Returns an array of paragraph HTML strings (split on blank lines). */
export function renderParagraphs(md: string): string[] {
  return md
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => inline(p.replace(/\n/g, " ")));
}

/** Single inline string (no paragraph splitting). */
export function renderInline(md: string): string {
  return inline(md);
}
