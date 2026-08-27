import type { Logger } from "pino";
import pinoHttp from "pino-http";

export const createHttpLogger = (logger: Logger) => {
  return pinoHttp({ logger });
};
