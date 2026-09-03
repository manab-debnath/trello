import type { User, Organization } from "db/types";

interface EmailHeader {
  to: string;
  from: string;
  subject: string;
}

type EmailJob =
  | {
      type: "EMAILVERIFICATION";
      emailHeader: EmailHeader;
      user: User;
      url: string;
    }
  | {
      type: "RESETPASSWORD";
      emailHeader: EmailHeader;
      user: User;
      url: string;
    }
  | {
      type: "SENDINVITATION";
      emailHeader: EmailHeader;
      user: User;
      organization: Organization;
    };

export type { EmailHeader, EmailJob };
