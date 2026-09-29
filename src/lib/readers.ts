import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { addSubscriber, removeSubscriber, isValidEmail } from "@/lib/subscribers";

/**
 * Reader accounts — the people who sign up on the public site.
 *
 * A reader is a first name plus an email, nothing more: no password (yet), no
 * profile fields, no tracking. Signing up IS subscribing — one step, so the
 * email list and the account list can never drift apart.
 *
 * This is deliberately NOT the author account. The author has no row here and
 * no reader session can ever reach the author tools (see src/lib/readerAuth.ts
 * and src/lib/auth.ts — different cookies, different signing keys, different
 * roles). Local JSON store, same as the rest of the site's data.
 */

export interface Reader {
  id: string;
  firstName: string;
  email: string;
  /** ISO timestamp. */
  joinedAt: string;
  /** Where they signed up from, e.g. "signup-page". */
  source: string;
}

const FILE = path.join(process.cwd(), "src", "content", "readers.json");

/** Keep names short, single-line, and free of markup. */
export function cleanFirstName(input: string): string {
  return input
    .replace(/[\p{C}<>]/gu, "") // control chars and angle brackets
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 40);
}

export function isValidFirstName(name: string): boolean {
  return cleanFirstName(name).length >= 1;
}

export async function getReaders(): Promise<Reader[]> {
  try {
    const data = JSON.parse(await fs.readFile(FILE, "utf8"));
    return Array.isArray(data.readers) ? data.readers : [];
  } catch {
    return [];
  }
}

async function writeReaders(readers: Reader[]): Promise<void> {
  await fs.writeFile(FILE, JSON.stringify({ readers }, null, 2), "utf8");
}

export async function findReaderByEmail(emailRaw: string): Promise<Reader | null> {
  const email = emailRaw.trim().toLowerCase();
  const readers = await getReaders();
  return readers.find((r) => r.email === email) ?? null;
}

export async function findReaderById(id: string): Promise<Reader | null> {
  const readers = await getReaders();
  return readers.find((r) => r.id === id) ?? null;
}

export interface SignUpResult {
  ok: boolean;
  reader?: Reader;
  /** True when this email already had an account — we just sign them back in. */
  already?: boolean;
  error?: string;
}

/**
 * Create a reader account and subscribe that address in one step.
 * An email that already has an account is not an error: it returns the
 * existing reader so the caller can simply resume their session.
 */
export async function signUpReader({
  firstName: firstNameRaw,
  email: emailRaw,
  source = "signup-page",
}: {
  firstName: string;
  email: string;
  source?: string;
}): Promise<SignUpResult> {
  const firstName = cleanFirstName(firstNameRaw);
  const email = emailRaw.trim().toLowerCase();

  if (!firstName) return { ok: false, error: "Please add a first name." };
  if (!isValidEmail(email)) {
    return { ok: false, error: "That doesn’t look like a valid email." };
  }

  const existing = await findReaderByEmail(email);
  if (existing) {
    // Already a reader: make sure they're still on the email list, then resume.
    await addSubscriber(email);
    return { ok: true, reader: existing, already: true };
  }

  const reader: Reader = {
    id: randomUUID(),
    firstName,
    email,
    joinedAt: new Date().toISOString(),
    source,
  };

  const readers = await getReaders();
  readers.push(reader);
  await writeReaders(readers);

  // Signing up IS subscribing — that's the whole promise of the form.
  await addSubscriber(email);

  return { ok: true, reader };
}

/** Delete a reader's account and take them off the email list. */
export async function deleteReader(id: string): Promise<void> {
  const readers = await getReaders();
  const reader = readers.find((r) => r.id === id);
  if (!reader) return;
  await writeReaders(readers.filter((r) => r.id !== id));
  await removeSubscriber(reader.email);
}

export interface ReaderStats {
  total: number;
  last7Days: number;
  last30Days: number;
  /** ISO timestamp of the most recent sign-up, or null. */
  newestAt: string | null;
  /** Sign-ups per ISO week, oldest first — for the dashboard trend. */
  perWeek: { weekStart: string; count: number }[];
  /** Most recent sign-ups, newest first. */
  recent: Reader[];
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Monday of the week containing `d`, as YYYY-MM-DD (UTC). */
function weekStart(d: Date): string {
  const utc = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
  );
  const shift = (utc.getUTCDay() + 6) % 7; // Monday = 0
  utc.setUTCDate(utc.getUTCDate() - shift);
  return utc.toISOString().slice(0, 10);
}

/** Aggregates for the author dashboard. Counts only — no behaviour tracking. */
export async function getReaderStats(weeks = 8): Promise<ReaderStats> {
  const readers = await getReaders();
  const now = Date.now();

  const sorted = [...readers].sort(
    (a, b) => Date.parse(b.joinedAt) - Date.parse(a.joinedAt),
  );

  // Buckets for the last `weeks` weeks, oldest first, zero-filled.
  const buckets = new Map<string, number>();
  for (let i = weeks - 1; i >= 0; i--) {
    buckets.set(weekStart(new Date(now - i * 7 * DAY_MS)), 0);
  }
  for (const r of readers) {
    const t = Date.parse(r.joinedAt);
    if (Number.isNaN(t)) continue;
    const key = weekStart(new Date(t));
    if (buckets.has(key)) buckets.set(key, buckets.get(key)! + 1);
  }

  const within = (days: number) =>
    readers.filter((r) => {
      const t = Date.parse(r.joinedAt);
      return !Number.isNaN(t) && now - t <= days * DAY_MS;
    }).length;

  return {
    total: readers.length,
    last7Days: within(7),
    last30Days: within(30),
    newestAt: sorted[0]?.joinedAt ?? null,
    perWeek: [...buckets].map(([week, count]) => ({ weekStart: week, count })),
    recent: sorted.slice(0, 12),
  };
}
