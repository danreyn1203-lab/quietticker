import { NextResponse } from "next/server";
import { deleteReader } from "@/lib/readers";
import { getReader, READER_COOKIE } from "@/lib/readerAuth";

/**
 * Reader-initiated deletion: removes their account and unsubscribes them.
 * Only ever acts on the account in the caller's own cookie — one reader can
 * never delete another.
 */
export async function POST() {
  const reader = await getReader();
  if (!reader) {
    return NextResponse.json({ ok: false, error: "Not signed in" }, { status: 401 });
  }
  await deleteReader(reader.id);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(READER_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
