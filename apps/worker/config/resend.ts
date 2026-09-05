import { Resend } from "resend";
import { logger } from "..";
import type { EmailJob } from "types";
import {
  emailVerificationTemplate,
  resetPasswordTemplate,
  sendInvitationTemplate,
} from "../htmlTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);
const emailFrom = process.env.EMAIL_FROM as string;

export async function sendResendEmail(job: EmailJob) {
  let htmlTemplate: string;
  switch (job.type) {
    case "EMAILVERIFICATION":
      htmlTemplate = emailVerificationTemplate(job.user, job.url);
      break;
    case "RESETPASSWORD":
      htmlTemplate = resetPasswordTemplate(job.user, job.url);
      break;
    case "SENDINVITATION":
      htmlTemplate = sendInvitationTemplate(
        job.user,
        job.organization,
        job.url,
      );
      break;
    default:
      htmlTemplate = "";
  }
  const { data, error } = await resend.emails.send({
    from: job.emailHeader.from || emailFrom,
    to: job.emailHeader.to,
    subject: job.emailHeader.subject,
    html: htmlTemplate,
  });

  logger.info({ data }, "Email sent successfully");
}
