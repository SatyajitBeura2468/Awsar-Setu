import { Resend } from "resend";

let resend: Resend | null = null;

export function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;

  if (!resend) {
    resend = new Resend(apiKey);
  }

  return resend;
}

export async function sendMeaningfulAlertEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const client = getResendClient();
  const from = process.env.RESEND_FROM_EMAIL;

  if (!client || !from) {
    return {
      ok: false,
      reason: "Email provider is not configured.",
    };
  }

  const result = await client.emails.send({
    from,
    to,
    subject,
    html,
  });

  return { ok: true, result };
}
