import { Resend } from "resend";

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
}

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;

  return new Resend(apiKey);
}

export async function sendResendEmail(input: SendEmailInput): Promise<boolean> {
  const from = process.env.AUTH_EMAIL_FROM;
  const resend = getResendClient();

  if (!resend || !from) return false;

  const { error } = await resend.emails.send({
    from,
    to: input.to,
    subject: input.subject,
    html: input.html,
  });

  return !error;
}
