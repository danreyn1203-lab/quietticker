import { NextResponse } from "next/server";
import { READER_COOKIE } from "@/lib/readerAuth";

/** Sign a reader out of this browser. Their account and subscription stay. */
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(READER_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
