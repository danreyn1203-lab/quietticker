import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  checkPassword,
  createToken,
  sessionCookieOptions,
} from "@/lib/auth";

export async function POST(request: Request) {
  let password = "";
  try {
    const body = await request.json();
    password = typeof body?.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }

  if (!process.env.AUTHOR_PASSWORD) {
    return NextResponse.json(
      { ok: false, error: "No author password is configured on the server." },
      { status: 503 },
    );
  }

  if (!checkPassword(password)) {
    return NextResponse.json(
      { ok: false, error: "Incorrect password." },
      { status: 401 },
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, createToken(), sessionCookieOptions());
  return res;
}
