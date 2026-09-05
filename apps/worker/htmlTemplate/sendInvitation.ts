import type { Organization, User } from "db/types";

export const sendInvitationTemplate = (
  user: User,
  organization: Organization,
  url: string
) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Organization Invitation</title>
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
              background-color: #059669;
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
          .org-card {
              background-color: #f0fdf4;
              border: 1px solid #bbf7d0;
              border-radius: 6px;
              padding: 20px;
              margin: 25px 0;
          }
          .org-card h2 {
              margin: 0 0 10px 0;
              font-size: 18px;
              color: #065f46;
          }
          .org-card p {
              margin: 0;
              font-size: 14px;
              color: #166534;
          }
          .button-wrapper {
              text-align: center;
              margin: 30px 0;
          }
          .btn {
              background-color: #059669;
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
          <!-- Header -->
          <div class="header">
              <h1>You've Been Invited!</h1>
          </div>

          <!-- Content -->
          <div class="content">
              <p>Hi ${user.name.split(" ")[0]},</p>
              <p><strong>{{InviterName}}</strong> has invited you to join their organization on Trello.</p>

              <!-- Organization Details -->
              <div class="org-card">
                  <h2>${organization.name}</h2>
                  <p>${organization.description}</p>
              </div>

              <p>Click the button below to accept the invitation and set up your workspace profile:</p>

              <div class="button-wrapper">
                  <a href="${url}" target="_blank" class="btn">Accept Invitation</a>
              </div>

              <p style="font-size: 14px; color: #666666;">This invitation will expire in 7 days. If you were not expecting this invite, you can safely ignore this email.</p>

              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

              <p class="alt-link">Having trouble with the button? Copy and paste this link into your web browser:<br>
              <a href="${url}" style="color: #059669;">${url}</a></p>
          </div>

          <!-- Footer -->
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Trello. All rights reserved.</p>
              <p>123 Main St, Anytown, USA</p>
          </div>
      </div>

  </body>
  </html>`;
};
