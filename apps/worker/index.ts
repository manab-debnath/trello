import { Worker } from "bullmq";
import IORedis from "ioredis";
import { createLogger } from "logger";
import { sendResendEmail } from "./config/resend";

const connection = new IORedis({
  maxRetriesPerRequest: null,
});

export const logger = createLogger("worker");

const worker = new Worker(
  "email",
  async (job) => {
    await sendResendEmail(job.data);
  },
  {
    connection,
  },
);
