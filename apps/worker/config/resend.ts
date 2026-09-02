import { Resend } from "resend";
import { logger } from "..";
import type { EmailHeader, EmailType } from "types";
import { emailVerificationTemplate } from "../htmlTemplate/emailVerification";
import type { User } from "db/types";
import { resetPasswordTemplate } from "../htmlTemplate/resetPassword";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendResendEmail(
  emailHeader: EmailHeader,
  user: User,
  url: string,
  emailType: EmailType,
) {
  let htmlTemplate: string;
  switch (emailType) {
    case "EMAILVERIFICATION":
      htmlTemplate = emailVerificationTemplate(user, url);
      break;
    case "RESETPASSWORD":
      htmlTemplate = resetPasswordTemplate(user, url);
      break;
    default:
      htmlTemplate = "";
  }
  const { data, error } = await resend.emails.send({
    from: emailHeader.from,
    to: emailHeader.to,
    subject: emailHeader.subject,
    html: htmlTemplate,
  });

  if (error) {
    return logger.error({ error }, "Failed to send email verification");
  }

  logger.info({ data }, "Email sent successfully");
}
