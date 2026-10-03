import "server-only";
import nodemailer from "nodemailer";
import { renderParagraphs } from "./markdown";
import { site } from "./site";

/**
 * Email sending over SMTP with Nodemailer — no third-party email SaaS.
 * Credentials come from environment variables (never hard-coded):
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, NEWSLETTER_FROM
 * If those aren't set, sending is disabled and the admin UI offers a
 * mailto BCC fallback instead. Sending is only ever triggered by the author
 * from /admin.
 */

export function emailConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.NEWSLETTER_FROM,
  );
}

function transport() {
  const port = Number(process.env.SMTP_PORT || 587);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465, // 465 = implicit TLS; 587 = STARTTLS
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

/** Wrap the author's markdown body in a simple, readable HTML email. */
export function renderEmailHtml(subject: string, bodyMarkdown: string): string {
  const paras = renderParagraphs(bodyMarkdown)
    .map((p) => `<p style="margin:0 0 16px;line-height:1.6">${p}</p>`)
    .join("");
  return `<!doctype html><html><body style="margin:0;background:#f4f2ec;padding:24px">
  <div style="max-width:600px;margin:0 auto;background:#fffefb;border:1px solid #e8e4db;border-radius:14px;padding:28px;font-family:Georgia,'Times New Roman',serif;color:#1b1a17">
    <div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#8b867b;font-family:Arial,sans-serif">${site.name}</div>
    <h1 style="font-size:22px;margin:8px 0 18px;line-height:1.25">${escapeHtml(subject)}</h1>
    ${paras}
    <hr style="border:none;border-top:1px solid #e8e4db;margin:24px 0"/>
    <p style="font-size:12px;color:#8b867b;font-family:Arial,sans-serif;line-height:1.5">
      You’re getting this because you subscribed to ${site.name}. Independent, educational research — not investment advice.
      To unsubscribe, just reply with “unsubscribe”.
    </p>
  </div></body></html>`;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Send one personal email per recipient. Returns per-message tallies. */
export async function sendToAll(
  recipients: string[],
  subject: string,
  html: string,
): Promise<{ sent: number; failed: number; errors: string[] }> {
  const t = transport();
  let sent = 0;
  let failed = 0;
  const errors: string[] = [];
  for (const to of recipients) {
    try {
      await t.sendMail({ from: process.env.NEWSLETTER_FROM, to, subject, html });
      sent++;
    } catch (e) {
      failed++;
      errors.push(`${to}: ${e instanceof Error ? e.message : "failed"}`);
    }
  }
  return { sent, failed, errors };
}

/** Fallback for when SMTP isn't configured: a mailto link that BCCs everyone. */
export function buildMailtoBcc(
  recipients: string[],
  subject: string,
  bodyMarkdown: string,
): string {
  const bcc = recipients.join(",");
  const params = new URLSearchParams({ bcc, subject, body: bodyMarkdown });
  return `mailto:?${params.toString()}`;
}

/** The verification-code email shown to a new reader. Plain, branded, no links. */
export function renderVerificationHtml(firstName: string, code: string): string {
  const name = escapeHtml(firstName || "there");
  return `<!doctype html><html><body style="margin:0;background:#f4f2ec;padding:24px">
  <div style="max-width:600px;margin:0 auto;background:#fffefb;border:1px solid #e8e4db;border-radius:14px;padding:28px;font-family:Georgia,'Times New Roman',serif;color:#1b1a17">
    <div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#8b867b;font-family:Arial,sans-serif">${site.name}</div>
    <h1 style="font-size:22px;margin:8px 0 14px;line-height:1.25">Confirm your email</h1>
    <p style="margin:0 0 16px;line-height:1.6">Hi ${name}, here is your verification code:</p>
    <div style="margin:0 0 18px;font-family:'SFMono-Regular',Consolas,monospace;font-size:34px;letter-spacing:10px;font-weight:700;color:#22415c;background:#f4f2ec;border:1px solid #e8e4db;border-radius:10px;padding:16px 10px;text-align:center">${escapeHtml(
      code,
    )}</div>
    <p style="margin:0 0 16px;line-height:1.6;font-family:Arial,sans-serif;font-size:14px;color:#57534b">
      Enter it on the sign-up page to finish creating your account. It expires in 15 minutes.
      If you didn’t try to sign up for ${site.name}, you can ignore this email — no account is created until the code is used.
    </p>
    <hr style="border:none;border-top:1px solid #e8e4db;margin:24px 0"/>
    <p style="font-size:12px;color:#8b867b;font-family:Arial,sans-serif;line-height:1.5">
      ${site.name} — independent, educational research. Not investment advice.
    </p>
  </div></body></html>`;
}

/**
 * Email a single verification code over SMTP. Mirrors the newsletter sender —
 * Nodemailer, no third-party SaaS. Returns ok:false (never throws) so the
 * caller can fall back to logging the code in development.
 */
export async function sendVerificationCode(
  to: string,
  firstName: string,
  code: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!emailConfigured()) return { ok: false, error: "SMTP not configured" };
  try {
    await transport().sendMail({
      from: process.env.NEWSLETTER_FROM,
      to,
      subject: `Your ${site.name} verification code: ${code}`,
      html: renderVerificationHtml(firstName, code),
    });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "send failed" };
  }
}
