import { Resend } from "resend";
import { logger } from "..";
import type { EmailHeader } from "./auth";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendResendEmail(
  emailHeader: EmailHeader,
  url: string,
  emailType: "EMAILVERIFICATION" | "RESETPASSWORD",
) {
  const { data, error } = await resend.emails.send({
    from: emailHeader.from,
    to: emailHeader.to,
    subject: emailHeader.subject,
    html: `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Verify Your Email</title>
        <style>
          body {
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
              background-color: #f4f7f6;
              color: #333333;
          }
          .email-container {
              max-width: 600px;
              margin: 40px auto;
              background-color: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
          }
          .header {
              background-color: #4F46E5;
              padding: 30px;
              text-align: center;
              color: #ffffff;
          }
          .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: 700;
          }
          .content {
              padding: 40px 30px;
              line-height: 1.6;
          }
          .content p {
              margin: 0 0 20px;
              font-size: 16px;
          }
          .button-wrapper {
              text-align: center;
              margin: 30px 0;
          }
          .btn {
              background-color: #4F46E5;
              color: #ffffff !important;
              text-decoration: none;
              padding: 14px 28px;
              border-radius: 6px;
              font-size: 16px;
              font-weight: bold;
              display: inline-block;
          }
          .alt-link {
              font-size: 12px;
              color: #666666;
              word-break: break-all;
          }
          .footer {
              background-color: #f9fafb;
              padding: 20px 30px;
              text-align: center;
              font-size: 12px;
              color: #888888;
              border-top: 1px solid #e5e7eb;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>${emailType === "EMAILVERIFICATION" ? "Confirm Your Email Address" : "Reset Your Password"}</h1>
          </div>

          <div class="content">
            <p>Hi ${emailHeader.receiverName!.split(" ")[0]},</p>
            <p>
             ${emailType === "EMAILVERIFICATION" ? "Thank you for signing up! Please verify your email address to complete your registration." : "Please click on the link below to reset your password."}
            </p>

            <div class="button-wrapper">
              <a href="${url}" target="_blank" class="btn">${emailHeader.buttonText}</a>
            </div>

            <p>
              This verification link will expire in 24 hours.
              required.
            </p>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />

            <p class="alt-link">
              Having trouble with the button? Copy and paste this link into your web browser:<br />
              <a href="${url}" style="color: #4F46E5;">${url}</a>
            </p>
          </div>

          <div class="footer">
            <p>&copy; 2026 Trello. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
`,
  });

  if (error) {
    return logger.error({ error }, "Failed to send email verification");
  }

  logger.info({ data }, "Email sent successfully");
}
