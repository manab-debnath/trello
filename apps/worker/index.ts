import { Worker } from "bullmq";
import IORedis from "ioredis";
import { createLogger } from "logger";
import type { EmailType } from "types";
import { sendResendEmail } from "./config/resend";

const connection = new IORedis({
  maxRetriesPerRequest: null,
});

export const logger = createLogger("worker");

const worker = new Worker(
  "email",
  async (job) => {
    switch (job.name as EmailType) {
      case "EMAILVERIFICATION":
        await sendResendEmail(
          job.data.emailHeader,
          job.data.user,
          job.data.url,
          job.name as EmailType,
        );
        break;
      case "RESETPASSWORD":
        await sendResendEmail(
          job.data.emailHeader,
          job.data.user,
          job.data.url,
          job.name as EmailType,
        );
        break;
      default:
        break;
    }
  },
  {
    connection,
  },
);
