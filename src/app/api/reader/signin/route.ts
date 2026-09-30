import { NextResponse } from "next/server";
import { findReaderByEmail } from "@/lib/readers";
import { createReaderToken, readerCookieOptions, READER_COOKIE } from "@/lib/readerAuth";

/**
 * Public: sign a returning reader back in by email.
 *
 * Passwordless by design (see readerAuth.ts): the account gates nothing
 * sensitive, so matching a known email is enough to restore the session. An
 * unknown email is not an error the caller should retry — it just means "no
 * account here yet", which the UI turns into a nudge toward /signup.
 */
export async function POST(request: Request) {
  let email = "";
  try {
    const body = await request.json();
    email = typeof body?.email === "string" ? body.email : "";
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }

  const reader = await findReaderByEmail(email);
  if (!reader) {
    return NextResponse.json(
      { ok: false, notFound: true, error: "No account found for that email." },
      { status: 404 },
    );
  }

  const res = NextResponse.json({ ok: true, firstName: reader.firstName });
  res.cookies.set(READER_COOKIE, createReaderToken(reader.id), readerCookieOptions());
  return res;
}
