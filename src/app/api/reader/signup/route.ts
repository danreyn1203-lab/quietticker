import { NextResponse } from "next/server";
import { signUpReader } from "@/lib/readers";
import { createReaderToken, readerCookieOptions, READER_COOKIE } from "@/lib/readerAuth";

/**
 * Public: create a reader account AND subscribe that address, in one request.
 * Sets a reader session cookie so the header can greet them by first name.
 * An email that already has an account is simply signed back in.
 */
export async function POST(request: Request) {
  if (tooManyFrom(clientKey(request))) {
    return NextResponse.json(
      { ok: false, error: "Too many sign-ups from here just now. Try again shortly." },
      { status: 429 },
    );
  }

  let firstName = "";
  let email = "";
  try {
    const body = await request.json();
    firstName = typeof body?.firstName === "string" ? body.firstName : "";
    email = typeof body?.email === "string" ? body.email : "";
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }

  const result = await signUpReader({ firstName, email, source: "signup-page" });
  if (!result.ok || !result.reader) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }

  const res = NextResponse.json({
    ok: true,
    already: result.already ?? false,
    firstName: result.reader.firstName,
  });
  res.cookies.set(
    READER_COOKIE,
    createReaderToken(result.reader.id),
    readerCookieOptions(),
  );
  return res;
}

/**
 * Small in-memory throttle: enough to stop a bored script filling the list,
 * not a substitute for a real WAF. Resets when the server restarts.
 */
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 12;
const hits = new Map<string, number[]>();

function clientKey(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function tooManyFrom(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear(); // crude bound on memory
  return recent.length > MAX_PER_WINDOW;
}
