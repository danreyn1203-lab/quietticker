# Quiet Ticker

Independent stock research, published in the open.

A single-author research site: every write-up states what was bought, when, at what
price, and what would prove the thesis wrong. No hype, no paywall, no affiliate links.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 (CSS-first,
no `tailwind.config.js` — theme tokens live in `src/app/globals.css`).

## Getting started

```bash
npm install
cp .env.local.example .env.local   # then fill in the values
npm run dev
```

Open http://localhost:3000.

## How content works

Articles are structured JSON, not Markdown — each one is a list of typed blocks
(prose, charts, tables, risk lists, sources) so the renderer can lay them out
consistently and the charts stay data-driven.

| Path | What it holds |
| --- | --- |
| `src/content/articles/*.json` | One file per research write-up |
| `src/content/research-log.json` | Dated journal entries + the companies on the homepage |
| `src/content/featured.json` | The homepage "closest look" spotlight |
| `src/lib/articles/types.ts` | The block model every article conforms to |
| `src/components/article/` | The renderer for each block type |
| `src/lib/searchIndex.ts` | Client-safe search index — **update by hand when adding an article** |

## Authoring

Sign in at `/admin` with `AUTHOR_PASSWORD`. Once signed in:

- every article page gets an **Edit** button → `/journal/[slug]/edit`
- `/admin/featured` sets the homepage spotlight
- `/admin/email` composes and sends the newsletter

Auth is a single HMAC-signed httpOnly cookie (`src/lib/auth.ts`) — one author, no
user table. Saves `PUT` to `/api/articles/[slug]`, which writes the JSON file.

## Newsletter

Subscribers are captured by `SubscribeForm` → `POST /api/subscribe` and stored in
`src/content/subscribers.json`. Sending goes through Nodemailer over plain SMTP
(`src/lib/email.ts`); each subscriber gets their own email rather than a shared
thread. **If SMTP is unset the app falls back to generating a `mailto:` BCC link**,
so nothing breaks in development.

The subscriber and broadcast stores are git-ignored on purpose — they hold real
email addresses. `*.example.json` shows their shape.

## Environment

See `.env.local.example` for the full annotated list. Briefly:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public base URL — drives canonical links, sitemap, Open Graph |
| `AUTHOR_PASSWORD` | Password for `/admin` |
| `AUTHOR_SESSION_SECRET` | Long random string that signs the login cookie |
| `SMTP_*`, `NEWSLETTER_FROM` | Newsletter delivery; leave blank for mailto fallback |

## Scripts

```bash
npm run dev     # dev server
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

## A note on the research

Everything published here is one person's opinion and personal position, not
financial advice. Figures are checked against primary sources at the time of
writing and dated; where a claim could not be verified it is labelled as such
rather than quietly dropped.
