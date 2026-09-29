import { NextResponse } from "next/server";
import { addSubscriber } from "@/lib/subscribers";

/** Public: capture a newsletter email. */
export async function POST(request: Request) {
  let email = "";
  try {
    const body = await request.json();
    email = typeof body?.email === "string" ? body.email : "";
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }

  const result = await addSubscriber(email);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }
  return NextResponse.json({
    ok: true,
    already: result.already ?? false,
  });
}
