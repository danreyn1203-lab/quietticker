import { NextResponse } from "next/server";
import { stageVerificationCode } from "@/lib/readers";
import { deliverVerificationCode } from "@/lib/readerDelivery";
import { getPendingReader } from "@/lib/readerAuth";

/** Public: resend the verification code for the pending account. */
export async function POST() {
  const pending = await getPendingReader();
  if (!pending) {
    return NextResponse.json(
      { ok: false, expired: true, error: "Your verification session expired. Please sign in again." },
      { status: 401 },
    );
  }

  const staged = await stageVerificationCode(pending.id);
  if (!staged.ok || !staged.reader || !staged.code) {
    return NextResponse.json({ ok: false, error: "Couldn’t resend just now." }, { status: 400 });
  }

  const delivery = await deliverVerificationCode(
    staged.reader.email,
    staged.reader.firstName,
    staged.code,
  );
  return NextResponse.json({ ok: true, sent: delivery.sent, devCode: delivery.devCode });
}
