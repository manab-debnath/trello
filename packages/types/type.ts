interface EmailHeader {
  to: string;
  from: string;
  subject: string;
}

type EmailType = "EMAILVERIFICATION" | "RESETPASSWORD";

export type { EmailHeader, EmailType };
