import "server-only";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";
import { findReaderById, type Reader } from "@/lib/readers";

/**
 * Reader sessions — completely separate from the author session in src/lib/auth.ts.
 *
 * The separation is the point: a reader cookie is a DIFFERENT cookie name,
 * signed with a DIFFERENT key (the shared secret domain-separated by a purpose
 * string), and carries role "reader". So a reader token cannot be replayed as
 * an author token — the signature won't verify, and even if it did, isAuthor()
 * requires role "author". Nobody who signs up can reach the author's dashboard,
 * research editing, or subscriber list.
 *
 * There is no password yet (sign-up is first name + email), so this cookie is
 * a convenience: it remembers who someone is for their own profile page. It
 * deliberately gates nothing sensitive.
 */

export const READER_COOKIE = "reader_session";
const MAX_AGE = 60 * 60 * 24 * 180; // 180 days — readers shouldn't have to re-enter

function key(): string {
  const base =
    process.env.AUTHOR_SESSION_SECRET ||
    // Dev fallback so the app runs before .env.local is set. Set a real value!
    "dev-insecure-secret-change-me";
  // Domain separation: a reader signature is never a valid author signature.
  return `${base}|reader-session-v1`;
}

function b64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function sign(payload: string): string {
  return b64url(createHmac("sha256", key()).update(payload).digest());
}

export function createReaderToken(readerId: string): string {
  const payload = b64url(
    JSON.stringify({ role: "reader", id: readerId, exp: Date.now() + MAX_AGE * 1000 }),
  );
  return `${payload}.${sign(payload)}`;
}

function readerIdFromToken(token: string | undefined): string | null {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const a = Buffer.from(sig);
  const b = Buffer.from(sign(payload));
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(
      Buffer.from(payload.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString(),
    );
    if (data.role !== "reader") return null;
    if (typeof data.exp !== "number" || data.exp <= Date.now()) return null;
    return typeof data.id === "string" ? data.id : null;
  } catch {
    return null;
  }
}

/**
 * The signed-in reader, or null. Returns null for a deleted account, so
 * "leave" takes effect immediately even if the cookie is still around.
 */
export async function getReader(): Promise<Reader | null> {
  const store = await cookies();
  const id = readerIdFromToken(store.get(READER_COOKIE)?.value);
  if (!id) return null;
  return findReaderById(id);
}

export function readerCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  };
}
