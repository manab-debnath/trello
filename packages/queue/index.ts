import { Queue } from "bullmq";

const emailQueue = new Queue("email", {
  connection: {
    url: process.env.REDIS_URL,
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

export { emailQueue };
