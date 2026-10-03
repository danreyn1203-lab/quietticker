import "server-only";
import { emailConfigured, sendVerificationCode } from "@/lib/email";

/**
 * Get a verification code to a reader, the same way the newsletter reaches
 * subscribers: Nodemailer over SMTP. When SMTP isn't configured we can't email,
 * so (like the newsletter's mailto fallback) we degrade gracefully — the code
 * is logged to the server console, and in development only it is also returned
 * so the local tester can proceed without a mail server. It is NEVER returned
 * in production.
 */
export async function deliverVerificationCode(
  email: string,
  firstName: string,
  code: string,
): Promise<{ sent: boolean; devCode?: string; error?: string }> {
  if (emailConfigured()) {
    const res = await sendVerificationCode(email, firstName, code);
    if (res.ok) return { sent: true };
    // SMTP is set but the send failed — surface it; they can resend.
    console.error(`[verify] email to ${email} failed: ${res.error}`);
    return { sent: false, error: res.error };
  }

  // No SMTP: log it so a local run can still complete the flow.
  console.warn(
    `[verify] SMTP not configured — code for ${email} is ${code} (dev only).`,
  );
  const devCode = process.env.NODE_ENV !== "production" ? code : undefined;
  return { sent: false, devCode };
}
