import { NextResponse } from "next/server";
import { isAuthor } from "@/lib/auth";
import { removeSubscriber } from "@/lib/subscribers";

/** Author-only: remove a subscriber (e.g. an unsubscribe request or bad address). */
export async function DELETE(request: Request) {
  if (!(await isAuthor())) {
    return NextResponse.json({ ok: false, error: "Not authorized" }, { status: 401 });
  }
  let email = "";
  try {
    const body = await request.json();
    email = typeof body?.email === "string" ? body.email : "";
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
  if (!email) {
    return NextResponse.json({ ok: false, error: "No email given" }, { status: 400 });
  }
  await removeSubscriber(email);
  return NextResponse.json({ ok: true });
}
