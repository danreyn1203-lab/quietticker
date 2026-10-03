import "server-only";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

/**
 * Minimal single-author auth. There is one author (the site owner). The
 * email, password and signing secret come from environment variables — never
 * hard-code secrets (§67). A signed, httpOnly cookie marks an authenticated
 * session; the secret never reaches the client. This is enough to gate editing
 * on a single-author research site; it is not a multi-user account system.
 *
 * To change the login, edit AUTHOR_EMAIL / AUTHOR_PASSWORD in .env.local and
 * restart the server — the credentials live only there, never in the code.
 */

export const SESSION_COOKIE = "author_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secret(): string {
  return (
    process.env.AUTHOR_SESSION_SECRET ||
    // Dev fallback so the app runs before .env.local is set. Set a real value!
    "dev-insecure-secret-change-me"
  );
}

function b64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function sign(payload: string): string {
  return b64url(createHmac("sha256", secret()).update(payload).digest());
}

/** Create a signed session token that expires in MAX_AGE seconds. */
export function createToken(): string {
  const payload = b64url(
    JSON.stringify({ role: "author", exp: Date.now() + MAX_AGE * 1000 }),
  );
  return `${payload}.${sign(payload)}`;
}

function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  try {
    const data = JSON.parse(
      Buffer.from(payload.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString(),
    );
    return data.role === "author" && typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}

/** True when the current request carries a valid author session. */
export async function isAuthor(): Promise<boolean> {
  const store = await cookies();
  return verifyToken(store.get(SESSION_COOKIE)?.value);
}

/** Constant-time password check against the configured author password. */
export function checkPassword(input: string): boolean {
  const expected = process.env.AUTHOR_PASSWORD;
  if (!expected) return false; // no password configured → editing stays locked
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Check an email + password against the configured author credentials.
 * The password is compared in constant time. The email is only a label (not a
 * secret), so a plain case-insensitive match is fine; if AUTHOR_EMAIL isn't set
 * the email step is skipped, so a password-only setup keeps working.
 */
export function checkCredentials(email: string, password: string): boolean {
  if (!checkPassword(password)) return false;
  const expectedEmail = process.env.AUTHOR_EMAIL;
  if (!expectedEmail) return true; // no email configured → password alone
  return email.trim().toLowerCase() === expectedEmail.trim().toLowerCase();
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  };
}
