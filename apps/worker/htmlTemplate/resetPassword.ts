import type { User } from "db/types";

export const resetPasswordTemplate = (user: User, url: string) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
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
              background-color: #DC2626;
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
              background-color: #DC2626;
              color: #ffffff !important;
              text-decoration: none;
              padding: 14px 28px;
              border-radius: 6px;
              font-size: 16px;
              font-weight: bold;
              display: inline-block;
          }
          .security-notice {
              background-color: #FEF2F2;
              border-left: 4px solid #DC2626;
              padding: 15px;
              margin: 20px 0;
              border-radius: 0 4px 4px 0;
              font-size: 14px;
              color: #991B1B;
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
          <!-- Header -->
          <div class="header">
              <h1>Password Reset Request</h1>
          </div>

          <!-- Content -->
          <div class="content">
              <p>Hi ${user.name.split(" ")[0]},</p>
              <p>We received a request to reset the password associated with your account. Click the button below to choose a new password:</p>

              <div class="button-wrapper">
                  <a href="${url}" target="_blank" class="btn">Reset Password</a>
              </div>

              <div class="security-notice">
                  <strong>Important:</strong> This password reset link will expire in 24 hours. If you did not request a password reset, please ignore this email or contact support if you have concerns.
              </div>

              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

              <p class="alt-link">Having trouble with the button? Copy and paste this link into your web browser:<br>
              <a href="${url}" style="color: #DC2626;">${url}</a></p>
          </div>

          <!-- Footer -->
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Trello. All rights reserved.</p>
              <p>123 Main St, Anytown, USA</p>
          </div>
      </div>

  </body>
  </html>
  `;
};
